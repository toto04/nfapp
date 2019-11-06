import React, { Component } from 'react'
import { View, Button } from 'react-native';
import { NavigationProps, commonStyles, Page } from '../util'
import { createStackNavigator, NavigationStackOptions } from 'react-navigation-stack'
import login from './login'

export default class Social extends Component<NavigationProps> {
    static navigationOptions: NavigationStackOptions = {
        title: 'Social',
        headerStyle: {
            backgroundColor: commonStyles.backgroundColor,
        },
        headerTintColor: commonStyles.mainColor,
        headerTitleStyle: {
            fontWeight: '400',
            fontSize: 30
        },
    }
    render() {
        return (
            <Page {...this.props} title='Social'>
                <Button title="Login" onPress={() => {
                    this.props.navigation.navigate('Login')
                }}></Button>
            </Page>
        )
    }
}