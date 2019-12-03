import React, { Component } from 'react';
import { NavigationProps, Page, commonStyles, api } from "../util";
import { Text, View, TextInput, StyleSheet, Image } from 'react-native';
import RadioForm from 'react-native-simple-radio-button'
import CheckBox from 'react-native-check-box'
import IconComponent from 'react-native-vector-icons/Ionicons'
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { LoginState } from '../redux/login';

interface FieldProps { description: string, onValueChange: (v: string) => void }
interface OptionsProps extends FieldProps { options: string[] }

class DescriptionField extends Component<FieldProps> {
    render() {
        return (
            <View style={styles.field}>
                <Text style={styles.description}>{this.props.description}</Text>
            </View>
        )
    }
}

class TextInputField extends Component<FieldProps> {
    render() {
        return (
            <View style={styles.field}>
                <Text style={styles.description}>{this.props.description}</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={value => this.props.onValueChange(value)}
                />
            </View>
        )
    }
}

class TextAreaField extends Component<FieldProps> {
    render() {
        return (
            <View style={styles.field}>
                <Text style={styles.description}>{this.props.description}</Text>
                <TextInput
                    style={[styles.input, { minHeight: 60 }]}
                    multiline
                    onChangeText={value => this.props.onValueChange(value)}
                    numberOfLines={4}
                />
            </View>
        )
    }
}

class RadioInputField extends Component<OptionsProps> {
    render() {
        return (
            <View style={styles.field}>
                <Text style={styles.description}>{this.props.description}</Text>
                <RadioForm
                    style={{ marginTop: 10 }}
                    labelStyle={{ fontSize: 16, textAlignVertical: 'center' }}
                    radio_props={this.props.options.map((label, value) => ({ label, value }))}
                    buttonColor={commonStyles.mainColor}
                    selectedButtonColor={commonStyles.mainColor}
                    buttonSize={15}
                    onPress={value => this.props.onValueChange(this.props.options[value])}
                />
            </View>
        )
    }
}

class CheckboxField extends Component<OptionsProps, { checks: boolean[] }> {
    constructor(props) {
        super(props)
        this.state = {
            checks: Array(this.props.options.length).fill(false)
        }
    }

    async updateValue() {
        let value: string = this.props.options.filter((v, i) => this.state.checks[i]).join(', ')
        this.props.onValueChange(value)
    }

    render() {
        let optionElements: JSX.Element[] = []
        for (let option of this.props.options) {
            let i = this.props.options.indexOf(option)
            optionElements.push(
                <CheckBox
                    key={i}
                    onClick={() => {
                        this.setState({
                            checks: this.state.checks.map((v, j) => { return (j == i) ? !v : v })
                        }, () => this.updateValue())
                    }}
                    isChecked={this.state.checks[i]}
                    rightTextView={<Text style={{ paddingLeft: 8, fontSize: 16, textAlignVertical: 'center' }}>{option}</Text>}
                    checkedImage={<IconComponent size={32} name={'ios-checkbox'} color={commonStyles.mainColor} />}
                    unCheckedImage={<IconComponent size={32} name={'md-square-outline'} color={commonStyles.mainColor} />}
                />
            )
        }
        return (
            <View style={styles.field}>
                <Text style={styles.description}>{this.props.description}</Text>
                {optionElements}
            </View>
        )
    }
}

class SurveyAnswerPage extends Component<NavigationProps & { login: LoginState }, { values: { [key: string]: string } }> {
    constructor(props) {
        super(props)
        let values = {}
        for (const field in this.props.navigation.getParam('surveyFields')) values[field] = ''
        this.state = { values }
    }

    updateValue(value: string, fieldName: string) {
        let values = Object.assign({}, this.state.values)
        values[fieldName] = value
        this.setState({ values })
    }

    render() {
        let fields: { [key: string]: { type: string, description: string, options?: string[] } } = this.props.navigation.getParam('surveyFields')
        let fieldElements: React.ReactElement[] = []
        let i = 0
        for (let fieldName in fields) {
            switch (fields[fieldName].type) {
                case 'textinput':
                    fieldElements.push(<TextInputField onValueChange={v => this.updateValue(v, fieldName)} key={i} description={fields[fieldName].description} />)
                    break
                case 'textarea':
                    fieldElements.push(<TextAreaField onValueChange={v => this.updateValue(v, fieldName)} key={i} description={fields[fieldName].description} />)
                    break
                case 'radioinput':
                    fieldElements.push(<RadioInputField onValueChange={v => this.updateValue(v, fieldName)} key={i} description={fields[fieldName].description} options={fields[fieldName].options} />)
                    break
                case 'checkbox':
                    fieldElements.push(<CheckboxField onValueChange={v => this.updateValue(v, fieldName)} key={i} description={fields[fieldName].description} options={fields[fieldName].options} />)
                    break
                default:
                    fieldElements.push(<DescriptionField onValueChange={v => this.updateValue(v, fieldName)} key={i} description={fields[fieldName].description} />)
            }
            i++
        }
        let surveyName = this.props.navigation.state.params.surveyName

        return (
            <Page title={surveyName} navigation={this.props.navigation} backButton>
                {fieldElements}
                <TouchableOpacity
                    style={{
                        backgroundColor: commonStyles.mainColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: 20,
                        padding: 4,
                        marginTop: 10,
                        height: 40,
                        borderRadius: 3
                    }}
                    onPress={() => api.post(`/api/surveys/${surveyName}`, {
                        username: this.props.login.username,
                        password: this.props.login.password,
                        answers: this.state.values
                    }).then(async res => {
                        let o = await res.json()
                        this.props.navigation.state.params.refreshSurveys()
                        this.props.navigation.goBack()
                        alert(o.success ? 'Grazie per aver risposto!' : ('C\'è stato un errore:' + o.error))
                    })}
                >
                    <Text style={{ color: '#fff', fontSize: 20 }}>Send</Text>
                </TouchableOpacity>
            </Page >
        )
    }
}
export default connect((state: { login: LoginState }) => ({ login: state.login }))(SurveyAnswerPage)

let styles = StyleSheet.create({
    field: {
        borderRadius: 5,
        backgroundColor: '#ddd',
        margin: 20,
        padding: 10,
        marginBottom: 0
    },
    description: {
        fontSize: 20
    },
    input: {
        padding: 5,
        borderRadius: 2,
        marginTop: 5,
        minHeight: 25,
        fontSize: 18,
        backgroundColor: '#ccc'
    }
})