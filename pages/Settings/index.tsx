import React, { Component } from 'react'
import { Page, NavigationProps } from '../../util'
import { StyleSheet, Text, StyleProp, TextStyle } from 'react-native'
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
        <Option>Contattaci</Option>
        <Option onPress={() => {
            this.props.logout()
            this.props.navigation.navigate('Profile')
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