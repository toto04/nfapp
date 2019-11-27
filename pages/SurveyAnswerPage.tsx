import React, { Component } from 'react';
import { NavigationProps, Page, commonStyles } from "../util";
import { Text, View, TextInput, StyleSheet } from 'react-native';
import RadioForm from 'react-native-simple-radio-button'
import CheckBox from 'react-native-check-box'

interface FieldProps { description: string }
interface OptionsProps extends FieldProps { options: string[] }

class TextInputField extends Component<FieldProps, { value: string }> {
    render() {
        return (
            <View style={styles.field}>
                <Text style={styles.description}>{this.props.description}</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={value => this.setState({ value })}
                />
            </View>
        )
    }
}

class TextAreaField extends Component<FieldProps, { value: string }> {
    render() {
        return (
            <View style={styles.field}>
                <Text style={styles.description}>{this.props.description}</Text>
                <TextInput
                    style={styles.input}
                    multiline
                    onChangeText={value => this.setState({ value })}
                    numberOfLines={4}
                />
            </View>
        )
    }
}

class RadioInputField extends Component<OptionsProps, { value: string }> {
    render() {
        return (
            <View style={styles.field}>
                <Text style={styles.description}>{this.props.description}</Text>
                <RadioForm
                    style={{ marginTop: 10 }}
                    labelStyle={{ fontSize: 16 }}
                    radio_props={this.props.options.map((label, value) => ({ label, value }))}
                    buttonColor={commonStyles.mainColor}
                    selectedButtonColor={commonStyles.mainColor}
                    buttonSize={15}
                    onPress={value => this.setState({ value })}
                />
            </View>
        )
    }
}

class CheckboxField extends Component<OptionsProps, { value: string, checks: boolean[] }> {
    render() {
        let optionElements: JSX.Element[] = []
        let i = 0
        for (let option of this.props.options) {
            optionElements.push(
                <CheckBox
                // asdijghalskhjdgakljshdgkajhg FIX!!!!
                    onClick={() => this.setState({checks: this.state.checks})}
                    isChecked={true}
                    rightText={option}
                />
            )
            i++
        }
        return (
            <View style={styles.field}>
                <Text style={styles.description}>{this.props.description}</Text>
                {optionElements}
            </View>
        )
    }
}

export default class SurveyAnswerPage extends Component<NavigationProps, { fieldElements: JSX.Element[] }> {
    render() {
        let fields: { [key: string]: { type: string, description: string, options?: string[] } } = this.props.navigation.getParam('surveyFields')
        let fieldElements: JSX.Element[] = []
        let i = 0
        for (let fieldName in fields) {
            switch (fields[fieldName].type) {
                case 'textinput':
                    fieldElements.push(<TextInputField key={i} description={fields[fieldName].description} />)
                    break
                case 'textarea':
                    fieldElements.push(<TextAreaField key={i} description={fields[fieldName].description} />)
                    break
                case 'radioinput':
                    fieldElements.push(<RadioInputField key={i} description={fields[fieldName].description} options={fields[fieldName].options} />)
                    break
                case 'checkbox':
                    fieldElements.push(<CheckboxField key={i} description={fields[fieldName].description} options={fields[fieldName].options} />)
                    break

                default:
            }
            i++
        }
        return (
            <Page title={this.props.navigation.getParam('surveyName')} navigation={this.props.navigation} backButton>
                {fieldElements}
            </Page >
        )
    }
}

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