import React, { Component } from 'react'
import { Text, Linking, TextInput, TouchableOpacity, Alert, Platform, KeyboardAvoidingView } from 'react-native'
import { Page, NavigationProps, commonStyles, api } from '../../util'

export default class Report extends Component<NavigationProps, { report?: string }> {
    constructor(p) {
        super(p)
        this.state = { report: undefined }
    }
    render = () => <Page
        navigation={this.props.navigation}
        backButton
        title="report"
        contentContainerStyle={{
            padding: 16,
            paddingBottom: 100
        }}
    >
        <KeyboardAvoidingView behavior='position'>
            <Text style={{ fontSize: 20 }}>
                Ci dispiace che tu stia avendo problemi con l'NFApp,
            se qualcuno non rispetta i nostri <Text
                    style={{ color: commonStyles.main.color }}
                    onPress={() => Linking.openURL('https://nfapp-server.herokuapp.com/privacy')}
                >Termini e condizioni</Text>, oppure hai problemi di qualsiasi natura scrivi qua
            sotto tutto quello che dobbiamo sapere per darti una mano, cercheremo di risolvere
            il prima possibile
        </Text>
            <Text style={{ fontSize: 20, marginVertical: 5 }}>
                Puoi usare questa pagina per segnalarci problemi di qualsiasi natura, ma se hai problemi
                tecnici o pensi di avere bisogno di un supporto più immediato ti consigliamo di scriverci
            direttamente (i nostri recapiti sono in fondo alla nostra <Text style={{ color: commonStyles.main.color }} onPress={() => Linking.openURL('https://nfapp-server.herokuapp.com/privacy')}>Politica sulla Privacy</Text>)
        </Text>
            <Text style={{ fontSize: 20, marginVertical: 5 }}>
                Infine se vuoi segnalare un bug ti preghiamo di aprire una issue nella repo ufficiale
            dell'app su <Text style={{ color: commonStyles.main.color }} onPress={() => Linking.openURL('https://github.com/toto04/nfapp/issues/new')}>Github</Text>)
        </Text>
            <TextInput
                style={{
                    backgroundColor: '#ddd',
                    marginVertical: 8,
                    padding: 4,
                    fontSize: 15,
                    borderRadius: 3,
                    minHeight: 60
                }}
                multiline
                placeholder="Cosa c'è che non va?"
                onChangeText={value => this.setState({ report: value })}
                numberOfLines={4}
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
                    if (!this.state.report) Alert.alert('Errore', 'Devi scrivere qualcosa nel campo di testo, duh')
                    else {
                        let res = await api.post('/api/user/report', { report: this.state.report })
                        if (res.success) {
                            this.props.navigation.navigate('Profile')
                            Alert.alert('Successo', 'Abbiamo raccolto la tua segnalazione, speriamo di poterti aiutare il prima possibile')
                        } else Alert.alert('Qualcosa è andato storto', 'Riprova più tardi o contattaci direttamente')
                    }
                }}>
                <Text style={{ color: '#fff', fontSize: 20 }}>Segnala</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    </Page>
}