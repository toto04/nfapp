import { Action, Reducer } from 'redux'

export interface ThemeState {
    statusBar: 'dark' | 'light'
    tabBar: 'dark' | 'light'
}

interface ThemeActionPayload {
    statusBar?: 'dark' | 'light'
    tabBar?: 'dark' | 'light'
}

interface ThemeAction extends Action<string> {
    payload?: ThemeActionPayload
}

export function setTheme(payload: ThemeActionPayload): ThemeAction {
    return {
        type: 'THEME',
        payload
    }
}

const defaultState: ThemeState = { statusBar: 'light', tabBar: 'light' }
export let themeReducer: Reducer<ThemeState, ThemeAction> = (state = defaultState, action) => {
    if (action.payload) return {
        statusBar: action.payload.statusBar ? action.payload.statusBar : state.statusBar,
        tabBar: action.payload.tabBar ? action.payload.tabBar : state.tabBar
    }
    else return { ...state }
}