import React, { Component } from 'react'
import { NavigationProps, Page, commonStyles, api, Class } from '../../util';
import { Text, TextInput, TouchableOpacity, Alert, Picker } from 'react-native';
import { connect } from 'react-redux';
import { login, LoginState } from '../../redux/login';
let classes = []
for (let field in Class.classStructure) {
    for (let year of Class.classStructure[field]) {
        classes.push(...year.sections)
    }
}

class _ChangeName extends Component<NavigationProps & { state: { login: LoginState }, login: typeof login }, { classname: string }> {
    state = { classname: classes[0] }
    render = () => <Page
        navigation={this.props.navigation}
        title="modifica nome"
        backButton
        contentContainerStyle={{
            padding: 16
        }}
    >
        <Text style={{ fontSize: 20 }}>
            Ci piacerebbe poterti far saltare anni di scuola,
            ma possiamo cambiare la tua classe solo all'interno dell'applicazione :(
        </Text>
        <Picker
            // TODO: fix the picker, uniformity between ios and android
            mode={'dialog'}
            selectedValue={this.state.classname}
            onValueChange={classname => {
                this.setState({ classname })
            }}
        >
            {classes.map(c => <Picker.Item key={c} label={c} value={c} />)}
        </Picker>
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
                let res = await api.post('/api/user/changeClass', { classname: this.state.classname })
                if (res.success) {
                    this.props.login(this.props.state.login.username, this.props.state.login.password, this.state.classname, this.props.state.login.firstName, this.props.state.login.lastName, this.props.state.login.profilepic)
                    this.props.navigation.navigate('SettingsPage')
                    Alert.alert('Yay', 'Classe modificata con successo')
                } else Alert.alert('Qualcosa è andato storto', res.error)
            }}>
            <Text style={{ color: '#fff', fontSize: 20 }}>Modifica Classe</Text>
        </TouchableOpacity>
    </Page>
}
export default connect(state => ({ state }), dispatch => ({ login: (...args: Parameters<typeof login>) => dispatch(login(...args)) }))(_ChangeName)