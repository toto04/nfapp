import React, { Component } from 'react'
import {} from 'react-navigation-drawer'
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'
import { View, StatusBar, Platform } from 'react-native'

export interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export class StatusBarBackground extends Component {
    render() {
        return (
            <View style={{
                height: Platform.OS == 'ios' ? 18 : 0,
                backgroundColor: '#1e1b20',
                alignSelf: 'stretch',
              }}>
                <StatusBar backgroundColor={'#1e1b20'} barStyle={'light-content'} />
            </View>
        )
    }
}

export let commonStyles = {
    mainColor: '#ff7923'
}