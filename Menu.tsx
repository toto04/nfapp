import React, { Component } from "react";
import { View, Text, StyleSheet, Image, Linking, Platform } from "react-native";
import { DrawerContentComponentProps } from "react-navigation-drawer";
import { NavigationProps, commonStyles } from './util'
import { TouchableHighlight } from "react-native-gesture-handler";

export default class Menu extends Component<NavigationProps & DrawerContentComponentProps> {
    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: commonStyles.backgroundColor,
                alignItems: 'stretch',
                paddingTop: 20
            }}>
                <View>
                    {/* <View style={{
                        height: 3,
                        backgroundColor: commonStyles.mainColor,
                        margin: 15,
                        width: 200,
                        alignSelf: 'center'
                    }} /> */}
                    <Text style={styles.menuItem} onPress={() => {
                        if (this.props.navigation.navigate('Home')) this.props.navigation.closeDrawer()
                    }}>Home</Text>
                    <Text style={styles.menuItem} onPress={() => {
                        if (this.props.navigation.navigate('Social')) this.props.navigation.closeDrawer()
                    }}>Social</Text>
                    <Text style={styles.menuItem} onPress={() => {
                        if (this.props.navigation.navigate('Surveys')) this.props.navigation.closeDrawer()
                    }}>Sondaggi</Text>
                    <Text style={styles.menuItem} onPress={() => {
                        if (this.props.navigation.navigate('Calendar')) this.props.navigation.closeDrawer()
                    }}>Calendario</Text>
                    <Text style={styles.menuItem} onPress={() => {
                        if (this.props.navigation.navigate('Sharing')) this.props.navigation.closeDrawer()
                    }}>School Sharing</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableHighlight onPress={() => console.log('fb')}><Image source={require('./assets/facebook.png')} style={styles.icon} /></TouchableHighlight>
                        <TouchableHighlight onPress={async () => {
                            let inst = await Linking.canOpenURL('instagram://')
                            if (inst) Linking.openURL('instagram://user?username=peertopeer.nf')
                            else Linking.openURL('https://instagram.com/peertopeer.nf?igshid=1kbmcukf7ke3h')
                        }}><Image source={require('./assets/instagram.png')} style={styles.icon} /></TouchableHighlight>
                    </View>
                    <Text style={[styles.menuItem, { fontSize: 12, marginBottom: 0 }]}>© 2019 peer to peer</Text>
                    <Text style={[styles.menuItem, { fontSize: 12, marginTop: 0 }]}>by Tommaso Morganti</Text>
                </View>
            </View>
        )
    }
}

function test() {
    console.log('press')
}

let styles = StyleSheet.create({
    menuItem: {
        color: 'white',
        fontSize: 25,
        margin: 20,
        textAlign: 'center'
    },
    icon: {
        tintColor: 'white',
        height: 40,
        width: 40
    }
})