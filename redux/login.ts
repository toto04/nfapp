/**
 * This file contains all the redux stuff related to login and accounts
 */

import { Action, Reducer } from 'redux'
import { AsyncStorage } from 'react-native'
import { Class } from '../util/Classes'

/**
 * Global state, defines what the Redux store holds
 */
export type LoginState = {
    loggedIn: true,
    username: string,
    password: string,
    _class: Class,
    profilepic?: string,
    firstName?: string,
    lastName?: string
} | {
    loggedIn: false,
    username?: undefined,
    password?: undefined,
    _class?: undefined,
    profilepic?: undefined,
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
 * @param classname user's classname
 * @param firstName user's fisrt name
 * @param lastName user's last name
 */
export function login(username: string, password: string, classname: string, firstName: string, lastName: string, profilepic?: string): LoginAction {
    try {
        // tries to create a new class, if the classname is invalid the contructor throws an error
        let _class = new Class(classname)
        AsyncStorage.setItem('logInfo', JSON.stringify({ username, password, classname, firstName, lastName, profilepic }))
        return {
            type: 'LOGIN',
            payload: {
                loggedIn: true,
                username,
                password,
                _class,
                firstName,
                lastName,
                profilepic
            }
        }
    } catch (e) {
        // if the classname is invalid an error is issued, also, this should never happen
        (async () => {
            require('../util/Api').api.post('/error/InvalidClass', { username, classname })
        })()
        return logout()
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
                _class: action.payload._class,
                profilepic: action.payload.profilepic ?? undefined,
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