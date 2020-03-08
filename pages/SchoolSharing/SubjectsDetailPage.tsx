import React, { Component } from 'react'
import { NavigationProps, Page, commonStyles, api, formatDate, Class, ShadowCard, serverUrl, Note } from '../../util'
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler'
import { View, Text, Modal, RefreshControl, ImageBackground, ActivityIndicator, Dimensions, Platform } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { connect } from 'react-redux'
import { LoginState } from '../../redux/login'
import { createStackNavigator } from 'react-navigation-stack'
import SVG, { Path, Circle, Defs, LinearGradient as SVGLinearGradient, Stop } from 'react-native-svg'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
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

const coords = [.6, .3, .75, .25, .55]
const colors = Array(5).fill(1).map((c, i) => `hsl(34, 100%, ${60 - i * 5}%)`)
class ClassNumber extends Component<{ index: number, onPress?: () => void, text: string, usersClass?: boolean }> {
    render = () => {
        let offset = Dimensions.get("window").width / 6
        let heigth = (Dimensions.get("window").height - 200) / 5
        let radius = this.props.usersClass ? offset : offset - 10
        let x1 = Dimensions.get('window').width * (coords[this.props.index - 1] ?? .5)
        let x2 = Dimensions.get('window').width * coords[this.props.index]
        return <View style={{
            top: -offset * (this.props.index + 1),
            left: 0,
            right: 0,
            width: Dimensions.get('window').width,
            height: heigth + offset,
            zIndex: 5 - this.props.index,
        }}>
            <SVG
                height="100%"
                width="100%"
            >
                <Circle
                    cx={coords[this.props.index] * 100 + '%'}
                    cy={heigth}
                    r={radius}
                    fill={colors[this.props.index]}
                />
                <Path
                    d={`M${x1} 0 L${x2} ${heigth - 10} Z`}
                    strokeWidth={10}
                    stroke="url(#grad)"
                />
                <Defs>
                    <SVGLinearGradient id="grad" x1={x1 / Math.max(x1, x2) * 100 + '%'} y1={0} x2={x2 / Math.max(x1, x2) * 100 + '%'} y2="100%">
                        <Stop offset="0.2" stopColor={colors[this.props.index - 1] ?? 'hsl(34, 100%, 65%)'} />
                        <Stop offset="0.8" stopColor={colors[this.props.index]} />
                    </SVGLinearGradient>
                </Defs>
            </SVG>
            <View
                style={{
                    position: 'absolute',
                    borderRadius: radius,
                    overflow: 'hidden',
                    width: radius * 2,
                    height: radius * 2,
                    top: heigth - radius,
                    left: x2 - radius,
                }}
            >
                <TouchableOpacity style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }} onPress={this.props.onPress}>
                    <Text style={{ color: 'white', fontSize: 40, paddingLeft: 5 }}>{this.props.text}</Text>
                </TouchableOpacity>
            </View>
        </View >
    }
}

class ClassSelection extends Component<NavigationProps, { visibleSection: string, class: Class }> {
    state = {
        visibleSection: this.props.navigation.getParam('visibleSection'),
        class: this.props.navigation.getParam('userClass')
    }

    render() {
        return <Page
            scrollEnabled={false}
            title={this.state.visibleSection}
            backButton
            navigation={this.props.navigation}
            style={{
                backgroundColor: commonStyles.main.backgroundColor
            }}
            contentContainerStyle={{
                paddingTop: Platform.OS == "android" ? getStatusBarHeight() : 0,
            }}
        >
            {classStructure[this.state.visibleSection].map((item, index) => <ClassNumber
                key={item.year}
                index={index}
                text={item.year}
                usersClass={item == classStructure[this.state.visibleSection][this.state.class.yearIndex]}
                onPress={() => this.props.navigation.navigate('SubjectsDetailPage', {
                    classContext: { field: this.state.visibleSection, classIndex: index }
                })
                }
            />)}
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
        let response = await api.get('/api/schoolsharing/note/' + noteID)
        if (response.success) {
            let note: Note = response.data
            this.props.navigation.navigate('NoteDetailPage', { note })
        }
        this.setState({ loading: false })
    }

    fetchNotes = async (page: number = 0) => {
        let res: { success: boolean, data?: Note[] } = await api.get(`/api/schoolsharing/notes/${this.state.context.field}/${this.state.context.classIndex}/${this.state.context.subject}/${page}`)
        if (res.success === false) {
            this.setState({ error: true })
            return []
        } else return res.data
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