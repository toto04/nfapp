import { LoginState, login, logout } from '../redux';
import { MapDispatchToProps, MapStateToProps, connect } from 'react-redux';
import { NavigationProps, Page } from '../util';
import React, { Component } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { Button, Text } from 'react-native';

class myComp extends Component<NavigationProps & {
    login: (user: string, pass: string) => void,
    logout: () => void,
    username: string,
    password: string,
    loggedIn: boolean
}, { currentUser: string, currentPass: string }> {
    render() {
        let button = !this.props.loggedIn ?
            (
                <Button title='submit' onPress={() => {
                    this.props.login(this.state.currentUser, this.state.currentPass)
                }} />
            ) : (
                <Button title='logout' onPress={() => {
                    this.props.logout()
                }} />
            )
        return (
            <Page {...this.props} title='test' downButton>
                <TextInput
                    placeholder='username'
                    onChangeText={v => {
                        this.setState({ currentUser: v })
                    }}
                />
                <TextInput
                    placeholder='password'
                    onChangeText={v => {
                        this.setState({ currentPass: v })
                    }}
                />
                {button}
                <Text>{this.props.username}</Text>
                <Text>{this.props.password}</Text>
            </Page>
        )
    }
}

function mapStateToProps(state: LoginState) {
    return {
        username: state.username,
        password: state.password,
        loggedIn: state.username != undefined
    }
}

function mapDispatchToProps(dispatch) {
    return {
        login: (username: string, password: string) => dispatch(login(username, password)),
        logout: () => dispatch(logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(myComp)

