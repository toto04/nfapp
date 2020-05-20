import React, { Component } from 'react';
import { NavigationScreenProp, NavigationState, NavigationParams, NavigationActions } from 'react-navigation';
import { View, Text, ScrollViewProps, RefreshControl, StatusBar, StatusBarStyle, StyleSheet, ViewProps, GestureResponderEvent, StyleProp, ViewStyle, Platform, Insets } from 'react-native';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-safe-area-view';
import Icon from 'react-native-vector-icons/Fontisto';
import store from '../redux/index';
import { setTheme } from '../redux/theme';

/**
 * Defines the standard *navigation* prop common to all components that
 * somehow make use of the navigation (all *Page* components)
 */
export interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}


/**
 * Plain JS object containing common style properties
 */
export const commonStyles = StyleSheet.create({
    main: {
        color: '#ff9000',
        backgroundColor: '#1e1b20'
    }
})

interface HeaderProps {
    title: string
    downButton?: boolean
    backButton?: boolean
    customAction?: () => void
    rightButton?: {
        name: string,
        action: () => void
    }
}
/**
 * Page component, with an Header, navigation buttons and a scrollview
 */
export class Page extends Component<NavigationProps & HeaderProps & ScrollViewProps & { fixedChildren?: React.ReactNode }> {
    render() {
        return (<View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Header {...this.props} />
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 50 }} {...this.props}>
                {this.props.children}
            </ScrollView>
            {this.props.fixedChildren}
        </View>);
    }
}
/**
 * Header component, represents the header
 *
 * refer to the *HeaderProps* interface
 */
class Header extends Component<NavigationProps & HeaderProps> {
    componentDidMount() {
        this.props.navigation.addListener('willFocus', () => {
            StatusBar.setBarStyle('light-content');
        });
    }
    render() {
        let buttonAction = this.props.customAction ? this.props.customAction : () => this.props.navigation.dispatch(NavigationActions.back());
        let button: JSX.Element;
        if (this.props.backButton) {
            button = (<View style={[styles.menuButton, { justifyContent: 'center' }]} onTouchStart={buttonAction}>
                <View style={[styles.menuButtonBar, { transform: [{ rotate: '-45deg' }, { translateY: -6.5 }] }]} />
                <View style={[styles.menuButtonBar, { transform: [{ rotate: '45deg' }, { translateY: 6.5 }] }]} />
            </View>);
        }
        else if (this.props.downButton) {
            button = (<View style={[styles.menuButton, { flexDirection: 'row', justifyContent: 'center' }]} onTouchStart={buttonAction}>
                <View style={[styles.menuButtonBar, { transform: [{ rotate: '45deg' }, { translateX: 5.5 }] }]} />
                <View style={[styles.menuButtonBar, { transform: [{ rotate: '-45deg' }, { translateX: -5.5 }] }]} />
            </View>);
        }
        else {
            button = undefined;
        }
        return (<View style={styles.header}>
            {button}
            <Text style={{
                color: commonStyles.main.color,
                fontSize: 35
            }}>{this.props.title}</Text>
            {this.props.rightButton ? <Icon
                style={{ alignSelf: 'center', marginLeft: 'auto', padding: 10, marginRight: 10 }}
                size={30}
                name={this.props.rightButton.name}
                color={commonStyles.main.color}
                onPress={this.props.rightButton.action}
            /> : undefined}
        </View>);
    }
}
/**
 * General scrollable main page component, the 5 main pages of this app (in the tab navigator) are all
 * istances of this component.
 * Allows for controlled refresh options with automatic refresh on mount, common styles already applied
 * with the options to override them
 *
 * Inherits the props from `ScrollViewProps` and `NavigationProps`
 * @prop `refreshOptions.onRefresh`: async function called on refresh of the _'RefreshControl'_ component and on mount
 * @prop `refreshOptions.refreshing`: boolean state of the actual refreshing, should be set to true on the _'onRefresh'_ function call, and false on return of said function
 * @prop `refreshOptions.color`: color of the refresh wheel
 * @prop `statusBarStyles`: the style of the status bar to apply on focus
 * @prop `overrideStyles`: optional boolean, overrides the default styles with the ones passed with the _'style'_ and _'contentContainerStyle'_ props
 */
export class ScrollableMainPage extends Component<ScrollViewProps & NavigationProps & {
    refreshOptions?: {
        onRefresh: () => Promise<any>;
        refreshing: boolean;
        color: string;
    };
    overrideStyles?: boolean;
    statusBarStyle: StatusBarStyle;
    darkTabBar?: boolean
}> {
    scrollView: any;
    componentDidMount() {
        this.props.navigation.addListener('willFocus', () => {
            store.dispatch(setTheme({ tabBar: this.props.darkTabBar ? 'dark' : 'light' }))
            StatusBar.setBarStyle(this.props.statusBarStyle);
        });
    }
    render() {
        let contentInset: Insets = { top: getStatusBarHeight() };
        for (let key in this.props.contentInset)
            contentInset[key] = this.props.contentInset[key];
        return <ScrollView
            ref={s => { if (s) this.scrollView = s }}
            refreshControl={this.props.refreshOptions ? <RefreshControl
                refreshing={this.props.refreshOptions.refreshing}
                onRefresh={() => this.props.refreshOptions.onRefresh()}
                tintColor={this.props.refreshOptions.color}
                colors={['black']}
            /> : undefined}
            {...this.props}
            contentContainerStyle={this.props.overrideStyles ? this.props.contentContainerStyle : [{
                margin: 20,
                marginTop: 20 + (Platform.OS != "ios" ? getStatusBarHeight() : 0),
                paddingBottom: contentInset.bottom ? 0 : 50
            }, this.props.contentContainerStyle]}
            contentInset={contentInset}
            contentOffset={{ y: Platform.OS == 'ios' ? -getStatusBarHeight() : 0, x: 0 }}
        >
            {this.props.children}
        </ScrollView>;
    }
}

export class ShadowCard extends Component<ViewProps & { borderRadius?: number, onPress?: (event: GestureResponderEvent) => void, contentContainerStyle?: StyleProp<ViewStyle> }> {
    render() {
        return <View {...this.props} style={[{
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 5 },
            shadowRadius: 5,
            elevation: 5
        }, this.props.style]} >
            <TouchableHighlight
                onPress={this.props.onPress}
                style={[{
                    flex: 1,
                    borderRadius: this.props.borderRadius == undefined ? 10 : this.props.borderRadius,
                    overflow: 'hidden'
                }, this.props.contentContainerStyle]}
            >
                {this.props.children}
            </TouchableHighlight>
        </View>
    }
}

const styles = StyleSheet.create({
    header: {
        paddingTop: getStatusBarHeight(),
        height: 64 + getStatusBarHeight(),
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        backgroundColor: '#1e1b20',
    },
    menuButton: {
        padding: 6,
        height: 50,
        width: 64,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    menuButtonBar: {
        width: 20,
        height: 3,
        backgroundColor: commonStyles.main.color,
        borderRadius: 3,
    }
})