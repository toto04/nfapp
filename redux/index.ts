import { Action, createStore, Reducer } from 'redux'

export type LoginState = {
    username: string,
    password: string
} | {
    username: undefined,
    password: undefined
}
interface LoginAction extends Action<string> {
    payload?: LoginState
}

export function login(username: string, password: string): LoginAction {
    return {
        type: 'LOGIN',
        payload: {
            username,
            password
        }
    }
}

export function logout(): LoginAction {
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
                password: action.payload.password
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
