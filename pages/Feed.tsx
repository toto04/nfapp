import React, { Component } from 'react'
import { Text, RefreshControl, View, Image } from 'react-native'
import { NavigationProps, api, commonStyles } from '../util';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';

export interface Post {
    author: string,
    title: string,
    body?: string,
    image?: string,
    time: string
}

class PostComponent extends Component<NavigationProps & { postObject: Post }> {
    render() {
        let body = this.props.postObject.body ? <Text style={{ color: '#bbb', fontSize: 14 }} numberOfLines={4}>{this.props.postObject.body}</Text> : undefined
        let image = this.props.postObject.image ? <Image style={{
            flex: 1,
            height: 300,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            resizeMode: 'cover'
        }} source={{ uri: this.props.postObject.image }} /> : undefined
        return (
            <View style={{
                marginTop: 15,
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
        )
    }
}

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
            let posts: (Post & { id: number })[] = await res.json()
            let els = []
            for (const post of posts) {
                els.push(
                    <PostComponent
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