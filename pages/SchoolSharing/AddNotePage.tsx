import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, Alert, ImageBackground } from 'react-native'
import { NavigationProps, Page, api, commonStyles, Class, ShadowCard } from '../../util'
import { TextInput, TouchableOpacity, FlatList, TouchableHighlight } from 'react-native-gesture-handler'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types'
import IconComponent from 'react-native-vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
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
    sending: boolean
}

export default class AddNotePage extends Component<NavigationProps, AddNoteState> {
    placeholder = placeholderTitles[Math.floor(Math.random() * placeholderTitles.length)]
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            description: '',
            images: [],
            sending: false
        }
    }

    pickImage = async () => {
        let permission = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if (permission.status != 'granted') {
            Alert.alert('C\'è stato un errore', 'Devi dare il permesso per accedere al tuo rullino foto')
            return
        }
        let image: any = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            quality: 0.7
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
                placeholder={this.placeholder}
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
            <FlatList
                data={this.state.images}
                renderItem={({ index, item }) => <ShadowCard>
                    <ImageBackground source={{ uri: item }} style={{
                        alignSelf: 'stretch',
                        margin: 10,
                        height: 70,
                        borderRadius: 10,   // idk why i have to put the radius here too
                        overflow: 'hidden'
                    }}>
                        <LinearGradient
                            colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.6)']}
                            style={{
                                flexDirection: 'row-reverse',
                                alignContent: 'center'
                            }}
                        >
                            <TouchableHighlight onPress={() => {
                                let { images } = this.state
                                images.splice(index, 1)
                                this.setState({ images })
                            }} >
                                <IconComponent size={40} style={{ margin: 15 }} name='ios-remove-circle-outline' color='red' />
                            </TouchableHighlight>
                        </LinearGradient>
                    </ImageBackground>
                </ShadowCard>}
                keyExtractor={(item, index) => index + ''}
            />
            <TouchableOpacity
                style={{
                    backgroundColor: commonStyles.main.color,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 30,
                    padding: 4,
                    marginTop: 10,
                    height: 40,
                    borderRadius: 3
                }}
                disabled={this.state.sending}
                onPress={async () => {
                    let { title, description, images } = this.state
                    if (title.length < 1) {
                        Alert.alert('Devi inserire un titolo!', 'Inserisci qualcosa di bello così che gli altri possano sapere subito di cosa si tratta')
                        return
                    }

                    this.setState({ sending: true })
                    let context: Context = this.props.navigation.getParam('classContext')
                    let res = await api.post(`/api/schoolsharing/notes/${context.field}/${context.classIndex}/${context.subject}`, { title, description, images })
                    if (res.success) {
                        Alert.alert('Grazie', `I tuoi appunti sono stati pubblicati nella classe ${Class.classStructure[context.field][context.classIndex].year} ${context.field} per la materia ${context.subject}`)
                        this.props.navigation.goBack()
                    } else {
                        Alert.alert('Errore', 'C\'è stato un errore sconosciuto, riprova più tardi\n' + (res.error ?? ''))
                    }
                }}
            >
                <Text style={{ color: '#fff', fontSize: 20 }}>{this.state.sending ? 'Sto caricando...' : 'Pubblica'}</Text>
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