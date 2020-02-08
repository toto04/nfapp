import React, { Component } from 'react';
import { StatusBar, AsyncStorage } from 'react-native'
import { createAppContainer, NavigationContainerComponent, NavigationActions } from 'react-navigation'
import { createBottomTabNavigator, BottomTabBar, BottomTabBarProps } from 'react-navigation-tabs'
import IconComponent from 'react-native-vector-icons/Ionicons'
import { createStackNavigator } from 'react-navigation-stack';
import { Provider, connect } from 'react-redux';
import { AppLoading, Notifications } from 'expo'
import { Asset } from 'expo-asset'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'

import { commonStyles, api, registerPushNotifications, ErrorModal, formatDate } from './util'
import store from './redux/index';
import { login, logout } from './redux/login'
import { ThemeState } from './redux/theme';

import images from './assets/fields/images'
import Feed, { Post } from './pages/Feed'
import PostDetailPage from './pages/Feed/PostDetailPage'
import Surveys from './pages/Surveys'
import SurveyAnswerPage from './pages/Surveys/SurveyAnswerPage'
import Calendar from './pages/Calendar'
import Login from './pages/login'
import Profile from './pages/Profile'
import SavedNotes from './pages/Profile/SavedNotes'
import SchoolSharing from './pages/SchoolSharing'
import SubjectsDetailPage from './pages/SchoolSharing/SubjectsDetailPage'
import NoteDetailPage from './pages/SchoolSharing/NoteDetailPage'
import AddNotePage from './pages/SchoolSharing/AddNotePage'
import { Notification } from 'expo/build/Notifications/Notifications.types';

class TabBar extends Component<BottomTabBarProps & { theme: ThemeState }> {
    render() {
        return <BottomTabBar
            {...this.props}
            style={{
                borderTopWidth: 0,
                height: 50,
                backgroundColor: this.props.theme.tabBar == 'light' ? 'white' : commonStyles.main.backgroundColor
            }}
            activeTintColor={commonStyles.main.color}
            inactiveTintColor={this.props.theme.tabBar == 'light' ? '#7f7f7f' : '#8e8e93'}
        />
    }
}
let ConnectedTabBar = connect((state: { theme: ThemeState }) => ({ theme: state.theme }))(TabBar)

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
    lazy: false,
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
                    iconName = 'ios-book'
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
        return <ConnectedTabBar {...props} />
    }
})

/**
 * Stack navigator that contains all the detail pages
 */
let DetailNav = createStackNavigator({
    HomeNav,
    SurveyAnswerPage,
    PostDetailPage,
    SubjectsDetailPage,
    NoteDetailPage,
    AddNotePage,
    SavedNotes
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
        Asset.loadAsync(Object.entries(images).map(e => e[1]))
    }

    componentDidUpdate() {
        // Useful for testing purposes
        // rootNavRef.dispatch(NavigationActions.navigate({routeName: 'AddNotePage'}))
    }

    /**
     * get the session from the local storage, if present automatically
     * reauthenticate the user
     */
    async checkLogin() {
        let info = await AsyncStorage.getItem('logInfo')
        if (!info) return
        let { username, password, classname, firstName, lastName } = JSON.parse(info)
        store.dispatch(login(username, password, classname, firstName, lastName))
        api.post('/api/login', { usr: username, pwd: password }).then(async res => {
            let { logged, username, classname, firstName, lastName } = res
            if (logged) store.dispatch(login(username, password, classname, firstName, lastName))
            else store.dispatch(logout())
        })
    }

    render() {
        if (this.state.isLoading) return (<AppLoading startAsync={this.checkLogin} onFinish={() => this.setState({ isLoading: false })} />)
        return (
            <Provider store={store}>
                <ErrorModal />
                <StatusBar barStyle='dark-content' backgroundColor={commonStyles.main.backgroundColor} />
                <ActionSheetProvider>
                    <RootNavContainer ref={navigatorRef => { rootNavRef = navigatorRef }} />
                </ActionSheetProvider>
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