import React, { Component, } from 'react'
import { View, Button, StyleSheet, TouchableOpacity, Text, Picker } from 'react-native';
import { NavigationProps, Header, serverUrl, commonStyles } from '../util'
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import { createStackNavigator } from 'react-navigation-stack';
import { withNavigationFocus, NavigationFocusInjectedProps } from 'react-navigation';

interface signupStates {
    usr?: string,
    pwd?: string,
    email?: string,
    fstName?: string,
    lstName?: string,
    cls: string
}

class Signup extends Component<NavigationProps, signupStates> {
    constructor(props) {
        super(props)
        this.state = {
            cls: ''
        }
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: '#fff', flex: 1 }}>
                <Header {...this.props} title='registrati' backButton />
                <TextInput
                    style={styles.input}
                    placeholder='user'
                    onChangeText={(usr) => { this.setState({ usr }) }}
                    autoCompleteType='username'
                    textContentType='username'
                />
                <TextInput
                    style={styles.input}
                    placeholder='password'
                    onChangeText={(pwd) => { this.setState({ pwd }) }}
                    autoCompleteType='password'
                    textContentType='newPassword'
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder='conferma password'
                    onChangeText={(pwd) => { this.setState({ pwd }) }}
                    autoCompleteType='password'
                    textContentType='password'
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder='email@example.com'
                    onChangeText={(email) => { this.setState({ email }) }}
                    autoCompleteType='email'
                    textContentType='emailAddress'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Nome'
                    onChangeText={(fstName) => { this.setState({ fstName }) }}
                    autoCompleteType='name'
                    textContentType='name'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Cognome'
                    onChangeText={(lstName) => { this.setState({ lstName }) }}
                    autoCompleteType='name'
                    textContentType='familyName'
                />
                <Picker
                    selectedValue={this.state.cls}
                    onValueChange={(cls, idx) => {
                        this.setState({ cls })
                    }}
                >
                    <Picker.Item label='3ASA' value='3ASA' />
                    <Picker.Item label='4ASA' value='4ASA' />
                    <Picker.Item label='5ASA' value='5ASA' />
                </Picker>
                <TouchableOpacity style={styles.button} onPress={() => {
                    fetch(serverUrl + '/api/signup', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            usr: this.state.usr,
                            pwd: this.state.pwd,
                            email: this.state.email,
                            fstName: this.state.fstName,
                            lstName: this.state.lstName,
                            cls: this.state.cls
                        })
                    }).then(async res => {
                        let { success, error } = await res.json()
                        alert(success ? 'utente creato!' : error)
                    })
                }}>
                    <Text style={{ color: '#fff', fontSize: 20 }}>Registrati</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
}

class Login extends Component<NavigationProps, { usr: string, pwd: string, editable: boolean }> {
    constructor(props) {
        super(props)
        this.state = { usr: '', pwd: '', editable: true }
        this.props.navigation.addListener('willFocus', () => {
            this.setState({ editable: true })
        })
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: '#fff', flex: 1 }}>
                <Header {...this.props} title='log in' downButton />
                <TextInput
                    style={styles.input}
                    editable={this.state.editable}
                    placeholder='user'
                    onChangeText={(usr) => { this.setState({ usr }) }}
                    autoCompleteType='username'
                />
                <TextInput
                    style={styles.input}
                    editable={this.state.editable}
                    placeholder='password'
                    onChangeText={(pwd) => { this.setState({ pwd }) }} autoCompleteType='password'
                    secureTextEntry
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
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
                    }}>
                    <Text style={{ color: '#fff', fontSize: 20 }}>Log in</Text>
                </TouchableOpacity>
                <Button title='Non hai un account? Registrati' onPress={() => {
                    this.props.navigation.navigate('Signup')
                    this.setState({ editable: false })
                }} />
            </ScrollView>
        )
    }
}

export default createStackNavigator({
    Login,
    Signup
}, {
    headerMode: 'none'
})

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