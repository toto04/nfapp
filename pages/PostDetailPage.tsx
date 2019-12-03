import React, { Component } from 'react';
import { NavigationProps, Page } from '../util';
import { Post } from './Feed';
import { Text, Image, Dimensions, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer'
import IconComponent from 'react-native-vector-icons/Ionicons'
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { createStackNavigator } from 'react-navigation-stack';
import { NavigationActions } from 'react-navigation';

class PostDetailPage extends Component<NavigationProps, { postObject: Post, imageSize: { width: number, height: number } }> {
    ref: React.RefObject<PostDetailPage>
    constructor(props) {
        super(props)
        this.state = { postObject: this.props.navigation.state.params.postObject, imageSize: { width: 0, height: 0 } }
        this.ref = React.createRef()
        Image.getSize(this.state.postObject.image, (w, h) => {
            let width = Dimensions.get('screen').width - 40
            this.setState({ imageSize: { width: width, height: (h * width / w) } })
        }, (e) => { if (e) throw e })
    }
    render() {
        return (
            <Page
                navigation={this.props.navigation}
                title='post'
                backButton
                contentContainerStyle={{ margin: 20, paddingBottom: 50 }}
            >
                <Text style={{ color: '#666', fontSize: 14 }}>{'@' + this.state.postObject.author + ' - ' + this.state.postObject.time}</Text>
                <Text style={{ color: 'black', fontSize: 35, fontWeight: 'bold', marginBottom: 10 }}>{this.state.postObject.title}</Text>
                <Text style={{ color: 'black', fontSize: 18 }}>{this.state.postObject.body}</Text>
                <TouchableHighlight
                    style={{ marginTop: 20 }}
                    onPress={() => this.props.navigation.navigate('ImageModal', { imageURL: this.state.postObject.image })}
                >
                    <Image
                        style={{
                            width: this.state.imageSize.width,
                            height: this.state.imageSize.height,
                        }}
                        source={{ uri: this.state.postObject.image }}
                    />
                </TouchableHighlight>
            </Page>
        )
    }
}

/** Full screen image view */
class ImageModal extends Component<NavigationProps, { header: boolean }> {
    state = { header: false }
    render() {
        return (
            <View style={{
                flex: 1,
                position: 'relative'
            }}>
                <ImageViewer
                    style={{ paddingTop: -20 }}
                    renderIndicator={() => null}
                    onClick={() => this.setState({ header: !this.state.header })}
                    enableSwipeDown
                    saveToLocalByLongPress={false}
                    onCancel={() => {
                        this.props.navigation.dispatch(NavigationActions.back())
                    }}
                    imageUrls={[{
                        url: this.props.navigation.state.params.imageURL
                    }]}
                />
                <IconComponent
                    style={{
                        position: 'absolute',
                        top: 20,
                        left: 30
                    }}
                    size={55}
                    name='ios-close'
                    color='white'
                    onPress={() => this.props.navigation.dispatch(NavigationActions.back())}
                />
            </View>
        )
    }
}

export default createStackNavigator({
    PostDetailPage,
    ImageModal
}, {
    initialRouteName: 'PostDetailPage',
    mode: 'modal',
    headerMode: 'none',
})