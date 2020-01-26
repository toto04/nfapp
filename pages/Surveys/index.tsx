import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'
import { NavigationProps, commonStyles, api, ScrollableMainPage, ShadowCard } from "../../util";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { LoginState } from '../../redux/login';

class Survey extends Component<NavigationProps & { name: string, expiry: string, fields: { [key: string]: { type: string, description: string, options?: string[] } }, refresh: () => void }> {
    render() {
        return (
            <ShadowCard borderRadius={15} style={{
                margin: 20,
                marginBottom: 0,

            }} onPress={() => {
                this.props.navigation.navigate('SurveyAnswerPage', {
                    surveyName: this.props.name,
                    surveyFields: this.props.fields,
                    refreshSurveys: this.props.refresh
                })
            }}>
                <View style={{
                    backgroundColor: commonStyles.main.backgroundColor,
                    padding: 20
                }}>
                    <Text style={{ color: 'white' }}>{this.props.expiry}</Text>
                    <Text style={{ color: 'white', fontSize: 30 }}>{this.props.name}</Text>
                </View>
            </ShadowCard>
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

    async componentDidMount() {
        let surveyElements = await this.fetchSurveys()
        this.setState({ surveyElements })
    }

    async fetchSurveys() {
        let surveys = await api.get('/api/surveys')
        let surveyElements: JSX.Element[] = []
        for (let survey of surveys) {
            let date = new Date(survey.expiry)
            surveyElements.push(<Survey key={surveys.indexOf(Survey)} name={survey.name} expiry={`Scadenza: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`} fields={survey.fields} refresh={() => this.refresh()} navigation={this.props.navigation} />)
        }
        if (surveyElements.length == 0) { surveyElements.push(<Text key={0} style={{ color: '#999', alignSelf: 'stretch', margin: 20, textAlign: 'center', fontSize: 18 }}>Non ci sono nuovi sondaggi</Text>) }
        return surveyElements
    }

    async refresh() {
        this.setState({ refreshing: true })
        let surveyElements = await this.fetchSurveys()
        this.setState({ surveyElements, refreshing: false })
    }

    render() {
        return (
            <ScrollableMainPage
                navigation={this.props.navigation}
                refreshOptions={{
                    refreshing: this.state.refreshing && this.props.login.loggedIn,
                    onRefresh: this.refresh.bind(this),
                    color: 'black'
                }}
                statusBarStyle='dark-content'
            >
                <Text style={{ fontWeight: 'bold', fontSize: 40 }}>Sondaggi</Text>
                {this.props.login.loggedIn ? this.state.surveyElements : <Button title='Login' onPress={() => {
                    this.props.navigation.navigate('Login')
                }} />}
            </ScrollableMainPage>
        )
    }
}

export default connect((state: { login: LoginState }) => { return { login: state.login } })(SurveysPage)