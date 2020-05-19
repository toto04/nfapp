import React, { Component } from 'react'
import { NavigationProps, Page, commonStyles, api } from '../../util';
import { Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { login, LoginState } from '../../redux/login';

class _ChangeName extends Component<NavigationProps & { state: { login: LoginState }, login: typeof login }, { firstname: string, lastname: string }> {
    render = () => <Page
        navigation={this.props.navigation}
        title="modifica nome"
        backButton
        contentContainerStyle={{
            padding: 16
        }}
    >
        <Text style={{ fontSize: 20 }}>
            Hai fatto qualche errore di battitura durante la registrazione?
            Vuoi essere conosciuto per qualcosa di diverso?
        </Text>
        <Text style={{ fontSize: 20, marginVertical: 5 }}>
            Sei venuto nel posto giusto, qua puoi decidere come gli altri ti
            vedranno (ma non puoi cambiare chi sei in realtà)
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
            placeholder='Nome'
            onChangeText={firstname => this.setState({ firstname })}
            autoCompleteType='name'
            textContentType='name'
            autoCapitalize='words'
        />
        <TextInput
            style={{
                backgroundColor: '#ddd',
                marginVertical: 8,
                padding: 4,
                height: 35,
                fontSize: 15,
                borderRadius: 3
            }}
            placeholder='Cognome'
            onChangeText={lastname => this.setState({ lastname })}
            autoCompleteType='name'
            textContentType='familyName'
            autoCapitalize='words'
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
                if (!this.state.firstname || !this.state.lastname) Alert.alert('Errore', 'Inserisci nome e cognome, duh')
                else {
                    let res = await api.post('/api/user/changeName', { firstname: this.state.firstname, lastname: this.state.lastname })
                    if (res.success) {
                        this.props.login(this.props.state.login.username, this.props.state.login.password, this.props.state.login._class.className, this.state.firstname, this.state.lastname, this.props.state.login.profilepic)
                        this.props.navigation.navigate('SettingsPage')
                        Alert.alert('Yay', 'Nome e Cognome modificati con successo')
                    } else Alert.alert('Qualcosa è andato storto', res.error)
                }
            }}>
            <Text style={{ color: '#fff', fontSize: 20 }}>Modifica Nome e Cognome</Text>
        </TouchableOpacity>
    </Page>
}
export default connect(state => ({ state }), dispatch => ({ login: (...args: Parameters<typeof login>) => dispatch(login(...args)) }))(_ChangeName)