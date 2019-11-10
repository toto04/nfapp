import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Platform, Button, SafeAreaView, AsyncStorage } from 'react-native';
import { createAppContainer, NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'
import Menu from "./Menu";
import Social from "./pages/Social";
import Login from './pages/login'
import { NavigationProps, commonStyles, serverUrl, Page } from './util'
import { createStackNavigator } from 'react-navigation-stack';
import Profile from './pages/Profile';

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
  Login: Profile
}, {
  initialRouteName: 'Nav',
  mode: 'modal',
  headerMode: 'none'
})
let Container = createAppContainer(loginNav)

export default class App extends Component {
  render() {
    return (
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: commonStyles.backgroundColor,
        paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0
      }}>
        <StatusBar barStyle='light-content' backgroundColor={commonStyles.backgroundColor} />
        <Container />
      </SafeAreaView>
    );
  }
}
