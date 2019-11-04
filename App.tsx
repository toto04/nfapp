import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Platform, Button, SafeAreaView } from 'react-native';
import { createAppContainer, NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'
import Menu from "./Menu";
import Social from "./pages/Social";
import { NavigationProps, commonStyles, Header, serverUrl } from './util'

class Home extends Component<NavigationProps, {res: string}> {
  constructor(Props) {
    super(Props)
    this.state = { res: 'Aspetta...' }
    console.log(this.state.res)
    fetch(serverUrl).then(async res => {
      const t = await res.text()
      this.setState({ res: t })
      console.log(this.state.res)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header {...this.props} title='NFApp' />
        <Text>{this.state.res}</Text>
      </View>
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
let Container = createAppContainer(Nav)

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  }
});
