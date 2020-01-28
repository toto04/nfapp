import React, { Component } from 'react'
import { Text, Image, Dimensions, Platform } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import images from '../../assets/fields/images'
import { FlatList, TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler'
import { getStatusBarHeight } from 'react-native-safe-area-view';
import { NavigationProps, commonStyles, ScrollableMainPage, Class, Page } from '../../util';
const { classStructure } = Class

export default class SchoolSharing extends Component<NavigationProps, { slideIndex: number }> {
    state = {
        slideIndex: 0
    }
    constructor(props) {
        super(props)
        this.renderContent.bind(this)
    }

    renderContent = (field) => {
        let data = classStructure[field].map(f => f.year)
        return <FlatList
            data={data}
            renderItem={({ index, item }) => <TouchableOpacity onPress={() => this.props.navigation.navigate('SubjectsDetailPage', { classContext: { field, classIndex: index } })}>
                <Text style={{ padding: 10, fontSize: 20 }}>{`Classe ${item}`}</Text>
            </TouchableOpacity>}
            keyExtractor={item => item + ''}
        />
    }

    render() {
        return <ScrollableMainPage
            scrollEnabled={false}
            navigation={this.props.navigation}
            statusBarStyle='light-content'
            style={{
                flex: 1,
                backgroundColor: commonStyles.main.backgroundColor
            }}
            contentContainerStyle={{
                flex: 1,
                marginTop: Platform.OS != "ios" ? getStatusBarHeight() : 0,
                paddingBottom: Platform.OS == 'ios' ? 50 : 0
            }}
            overrideStyles
            darkTabBar
        >
            <Text style={{ fontWeight: 'bold', fontSize: 40, margin: 20, marginBottom: 0, color: commonStyles.main.color }}>School Sharing</Text>
            <Text style={{ alignSelf: 'center', textAlign: 'center', color: '#bbb', padding: 15, fontSize: 16, marginHorizontal: 20 }}>Condividi i tuoi appunti con altri studenti per guadagnare punti!</Text>
            <Carousel
                containerCustomStyle={{
                    flex: 1
                }}
                data={Object.keys(classStructure)}
                renderItem={({ item }) => {
                    return <TouchableHighlight
                        style={{
                            height: '100%',
                            backgroundColor: 'white',
                            borderRadius: 10,
                            overflow: 'hidden'
                        }}
                        onPress={() => {
                            this.props.navigation.navigate('ClassSelection', { visibleSection: item })
                        }}
                    >
                        <Image
                            source={images[item]}
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'white'
                            }}
                            resizeMode={'contain'}
                        />
                    </TouchableHighlight>
                }}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={300}
                onSnapToItem={idx => this.setState({ slideIndex: idx })}
            />
            <Pagination
                dotsLength={Object.keys(classStructure).length}
                dotColor='white'
                inactiveDotColor='white'
                activeDotIndex={this.state.slideIndex}
            />

        </ScrollableMainPage>
    }
}