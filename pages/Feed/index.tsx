import React, { Component } from 'react'
import { Text, RefreshControl, View, Image } from 'react-native'
import { NavigationProps, api, commonStyles, formatDate, ScrollableMainPage, ShadowCard } from '../../util';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import IconComponent from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux';
import { LoginState } from '../../redux/login';
import { getStatusBarHeight } from 'react-native-safe-area-view';

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
            this.setState({ liked: !liked })
            api.post(url, {}).then(async res => {
                if (res.success) this.setState({ liked: !liked })
            })
        } : () => this.props.navigation.navigate('Login')
        let like = liked ?
            <IconComponent style={{ marginTop: 8, marginHorizontal: 16 }} size={30} onPress={onLike} name='ios-heart' color={commonStyles.main.color} /> :
            <IconComponent style={{ marginTop: 8, marginHorizontal: 16 }} size={30} onPress={onLike} name='ios-heart-empty' />

        return (
            <View style={{ marginTop: 15 }}>
                <ShadowCard
                    onPress={() => {
                        this.props.navigation.navigate('PostDetailPage', { postObject: this.props.postObject })
                    }}
                >
                    <View
                        style={{ backgroundColor: commonStyles.main.backgroundColor }}>
                        <View style={{ margin: 15 }}>
                            <Text style={{ color: '#aaa', fontSize: 12 }}>{'@' + this.props.postObject.author + ' - ' + this.props.postObject.time}</Text>
                            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>{this.props.postObject.title}</Text>
                            {body}
                        </View>
                        {image}
                    </View>
                </ShadowCard>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
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

    async componentWillMount() {
        let els = await this.fetchPosts()
        this.setState({ posts: els })
    }

    async fetchPosts() {
        let posts: Post[] = await api.get('/api/posts')
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
        return els
    }

    async refresh() {
        this.setState({ refreshing: true })
        let els = await this.fetchPosts()
        this.setState({ refreshing: false, posts: els })
    }

    render() {
        return (
            <ScrollableMainPage
                navigation={this.props.navigation}
                refreshOptions={{
                    refreshing: this.state.refreshing,
                    onRefresh: this.refresh.bind(this),
                    color: 'black'
                }}
                statusBarStyle='dark-content'
            >
                <Text style={{ fontWeight: 'bold', fontSize: 40 }}>Bacheca</Text>
                {this.state.posts}
            </ScrollableMainPage>
        )
    }
}