import React, { Component } from 'react'
import { } from 'react-navigation-drawer'
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'
import { View, StatusBar, Platform, StyleSheet, Text } from 'react-native'

export class Header extends Component<NavigationProps & {title: string}> {
    render() {
        return (
            <View style={styles.header}>
                <View style={styles.menuButton} onTouchStart={() => this.props.navigation.openDrawer()}>
                    <View style={{ width: 33, height: 3, backgroundColor: commonStyles.mainColor }} />
                    <View style={{ width: 17, height: 3, backgroundColor: commonStyles.mainColor }} />
                    <View style={{ width: 25, height: 3, backgroundColor: commonStyles.mainColor }} />
                </View>
                <Text style={{
                    color: '#ff7923',
                    fontSize: 35
                }}>{this.props.title}</Text>
            </View>
        )
    }
}

export interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export let commonStyles = {
    mainColor: '#ff7923',
    backgroundColor: '#1e1b20'
}

const styles = StyleSheet.create({
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
})