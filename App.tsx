import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Platform, Button, SafeAreaView, AsyncStorage } from 'react-native';
import { createAppContainer, NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'
import Menu from "./Menu";
import Social from "./pages/Social";
import Login from './pages/login'
import { NavigationProps, commonStyles, serverUrl, Page } from './util'
import { createStackNavigator } from 'react-navigation-stack';
import { Provider } from 'react-redux';
import store, { login, logout } from './redux/index';

class Home extends Component<NavigationProps, { res: string }> {
  constructor(props) {
    super(props)
    this.state = { res: 'Aspetta...' }
    console.log(this.state.res)
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

let Nav = createDrawerNavigator({
  Home,
  Social
}, {
  initialRouteName: 'Home',
  contentComponent: Menu
})

let loginNav = createStackNavigator({
  Nav,
  Login
}, {
  initialRouteName: 'Nav',
  mode: 'modal',
  headerMode: 'none'
})
let Container = createAppContainer(loginNav)

export default class App extends Component {
  constructor(props) {
    super(props)
    AsyncStorage.getItem('logInfo').then(async info => {
      if (!info) return
      let obj = JSON.parse(info)
      let res = await fetch(serverUrl + '/api/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usr: obj.username,
          pwd: obj.password
        })
      })
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
          <Container />
        </SafeAreaView>
      </Provider>
    );
  }
}
