import React, { Component } from 'react'
import { Page, NavigationProps, api } from '../../util'
import { StyleSheet, Text, StyleProp, TextStyle, Alert, Linking } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { logout, login, LoginState } from '../../redux/login'
import Constants from 'expo-constants'
import { createStackNavigator } from 'react-navigation-stack'

import ChangeName from './ChangeName'
import ChangeClass from './ChangeClass'
import ChangePassword from './ChangePassword'
import ChangeEmail from './ChangeEmail'
import DeleteAccount from './DeleteAccount'

class Option extends Component<{ onPress?: () => void, style?: StyleProp<TextStyle> }> {
    render = () => <TouchableOpacity onPress={this.props.onPress}>
        <Text style={[{
            fontSize: 22,
            margin: 2
        }, this.props.style]}>{this.props.children}</Text>
    </TouchableOpacity>
}

class _SettingsPage extends Component<NavigationProps & { state: { login: LoginState }, login: typeof login, logout: typeof logout }> {
    render = () => <Page
        navigation={this.props.navigation}
        title="impostazioni"
        backButton
        contentContainerStyle={{
            paddingHorizontal: 13
        }}
    >
        <Text style={{ paddingTop: 10, opacity: 0.5 }}>{'versione del bundle: ' + Constants.manifest.version}</Text>
        <Text style={styles.section}>Privacy</Text>
        <Option>Segnala</Option>
        <Option onPress={() => {
            this.props.navigation.navigate('ChangeName')
        }}>Modifica nome e cognome</Option>
        <Option onPress={() => {
            this.props.navigation.navigate('ChangeClass')
        }}>Modifica classe</Option>
        <Option onPress={async () => {
            let res = await api.post('/api/user/removeProfilepic', {})
            this.props.login(this.props.state.login.username, this.props.state.login.password, this.props.state.login._class.className, this.props.state.login.firstName, this.props.state.login.lastName)
            res.success ? Alert.alert('Foto profilo rimossa', 'La tua foto profilo è stat rimossa, puoi cambiarla in qualsiasi momento dal profilo') : Alert.alert('Qualcosa è andato storto', res.error)
        }}>Rimuovi foto profilo</Option>
        <Option style={{ color: 'red' }} onPress={() => {
            Alert.alert('Sei veramente sicuro di eliminare di voler eliminare il tuo account?', 'Questa azione è irreversibile e avrà effetto immediato. Verrano automaticamente eliminati tutti i tuoi dati e gli appunti che hai pubblicato', [
                {
                    text: 'Sono sicuro',
                    style: 'destructive',
                    onPress: () => this.props.navigation.navigate('DeleteAccount')
                },
                {
                    text: 'Annulla',
                    style: 'cancel'
                }
            ])
        }}>Elimina account</Option>
        <Text style={styles.section}>Sicurezza</Text>
        <Option onPress={() => {
            this.props.navigation.navigate('ChangePassword')
        }}>Cambia password</Option>
        <Option onPress={() => {
            this.props.navigation.navigate('ChangeEmail')
        }}>Cambia indirizzo email</Option>
        <Text style={styles.section}>Altro</Text>
        <Option onPress={() => {
            Alert.alert('Contattaci', 'Puoi contattare i Rappresentati di Istituto o gli Sviluppatori dell\'applicazione via Whatsapp o email ai recapiti che trovi in fondo alla Politica della Privacy', [{ text: 'Vai ai recapiti', onPress: () => Linking.openURL('https://nfapp-server.herokuapp.com/privacy') }, { text: 'Annulla', style: 'cancel' }])
        }}>Contattaci</Option>
        <Option onPress={() => {
            Alert.alert('Logout', 'Sei sicuro di voler fare il logout? Potrai rifare il login quando vuoi', [
                {
                    text: 'Procedi',
                    onPress: () => {
                        this.props.logout()
                        this.props.navigation.navigate('Profile')
                        Alert.alert('Logout', 'logout effettuato, a presto!')
                    }
                }, {
                    text: 'Annulla',
                    style: 'cancel'
                }
            ])
        }} style={{ color: 'red' }}>Logout</Option>
    </Page>
}

let SettingsPage = connect((state: { login: LoginState }) => ({ state }), (dispatch) => ({
    login: (username: string, password: string, classname: string, firstName: string, lastName: string, profilepic?: string) => dispatch(login(username, password, classname, firstName, lastName, profilepic)),
    logout: () => dispatch(logout())
}))(_SettingsPage)

export default createStackNavigator({
    SettingsPage,
    ChangeName,
    ChangeClass,
    ChangePassword,
    ChangeEmail,
    DeleteAccount
}, {
    headerMode: 'none'
})

let styles = StyleSheet.create({
    section: {
        margin: 2,
        marginTop: 10,
        fontSize: 30,
        fontWeight: 'bold'
    }
})