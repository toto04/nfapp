import { Action, createStore, Reducer } from 'redux'
import { AsyncStorage } from 'react-native'

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
interface LoginAction extends Action<string> {
    payload?: LoginState
}

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

export default createStore(loginReducer)
