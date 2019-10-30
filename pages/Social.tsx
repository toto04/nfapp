import React, { Component } from 'react'
import { View } from 'react-native';
import { NavigationProps, Header } from '../util'

export default class Social extends Component<NavigationProps> {
    render() {
        return(
            <View>
                <Header {...this.props} title='Social' />
                
            </View>
        )
    }
}