import React, { Component } from 'react'
import { NavigationProps, Page, commonStyles, api, Class } from '../../util';
import { Text, TextInput, TouchableOpacity, Alert, Picker } from 'react-native';
import { connect } from 'react-redux';
import { login, LoginState, logout } from '../../redux/login';
let classes = []
for (let field in Class.classStructure) {
    for (let year of Class.classStructure[field]) {
        classes.push(...year.sections)
    }
}

class _ChangePassword extends Component<NavigationProps & { state: { login: LoginState }, login: typeof login, logout: typeof logout }, { newPassword: string, newPasswordConfirm: string }> {
    state = { newPassword: '', newPasswordConfirm: '' }
    render = () => <Page
        navigation={this.props.navigation}
        title="cambia password"
        backButton
        contentContainerStyle={{
            padding: 16
        }}
    >
        <Text style={{ fontSize: 20 }}>
            La nuova password deve essere lunga almeno 8 caratteri,
            dovrai rieffettuare il login una volta modificata
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
            placeholder='nuova password'
            onChangeText={newPassword => this.setState({ newPassword })}
            autoCompleteType='password'
            textContentType='newPassword'
            autoCapitalize='none'
            secureTextEntry
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
            placeholder='conferma nuova password'
            onChangeText={newPasswordConfirm => this.setState({ newPasswordConfirm })}
            autoCompleteType='password'
            textContentType='newPassword'
            autoCapitalize='none'
            secureTextEntry
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
                if (this.state.newPassword.length < 8) {
                    Alert.alert('Errore', 'La password deve essere lunga almeno 8 caratteri')
                    return
                }
                if (this.state.newPasswordConfirm != this.state.newPassword) {
                    Alert.alert('Errore', 'La password e Conferma Password devono essere uguali')
                    return
                }
                let res = await api.post('/api/user/changePassword', { newPassword: this.state.newPassword })
                if (res.success) {
                    this.props.logout()
                    this.props.navigation.navigate('Login')
                    Alert.alert('Yay', 'La password è stata modificata con successo, puoi rieffettuare il login')
                } else Alert.alert('Qualcosa è andato storto', res.error)
            }}>
            <Text style={{ color: '#fff', fontSize: 20 }}>Imposta nuova password</Text>
        </TouchableOpacity>
    </Page>
}
export default connect(state => ({ state }), dispatch => ({ login: (...args: Parameters<typeof login>) => dispatch(login(...args)), logout: () => dispatch(logout()) }))(_ChangePassword)