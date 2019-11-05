import React, { Component } from 'react'
import { } from 'react-navigation-drawer'
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'
import { View, StatusBar, Platform, StyleSheet, Text } from 'react-native'
import env from './env'

export class Header extends Component<NavigationProps & { title: string, downButton?: boolean, backButton?: boolean }> {
    render() {
        let button: JSX.Element
        if (this.props.backButton) {
            button = (
                <View style={[styles.menuButton, { justifyContent: 'center' }]} onTouchStart={() => this.props.navigation.goBack()}>
                    <View style={[styles.menuButtonBar, { transform: [{ rotate: '-45deg' }, { translateY: -6.5 }] }]} />
                    <View style={[styles.menuButtonBar, { transform: [{ rotate: '45deg' }, { translateY: 6.5 }] }]} />
                </View>
            )
        } else if (this.props.downButton) {
            button = (
                <View style={[styles.menuButton, { flexDirection: 'row', justifyContent: 'center' }]} onTouchStart={() => this.props.navigation.goBack()}>
                    <View style={[styles.menuButtonBar, { transform: [{ rotate: '45deg' }, { translateX: 5.5 }] }]} />
                    <View style={[styles.menuButtonBar, { transform: [{ rotate: '-45deg' }, { translateX: -5.5 }] }]} />
                </View>
            )
        } else {
            button = (
                <View style={styles.menuButton} onTouchStart={() => this.props.navigation.openDrawer()}>
                    <View style={[styles.menuButtonBar, { width: 33 }]} />
                    <View style={[styles.menuButtonBar, { width: 17 }]} />
                    <View style={[styles.menuButtonBar, { width: 25 }]} />
                </View>
            )
        }

        return (
            <View style={styles.header}>
                {button}
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

export const commonStyles = {
    mainColor: '#ff7923',
    backgroundColor: '#1e1b20'
}

export const serverUrl = env.API_HOST

const styles = StyleSheet.create({
    header: {
        height: 64,
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: '#1e1b20',
    },
    menuButton: {
        padding: 6,
        height: 50,
        width: 64,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    menuButtonBar: {
        width: 20,
        height: 3,
        backgroundColor: commonStyles.mainColor,
        borderRadius: 3,
    }
})