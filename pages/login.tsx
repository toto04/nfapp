import React, { Component, } from 'react'
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { NavigationProps, Header, serverUrl, commonStyles } from '../util'
import { TextInput } from 'react-native-gesture-handler';

interface signupStates {
    usr: string,
    pwd: string,
    email: string,
    fstName: string,
    lstName: string,
    class: string
}

class Signup extends Component<NavigationProps, signupStates> {
    
}


export default class Login extends Component<NavigationProps, { usr: string, pwd: string }> {
    componentDidMount() {
        this.setState({ usr: '', pwd: '' }) // prevent crashing without input
    }

    render() {
        return (
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
                <Header {...this.props} title='Impostazioni' />
                <TextInput style={styles.input} placeholder='user' onChangeText={(usr) => { this.setState({ usr }) }} autoCompleteType='username' />
                <TextInput style={styles.input} placeholder='password' onChangeText={(pwd) => { this.setState({ pwd }) }} autoCompleteType='password' secureTextEntry />
                <Button title='Log in' onPress={() => {
                    fetch(serverUrl + '/api/login', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            usr: this.state.usr,
                            pwd: this.state.pwd
                        })
                    }).then(async res => {
                        let { logged } = await res.json()
                        alert(logged ? 'Loggato!' : 'Elia smettila')
                    })
                }} />
                <Button title='Sign up' onPress={() => {
                    fetch(serverUrl + '/api/signup', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            usr: this.state.usr,
                            pwd: this.state.pwd
                        })
                    }).then(async res => {
                        let { success } = await res.json()
                        alert(success ? 'utente creato!' : 'utente non creato')
                    })
                }} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        marginHorizontal: 30,
        padding: 4,
        marginVertical: 10,
        height: 40,
        fontSize: 20,
        borderWidth: 1,
        borderRadius: 3
    }
})