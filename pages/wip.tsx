import React, { Component } from 'react'
import { View, Text } from 'react-native'

/**
 * Work In Progress page, speaks for itself
 */
export default class WIP extends Component {
    render() {
        return(
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', margin: 20}}>
                <Text style={{color: '#777', fontSize: 26, textAlign: 'center'}}>Questa pagina non è ancora stata sviluppata</Text>
                <Text style={{color: '#777', fontSize: 20, marginTop: 10}}>Elia culo</Text>
            </View>
        )
    }
}