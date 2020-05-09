import React, { Component } from 'react'
import { Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Page, NavigationProps, commonStyles, api } from "../../util";
import { connect } from 'react-redux';
import { LoginState, logout } from '../../redux/login';

class _DeleteAccount extends Component<NavigationProps & { state: { login: LoginState }, logout: typeof logout }, { username: string, password: string }> {
    constructor(p) {
        super(p)
        this.state = {
            username: '',
            password: ''
        }
    }
    render = () => {
        return <Page
            navigation={this.props.navigation}
            title="elimina account"
            backButton
            contentContainerStyle={{
                paddingHorizontal: 13
            }}
        >
            <Text style={{
                fontSize: 30,
                color: commonStyles.main.color,
                fontWeight: 'bold',
                margin: 2,
                marginTop: 10
            }}>Attenzione!</Text>
            <Text style={{
                fontSize: 18,
                marginVertical: 5
            }}>
                Sul serio, non puoi più tornare indietro se cancelli il tuo account, tutti i tuoi dati e gli appunti che hai condiviso scompariranno completamente.

                Detto questo se sei veramente sicuro immetti il tuo username e la tua password qua sotto.
            </Text>

            <TextInput
                style={styles.input}
                placeholder='user'
                onChangeText={username => { this.setState({ username }) }}
                autoCapitalize='none'
            />
            <TextInput
                style={styles.input}
                placeholder='password'
                onChangeText={password => { this.setState({ password }) }}
                autoCapitalize='none'
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={async () => {
                if (this.state.username != this.props.state.login.username) {
                    Alert.alert('Errore', 'L\'username con cui hai effettuato il login e quello che hai inserito non coincidono')
                    return
                }
                if (this.state.password != this.props.state.login.password) {
                    Alert.alert('Errore', 'La password che hai inserito non conincide con quella del tuo account')
                    return
                }
                Alert.alert('Per l\'ultima volta', 'Sei veramente sicuro sicuro sicuro di voler cancellare il tuo account? Scomparirà per sempre (che è veramente tanto tempo!)', [
                    {
                        text: 'Ho detto che sono sicuro',
                        style: 'destructive',
                        onPress: async () => {
                            let res = await api.post('/api/user/delete', {})
                            this.props.logout()
                            this.props.navigation.navigate('Profile')
                            Alert.alert('Addio', res.data)
                        }
                    }, {
                        text: 'Annulla',
                        style: 'cancel'
                    }
                ])
            }}>
                <Text style={{ color: '#fff', fontSize: 20 }}>Conferma</Text>
            </TouchableOpacity>
        </Page>
    }
}

export default connect((state: { login: LoginState }) => ({ state }), dispatch => ({ logout: () => dispatch(logout()) }))(_DeleteAccount)

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#ddd',
        marginHorizontal: 30,
        marginVertical: 5,
        padding: 4,
        height: 35,
        fontSize: 15,
        borderRadius: 3
    },
    button: {
        backgroundColor: commonStyles.main.color,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 30,
        padding: 4,
        marginTop: 10,
        height: 40,
        fontSize: 20,
        borderRadius: 3
    }
})