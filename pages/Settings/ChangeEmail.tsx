import React, { Component } from 'react'
import { NavigationProps, Page, commonStyles, api } from '../../util';
import { Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { login, LoginState } from '../../redux/login';

export default class ChangeEmail extends Component<NavigationProps, { newEmail: string }> {
    state = { newEmail: '' }
    render = () => <Page
        navigation={this.props.navigation}
        title="modifica email"
        backButton
        contentContainerStyle={{
            padding: 16
        }}
    >
        <Text style={{ fontSize: 20 }}>
            Cambiando il tuo indirizzo email ti invieremo eventuali comunicazioni riguardanti il
            tuo account al nuovo indirizzo, tra cui anche email di recupero password
        </Text>
        <TextInput
            style={{
                backgroundColor: '#ddd',
                marginVertical: 8,
                padding: 4,
                height: 35,
                fontSize: 15,
                borderRadius: 3
            }}
            placeholder='email@example.com'
            onChangeText={newEmail => this.setState({ newEmail })}
            autoCompleteType='email'
            textContentType='emailAddress'
            autoCapitalize='none'
        />
        <TouchableOpacity
            style={{
                backgroundColor: commonStyles.main.color,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 30,
                padding: 4,
                marginTop: 10,
                height: 40,
                borderRadius: 3
            }}
            onPress={async () => {
                let res = await api.post('/api/user/changeEmail', { newEmail: this.state.newEmail })
                if (res.success) {
                    this.props.navigation.navigate('SettingsPage')
                    Alert.alert('Yay', 'Indirizzo email modificato con successo')
                } else Alert.alert('Qualcosa è andato storto', res.error)
            }}>
            <Text style={{ color: '#fff', fontSize: 20 }}>Modifica indirizzo email</Text>
        </TouchableOpacity>
    </Page>
}