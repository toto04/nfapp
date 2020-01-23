import React, { Component } from 'react'
import { StyleSheet, Text, Dimensions } from 'react-native'
import Animated, { Easing } from 'react-native-reanimated'
import { connect } from 'react-redux'
import { ErrorState } from '../redux/error'
import { getStatusBarHeight } from 'react-native-safe-area-view'

export * from './GeneralComponents'
export * from './Classes'
export * from './Api'
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

class ErrorModalComponent extends Component<{ message?: string }, { y: Animated.Value<number> }> {
    state = { message: '', y: new Animated.Value(Dimensions.get('screen').height) }

    render() {
        if (this.props.message) {
            Animated.timing(this.state.y, { toValue: Dimensions.get('screen').height - 170, duration: 300, easing: Easing.inOut(Easing.ease) }).start(() => {
                setTimeout(() => {
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
                padding: 10,
                width: Dimensions.get('screen').width - 40,
                height: 80,
                alignItems: 'stretch',
                justifyContent: 'center'
            }}
        >
            <ShadowCard style={{
                zIndex: 2001,
                backgroundColor: commonStyles.main.backgroundColor,
            }}>
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
