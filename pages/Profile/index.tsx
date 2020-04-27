import React, { Component } from 'react'
import { Image, Text, View, Button, StyleSheet, AsyncStorage } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import { NavigationProps, commonStyles, api, ScrollableMainPage, ShadowCard } from '../../util';
import { LoginState, logout } from '../../redux/login';
import { connect } from 'react-redux';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';

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

class ProfilePage extends Component<NavigationProps & { login: LoginState, logout: () => void }, { class: string, newProfilePic?: string }> {
    constructor(props) {
        super(props)
        this.state = { class: 'attendo server...' }
        api.get(`/api/user/info/${this.props.login.username}`).then(async res => {
            this.setState({ class: res.data.classname })
        })
    }

    pickImage = async () => {
        let permission = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if (permission.status != 'granted') return
        let image: any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            base64: true,
            quality: 0.6
        })
        if (!image.cancelled) {
            let data = 'data:image/jpeg;base64,' + image.base64
            this.setState({ newProfilePic: data })

            AsyncStorage.getItem('logInfo').then(info => AsyncStorage.setItem('logInfo', JSON.stringify({ ...JSON.parse(info), profilepic: data })))
            api.post('/api/user/profilepic', { profilepic: data })
        }
    }

    render() {
        return (
            <ScrollableMainPage
                navigation={this.props.navigation}
                statusBarStyle='dark-content'
            >
                <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                    <View style={{ flex: 2 }}>
                        <Text style={[styles.profileText, { fontWeight: 'bold', fontSize: 34 }]}>{`${this.props.login.firstName} ${this.props.login.lastName}`}</Text>
                        <Text style={styles.profileText}>{this.state.class}</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SettingsPage')}>
                            <Text style={[styles.profileText, { color: commonStyles.main.color }]}>impostazioni</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableHighlight
                            onPress={() => {
                                this.pickImage()
                            }}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                overflow: 'hidden'
                            }}
                        >
                            <Image
                                source={this.state.newProfilePic ? { uri: this.state.newProfilePic } : this.props.login.profilepic ? { uri: this.props.login.profilepic } : require('../../assets/default-avatar.png')}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </TouchableHighlight>
                    </View>
                </View>
                <Preview title='I tuoi appunti' onPress={() => this.props.navigation.navigate('PostedNotes', { user: this.props.login.username })} />
                <Preview title='Appunti salvati' onPress={() => this.props.navigation.navigate('SavedNotes')} />
                <Preview title='Eventi attesi' onPress={()=> this.props.navigation.navigate('AttendedEvents')}/>
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