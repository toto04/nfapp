import React, { Component } from 'react'
import { View, Button, StyleSheet } from 'react-native';
import { NavigationProps, Header, serverUrl, commonStyles } from '../util'
import { TextInput } from 'react-native-gesture-handler';

export default class Login extends Component<NavigationProps, {usr: string, pwd: string}> {
    static navigationOptions = {
        title: 'Login',
        headerStyle: {
            backgroundColor: commonStyles.backgroundColor,
        },
        headerTintColor: commonStyles.mainColor,
    }

    componentDidMount() {
        this.setState({usr: '', pwd: ''}) // prevent crashing without input
    }

    render() {
        return (
            <View style={{backgroundColor: '#fff', flex: 1}}>
                <Header {...this.props} title='Impostazioni' />
                <TextInput style={styles.input} placeholder='user' onChangeText={(usr)=>{this.setState({usr})}} autoCompleteType='username' />
                <TextInput style={styles.input} placeholder='password' onChangeText={(pwd)=>{this.setState({pwd})}} autoCompleteType='password' secureTextEntry />
                <Button title='send' onPress={() => {
                    console.log(serverUrl)
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
                        console.log('banana')
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