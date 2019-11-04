import React, { Component } from 'react'
import { View, Button } from 'react-native';
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
    render() {
        return (
            <View style={{backgroundColor: '#fff', flex: 1}}>
                <Header {...this.props} title='Impostazioni' />
                <TextInput placeholder='user' onChangeText={(usr)=>{this.setState({usr})}} autoCompleteType='username' />
                <TextInput placeholder='password' onChangeText={(pwd)=>{this.setState({pwd})}} autoCompleteType='password' secureTextEntry />
                <Button title='send' onPress={() => {
                    fetch(serverUrl + '/api/login', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            usr: this.state.usr,
                            pwd: this.state.pwd
                        })
                    })
                }} />
            </View>
        )
    }
}