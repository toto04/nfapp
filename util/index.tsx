import React, { Component } from 'react'
import { StyleSheet, Text, Dimensions, Image } from 'react-native'
import Animated, { Easing } from 'react-native-reanimated'
import { connect } from 'react-redux'
import { ErrorState } from '../redux/error'
import { getStatusBarHeight } from 'react-native-safe-area-view'

export * from './GeneralComponents'
export * from './Classes'
export * from './Api'
export * from './savedNotes'
import { commonStyles, ShadowCard } from './GeneralComponents'

export function formatDate(inputDate: string) {
    let date = new Date(inputDate);
    let dd = date.getDate() + '';
    if (dd.length == 1)
        dd = '0' + dd;
    let MM = date.getMonth() + 1 + '';
    if (MM.length == 1)
        MM = '0' + MM;
    let yyyy = date.getFullYear();
    let hh = date.getHours() + '';
    if (hh.length == 1)
        hh = '0' + hh;
    let mm = date.getMinutes() + '';
    if (mm.length == 1)
        mm = '0' + mm;
    return `${dd}/${MM}/${yyyy} ${hh}:${mm}`;
}

/**
 * Promise wrapper for the Image.getSize() funcion of react native beCAUSE THESE MORONS STILL
 * USE CALLBACKS WTF
 * @param uri uri string as given to the Image component
 */
export let getImageSize = (uri: string): Promise<{ width: number, height: number }> => {
    return new Promise((resolve, reject) => {
        Image.getSize(uri, (width, height) => {
            resolve({ width, height })
        }, e => {
            reject(e)
        })
    })
}

class ErrorModalComponent extends Component<{ message?: string }, { y: Animated.Value<number> }> {
    state = { message: '', y: new Animated.Value(Dimensions.get('screen').height) }
    timeout?: number

    render() {
        if (this.props.message) {
            Animated.timing(this.state.y, { toValue: Dimensions.get('screen').height - 170, duration: 300, easing: Easing.inOut(Easing.ease) }).start(() => {
                this.timeout = setTimeout(() => {
                    Animated.timing(this.state.y, { toValue: Dimensions.get('screen').height, duration: 300, easing: Easing.inOut(Easing.ease) }).start()
                }, 5000)
            })
        }
        let a: any = [{ translateY: this.state.y }]
        return <Animated.View
            style={{
                position: 'absolute',
                transform: a,
                zIndex: 2000,
                margin: 20,
                alignItems: 'stretch',
                justifyContent: 'center'
            }}
        >
            <ShadowCard
                borderRadius={10}
                style={{
                    width: Dimensions.get('screen').width - 40,
                    backgroundColor: commonStyles.main.backgroundColor
                }}
                contentContainerStyle={{
                    minHeight: 80,
                    padding: 15,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                onPress={() => {
                    if (this.timeout) {
                        clearTimeout(this.timeout)
                        this.timeout = undefined
                    }
                    Animated.timing(this.state.y, { toValue: Dimensions.get('screen').height, duration: 300, easing: Easing.inOut(Easing.ease) }).start()
                }}
            >
                <Text style={{
                    zIndex: 2002,
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 15
                }}>{this.props.message}</Text>
            </ShadowCard>
        </Animated.View>
    }
}
export let ErrorModal = connect((state: { error: ErrorState }) => ({ message: state.error.message }))(ErrorModalComponent)
