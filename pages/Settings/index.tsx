import React, { Component } from 'react'
import { Page, NavigationProps } from '../../util'
import { StyleSheet, Text, StyleProp, TextStyle, Alert, Linking } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import { logout } from '../../redux/login'

class Option extends Component<{ onPress?: () => void, style?: StyleProp<TextStyle> }> {
    render = () => <TouchableOpacity onPress={this.props.onPress}>
        <Text style={[{
            fontSize: 22,
            margin: 2
        }, this.props.style]}>{this.props.children}</Text>
    </TouchableOpacity>
}

class _SettingsPage extends Component<NavigationProps & { logout: typeof logout }> {
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
        <Option>Rimuovi foto profilo</Option>
        <Option style={{ color: 'red' }}>Elimina account</Option>
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

export default connect(null, (dispatch) => ({
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