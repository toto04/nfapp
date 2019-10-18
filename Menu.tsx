import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationAction, NavigationState, NavigationParams, NavigationActions } from "react-navigation";
import { DrawerContentComponentProps } from "react-navigation-drawer";
import { StatusBarBackground, NavigationProps, commonStyles } from './util'

export default class Menu extends Component<NavigationProps & DrawerContentComponentProps> {
    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#1e1b20',
                alignItems: 'stretch',
                paddingTop: 20 
            }}>
                <StatusBarBackground />
                <View>
                    {/* <View style={{
                        height: 3,
                        backgroundColor: commonStyles.mainColor,
                        margin: 15,
                        width: 200,
                        alignSelf: 'center'
                    }} /> */}
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

                    <Text style={[styles.menuItem, {fontSize: 12, marginBottom: 0}]}>© 2019 peer to peer</Text>
                    <Text style={[styles.menuItem, {fontSize: 12, marginTop: 0}]}>by Tommaso Morganti</Text>
                </View>
            </View>
        )
    }
}

function test() {
    console.log('press')
}

let styles = StyleSheet.create({
    menuItem: {
        color: 'white',
        fontSize: 25,
        margin: 20,
        textAlign: 'center'
    }
})