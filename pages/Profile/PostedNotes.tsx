import React, { Component } from 'react'
import { NavigationProps, Page, ShadowCard, formatDate, Note, api, serverUrl } from '../../util'
import { FlatList, ImageBackground, Text, Modal, View, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

export default class PostedNotes extends Component<NavigationProps, { user: string, notes?: Note[], refreshing: boolean, loading: boolean }> {
    constructor(props) {
        super(props)
        this.state = {
            user: this.props.navigation.getParam('user'),
            refreshing: false,
            loading: false
        }
    }

    componentDidMount = () => this.refresh()

    loadNote = async (noteID: number) => {
        this.setState({ loading: true })
        let response = await api.get('/api/schoolsharing/note/' + noteID)
        if (response.success) {
            let note: Note = response.data
            this.props.navigation.navigate('NoteDetailPage', { note })
        }
        this.setState({ loading: false })
    }

    refresh = async () => {
        this.setState({ refreshing: true })
        let res = await api.get('/api/schoolsharing/notes/' + this.state.user)
        if (res.success) this.setState({ notes: res.data })
        this.setState({ refreshing: false })
    }

    render = () => <Page
        navigation={this.props.navigation}
        title='appunti pubblicati'
        backButton
    >
        <FlatList
            data={this.state.notes}
            contentContainerStyle={{
                padding: 20,
                alignContent: 'stretch'
            }}
            renderItem={({ item }) => <ShadowCard
                onPress={() => this.loadNote(item.id)}
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
            ListEmptyComponent={<Text style={{ margin: 20, textAlign: 'center', fontSize: 20, color: '#777' }}>{this.state.refreshing ? 'caricamento...' : 'Non ci sono appunti salvati. Quando ne salverai uno, saranno disponibile qui, anche offline'}</Text>}
            keyExtractor={({ id }) => id + ''}
            refreshing={this.state.refreshing}
            onRefresh={this.refresh}
        />
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