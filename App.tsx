import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Platform, Button, SafeAreaView, AsyncStorage } from 'react-native';
import { createAppContainer, NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs'
import IconComponent from 'react-native-vector-icons/Ionicons'
import Menu from "./Menu";
import Social from "./pages/Social";
import Calendar from './pages/Calendar'
import Login from './pages/login'
import Profile from './pages/Profile'
import { NavigationProps, commonStyles, Page, api } from './util'
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';
import store from './redux/index';
import { login, logout } from './redux/login'

class Home extends Component<NavigationProps, { res: string }> {
  constructor(props) {
    super(props)
    this.state = { res: 'Aspetta...' }
    // fetch(serverUrl).then(async res => {
    //   const t = await res.text()
    //   this.setState({ res: t })
    //   console.log(this.state.res)
    // })
  }

  render() {
    return (
      <Page {...this.props} title='NFApp'>
        <Text>{this.state.res}</Text>
      </Page>
    )
  }
}

/**
 * The app global Drawer Navigator (side menu)
 */
let Nav = createBottomTabNavigator({
  Home,
  Sondaggi: Social,
  Calendar,
  SchoolSharing: Home,
  Profile
}, {
  initialRouteName: 'Profile',
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor, focused }) => {
      let f = focused ? '' : '-outline'
      let iconName: string
      switch (navigation.state.routeName) {
        case 'Home':
          iconName = 'ios-home'
          break
        case 'Sondaggi':
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
 * This stack navigator contains the login screen and the rest of the app,
 * allowing login to be made from everywere in the app
 */
let loginNav = createStackNavigator({
  Nav,
  Login
}, {
  initialRouteName: 'Nav',
  mode: 'modal',
  headerMode: 'none'
})
let RootNavContainer = createAppContainer(loginNav)

/**
 * Global App container, renders the Redux Store Provider allowing global store
 * Then margins the SafeAreaView granting the app to be contained, and lastly
 * renders the Root navigation container, which contains all the screens
 */
export default class App extends Component {
  constructor(props) {
    super(props)
    AsyncStorage.getItem('logInfo').then(async info => {
      // get the session from the local storage, if present automatically
      // reauthenticate the user
      if (!info) return
      let obj = JSON.parse(info)
      let res = await api.post('/api/login', { usr: obj.username, pwd: obj.password })
      let { logged, username, password, firstName, lastName } = await res.json()
      if (logged) store.dispatch(login(username, password, firstName, lastName))
      else store.dispatch(logout())
    })
  }
  render() {
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
