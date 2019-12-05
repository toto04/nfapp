import React, { Component } from 'react'
import { Text, RefreshControl, View, Image } from 'react-native'
import { NavigationProps, api, commonStyles } from '../util';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import IconComponent from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux';
import { LoginState } from '../redux/login';

export interface Post {
    id: number,
    author: string,
    title: string,
    body?: string,
    image?: string,
    time: string,
    liked?: boolean
}

class PostComponent extends Component<NavigationProps & { postObject: Post, login: LoginState }, { liked?: boolean }> {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        let body = this.props.postObject.body ? <Text style={{ color: '#bbb', fontSize: 14 }} numberOfLines={4}>{this.props.postObject.body}</Text> : undefined
        let image = this.props.postObject.image ? <Image style={{
            flex: 1,
            height: 300,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            resizeMode: 'cover'
        }} source={{ uri: this.props.postObject.image }} /> : undefined

        let liked = this.props.postObject.liked
        if (this.state.liked != undefined) liked = this.state.liked
        let onLike = this.props.login.loggedIn ? () => {
            const url = '/api/' + (liked ? 'dislike/' : 'like/') + this.props.postObject.id
            console.log(url)
            this.setState({ liked: !liked })
            api.post(url, {}).then(async res => {
                let r = await res.json()
                if (r.success) this.setState({ liked: !liked })
            })
        } : () => this.props.navigation.navigate('Login')
        let like = liked ?
            <IconComponent style={{ marginTop: 8, marginHorizontal: 16 }} size={30} onPress={onLike} name='ios-heart' color='red' /> :
            <IconComponent style={{ marginTop: 8, marginHorizontal: 16 }} size={30} onPress={onLike} name='ios-heart-empty' />

        return (
            <View style={{ marginTop: 15 }}>
                <View style={{
                    shadowOpacity: 0.2,
                    shadowOffset: { width: 0, height: 5 },
                    shadowRadius: 5,
                    elevation: 5
                }}>
                    <TouchableHighlight
                        onPress={() => {
                            this.props.navigation.navigate('PostDetailPage', { postObject: this.props.postObject })
                        }}
                        style={{
                            borderRadius: 10,
                            overflow: 'hidden'
                        }}
                    >
                        <View
                            style={{ backgroundColor: commonStyles.backgroundColor }}>
                            <View style={{ margin: 15 }}>
                                <Text style={{ color: '#aaa', fontSize: 12 }}>{'@' + this.props.postObject.author + ' - ' + this.props.postObject.time}</Text>
                                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>{this.props.postObject.title}</Text>
                                {body}
                            </View>
                            {image}
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <IconComponent style={{ marginTop: 8, marginHorizontal: 16 }} size={30} name='ios-text' />
                    {like}
                </View>
            </View>
        )
    }
}

let ConnectedPostComponent = connect((state: { login: LoginState }) => ({ login: state.login }))(PostComponent)

export default class FeedPage extends Component<NavigationProps, { posts: JSX.Element[], refreshing: boolean }> {
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            refreshing: false
        }
    }

    componentWillMount() { this.refresh() }

    refresh() {
        this.setState({ refreshing: true })
        api.get('/api/posts').then(async res => {
            let posts: Post[] = await res.json()
            let els = []
            for (let post of posts) {
                post.time = formatDate(post.time)
                els.push(
                    <ConnectedPostComponent
                        key={post.id}
                        navigation={this.props.navigation}
                        postObject={post}
                    />
                )
            }
            this.setState({ refreshing: false, posts: els })
        })
    }

    render() {
        return (
            <ScrollView
                contentContainerStyle={{ margin: 20, paddingBottom: 50 }}
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()} tintColor={'black'} />}
            >
                <Text style={{ fontWeight: 'bold', fontSize: 40 }}>Bacheca</Text>
                {this.state.posts}
            </ScrollView>
        )
    }
}

function formatDate(inputDate: string) {
    let date = new Date(inputDate)
    let dd = date.getDate() + ''
    if (dd.length == 1) dd = '0' + dd
    let MM = date.getMonth() + 1 + ''
    if (MM.length == 1) MM = '0' + MM
    let yyyy = date.getFullYear()

    let hh = date.getHours() + ''
    if (hh.length == 1) hh = '0' + hh
    let mm = date.getMinutes() + ''
    if (mm.length == 1) mm = '0' + mm

    return `${dd}/${MM}/${yyyy} ${hh}:${mm}`
}