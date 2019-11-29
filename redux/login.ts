/**
 * This file contains all the redux stuff related to login and accounts
 */

import { Action, Reducer } from 'redux'
import { AsyncStorage } from 'react-native'

/**
 * Global state, defines what the Redux store holds
 */
export type LoginState = {
    loggedIn: true,
    username: string,
    password: string,
    firstName?: string,
    lastName?: string
} | {
    loggedIn: false,
    username?: undefined,
    password?: undefined,
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
            loggedIn: true,
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

const defaultState: LoginState = { loggedIn: false }
export let loginReducer: Reducer<LoginState, LoginAction> = (state = defaultState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                loggedIn: true,
                username: action.payload.username,
                password: action.payload.password,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName
            }
        case 'LOGOUT':
            return {
                loggedIn: false
            }
        default:
            return state
    }
}