import React, { Component } from 'react';
import { StatusBar, Platform, SafeAreaView, AsyncStorage, View, Dimensions } from 'react-native'
import { createAppContainer, NavigationContainerComponent, NavigationActions } from 'react-navigation'
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs'
import IconComponent from 'react-native-vector-icons/Ionicons'
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';
import { AppLoading, Notifications } from 'expo'

import { commonStyles, api, registerPushNotifications, ErrorModal, formatDate } from './util'
import store from './redux/index';
import { login, logout } from './redux/login'

import Feed, { Post } from './pages/Feed'
import PostDetailPage from './pages/PostDetailPage'
import Surveys from './pages/Surveys'
import SurveyAnswerPage from './pages/SurveyAnswerPage'
import Calendar from './pages/Calendar'
import Login from './pages/login'
import Profile from './pages/Profile'
import SchoolSharing from './pages/SchoolSharing'
import SubjectsDetailPage from './pages/SchoolSharing/SubjectsDetailPage'
import { Notification } from 'expo/build/Notifications/Notifications.types';

/**
 * The app global Tab Navigator
 */
let HomeNav = createBottomTabNavigator({
    Feed,
    Surveys,
    Calendar,
    SchoolSharing,
    Profile
}, {
    initialRouteName: 'Profile',
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ tintColor, focused }) => {
            let f = focused ? '' : '-outline'
            let iconName: string
            switch (navigation.state.routeName) {
                case 'Feed':
                    iconName = 'ios-home'
                    break
                case 'Surveys':
                    iconName = 'ios-checkmark-circle' + f
                    break
                case 'Calendar':
                    iconName = 'ios-calendar'
                    break
                case 'SchoolSharing':
                    iconName = 'ios-share'
                    break
                case 'Profile':
                    iconName = 'ios-contact'
                    break
                default:
                    break
            }
            return <IconComponent size={25} name={iconName} color={tintColor} />
        },
        tabBarLabel: () => { }
    }),
    tabBarComponent: props => {
        return <BottomTabBar {...props} style={{ borderTopWidth: 0, height: 50 }} activeTintColor={commonStyles.main.color} />
    }
})

/**
 * Stack navigator that contains all the detail pages
 */
let DetailNav = createStackNavigator({
    HomeNav,
    SurveyAnswerPage,
    PostDetailPage,
    SubjectsDetailPage
}, {
    headerMode: 'none'
})

/** 
 * This stack navigator contains the login screen and the rest of the app,
 * allowing login to be made from everywere in the app
 */
let loginNav = createStackNavigator({
    DetailNav,
    Login
}, {
    initialRouteName: 'DetailNav',
    mode: 'modal',
    headerMode: 'none'
})
let RootNavContainer = createAppContainer(loginNav)
let rootNavRef: NavigationContainerComponent

/**
 * Global App container, renders the Redux Store Provider allowing global store
 * Then margins the SafeAreaView granting the app to be contained, and lastly
 * renders the Root navigation container, which contains all the screens
 */
export default class App extends Component<null, { isLoading: boolean }> {
    constructor(props) {
        super(props)
        this.state = { isLoading: true }
    }

    componentDidMount() {
        registerPushNotifications()
        Notifications.addListener(handleNotifications)
    }

    /**
     * get the session from the local storage, if present automatically
     * reauthenticate the user
     */
    async checkLogin() {
        let info = await AsyncStorage.getItem('logInfo')
        if (!info) return
        let { username, password, firstName, lastName } = JSON.parse(info)
        store.dispatch(login(username, password, firstName, lastName))
        api.post('/api/login', { usr: username, pwd: password }).then(async res => {
            let { logged, username, firstName, lastName } = res
            if (logged) store.dispatch(login(username, password, firstName, lastName))
            else store.dispatch(logout())
        })
    }

    render() {
        if (this.state.isLoading) return (<AppLoading startAsync={this.checkLogin} onFinish={() => this.setState({ isLoading: false })} />)
        return (
            <Provider store={store}>
                <ErrorModal />
                <StatusBar barStyle='dark-content' backgroundColor={commonStyles.main.backgroundColor} />
                <RootNavContainer ref={navigatorRef => { rootNavRef = navigatorRef }} />
            </Provider>
        );
    }
}

async function handleNotifications(notification: Notification) {
    if (notification.origin != 'selected') return
    switch (notification.data.type) {
        case 'newPost':
            let res: Post | { success: false } = await api.get('/api/post/' + notification.data.postID)
            let post = res as Post
            if (post.id) {
                post.time = formatDate(post.time)
                rootNavRef.dispatch(NavigationActions.navigate({
                    routeName: 'PostDetailPage',
                    params: { postObject: res }
                }))
            }
            break
        case 'newSurvey':
            rootNavRef.dispatch(NavigationActions.navigate({
                routeName: 'Surveys'
            }))
            break
    }
}