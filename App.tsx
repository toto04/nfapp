import React, { Component } from 'react';
import { StatusBar, Platform, SafeAreaView, AsyncStorage } from 'react-native';
import { createAppContainer } from 'react-navigation'
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs'
import IconComponent from 'react-native-vector-icons/Ionicons'
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo'

import { commonStyles, api, registerPushNotifications } from './util'
import store from './redux/index';
import { login, logout } from './redux/login'

import Feed from './pages/Feed'
import PostDetailPage from './pages/PostDetailPage'
import Surveys from './pages/Surveys'
import SurveyAnswerPage from './pages/SurveyAnswerPage'
import Calendar from './pages/Calendar'
import Login from './pages/login'
import Profile from './pages/Profile'
import WIP from './pages/wip'

/**
 * The app global Tab Navigator
 */
let HomeNav = createBottomTabNavigator({
  Feed,
  Surveys,
  Calendar,
  SchoolSharing: WIP,
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
    return <BottomTabBar {...props} style={{ borderTopWidth: 0 }} activeTintColor={commonStyles.mainColor} />
  }
})

/**
 * Stack navigator that contains all the detail pages
 */
let DetailNav = createStackNavigator({
  HomeNav,
  SurveyAnswerPage,
  PostDetailPage
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
  }

  /**
   * get the session from the local storage, if present automatically
   * reauthenticate the user
   */
  async checkLogin() {
    let info = await AsyncStorage.getItem('logInfo')
    if (!info) return
    let obj = JSON.parse(info)
    let res = await api.post('/api/login', { usr: obj.username, pwd: obj.password })
    let { logged, username, password, firstName, lastName } = await res.json()
    if (logged) store.dispatch(login(username, password, firstName, lastName))
    else store.dispatch(logout())
  }

  render() {
    if (this.state.isLoading) return (<AppLoading startAsync={this.checkLogin} onFinish={() => this.setState({ isLoading: false })} />)
    return (
      <Provider store={store} >
        <SafeAreaView style={{
          flex: 1,
          backgroundColor: commonStyles.backgroundColor,
          paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0
        }}>
          <StatusBar barStyle='light-content' backgroundColor={commonStyles.backgroundColor} />
          <RootNavContainer />
        </SafeAreaView>
      </Provider>
    );
  }
}
