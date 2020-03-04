import React, { Component } from 'react'
import { Page, NavigationProps, api } from '../../util'
import { StyleSheet, Text, StyleProp, TextStyle, Alert, Linking } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { logout, login, LoginState } from '../../redux/login'

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
        <Text style={styles.section}>Privacy</Text>
        <Option>Segnala</Option>
        <Option>Modifica nome e cognome</Option>
        <Option>Modifica classe</Option>
        <Option onPress={async () => {
            let res = await api.post('/api/user/removeProfilepic', {})
            this.props.login(this.props.state.login.username, this.props.state.login.password, this.props.state.login._class.className, this.props.state.login.firstName, this.props.state.login.lastName)
            res.success ? Alert.alert('Foto profilo rimossa', 'La tua foto profilo è stat rimossa, puoi cambiarla in qualsiasi momento dal profilo') : Alert.alert('Qualcosa è andato storto', res.error)
        }}>Rimuovi foto profilo</Option>
        <Option style={{ color: 'red' }} onPress={() => {
            Alert.alert('Sei veramente sicuro di eliminare di voler eliminare il tuo account?', 'Questa azione è irreversibile e avrà effetto immediato. Verrano automaticamente eliminati tutti i tuoi dati e gli appunti che hai pubblicato')
        }}>Elimina account</Option>
        <Text style={styles.section}>Sicurezza</Text>
        <Option>Cambia password</Option>
        <Option>Cambia indirizzo email</Option>
        <Text style={styles.section}>Altro</Text>
        <Option onPress={() => {
            Alert.alert('Contattaci', 'Puoi contattare i Rappresentati di Istituto o gli Sviluppatori dell\'applicazione via Whatsapp o email ai recapiti che trovi in fondo alla Politica della Privacy', [{ text: 'Vai ai recapiti', onPress: () => Linking.openURL('https://nfapp-server.herokuapp.com/privacy') }, { text: 'Annulla', style: 'cancel' }])
        }}>Contattaci</Option>
        <Option onPress={() => {
            this.props.logout()
            this.props.navigation.navigate('Profile')
            Alert.alert('Logout', 'Probabilmente te ne sei accorto ma hai effettuato il logout')
        }} style={{ color: 'red' }}>Logout</Option>
    </Page>
}

export default connect((state: { login: LoginState }) => ({ state }), (dispatch) => ({
    login: (username: string, password: string, classname: string, firstName: string, lastName: string, profilepic?: string) => dispatch(login(username, password, classname, firstName, lastName, profilepic)),
    logout: () => dispatch(logout())
}))(_SettingsPage)

let styles = StyleSheet.create({
    section: {
        margin: 2,
        marginTop: 10,
        fontSize: 30,
        fontWeight: 'bold'
    }
})