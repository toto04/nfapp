import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationAction, NavigationState, NavigationParams, NavigationActions } from "react-navigation";
import { DrawerContentComponentProps } from "react-navigation-drawer";
import { StatusBarBackground, NavigationProps } from './util'

export default class Menu extends Component<NavigationProps & DrawerContentComponentProps> {
    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#1e1b20',
                alignItems: 'center',
            }}>
                <StatusBarBackground />
                <View>
                    <Text style={styles.menuItem} onPress={() => {
                        if(this.props.navigation.navigate('Home')) this.props.navigation.closeDrawer()
                    }}>Home</Text>
                    <Text style={styles.menuItem} onPress={test}>Elemento 2</Text>
                    <Text style={styles.menuItem} onPress={test}>Elemento 3</Text>
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
        margin: 15,
        textAlign: 'center'
    }
})