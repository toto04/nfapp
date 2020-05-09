import { Notifications } from 'expo';
import env from '../env';
import store from '../redux';
import * as Permissions from 'expo-permissions'
import { spawnError } from '../redux/error';

/** backend server's URL */
export let serverUrl = __DEV__ ? env.API_HOST : 'https://nfapp-server.herokuapp.com';
async function parseApiResponse(res: Response, resolve: (value: any) => void) {
    try {
        let obj = await res.json();
        resolve(obj);
    }
    catch {
        resolve({ success: false, error: 'could not parse json' });
    }
}
function handleApiRejection(error: any, reject: (reason?: any) => void) {
    store.dispatch(spawnError('Impossibile connettersi al server, riprova più tardi'));
}
function retryApiRequest(endpoint: string, options: {}, resolve: (value: any) => void) {
    fetch(serverUrl + endpoint, options).then(res => {
        parseApiResponse(res, resolve);
        store.dispatch(spawnError('Connessione ristabilita'));
    }).catch(e => setTimeout(() => retryApiRequest(endpoint, options, resolve), 5000)); // ritenta ogni 5 secondi
}

export interface ApiResponse<T = any> {
    success: boolean,
    error?: string,
    data?: T
}

export const api = {
    get: (endpoint: string) => new Promise<ApiResponse>(async (resolve, reject) => {
        let log = store.getState().login;
        let headers = log.loggedIn ? { 'x-nfapp-username': log.username, 'x-nfapp-password': log.password } : {};
        let options = { headers };
        fetch(serverUrl + endpoint, options).then(res => parseApiResponse(res, resolve)).catch(e => {
            handleApiRejection(e, reject);
            retryApiRequest(endpoint, options, resolve);
        });
    }),
    post: (endpoint: string, body: {}) => new Promise<ApiResponse>(async (resolve, reject) => {
        let log = store.getState().login;
        let headers = log.loggedIn ? {
            'x-nfapp-username': log.username,
            'x-nfapp-password': log.password,
            'Content-Type': 'application/json'
        } : { 'Content-Type': 'application/json' };
        let options = {
            method: 'post',
            headers,
            body: JSON.stringify(body)
        };
        fetch(serverUrl + endpoint, options).then(res => parseApiResponse(res, resolve)).catch(e => {
            handleApiRejection(e, reject);
            retryApiRequest(endpoint, options, resolve);
        });
    })
};

async function registerPushNotifications() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    let s = status
    if (status != 'granted') {
        const { status: newStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
        s = newStatus
    }
    if (s == 'granted') {
        let token = await Notifications.getExpoPushTokenAsync()
        api.post('/api/user/registertoken', { token })
    } else {
        const { username, password } = store.getState().login
        api.post('/api/user/unregistertoken', { username, password })
    }
}

let prevusr = ''
let prevpwd = ''
store.subscribe(() => {
    let { loggedIn, username, password } = store.getState().login
    if (loggedIn) {
        prevusr = username
        prevpwd = password
        registerPushNotifications()
    } else {
        api.post('/api/user/unregistertoken', {
            username: prevusr,
            password: prevpwd
        })
    }
})