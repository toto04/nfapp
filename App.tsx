import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Platform, Button, SafeAreaView } from 'react-native';
import { createAppContainer, NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'
import Menu from "./Menu";
import { NavigationProps, commonStyles } from './util'

class Header extends Component<NavigationProps> {
  render() {
    return (
      <View style={styles.header}>
        <View style={styles.menuButton} onTouchStart={() => this.props.navigation.openDrawer()}>
          <View style={{ width: 33, height: 3, backgroundColor: '#ff7923' }} />
          <View style={{ width: 17, height: 3, backgroundColor: '#ff7923' }} />
          <View style={{ width: 25, height: 3, backgroundColor: '#ff7923' }} />
        </View>
        <Text style={{
          color: '#ff7923',
          fontSize: 35
        }}>NFApp</Text>
      </View>
    )
  }
}

class Home extends Component<NavigationProps> {
  componentDidMount() {
    this.props.children
  }
  render() {
    return (
      <View style={styles.container}>
        <Header {...this.props} />
        <Text>Questa pagina è completamente inutile!</Text>
      </View>
    )
  }
}

let Nav = createDrawerNavigator({
  Home,
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
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: '#1e1b20',
  },
  menuButton: {
    padding: 5,
    height: 50,
    width: 50,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
});
