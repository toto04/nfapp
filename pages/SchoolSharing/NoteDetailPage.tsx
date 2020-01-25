import React, { Component, } from 'react'
import { Text, Image, Dimensions } from 'react-native'
import { NavigationProps, Page, getImageSize } from '../../util';
import { Note } from './SubjectsDetailPage';

export default class NoteDetailPage extends Component<NavigationProps, { note: Note, images: JSX.Element[] }> {
    constructor(props) {
        super(props)
        this.state = {
            note: this.props.navigation.getParam('note'),
            images: []
        }
    }

    async componentDidMount() {
        let sizePromises: Promise<{ width: number, height: number }>[] = []
        for (const image of this.state.note.images) sizePromises.push(getImageSize(image))
        let sizes = await Promise.all(sizePromises)
        let images: JSX.Element[] = []
        for (let i = 0; i < this.state.note.images.length; i++) {
            let width = Dimensions.get('window').width - 20
            images.push(<Image
                key={'image' + i}
                style={{
                    marginTop: 20,
                    width,
                    height: sizes[i].height * width / sizes[i].width
                }}
                source={{ uri: this.state.note.images[i] }}
            />)
        }
        this.setState({ images })
    }

    render() {
        return <Page
            navigation={this.props.navigation}
            title='appunti'
            backButton
            contentContainerStyle={{
                padding: 10,
                paddingBottom: 50
            }}
        >
            <Text style={{ fontSize: 35, fontWeight: 'bold' }}>{this.state.note.title}</Text>
            <Text style={{ fontSize: 18 }}>{this.state.note.description}</Text>
            {this.state.images}
        </Page>
    }
}