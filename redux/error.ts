import { Action, Reducer } from 'redux'

export interface ErrorState {
    message?: string
}

export interface ErrorAction extends Action<string> {
    payload?: {
        message: string
    }
}

export function spawnError(message: string) {
    return {
        type: 'ERROR',
        payload: { message }
    }
}

const defaultState: ErrorState = {}
export let errorReducer: Reducer<ErrorState, ErrorAction> = (state = defaultState, action) => {
    switch (action.type) {
        case 'ERROR':
            return { message: action.payload.message }
        default:
            return state
    }
}