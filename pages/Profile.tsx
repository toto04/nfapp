import React, { Component } from 'react'
import { Image, Text, View, Button, StyleSheet } from 'react-native'
import { NavigationProps, Page, commonStyles } from '../util';
import { TouchableHighlight, ScrollView } from 'react-native-gesture-handler';

class Preview extends Component<{ title: string }> {
    render() {
        return (
            <View style={{ alignSelf: 'stretch', padding: 10 }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', marginLeft: 21 }}>{this.props.title}</Text>
                <View style={{
                    margin: 20,
                    marginBottom: 0,
                    backgroundColor: commonStyles.backgroundColor,
                    borderRadius: 10, padding: 20,
                    shadowOpacity: 0.2,
                    shadowOffset: { width: 0, height: 5 },
                    shadowRadius: 5,
                    elevation: 5
                }}>
                    <Text style={{ color: 'white', fontSize: 40 }}>{'  '}</Text>
                </View>
            </View>
        )
    }
}

export default class Profile extends Component<NavigationProps> {
    render() {
        return (
            <ScrollView>
                <View style={{
                    alignSelf: 'stretch',
                    flexDirection: 'row',
                    padding: 20
                }}>
                    <View style={{ flex: 2 }}>
                        <Text style={[styles.profileText, {fontWeight: 'bold'}]}>Tommaso Morganti</Text>
                        <Text style={styles.profileText}>Scienze applicate</Text>
                        <Text style={styles.profileText}>5ASA</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Image
                            source={require('../assets/default-avatar.png')}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50,
                                overflow: 'hidden'
                            }}
                        />
                    </View>
                </View>
                <Preview title='Appunti salvati' />
                <Preview title='Eventi attenduti' />
                <Preview title='Peer education' />
            </ScrollView>
        )
    }
}

let styles = StyleSheet.create({
    profileText: {
        fontSize: 20
    }
})