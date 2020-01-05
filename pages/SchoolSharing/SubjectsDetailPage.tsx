import React, { Component } from 'react'
import { NavigationProps, Page, commonStyles, api, formatDate, Class } from '../../util'
import { ScrollView, TouchableHighlight, TouchableOpacity, FlatList } from 'react-native-gesture-handler'
import { View, Text, Modal, RefreshControl, ImageBackground } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { connect } from 'react-redux'
import { LoginState } from '../../redux/login'
const { classStructure } = Class

interface Context {
    field: string,
    classIndex: number
}

interface Note {
    id: number,
    data: string,
    author: string,
    title: string,
    description: string,
    postingdate: string
}

interface SubjectState {
    modalVisible: boolean,
    refreshing: boolean,
    error?: boolean,
    notes: Note[]
}

class Subject extends Component<NavigationProps & { context: Context, subject: string, login: LoginState }, SubjectState> {
    state: SubjectState = {
        modalVisible: false,
        refreshing: false,
        notes: []
    }
    refresh = async () => {
        this.setState({ refreshing: true })
        let res = await api.get(`/api/schoolsharing/notes/${this.props.context.field}/${this.props.context.classIndex}/${this.props.subject}`)
        if (res.success === false) this.setState({ error: true })
        this.setState({ refreshing: false, notes: res })
    }

    render() {
        return <View>
            <Modal
                visible={this.state.modalVisible}
                animationType='slide'
            >
                <Page
                    downButton
                    title={this.props.subject}
                    navigation={this.props.navigation}
                    customAction={() => this.setState({ modalVisible: false })}
                    rightButton={(this.props.login._class.field == this.props.context.field && this.props.login._class.yearIndex == this.props.context.classIndex) ? {
                        name: 'add',
                        action: () => { console.log('aggiungi un appunto') } // TODO: nuovi appunti
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
                                <TouchableHighlight
                                    style={commonStyles.shadowStyle}
                                >
                                    <ImageBackground
                                        source={{ uri: item.data }}
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
                                            <Text style={{ color: 'white' }
                                            } numberOfLines={1}>{item.description}</Text>
                                        </LinearGradient>
                                    </ImageBackground>
                                </TouchableHighlight>
                            }
                            ListEmptyComponent={<Text style={{ margin: 20, textAlign: 'center', fontSize: 20, color: '#777' }}>Nessuno ha ancora pubblicato appunti per questa materia, sii il primo!</Text>}
                            keyExtractor={({ id }) => id + ''}
                            refreshing={this.state.refreshing}
                            onRefresh={this.refresh}
                        />
                    }
                </Page>
            </Modal>
            <TouchableOpacity onPress={async () => {
                this.setState({ modalVisible: true })
                this.refresh()
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
let ConnectedSubject = connect((state: { login: LoginState }) => ({ login: state.login }))(Subject)

export default class SubjectsDetailPage extends Component<NavigationProps, {}> {
    render() {
        let context: Context = this.props.navigation.getParam('classContext')
        let subs = []
        for (let subject of classStructure[context.field][context.classIndex].subjects) subs.push(<ConnectedSubject
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