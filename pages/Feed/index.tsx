import React, { Component } from 'react'
import { Text, RefreshControl, View, Image } from 'react-native'
import { NavigationProps, api, commonStyles, formatDate, ScrollableMainPage, ShadowCard } from '../../util';
import { ScrollView, TouchableHighlight, FlatList } from 'react-native-gesture-handler';
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
    likes: number,
    liked?: boolean
}

class PostComponent extends Component<NavigationProps & { postObject: Post, login: LoginState }, { liked?: boolean, likes: number }> {
    constructor(props) {
        super(props)
        this.state = {
            likes: this.props.postObject.likes
        }
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
            const url = '/api/posts/' + (liked ? 'dislike/' : 'like/') + this.props.postObject.id
            this.setState({ liked: !liked, likes: this.state.likes - (liked ? 1 : -1) })
            api.post(url, {}).then(async res => {
                if (res.success) this.setState({ liked: !liked })
            })
        } : () => this.props.navigation.navigate('Login')
        let like = liked ?
            <IconComponent style={{ marginTop: 8, marginRight: 16 }} size={30} onPress={onLike} name='ios-heart' color={commonStyles.main.color} /> :
            <IconComponent style={{ marginTop: 8, marginRight: 16 }} size={30} onPress={onLike} name='ios-heart-empty' />

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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ marginLeft: 8 }}>{this.state.likes != 0 ? `Piace a ${this.state.likes} ${this.state.likes == 1 ? 'persona' : 'persone'}` : `Nessuno mi piace, sii il primo!`}</Text>
                    {like}
                </View>
            </View>
        )
    }
}

let ConnectedPostComponent = connect((state: { login: LoginState }) => ({ login: state.login }))(PostComponent)

export default class FeedPage extends Component<NavigationProps, { posts: Post[], refreshing: boolean, page: number, rockbottom: boolean }> {
    loadingMore = false
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            refreshing: false,
            page: 0,
            rockbottom: false
        }
    }

    async componentDidMount() {
        let els = await this.fetchPosts()
        this.setState({ posts: els })
    }

    async fetchPosts(page: number = 0) {
        let res = await api.get('/api/posts/' + page)
        let posts: Post[] = res.data
        return posts
    }

    async refresh() {
        this.setState({ refreshing: true })
        let els = await this.fetchPosts()
        this.setState({ refreshing: false, posts: els, rockbottom: false })
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
                scrollEventThrottle={400}
                contentContainerStyle={{ margin: 0 }}
                onScroll={this.state.rockbottom ? undefined : async ({ nativeEvent }) => {
                    const pixelsFromBottom = 200
                    if (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - pixelsFromBottom) {
                        if (this.loadingMore) return
                        if (!nativeEvent.layoutMeasurement.height) return
                        if (this.state.rockbottom) return

                        this.loadingMore = true
                        let page = this.state.page + 1
                        let newPosts = await this.fetchPosts(page)
                        if (newPosts.length < 10) this.setState({ rockbottom: true })
                        this.setState({ posts: [...this.state.posts, ...newPosts], page }, () => { this.loadingMore = false })
                    }
                }}
            >
                <FlatList
                    style={{ flex: 1 }}
                    ListHeaderComponent={<Text style={{ fontWeight: 'bold', fontSize: 40 }}>Bacheca</Text>}
                    data={this.state.posts}
                    renderItem={({ item }) => {
                        item.time = formatDate(item.time)
                        return <ConnectedPostComponent
                            navigation={this.props.navigation}
                            postObject={item}
                        />
                    }}
                    keyExtractor={post => post.id.toString()}
                    contentContainerStyle={{ marginHorizontal: 20 }}
                />
            </ScrollableMainPage>
        )
    }
}