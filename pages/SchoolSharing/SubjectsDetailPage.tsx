import React, { Component } from 'react'
import { NavigationProps, Page, commonStyles, api, formatDate, Class, ShadowCard, serverUrl, Note } from '../../util'
import { ScrollView, TouchableHighlight, TouchableOpacity, FlatList } from 'react-native-gesture-handler'
import { View, Text, Modal, RefreshControl, ImageBackground, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { connect } from 'react-redux'
import { LoginState } from '../../redux/login'
import { createStackNavigator } from 'react-navigation-stack'
const { classStructure } = Class

export interface Context {
    field: string,
    classIndex: number
}

interface SubjectState {
    refreshing: boolean,
    loading: boolean,
    context: Context & { subject: string }
    error?: boolean,
    notes: Note[],
    page: number,
    rockbottom: boolean
}

class ClassSelection extends Component<NavigationProps, { visibleSection: string }> {
    state = {
        visibleSection: this.props.navigation.getParam('visibleSection')
    }

    render() {
        return <Page
            // TODO: questa va decisamente migliorata
            title={this.state.visibleSection}
            backButton
            navigation={this.props.navigation}
        >
            <FlatList
                data={classStructure[this.state.visibleSection]}
                renderItem={({ item, index }) => <TouchableOpacity
                    style={{
                        padding: 10,
                        paddingHorizontal: 30
                    }}
                    onPress={() => {
                        this.props.navigation.navigate('SubjectsDetailPage', {
                            classContext: { field: this.state.visibleSection, classIndex: index }
                        })
                    }}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{`Classe ${item.year}`}</Text>
                </TouchableOpacity>}
                keyExtractor={item => item.year}
            />
        </Page>
    }
}

class SubjectsDetailPage extends Component<NavigationProps> {
    render() {
        let context: Context = this.props.navigation.getParam('classContext')
        return <Page
            navigation={this.props.navigation}
            backButton
            title='materie'
        >
            <FlatList
                data={classStructure[context.field][context.classIndex].subjects}
                renderItem={
                    ({ item, index }) => {
                        return <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('ConnectedNotesPage', { classContext: { ...context, subject: item } })
                            }}
                            style={{
                                padding: 8,
                                margin: 8,
                                marginBottom: 0,
                                borderRadius: 5,
                                overflow: 'hidden',
                                backgroundColor: `hsla(${index * 36}, 70%, 20%, 1.0)`
                            }}
                        >
                            <Text style={{ fontSize: 20, color: 'white' }}>{item}</Text>
                        </TouchableOpacity>
                    }
                }
                keyExtractor={item => item}
            />
        </Page>
    }
}

class NotePage extends Component<NavigationProps & { login: LoginState }, SubjectState> {
    loadingMore = false
    state: SubjectState = {
        context: this.props.navigation.getParam('classContext'),
        refreshing: false,
        loading: false,
        notes: [],
        page: 0,
        rockbottom: false
    }

    loadNote = async (noteID: number) => {
        this.setState({ loading: true })
        let note: Note = await api.get('/api/schoolsharing/note/' + noteID)
        this.setState({ loading: false })
        this.props.navigation.navigate('NoteDetailPage', { note })
    }

    fetchNotes = async (page: number = 0) => {
        let res: any = await api.get(`/api/schoolsharing/notes/${this.state.context.field}/${this.state.context.classIndex}/${this.state.context.subject}/${page}`)
        if (res.success === false) {
            this.setState({ error: true })
            return []
        } else {
            let notes: Note[] = res
            return notes
        }
    }

    refresh = async () => {
        this.setState({ refreshing: true })
        let notes = await this.fetchNotes()
        this.setState({ refreshing: false, notes })
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
            scrollEventThrottle={400}
            onScroll={this.state.rockbottom ? undefined : async ({ nativeEvent }) => {
                const pixelsFromBottom = 200
                if (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - pixelsFromBottom) {
                    if (this.loadingMore) return
                    if (!nativeEvent.layoutMeasurement.height) return
                    if (this.state.rockbottom) return

                    this.loadingMore = true
                    let page = this.state.page + 1
                    let newNotes = await this.fetchNotes(page)
                    if (newNotes.length < 10) this.setState({ rockbottom: true })
                    this.setState({ notes: [...this.state.notes, ...newNotes], page }, () => { this.loadingMore = false })
                }
            }}
        >
            {this.state.error ? <Text>C'è stato un errore, riprova più tardi</Text>
                : <FlatList
                    data={this.state.notes}
                    contentContainerStyle={{
                        padding: 20,
                        alignContent: 'stretch'
                    }}
                    renderItem={({ item }) =>
                        <ShadowCard
                            onPress={() => {
                                this.loadNote(item.id)
                            }}
                            style={{
                                marginVertical: 10
                            }}
                        >
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
            <Modal
                visible={this.state.loading}
                animationType='fade'
                onRequestClose={() => {
                    // TODO: avoid stalling during loading
                }}
                transparent
            >
                <View style={{
                    flex: 1,
                    backgroundColor: '#000000aa',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View>
                        <ActivityIndicator color='white' size='large' />
                        <Text style={{ color: 'white', fontSize: 20 }}>caricamento...</Text>
                    </View>
                </View>
            </Modal>
        </Page>
    }
}

let ConnectedNotesPage = connect((state: { login: LoginState }) => ({ login: state.login }))(NotePage)

let nav = createStackNavigator({
    ClassSelection,
    SubjectsDetailPage
}, {
    headerMode: 'none',
})

export default createStackNavigator({
    nav,
    ConnectedNotesPage
}, {
    headerMode: 'none',
    mode: 'modal'
})