import React, { Component } from 'react'
import { Text, View, Button, StyleSheet, Modal, Vibration, RefreshControl } from 'react-native'
import { NavigationProps, commonStyles, api } from "../util";
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { LoginState } from '../redux/login';

class Survey extends Component<NavigationProps & { name: string, expiry: string, fields: { [key: string]: { type: string, description: string, options?: string[] } } }> {
    render() {
        return (
            <View style={{
                margin: 20,
                marginBottom: 0,
                backgroundColor: commonStyles.backgroundColor,
                borderRadius: 10, padding: 20,
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 5 },
                shadowRadius: 5,
                elevation: 5
            }}>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate('SurveyAnswerPage', {
                        surveyName: this.props.name,
                        surveyFields: this.props.fields
                    })
                }}>
                    <Text style={{ color: 'white' }}>{this.props.expiry}</Text>
                    <Text style={{ color: 'white', fontSize: 30 }}>{this.props.name}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class SurveysPage extends Component<NavigationProps & { login: LoginState }, { surveyElements: JSX.Element[], refreshing: boolean }> {
    constructor(props) {
        super(props)
        this.state = {
            surveyElements: [],
            refreshing: false
        }
    }
    componentDidMount() { if (this.props.login.loggedIn) this.refresh() }

    refresh() {
        this.setState({ refreshing: true })
        api.get('/api/surveys/' /*+ this.props.login.username*/).then(async res => {
            let surveys = await res.json()
            let surveyElements: JSX.Element[] = []
            for (let survey of surveys) {
                let date = new Date(survey.expiry)
                surveyElements.push(<Survey key={surveys.indexOf(Survey)} name={survey.name} expiry={`Scadenza: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`} fields={survey.fields} navigation={this.props.navigation} />)
            }
            if (surveyElements.length == 0) { surveyElements.push(<Text key={0} style={{ color: '#999', alignSelf: 'stretch', margin: 20, textAlign: 'center', fontSize: 18 }}>Non ci sono nuovi sondaggi</Text>) }
            this.setState({ surveyElements, refreshing: false })
        })
    }

    render() {
        return (
            <ScrollView
                contentContainerStyle={{ margin: 20 }}
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()} tintColor={'black'} />
                }
            >
                <Text style={{ fontWeight: 'bold', fontSize: 40 }}>Sondaggi</Text>
                {this.props.login.loggedIn ? this.state.surveyElements : <Button title='Login' onPress={() => {
                    this.props.navigation.navigate('Login')
                }} />}
            </ScrollView>
        )
    }
}

export default connect((state: { login: LoginState }) => { return { login: state.login } })(SurveysPage)