import React, { Component } from 'react'
import { View } from 'react-native';
import { NavigationProps, Header } from '../util'

export default class Settings extends Component<NavigationProps> {
    render() {
        return(
            <View>
                <Header {...this.props} title='Impostazioni' />
                
            </View>
        )
    }
}