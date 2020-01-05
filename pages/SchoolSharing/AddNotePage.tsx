import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, Alert } from 'react-native'
import { NavigationProps, Page, api, commonStyles, Class } from '../../util'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types'
let placeholderTitles = ['Ossidoriduzioni', 'Le Opere di Giacomino Leopardi', 'Promessi Sposi - Capitolo 1', 'Appunti sui Sassi', 'Manierismo', 'Prima Rivoluzione Industriale', 'Henry VIII Tudor']

interface Context {
    field: string
    classIndex: number
    subject: string
}

interface AddNoteState {
    title: string
    description: string
    images: string[]
}

export default class AddNotePage extends Component<NavigationProps, AddNoteState> {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            description: '',
            images: []
        }
    }

    pickImage = async () => {
        let permission = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if (permission.status != 'granted') return
        let image: any = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            quality: 0
        })
        if (!image.cancelled) {
            let data = 'data:image/jpeg;base64,' + image.base64
            let images = this.state.images
            images.push(data)
            this.setState({ images })
        }
    }

    render() {
        return <Page
            navigation={this.props.navigation}
            contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
            title='pubblica appunti'
            backButton
        >
            <Text style={styles.text}>Titolo</Text>
            <TextInput
                onChangeText={title => this.setState({ title })}
                placeholder={placeholderTitles[Math.floor(Math.random() * placeholderTitles.length)]}
                style={styles.input}
            />
            <Text style={styles.text}>Descrizione</Text>
            <TextInput
                onChangeText={description => this.setState({ description })}
                multiline
                numberOfLines={5}
                placeholder=''
                style={[styles.input, { minHeight: 100 }]}
            />
            <Button title='aggiungi immagine' onPress={this.pickImage}></Button>
            <TouchableOpacity style={{
                backgroundColor: commonStyles.main.color,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 30,
                padding: 4,
                marginTop: 10,
                height: 40,
                borderRadius: 3
            }} onPress={async () => {
                // TODO: check user input to match
                let context: Context = this.props.navigation.getParam('classContext')
                let res = await api.post(`/api/schoolsharing/notes/${context.field}/${context.classIndex}/${context.subject}`, this.state)
                if (res.success) {
                    Alert.alert('Grazie', `I tuoi appunti sono stati pubblicati nella classe ${Class.classStructure[context.field][context.classIndex].year} ${context.field} per la materia ${context.subject}`)
                }
            }}>
                <Text style={{ color: '#fff', fontSize: 20 }}>Pubblica</Text>
            </TouchableOpacity>
        </Page>
    }
}

let styles = StyleSheet.create({
    text: {
        fontSize: 36,
        fontWeight: 'bold',
        marginTop: 10
    },
    input: {
        alignSelf: 'stretch',
        backgroundColor: '#ddd',
        fontSize: 20,
        padding: 5,
        borderRadius: 3,
        marginVertical: 5
    }
})