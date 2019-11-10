import React, { Component } from 'react'
import { Image, Text, View, Button } from 'react-native'
import { NavigationProps, Page, commonStyles } from '../util';
import { TouchableHighlight } from 'react-native-gesture-handler';

export default class Profile extends Component<NavigationProps> {
    render() {
        return (
            <Page {...this.props} title='profilo'>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    backgroundColor: commonStyles.backgroundColor,
                }}>
                    <TouchableHighlight onPress={() => {
                        alert('ora qua dovresti poter modificare l\'immagine di porfilo, lo implementerò poi')
                    }}>
                        <Image
                            source={require('../assets/default-avatar.png')}
                            style={{
                                width: 120,
                                height: 120,
                                borderRadius: 60,
                                overflow: 'hidden'
                            }}
                        />
                    </TouchableHighlight>
                    <TouchableHighlight>
                        <Text style={{ marginTop: 5, color: '#fff', fontSize: 20 }}>Tommaso Morganti</Text>
                    </TouchableHighlight>
                    <Text style={{ marginTop: 5, color: '#ccc' }}>@toto04</Text>
                    <Button title='cambia password' onPress={() => {
                        alert('qua dovresti invece cambiare la password')
                    }}></Button>
                </View>
            </Page>
        )
    }
}