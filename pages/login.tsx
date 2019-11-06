import React, { Component, } from 'react'
import { View, Button, StyleSheet, TouchableOpacity, Text, Picker, Modal, ActionSheetIOS } from 'react-native';
import { NavigationProps, Page, serverUrl, commonStyles } from '../util'
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import { createStackNavigator } from 'react-navigation-stack';

interface signupStates {
    usr?: string,
    pwd?: string,
    email?: string,
    fstName?: string,
    lstName?: string,
    cls: string
}

enum Classes {
    '3ASA',
    '4ASA',
    '5ASA'
}

class Signup extends Component<NavigationProps, signupStates> {
    constructor(props) {
        super(props)
        this.state = {
            cls: Classes[0]
        }
    }

    render() {
        let classItems: JSX.Element[] = []
        for (let i = 0; i < Object.keys(Classes).length / 2; i++) {
            classItems.push(<Picker.Item key={i} label={Classes[i]} value={Classes[i]} />)
        }

        return (
            <Page {...this.props} title='registrati' backButton>
                <TextInput
                    style={styles.input}
                    placeholder='user'
                    onChangeText={(usr) => { this.setState({ usr }) }}
                    autoCompleteType='username'
                    textContentType='username'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='password'
                    onChangeText={(pwd) => { this.setState({ pwd }) }}
                    autoCompleteType='password'
                    textContentType='newPassword'
                    autoCapitalize='none'
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder='conferma password'
                    onChangeText={(pwd) => { this.setState({ pwd }) }}
                    autoCompleteType='password'
                    textContentType='password'
                    autoCapitalize='none'
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder='email@example.com'
                    onChangeText={(email) => { this.setState({ email }) }}
                    autoCompleteType='email'
                    textContentType='emailAddress'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Nome'
                    onChangeText={(fstName) => { this.setState({ fstName }) }}
                    autoCompleteType='name'
                    textContentType='name'
                    autoCapitalize='words'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Cognome'
                    onChangeText={(lstName) => { this.setState({ lstName }) }}
                    autoCompleteType='name'
                    textContentType='familyName'
                    autoCapitalize='words'
                />
                <Picker
                    mode={'dialog'}
                    selectedValue={this.state.cls}
                    onValueChange={(cls, idx) => {
                        this.setState({ cls })
                    }}
                >
                    {classItems}
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
            </Page>
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
            <Page {...this.props} title='log in' downButton>
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
            </Page>
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