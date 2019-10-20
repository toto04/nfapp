import React, { Component } from 'react'
import {} from 'react-navigation-drawer'
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'
import { View, StatusBar, Platform } from 'react-native'

export interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export let commonStyles = {
    mainColor: '#ff7923',
    backgroundColor: '#1e1b20'
}