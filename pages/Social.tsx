import React, { Component } from 'react'
import { View, Button } from 'react-native';
import { NavigationProps, Header, commonStyles } from '../util'
import { createStackNavigator, NavigationStackOptions } from 'react-navigation-stack'
import login from './login'

class Social extends Component<NavigationProps> {
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
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
                <Header {...this.props} title='Social' />
                <Button title="Login" onPress={() => {
                    this.props.navigation.navigate('login')
                }}></Button>
            </View>
        )
    }
}

export default createStackNavigator(
    {
        Social,
        login
    },
    {
        mode: 'modal',
        headerMode: 'none'
    }
)