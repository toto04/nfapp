import React, { Component, } from 'react'
import { Button, StyleSheet, TouchableOpacity, Text, Picker } from 'react-native';
import { NavigationProps, Page, commonStyles, api } from '../util'
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import { createStackNavigator } from 'react-navigation-stack';
import { connect } from 'react-redux';
import { login, LoginState, logout } from '../redux/login';
import { NavigationActions } from 'react-navigation';

interface signupState {
    usr?: string,
    pwd?: string,
    email?: string,
    fstName?: string,
    lstName?: string,
    cls: string
}

let Classes = [
    '1AS', '2AS', '3AS', '4AS', '5AS', '5BS', '1ASA', '1BSA', '2ASA', '3ASA', '4ASA', '5ASA', '1AL', '1BL', '2AL', '2BL', '3AL', '3BL', '4AL', '4BL', '4CL', '5AL', '5BL', '1ASU', '2ASU', '1AA', '1BA', '2AA', '2BA', '2CA', '3AA', '3AF', '3AG', '4AA', '4AF', '4AG', '5AA', '5AF', '5AG'
]

class Signup extends Component<NavigationProps, signupState> {
    constructor(props) {
        super(props)
        this.state = {
            cls: Classes[0]
        }
    }

    render() {
        let classItems: JSX.Element[] = []
        for (let i = 0; i < Classes.length; i++) {
            classItems.push(<Picker.Item key={i} label={Classes[i]} value={Classes[i]} />)
        }

        return (
            <Page {...this.props} title='registrati' backButton>
                <TextInput
                    style={styles.input}
                    placeholder='user'
                    onChangeText={(usr) => { this.setState({ usr }) }}
                    autoCompleteType='username'
                    textContentType='username'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='password'
                    onChangeText={(pwd) => { this.setState({ pwd }) }}
                    autoCompleteType='password'
                    textContentType='newPassword'
                    autoCapitalize='none'
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder='conferma password'
                    onChangeText={(pwd) => { this.setState({ pwd }) }}
                    autoCompleteType='password'
                    textContentType='password'
                    autoCapitalize='none'
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder='email@example.com'
                    onChangeText={(email) => { this.setState({ email }) }}
                    autoCompleteType='email'
                    textContentType='emailAddress'
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Nome'
                    onChangeText={(fstName) => { this.setState({ fstName }) }}
                    autoCompleteType='name'
                    textContentType='name'
                    autoCapitalize='words'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Cognome'
                    onChangeText={(lstName) => { this.setState({ lstName }) }}
                    autoCompleteType='name'
                    textContentType='familyName'
                    autoCapitalize='words'
                />
                <Picker
                    mode={'dialog'}
                    selectedValue={this.state.cls}
                    onValueChange={(cls, idx) => {
                        this.setState({ cls })
                    }}
                >
                    {classItems}
                </Picker>
                <TouchableOpacity style={styles.button} onPress={() => {
                    api.post('/api/signup', {
                        usr: this.state.usr,
                        pwd: this.state.pwd,
                        email: this.state.email,
                        fstName: this.state.fstName,
                        lstName: this.state.lstName,
                        cls: this.state.cls
                    }).then(async res => {
                        let { success, error } = res
                        alert(success ? 'utente creato!' : error)
                    })
                }}>
                    <Text style={{ color: '#fff', fontSize: 20 }}>Registrati</Text>
                </TouchableOpacity>
            </Page>
        )
    }
}

class Login extends Component<NavigationProps & { login: typeof login }, { usr: string, pwd: string, editable: boolean }> {
    constructor(props) {
        super(props)
        this.state = { usr: '', pwd: '', editable: true }
        this.props.navigation.addListener('willFocus', () => {
            this.setState({ editable: true })
        })
    }

    render() {
        return (
            <Page {...this.props} title='log in' downButton>
                <TextInput
                    style={styles.input}
                    editable={this.state.editable}
                    placeholder='user'
                    onChangeText={(usr) => { this.setState({ usr }) }}
                    autoCompleteType='username'
                />
                <TextInput
                    style={styles.input}
                    editable={this.state.editable}
                    placeholder='password'
                    onChangeText={(pwd) => { this.setState({ pwd }) }} autoCompleteType='password'
                    secureTextEntry
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        let password = this.state.pwd
                        api.post('/api/login', { usr: this.state.usr, pwd: password }).then(async res => {
                            let { logged, username, firstName, lastName } = res
                            if (logged) {
                                this.props.login(username, password, firstName, lastName)
                                this.props.navigation.dispatch(NavigationActions.back())
                            }
                            alert(logged ? 'Login effettuato!' : 'Elia smettila')
                        })
                    }}>
                    <Text style={{ color: '#fff', fontSize: 20 }}>Log in</Text>
                </TouchableOpacity>
                <Button title='Non hai un account? Registrati' onPress={() => {
                    this.props.navigation.navigate('Signup')
                    this.setState({ editable: false })
                }} />
            </Page>
        )
    }
}

/** Login screen connected to store */
let connectedLogin = connect(null, (dispatch) => {
    return {
        login: (username: string, password: string, firstName: string, lastName: string) => dispatch(login(username, password, firstName, lastName))
    }
})(Login)

/** Stack navigator that allows to the sign up screen from the login screen */
let LoginStack = createStackNavigator({
    connectedLogin,
    Signup
}, {
    headerMode: 'none'
})

class LoggedInPage extends Component<NavigationProps & { logout: () => void }> {
    render() {
        return (
            <Page navigation={this.props.navigation} title='login' downButton contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
            }}>
                <Text style={{ textAlign: 'center', fontSize: 26 }}>Hai già effettuato il login!</Text>
                <Button title='logout' onPress={this.props.logout} />
            </Page>
        )
    }
}
let ConnectedLoggedInPage = connect(null, (dispatch) => ({ logout: () => dispatch(logout()) }))(LoggedInPage)

/** this component is used to switch between the Profile and the Login stack nav depending on the user's LoginState */
class LoginSessionHandler extends Component<NavigationProps & { loggedIn: boolean }> {
    static router = LoginStack.router // linea magica che risolve i problemi, non so cosa fa ma non toccare
    render() {
        return this.props.loggedIn ? <ConnectedLoggedInPage navigation={this.props.navigation} /> : <LoginStack navigation={this.props.navigation} />
    }
}
/** LoginSessionHandler connected to the store */
export default connect((state: { login: LoginState }) => { return { loggedIn: state.login.loggedIn } })(LoginSessionHandler)

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#ddd',
        marginHorizontal: 30,
        padding: 4,
        marginTop: 10,
        height: 35,
        fontSize: 15,
        borderRadius: 3
    },
    button: {
        backgroundColor: commonStyles.mainColor,
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