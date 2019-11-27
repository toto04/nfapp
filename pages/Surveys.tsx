import React, { Component } from 'react'
import { Text, View, Button, StyleSheet, Modal, Vibration } from 'react-native'
import { NavigationProps, Page, commonStyles, api } from "../util";
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';

export default class Surveys extends Component<NavigationProps> {
    render() {
        return (
            <ScrollView contentContainerStyle={{ margin: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 40 }}>Sondaggi</Text>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#ddd',
        marginHorizontal: 30,
        padding: 4,
        marginTop: 10,
        height: 35,
        fontSize: 15,
        borderRadius: 3
    },
    button: {
        backgroundColor: commonStyles.mainColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 30,
        padding: 4,
        marginTop: 10,
        height: 40,
        fontSize: 20,
        borderRadius: 3
    }
})