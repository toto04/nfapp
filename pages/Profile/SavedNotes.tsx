import React, { Component } from 'react'
import { NavigationProps, Note, ShadowCard, serverUrl, formatDate, Page } from '../../util'
import { FlatList, ImageBackground, Text, AsyncStorage } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

export default class SavedNotes extends Component<NavigationProps, { notes?: Note[], refreshing: boolean }> {
    constructor(props) {
        super(props)
        this.state = { refreshing: false }
    }

    componentDidMount = async () => {
        this.refresh()
    }

    refresh = async () => {
        this.setState({ refreshing: true })
        let keys = (await AsyncStorage.getAllKeys()).filter(k => k.match(/note\d+/))
        let notes: Note[] = (await AsyncStorage.multiGet(keys)).map(n => JSON.parse(n[1]))
        this.setState({ refreshing: false, notes })
    }

    render = () => <Page
        navigation={this.props.navigation}
        title="appunti salvati"
        backButton
    >
        <FlatList
            data={this.state.notes}
            contentContainerStyle={{
                padding: 20,
                alignContent: 'stretch'
            }}
            renderItem={({ item }) => <ShadowCard
                onPress={() => { this.props.navigation.navigate('NoteDetailPage', { note: item }) }}
                style={{
                    marginVertical: 10
                }}
            >
                <ImageBackground
                    source={{ uri: item.images[0] }}
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
            </ShadowCard>
            }
            ListEmptyComponent={<Text style={{ margin: 20, textAlign: 'center', fontSize: 20, color: '#777' }}>{this.state.refreshing ? 'caricamento...' : 'Non ci sono appunti salvati. Quando ne salverai uno, saranno disponibile qui, anche offline'}</Text>}
            keyExtractor={({ id }) => id + ''}
            refreshing={this.state.refreshing}
            onRefresh={this.refresh}
        />
    </Page>
}