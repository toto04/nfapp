import React, { Component } from 'react'
import { NavigationProps, Page, commonStyles, api, formatDate, Class, ShadowCard, serverUrl } from '../../util'
import { ScrollView, TouchableHighlight, TouchableOpacity, FlatList } from 'react-native-gesture-handler'
import { View, Text, Modal, RefreshControl, ImageBackground } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { connect } from 'react-redux'
import { LoginState } from '../../redux/login'
import { createStackNavigator } from 'react-navigation-stack'
const { classStructure } = Class

export interface Context {
    field: string,
    classIndex: number
}

interface Note {
    id: number,
    images: string[],
    author: string,
    title: string,
    description: string,
    postingdate: string
}

interface SubjectState {
    refreshing: boolean,
    context: Context & { subject: string }
    error?: boolean,
    notes: Note[]
}

class Subject extends Component<NavigationProps & { context: Context, subject: string }> {
    render() {
        return <View>
            <TouchableOpacity onPress={async () => {
                this.props.navigation.navigate('ConnectedNotesPage', { classContext: { ...this.props.context, subject: this.props.subject } })
            }}>
                <View style={{
                    width: 100,
                    height: 130,
                    marginTop: 20
                }}>
                    <Text style={{ height: 30, textAlignVertical: 'center', textAlign: 'center', fontSize: 15 }}>{this.props.subject}</Text>
                    <View style={{ width: 100, height: 100, backgroundColor: commonStyles.main.backgroundColor }} />
                </View>
            </TouchableOpacity>
        </View>
    }
}

class SubjectsDetailPage extends Component<NavigationProps> {
    render() {
        let context: Context = this.props.navigation.getParam('classContext')
        let subs = []
        for (let subject of classStructure[context.field][context.classIndex].subjects) subs.push(<Subject
            key={subject}
            navigation={this.props.navigation}
            subject={subject}
            context={context}
        />)
        return <Page
            navigation={this.props.navigation}
            backButton
            title='materie'
            contentContainerStyle={{
                justifyContent: 'space-evenly',
                flexDirection: 'row',
                flexWrap: 'wrap'
            }}
        >
            {subs}
        </Page>
    }
}

class NotePage extends Component<NavigationProps & { login: LoginState }, SubjectState> {
    state: SubjectState = {
        context: this.props.navigation.getParam('classContext'),
        refreshing: false,
        notes: []
    }

    refresh = async () => {
        this.setState({ refreshing: true })
        let res = await api.get(`/api/schoolsharing/notes/${this.state.context.field}/${this.state.context.classIndex}/${this.state.context.subject}`)
        if (res.success === false) this.setState({ error: true })
        this.setState({ refreshing: false, notes: res })
    }

    componentDidMount = () => {
        this.refresh()
        this.props.navigation.addListener('willFocus', this.refresh)
    }

    render() {
        return <Page
            downButton
            title={this.state.context.subject}
            navigation={this.props.navigation}
            rightButton={(this.props.login._class.field == this.state.context.field && this.props.login._class.yearIndex == this.state.context.classIndex) ? {
                name: 'add',
                action: () => {
                    this.props.navigation.navigate('AddNotePage', { classContext: this.state.context })
                }
            } : undefined}
            refreshControl={<RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.refresh()}
                tintColor='black'
                colors={['black']}
            />}
        >
            {this.state.error ? <Text>C'è stato un errore, riprova più tardi</Text>
                : <FlatList
                    data={this.state.notes}
                    contentContainerStyle={{
                        padding: 20,
                        alignContent: 'stretch'
                    }}
                    renderItem={({ item }) =>
                        <ShadowCard style={{
                            margin: 10
                        }}>
                            <ImageBackground
                                source={{ uri: serverUrl + item.images[0] }}
                                style={{ height: 200 }}
                            >
                                <LinearGradient
                                    colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.8)']}
                                    style={{
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                        padding: 10
                                    }}
                                >
                                    <Text style={{ color: 'white' }}>{item.author + ' - ' + formatDate(item.postingdate)}</Text>
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{item.title}</Text>
                                    <Text style={{ color: 'white' }} numberOfLines={1}>{item.description}</Text>
                                </LinearGradient>
                            </ImageBackground>
                        </ShadowCard>}
                    ListEmptyComponent={<Text style={{ margin: 20, textAlign: 'center', fontSize: 20, color: '#777' }}>{this.state.refreshing ? 'caricamento...' : 'Nessuno ha ancora pubblicato appunti per questa materia, sii il primo!'}</Text>}
                    keyExtractor={({ id }) => id + ''}
                    refreshing={this.state.refreshing}
                    onRefresh={this.refresh}
                />
            }
        </Page>
    }
}

let ConnectedNotesPage = connect((state: { login: LoginState }) => ({ login: state.login }))(NotePage)

export default createStackNavigator({
    SubjectsDetailPage,
    ConnectedNotesPage
}, {
    headerMode: 'none',
    mode: 'modal'
})