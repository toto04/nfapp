import React, { Component } from 'react'
import { NavigationScreenProp, NavigationState, NavigationParams, NavigationActions } from 'react-navigation'
import { View, StyleSheet, Text, ScrollViewProps, Dimensions } from 'react-native'
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import env from './env'
import store from './redux'
import { ScrollView } from 'react-native-gesture-handler'
import Animated, { Easing } from 'react-native-reanimated'
import { connect } from 'react-redux'
import { ErrorState, spawnError } from './redux/error'
import { getStatusBarHeight } from 'react-native-safe-area-view'

interface HeaderProps {
    title: string,
    downButton?: boolean,
    backButton?: boolean
}

/**
 * Page component, with an Header, navigation buttons and a
 */
export class Page extends Component<NavigationProps & HeaderProps & ScrollViewProps> {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Header {...this.props} />
                <ScrollView style={{ flex: 1 }} {...this.props}>
                    {this.props.children}
                </ScrollView>
            </View>
        )
    }
}

/**
 * Header component, represents the header
 * 
 * refer to the *HeaderProps* interface
 */
class Header extends Component<NavigationProps & HeaderProps> {
    render() {
        let button: JSX.Element
        if (this.props.backButton) {
            button = (
                <View style={[styles.menuButton, { justifyContent: 'center' }]} onTouchStart={() => this.props.navigation.dispatch(NavigationActions.back())}>
                    <View style={[styles.menuButtonBar, { transform: [{ rotate: '-45deg' }, { translateY: -6.5 }] }]} />
                    <View style={[styles.menuButtonBar, { transform: [{ rotate: '45deg' }, { translateY: 6.5 }] }]} />
                </View>
            )
        } else if (this.props.downButton) {
            button = (
                <View style={[styles.menuButton, { flexDirection: 'row', justifyContent: 'center' }]} onTouchStart={() => this.props.navigation.dispatch(NavigationActions.back())}>
                    <View style={[styles.menuButtonBar, { transform: [{ rotate: '45deg' }, { translateX: 5.5 }] }]} />
                    <View style={[styles.menuButtonBar, { transform: [{ rotate: '-45deg' }, { translateX: -5.5 }] }]} />
                </View>
            )
        } else {
            button = undefined
        }

        return (
            <View style={styles.header}>
                {button}
                <Text style={{
                    color: '#ff7923',
                    fontSize: 35
                }}>{this.props.title}</Text>
            </View>
        )
    }
}

/**
 * Defines the standard *navigation* prop common to all components that 
 * somehow make use of the navigation (all *Page* components)
 */
export interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

/**
 * Plain JS object containing common style properties
 */
export const commonStyles = {
    mainColor: '#ff9000',
    backgroundColor: '#1e1b20'
}

class ErrorModalComponent extends Component<{ message?: string }, { y: Animated.Value<number> }> {
    state = { message: '', y: new Animated.Value(Dimensions.get('screen').height) }

    render() {
        if (this.props.message) {
            Animated.timing(this.state.y, { toValue: Dimensions.get('screen').height - 170, duration: 300, easing: Easing.inOut(Easing.ease) }).start(() => {
                setTimeout(() => {
                    Animated.timing(this.state.y, { toValue: Dimensions.get('screen').height, duration: 300, easing: Easing.inOut(Easing.ease) }).start()
                }, 5000)
            })
        }
        let a: any = [{ translateY: this.state.y }]
        return <Animated.View
            style={{
                position: 'absolute',
                transform: a,
                zIndex: 2000,
                margin: 20,
                padding: 10,
                backgroundColor: commonStyles.backgroundColor,
                borderRadius: 10,
                width: Dimensions.get('screen').width - 40,
                height: 80,
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 5 },
                shadowRadius: 5,
                elevation: 5,
                alignItems: 'stretch',
                justifyContent: 'center'
            }}
        >
            <Text style={{ zIndex: 2001, color: 'white', textAlign: 'center', fontSize: 15 }}>{this.props.message}</Text>
        </Animated.View>
    }
}
export let ErrorModal = connect((state: { error: ErrorState }) => ({ message: state.error.message }))(ErrorModalComponent)

/** backend server's URL */
let serverUrl = __DEV__ ? env.API_HOST : 'https://nfapp-server.herokuapp.com'
async function parseApiResponse(res: Response, resolve: (value: any) => void) {
    try {
        let obj = await res.json()
        resolve(obj)
    } catch {
        resolve({ success: false, error: 'could not parse json' })
    }
}
function handleApiRejection(error: any, reject: (reason?: any) => void) {
    store.dispatch(spawnError('Impossibile connettersi al server, riprova più tardi'))
}
function retryApiRequest(endpoint: string, options: {}, resolve: (value: any) => void) {
    fetch(serverUrl + endpoint, options).then(res => {
        parseApiResponse(res, resolve)
        store.dispatch(spawnError('Connessione ristabilita'))
    }).catch(e => setTimeout(() => retryApiRequest(endpoint, options, resolve), 5000))  // ritenta ogni 5 secondi
}

export const api = {
    get: (endpoint: string) => new Promise<any>(async (resolve, reject) => {
        let log = store.getState().login
        let headers = log.loggedIn ? { 'x-nfapp-username': log.username, 'x-nfapp-password': log.password } : {}
        let options = { headers }
        fetch(serverUrl + endpoint, options).then(res => parseApiResponse(res, resolve)).catch(e => {
            handleApiRejection(e, reject)
            retryApiRequest(endpoint, options, resolve)
        })
    }),
    post: (endpoint: string, body: {}) => new Promise<any>(async (resolve, reject) => {
        let log = store.getState().login
        let headers = log.loggedIn ? {
            'x-nfapp-username': log.username,
            'x-nfapp-password': log.password,
            'Content-Type': 'application/json'
        } : { 'Content-Type': 'application/json' }
        let options = {
            method: 'post',
            headers,
            body: JSON.stringify(body)
        }
        fetch(serverUrl + endpoint, options).then(res => parseApiResponse(res, resolve)).catch(e => {
            handleApiRejection(e, reject)
            retryApiRequest(endpoint, options, resolve)
        })
    })
}

export async function registerPushNotifications() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    let s = status
    if (status != 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
        s = status
    }
    if (s != 'granted') return
    let token = await Notifications.getExpoPushTokenAsync()
    api.post('/api/tokentest', { token })
}

const styles = StyleSheet.create({
    header: {
        paddingTop: getStatusBarHeight(),
        height: 64 + getStatusBarHeight(),
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: '#1e1b20',
    },
    menuButton: {
        padding: 6,
        height: 50,
        width: 64,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    menuButtonBar: {
        width: 20,
        height: 3,
        backgroundColor: commonStyles.mainColor,
        borderRadius: 3,
    }
})