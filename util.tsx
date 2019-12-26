import React, { Component } from 'react'
import { NavigationScreenProp, NavigationState, NavigationParams, NavigationActions } from 'react-navigation'
import { View, StyleSheet, Text, ScrollViewProps, Dimensions, RefreshControl, StatusBar, StatusBarStyle } from 'react-native'
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
    backButton?: boolean,
    customAction?: () => void
}

/**
 * Page component, with an Header, navigation buttons and a scrollview
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
    componentDidMount() {
        this.props.navigation.addListener('willFocus', () => {
            StatusBar.setBarStyle('light-content')
        })
    }

    render() {
        let buttonAction = this.props.customAction ? this.props.customAction : () => this.props.navigation.dispatch(NavigationActions.back())
        let button: JSX.Element
        if (this.props.backButton) {
            button = (
                <View style={[styles.menuButton, { justifyContent: 'center' }]} onTouchStart={buttonAction}>
                    <View style={[styles.menuButtonBar, { transform: [{ rotate: '-45deg' }, { translateY: -6.5 }] }]} />
                    <View style={[styles.menuButtonBar, { transform: [{ rotate: '45deg' }, { translateY: 6.5 }] }]} />
                </View>
            )
        } else if (this.props.downButton) {
            button = (
                <View style={[styles.menuButton, { flexDirection: 'row', justifyContent: 'center' }]} onTouchStart={buttonAction}>
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
                    color: commonStyles.main.color,
                    fontSize: 35
                }}>{this.props.title}</Text>
            </View>
        )
    }
}

/**
 * General scrollable main page component, the 5 main pages of this app (in the tab navigator) are all
 * istances of this component.
 * Allows for controlled refresh options with automatic refresh on mount, common styles already applied
 * with the options to override them
 * 
 * Inherits the props from `ScrollViewProps` and `NavigationProps`
 * @prop `refreshOptions.onRefresh`: async function called on refresh of the _'RefreshControl'_ component and on mount
 * @prop `refreshOptions.refreshing`: boolean state of the actual refreshing, should be set to true on the _'onRefresh'_ function call, and false on return of said function
 * @prop `refreshOptions.color`: color of the refresh wheel
 * @prop `statusBarStyles`: the style of the status bar to apply on focus
 * @prop `overrideStyles`: optional boolean, overrides the default styles with the ones passed with the _'style'_ and _'contentContainerStyle'_ props
 */
export class ScrollableMainPage extends Component<ScrollViewProps & NavigationProps & {
    refreshOptions?: {
        onRefresh: () => Promise<any>,
        refreshing: boolean,
        color: string
    },
    overrideStyles?: boolean,
    statusBarStyle: StatusBarStyle
}> {
    scrollView: any
    componentDidMount() {
        this.scrollView.scrollTo({ y: -getStatusBarHeight(), animated: false })
        this.props.navigation.addListener('willFocus', () => {
            StatusBar.setBarStyle(this.props.statusBarStyle)
        })
        if (this.props.refreshOptions) this.props.refreshOptions.onRefresh().then(() => {
            this.scrollView.scrollTo({ y: -getStatusBarHeight(), animated: true })
        })
    }

    render() {
        let contentInset = { top: getStatusBarHeight() }
        for (let key in this.props.contentInset) contentInset[key] = this.props.contentInset[key]

        return <ScrollView
            ref={s => this.scrollView = s}
            refreshControl={
                this.props.refreshOptions ? <RefreshControl
                    refreshing={this.props.refreshOptions.refreshing}
                    onRefresh={() => this.props.refreshOptions.onRefresh()}
                    tintColor={this.props.refreshOptions.color}
                    colors={[this.props.refreshOptions.color]}
                /> : undefined
            }
            {...this.props}
            contentContainerStyle={this.props.overrideStyles ? this.props.contentContainerStyle : [{ margin: 20, paddingBottom: 50 }, this.props.contentContainerStyle]}
            contentInset={contentInset}
        >
            {this.props.children}
        </ScrollView >
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
export const commonStyles = StyleSheet.create({
    main: {
        color: '#ff9000',
        backgroundColor: '#1e1b20'
    },
    shadowStyle: {
        borderRadius: 10,
        overflow: 'hidden',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 5,
        elevation: 5
    }
})

export function formatDate(inputDate: string) {
    let date = new Date(inputDate);
    let dd = date.getDate() + '';
    if (dd.length == 1)
        dd = '0' + dd;
    let MM = date.getMonth() + 1 + '';
    if (MM.length == 1)
        MM = '0' + MM;
    let yyyy = date.getFullYear();
    let hh = date.getHours() + '';
    if (hh.length == 1)
        hh = '0' + hh;
    let mm = date.getMinutes() + '';
    if (mm.length == 1)
        mm = '0' + mm;
    return `${dd}/${MM}/${yyyy} ${hh}:${mm}`;
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
            style={[{
                position: 'absolute',
                transform: a,
                zIndex: 2000,
                margin: 20,
                padding: 10,
                backgroundColor: commonStyles.main.backgroundColor,
                width: Dimensions.get('screen').width - 40,
                height: 80,
                alignItems: 'stretch',
                justifyContent: 'center'
            }, commonStyles.shadowStyle]}
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
    api.post('/api/registertoken', { token })
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
        backgroundColor: commonStyles.main.color,
        borderRadius: 3,
    }
})