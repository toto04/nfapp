import { Action, createStore, Reducer } from 'redux'
import { AsyncStorage } from 'react-native'

/**
 * Global state, defines what the Redux store holds
 */
export type LoginState = {
    username: string,
    password: string,
    firstName?: string,
    lastName?: string
} | {
    username: undefined,
    password: undefined,
    firstName?: undefined,
    lastName?: undefined
}
/**
 * A Redux action that has the LoginState as payload
 */
interface LoginAction extends Action<string> {
    payload?: LoginState
}

/**
 * This action allows an already authenticated user to maintain the access across the app,
 * configuring the store with his LoginState
 * 
 * Also syncs data with the local storage to maintain access between sessions
 * @param username user's username
 * @param password user's password
 * @param firstName user's fisrt name
 * @param lastName user's last name
 */
export function login(username: string, password: string, firstName: string, lastName: string): LoginAction {
    AsyncStorage.setItem('logInfo', JSON.stringify({username, password}))
    return {
        type: 'LOGIN',
        payload: {
            username,
            password,
            firstName,
            lastName
        }
    }
}

/**
 * This action clears the store removing the user's LoginState, removing also the data from the local storage
 */
export function logout(): LoginAction {
    AsyncStorage.removeItem('logInfo')
    return {
        type: 'LOGOUT'
    }
}

const defaultState: LoginState = { username: undefined, password: undefined }
let loginReducer: Reducer<LoginState, LoginAction> = (state = defaultState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                username: action.payload.username,
                password: action.payload.password,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName
            }
        case 'LOGOUT':
            return {
                username: undefined,
                password: undefined
            }
        default:
            return state
    }
}

/**
 * Global store that maintains the user's LoginState across the app
 */
export default createStore(loginReducer)
