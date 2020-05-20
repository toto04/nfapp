import React, { Component, } from 'react'
import { Text, Image, Dimensions, View } from 'react-native'
import { NavigationProps, Page, getImageSize, Note, isSaved, saveNote, removeNote, api } from '../../util';
import ImageViewer from 'react-native-image-zoom-viewer';
import { NavigationActions } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-safe-area-view';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { createStackNavigator } from 'react-navigation-stack';
import { connectActionSheet, ActionSheetProps } from '@expo/react-native-action-sheet'
import { isIphoneX } from 'react-native-iphone-x-helper'
import Icon from 'react-native-vector-icons/Ionicons';

class NoteDetailPage extends Component<NavigationProps, { note: Note, images: JSX.Element[], saved?: boolean, vote?: boolean }> {
    constructor(props) {
        super(props)
        let note: Note = this.props.navigation.getParam('note')
        this.state = {
            note,
            images: [],
            vote: note.vote
        }
    }

    async componentDidMount() {
        this.setState({ saved: await isSaved(this.props.navigation.getParam('note')) })
        let sizePromises: Promise<{ width: number, height: number }>[] = []
        for (const image of this.state.note.images) sizePromises.push(getImageSize(image))
        let sizes = await Promise.all(sizePromises)
        let images: JSX.Element[] = []
        for (let i = 0; i < this.state.note.images.length; i++) {
            let width = Dimensions.get('window').width - 20
            images.push(<TouchableHighlight
                key={'image' + i}
                style={{ marginTop: 20 }}
                onPress={() => this.props.navigation.navigate('NoteImageModal', { note: this.state.note, imageIndex: i })}
            >
                <Image
                    style={{
                        width,
                        height: sizes[i].height * width / sizes[i].width
                    }}
                    source={{ uri: this.state.note.images[i] }}
                />
            </TouchableHighlight>)
        }
        this.setState({ images })
    }

    render() {
        return <Page
            navigation={this.props.navigation}
            title='appunti'
            backButton
            fixedChildren={<View style={{
                backgroundColor: 'white',
                position: 'absolute',
                bottom: 0,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                width: '100%',
                height: 50 + (isIphoneX() ? 34 : 0),
                paddingBottom: isIphoneX() ? 34 : 0,
                paddingHorizontal: 30,
            }}>
                <TouchableOpacity onPress={() => {
                    let newVote = this.state.vote ? undefined : true
                    api.post('/api/schoolsharing/vote/' + this.state.note.id, { vote: newVote })
                    this.setState({ vote: newVote })
                }}>
                    <Icon name="ios-arrow-up" size={30} color={this.state.vote ? 'red' : 'grey'} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, color: this.state.vote ? 'red' : this.state.vote === false ? 'blue' : 'grey' }}>{
                    this.state.note.points -
                    (this.state.note.vote ? 1 : this.state.note.vote === false ? -1 : 0) +
                    (this.state.vote ? 1 : this.state.vote === false ? -1 : 0)
                }</Text>
                <TouchableOpacity onPress={() => {
                    let newVote = this.state.vote === false ? undefined : false
                    api.post('/api/schoolsharing/vote/' + this.state.note.id, { vote: newVote })
                    this.setState({ vote: newVote })
                }}>
                    <Icon name="ios-arrow-down" size={30} color={this.state.vote === false ? 'blue' : 'grey'} />
                </TouchableOpacity>
            </View>}
            rightButton={{
                // TODO: change icons
                name: this.state.saved ? 'bookmark-alt' : 'bookmark',
                action: this.state.saved
                    ? () => removeNote(this.state.note).then(() => this.setState({ saved: false }))
                    : () => saveNote(this.state.note).then(() => this.setState({ saved: true }))
            }}
            contentContainerStyle={{
                padding: 10,
                paddingBottom: 60 + (isIphoneX() ? 34 : 0)
            }}
        >
            <Text style={{ fontSize: 35, fontWeight: 'bold' }}>{this.state.note.title}</Text>
            <Text style={{ fontSize: 18 }}>{this.state.note.description}</Text>
            {this.state.images}
        </Page>
    }
}

class _NoteImageModal extends Component<NavigationProps & ActionSheetProps, { header: boolean, saved?: boolean }> {
    constructor(props) {
        super(props)
        this.state = { header: false }
    }
    componentDidMount = async () => {
        this.setState({ saved: await isSaved(this.props.navigation.getParam('note')) })
    }

    render() {
        let note = this.props.navigation.getParam('note')
        return <View style={{
            flex: 1,
            position: 'relative'
        }}>
            <ImageViewer
                renderIndicator={() => null}
                onClick={() => this.setState({ header: !this.state.header })}
                enableSwipeDown
                saveToLocalByLongPress={false}
                onCancel={() => {
                    this.props.navigation.dispatch(NavigationActions.back())
                }}
                imageUrls={note.images.map(url => ({ url }))}
                index={this.props.navigation.getParam('imageIndex')}
                onLongPress={async () => {
                    this.props.showActionSheetWithOptions({
                        options: [this.state.saved ? 'Rimuovi dai salvati' : 'Salva appunto', 'Annulla'],
                        cancelButtonIndex: 1
                    }, async buttonIndex => {
                        if (buttonIndex == 0) {
                            await (this.state.saved ? removeNote(note) : saveNote(note))
                            console.log(await isSaved(note))
                        }
                    })
                }}
            />
            <Icon
                style={{
                    position: 'absolute',
                    top: 10 + getStatusBarHeight(),
                    left: 30
                }}
                size={55}
                name='ios-close'
                color='white'
                onPress={() => this.props.navigation.dispatch(NavigationActions.back())}
            />
        </View>
    }
}
const NoteImageModal = connectActionSheet(_NoteImageModal)

export default createStackNavigator({
    NoteDetailPage,
    NoteImageModal
}, {
    mode: 'modal',
    headerMode: 'none'
})