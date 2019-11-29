import { createStore, combineReducers } from 'redux'
import { loginReducer } from './login'

/** Creates the combined reducer that will be used by the store */
let rootReducer = combineReducers({
    login: loginReducer
})

/**
 * Global store that maintains the user's LoginState across the app
 */
export default createStore(rootReducer)
