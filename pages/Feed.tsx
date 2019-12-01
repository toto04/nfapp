import React, { Component } from 'react'
import { Text, RefreshControl, View, Image } from 'react-native'
import { NavigationProps, api, commonStyles } from '../util';
import { ScrollView } from 'react-native-gesture-handler';

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
            let posts: { id: number, title: string, author: string, body: string, image: string, time: string }[] = await res.json()
            let els = []
            for (const post of posts) {
                let i = posts.indexOf(post), body: JSX.Element
                if (post.body) body = <Text style={{ color: '#bbb', fontSize: 14 }} numberOfLines={4}>{post.body}</Text>
                let el = <View
                    key={i}
                    style={{
                        marginTop: 15,
                        backgroundColor: commonStyles.backgroundColor,
                        borderRadius: 10,
                        shadowOpacity: 0.2,
                        shadowOffset: { width: 0, height: 5 },
                        overflow: 'hidden',
                        shadowRadius: 5,
                        elevation: 5
                    }}>
                    <View style={{ margin: 15 }}>
                        <Text style={{ color: '#aaa', fontSize: 12 }}>{'@' + post.author + ' - ' + post.time}</Text>
                        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>{post.title}</Text>
                        {body}
                    </View>
                    <Image style={{
                        flex: 1,
                        height: 300,
                        borderBottomRightRadius: 10,
                        borderBottomLeftRadius: 10,
                        resizeMode: 'cover'
                    }} source={{ uri: post.image }} />
                </View>
                els.push(el)
            }
            this.setState({ refreshing: false, posts: els })
        })
    }

    render() {
        return (
            <ScrollView
                contentContainerStyle={{ margin: 20 }}
                refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()} tintColor={'black'} />}
            >
                <Text style={{ fontWeight: 'bold', fontSize: 40 }}>Bacheca</Text>
                {this.state.posts}
            </ScrollView>
        )
    }
}