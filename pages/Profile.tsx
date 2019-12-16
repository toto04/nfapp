import React, { Component } from 'react'
import { Image, Text, View, Button, StyleSheet } from 'react-native'
import { NavigationProps, Page, commonStyles, api } from '../util';
import { TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import { LoginState, logout } from '../redux/login';
import { Connect, connect } from 'react-redux';
import { getStatusBarHeight } from 'react-native-safe-area-view';

class Preview extends Component<{ title: string, onPress?: () => void }> {
    render() {
        return (
            <View style={{ alignSelf: 'stretch', paddingHorizontal: 10 }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', marginLeft: 21 }}>{this.props.title}</Text>
                <TouchableHighlight onPress={this.props.onPress}>
                    <View style={{
                        margin: 20,
                        backgroundColor: commonStyles.backgroundColor,
                        borderRadius: 10,
                        padding: 20,
                        shadowOpacity: 0.2,
                        shadowOffset: { width: 0, height: 5 },
                        shadowRadius: 5,
                        elevation: 5
                    }}>
                        <Text style={{ color: 'white', fontSize: 40 }}>{'  '}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}

class ProfilePage extends Component<NavigationProps & { login: LoginState, logout: () => void }, { class: string }> {
    constructor(props) {
        super(props)
        this.state = { class: 'attendo server...' }
        api.get(`/api/user/${this.props.login.username}`).then(async res => {
            this.setState({ class: res.class })
        })
    }

    render() {
        return (
            <ScrollView style={{ paddingTop: getStatusBarHeight() }}>
                <View style={{
                    padding: 20,
                    marginBottom: 20
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 2 }}>
                            <Text style={[styles.profileText, { fontWeight: 'bold', fontSize: 34 }]}>{`${this.props.login.firstName} ${this.props.login.lastName}`}</Text>
                            <Text style={styles.profileText}>{this.state.class}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Image
                                source={require('../assets/default-avatar.png')}
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 50,
                                    overflow: 'hidden'
                                }}
                            />
                        </View>
                    </View>
                </View>
                <Button title='logout' onPress={this.props.logout} />
                <Preview title='Appunti salvati' />
                <Preview title='Eventi attesi' />
                <Preview title='Peer education' />
            </ScrollView>
        )
    }
}

class ProfileLoggedOutPage extends Component<NavigationProps> {
    render() {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20
            }}>
                <Text style={{ fontSize: 26, textAlign: 'center' }}>Effettua il login per accedere al profilo</Text>
                <Button title='login' onPress={() => this.props.navigation.navigate('Login')} />
            </View>
        )
    }
}

class ProfileSessionHandler extends Component<NavigationProps & { login: LoginState, logout: () => void }> {
    render() { return (this.props.login.loggedIn ? <ProfilePage {...this.props} /> : <ProfileLoggedOutPage {...this.props} />) }
}
export default connect((state: { login: LoginState }) => ({ login: state.login }), (dispatch) => ({ logout: () => dispatch(logout()) }))(ProfileSessionHandler)

let styles = StyleSheet.create({
    profileText: {
        alignSelf: 'flex-start',
        color: 'black',
        fontSize: 20
    }
})