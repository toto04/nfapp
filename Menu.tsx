import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Linking, Platform, ImageBackground } from "react-native";
import { DrawerContentComponentProps } from "react-navigation-drawer";
import { NavigationProps, commonStyles } from './util'
import { TouchableHighlight, ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { LoginState } from "./redux/login";

/**
 * The menu's upper profile tab, show basic info about the logged in user, allows login
 */
class ProfileTab extends Component<NavigationProps & { username: string, firstName: string, lastName: string }> {
    render() {
        let name = this.props.username ? this.props.firstName + ' ' + this.props.lastName : 'Login'
        let usr = this.props.username ? '@' + this.props.username : ''
        return (
            <TouchableHighlight onPress={() => {
                this.props.navigation.navigate('Login')
            }}>
                <View style={{
                    height: 150,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 10
                }}>
                    <Image
                        source={require('./assets/default-avatar.png')}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            overflow: 'hidden'
                        }}
                    />
                    <Text style={{ marginTop: 5, color: '#fff', fontSize: 17 }}>{name}</Text>
                    <Text style={{ marginTop: 5, color: '#ccc' }}>{usr}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}
/** ProfileTab but connected to the Redux store */
let ConnectedProfileTab = connect((state: LoginState) => { return { username: state.username, firstName: state.firstName, lastName: state.lastName } })(ProfileTab)

/**
 * Drawer Menu component, it's literally the left side menu
 */
export default class Menu extends Component<NavigationProps & DrawerContentComponentProps> {
    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: commonStyles.backgroundColor,
                alignItems: 'stretch'
            }}>
                <ConnectedProfileTab {...this.props} />
                <ScrollView>
                    <Text style={styles.menuItem} onPress={() => {
                        if (this.props.navigation.navigate('Home')) this.props.navigation.closeDrawer()
                    }}>Home</Text>
                    <Text style={styles.menuItem} onPress={() => {
                        if (this.props.navigation.navigate('Social')) this.props.navigation.closeDrawer()
                    }}>Social</Text>
                    <Text style={styles.menuItem} onPress={() => {
                        if (this.props.navigation.navigate('Surveys')) this.props.navigation.closeDrawer()
                    }}>Sondaggi</Text>
                    <Text style={styles.menuItem} onPress={() => {
                        if (this.props.navigation.navigate('Calendar')) this.props.navigation.closeDrawer()
                    }}>Calendario</Text>
                    <Text style={styles.menuItem} onPress={() => {
                        if (this.props.navigation.navigate('Sharing')) this.props.navigation.closeDrawer()
                    }}>School Sharing</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableHighlight onPress={() => console.log('fb')}><Image source={require('./assets/facebook.png')} style={styles.icon} /></TouchableHighlight>
                        <TouchableHighlight onPress={async () => {
                            let inst = await Linking.canOpenURL('instagram://')
                            if (inst) Linking.openURL('instagram://user?username=liceonerviferrari')
                            else Linking.openURL('https://www.instagram.com/liceonerviferrari/')
                        }}><Image source={require('./assets/instagram.png')} style={styles.icon} /></TouchableHighlight>
                    </View>
                    <Text style={[styles.menuItem, { fontSize: 12, marginBottom: 0 }]}>© 2019 peer to peer</Text>
                    <Text style={[styles.menuItem, { fontSize: 12, marginTop: 0 }]}>by Tommaso Morganti</Text>
                </ScrollView>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    menuItem: {
        color: 'white',
        fontSize: 25,
        margin: 20,
        textAlign: 'center'
    },
    icon: {
        tintColor: 'white',
        height: 40,
        width: 40
    }
})