import React, { Component } from 'react'
import { } from 'react-navigation-drawer'
import { NavigationScreenProp, NavigationState, NavigationParams, NavigationActions } from 'react-navigation'
import { View, StatusBar, Platform, StyleSheet, Text, StyleProp, ViewStyle, AsyncStorage } from 'react-native'
import env from './env'
import { ScrollView } from 'react-native-gesture-handler'

interface HeaderProps {
    title: string,
    downButton?: boolean,
    backButton?: boolean
}

/**
 * Page component, with an Header, navigation buttons and a
 */
export class Page extends Component<NavigationProps & HeaderProps & { style?: StyleProp<ViewStyle> }> {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Header {...this.props} />
                <ScrollView style={{ flex: 1 }} {...this.props}>
                    {this.props.children}
                </ScrollView>
            </View>
        )
    }
}

/**
 * Header component, represents the header
 * 
 * refer to the *HeaderProps* interface
 */
class Header extends Component<NavigationProps & HeaderProps> {
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
                <View style={[styles.menuButton, { flexDirection: 'row', justifyContent: 'center' }]} onTouchStart={() => this.props.navigation.dispatch(NavigationActions.back())}>
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

/**
 * Defines the standard *navigation* prop common to all components that 
 * somehow make use of the navigation (all *Page* components)
 */
export interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

/**
 * Plain JS object containing common style properties
 */
export const commonStyles = {
    mainColor: '#ff7923',
    backgroundColor: '#1e1b20'
}

/** backend server's URL */
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