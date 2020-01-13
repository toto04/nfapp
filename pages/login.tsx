import React, { Component, } from 'react'
import { Button, StyleSheet, TouchableOpacity, Text, Picker, Alert, TextComponent } from 'react-native';
import { NavigationProps, Page, commonStyles, api, Class } from '../util'
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import { createStackNavigator } from 'react-navigation-stack';
import { connect } from 'react-redux';
import { login, LoginState, logout } from '../redux/login';
import { NavigationActions } from 'react-navigation';

interface signupState {
    usr?: string,
    pwd?: string,
    confirmPwd?: string,
    email?: string,
    fstName?: string,
    lstName?: string,
    phone?: string,
    cls: string
}

let classes = []

for (let field in Class.classStructure) {
    for (let year of Class.classStructure[field]) {
        classes.push(...year.sections)
    }
}

class Signup extends Component<NavigationProps, signupState> {
    constructor(props) {
        super(props)
        this.state = {
            cls: classes[0],
            usr: '',
            pwd: '',
            confirmPwd: '',
            email: '',
            fstName: '',
            lstName: '',
            phone: ''
        }
    }

    render() {
        let classItems: JSX.Element[] = []
        for (let i = 0; i < classes.length; i++) {
            classItems.push(<Picker.Item key={i} label={classes[i]} value={classes[i]} />)
        }

        let textReference: any = {}

        return (
            <Page {...this.props} title='registrati' backButton>
                <TextInput
                    style={styles.input}
                    placeholder='Nome'
                    onChangeText={(fstName) => { this.setState({ fstName }) }}
                    autoCompleteType='name'
                    textContentType='name'
                    autoCapitalize='words'
                    ref={r => textReference['fstName'] = r}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Cognome'
                    onChangeText={(lstName) => { this.setState({ lstName }) }}
                    autoCompleteType='name'
                    textContentType='familyName'
                    autoCapitalize='words'
                    ref={r => textReference['lstName'] = r}
                />
                <TextInput
                    style={styles.input}
                    placeholder='email@example.com'
                    onChangeText={(email) => { this.setState({ email }) }}
                    autoCompleteType='email'
                    textContentType='emailAddress'
                    autoCapitalize='none'
                    ref={r => textReference['email'] = r}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Numero di telefono'
                    onChangeText={(phone) => { this.setState({ phone }) }}
                    autoCompleteType='tel'
                    textContentType='telephoneNumber'
                    autoCapitalize='none'
                    ref={r => textReference['phone'] = r}
                    keyboardType='numeric'
                />
                <TextInput
                    style={styles.input}
                    placeholder='user'
                    onChangeText={(usr) => { this.setState({ usr }) }}
                    autoCompleteType='username'
                    textContentType='username'
                    autoCapitalize='none'
                    ref={r => textReference['usr'] = r}
                />
                <TextInput
                    style={styles.input}
                    placeholder='password'
                    onChangeText={(confirmPwd) => { this.setState({ confirmPwd }) }}
                    autoCompleteType='password'
                    textContentType='newPassword'
                    autoCapitalize='none'
                    secureTextEntry
                    ref={r => textReference['confirmPwd'] = r}
                />
                <TextInput
                    style={styles.input}
                    placeholder='conferma password'
                    onChangeText={(pwd) => { this.setState({ pwd }) }}
                    autoCompleteType='password'
                    textContentType='password'
                    autoCapitalize='none'
                    secureTextEntry
                    ref={r => textReference['pwd'] = r}
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
                <TouchableOpacity style={styles.button} onPress={async () => {

                    let completed = true
                    for (let k in this.state) {
                        if (!this.state[k]) completed = false
                    }
                    if (!completed) {
                        Alert.alert('Form incompleto', 'Compila tutti i campi di questo form per continuare')
                        return
                    } else {
                        if (this.state.pwd !== this.state.confirmPwd) {
                            Alert.alert('Attenzione', 'Le due password devono conincidere')
                            textReference['pwd'].clear()
                            textReference['confirmPwd'].clear()
                            return
                        }
                        if (this.state.pwd.length < 8) {
                            Alert.alert('Attenzione', 'La password deve avere almeno 8 caratteri')
                            return
                        }
                        let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                        if (!this.state.email.match(mailformat)) {
                            Alert.alert('Attenzione', 'La mail inserita non è una mail')
                            textReference['email'].clear()
                            return
                        }
                        let phoneformat = /^\d{10}$/
                        if (!this.state.phone.match(phoneformat)) {
                            Alert.alert('Attenzione', 'Insersci il numero senza prefisso o spazi: 3123456789')
                            textReference['phone'].clear()
                            return
                        }
                    }

                    let res = await api.post('/api/signup', {
                        usr: this.state.usr,
                        pwd: this.state.pwd,
                        email: this.state.email,
                        fstName: this.state.fstName,
                        lstName: this.state.lstName,
                        phone: this.state.phone,
                        cls: this.state.cls
                    })

                    let { success, error } = res
                    alert(success ? 'utente creato!' : error)
                }}>
                    <Text style={{ color: '#fff', fontSize: 20 }}>Registrati</Text>
                </TouchableOpacity>
            </Page>
        )
    }

    private newMethod() {
        console.log('mail');
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
                            let { logged, username, classname, firstName, lastName } = res
                            if (logged) {
                                this.props.login(username, password, classname, firstName, lastName)
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
        login: (username: string, password: string, classname: string, firstName: string, lastName: string) => dispatch(login(username, password, classname, firstName, lastName))
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