import React, { Component } from 'react'
import { Image, Text, View, Button, StyleSheet } from 'react-native'
import { NavigationProps, commonStyles, api, ScrollableMainPage, ShadowCard } from '../../util';
import { LoginState, logout } from '../../redux/login';
import {  connect } from 'react-redux';

class Preview extends Component<{ title: string, onPress?: () => void }> {
    render() {
        return (
            <View style={{ alignSelf: 'stretch', paddingHorizontal: 10 }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{this.props.title}</Text>
                <ShadowCard onPress={this.props.onPress} style={{ marginVertical: 20 }}>
                    <View style={{
                        backgroundColor: commonStyles.main.backgroundColor,
                        padding: 20
                    }}>
                        <Text style={{ color: 'white', fontSize: 40 }}>{'  '}</Text>
                    </View>
                </ShadowCard>
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
            <ScrollableMainPage
                navigation={this.props.navigation}
                statusBarStyle='dark-content'
            >
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 2 }}>
                        <Text style={[styles.profileText, { fontWeight: 'bold', fontSize: 34 }]}>{`${this.props.login.firstName} ${this.props.login.lastName}`}</Text>
                        <Text style={styles.profileText}>{this.state.class}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Image
                            source={require('../../assets/default-avatar.png')}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                overflow: 'hidden'
                            }}
                        />
                    </View>
                </View>
                <Button title='logout' onPress={this.props.logout} />
                <Preview title='Appunti pubblicati' />
                <Preview title='Appunti salvati' onPress={() => this.props.navigation.navigate('SavedNotes')} />
                <Preview title='Eventi attesi' />
            </ScrollableMainPage>
        )
    }
}

class ProfileLoggedOutPage extends Component<NavigationProps> {
    render() {
        return (
            <ScrollableMainPage
                scrollEnabled={false}
                navigation={this.props.navigation}
                statusBarStyle='light-content'
                contentContainerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20
                }}
            >
                <Text style={{ fontSize: 26, textAlign: 'center' }}>Effettua il login per accedere al profilo</Text>
                <Button title='login' onPress={() => this.props.navigation.navigate('Login')} />
            </ScrollableMainPage>
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