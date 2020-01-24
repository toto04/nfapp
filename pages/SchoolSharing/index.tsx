import React, { Component } from 'react'
import { Text, Image, Dimensions, ImageBackground } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import images from '../../assets/fields/images'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { NavigationProps, commonStyles, ScrollableMainPage, Class } from '../../util';
const { classStructure } = Class

export default class SchoolSharing extends Component<NavigationProps, { activeSections: number[] }> {
    state = { activeSections: [] }

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
            navigation={this.props.navigation}
            statusBarStyle='light-content'
            style={{
                backgroundColor: commonStyles.main.backgroundColor
            }}
            contentContainerStyle={{
                margin: 0
            }}
        >
            <Text style={{ fontWeight: 'bold', fontSize: 40, margin: 20, marginBottom: 0, color: commonStyles.main.color }}>School Sharing</Text>
            <Text style={{ alignSelf: 'center', textAlign: 'center', color: '#bbb', padding: 15, fontSize: 16, marginHorizontal: 20 }}>Condividi i tuoi appunti con altri studenti per guadagnare punti!</Text>
            <Carousel
                data={Object.keys(classStructure)}
                renderItem={({ item }) => {
                    return <Image
                        source={images[item]}
                        style={{
                            width: 300,
                            height: 450,
                            borderRadius: 10,
                            overflow: 'hidden'
                        }}
                        resizeMode={'contain'}
                    />
                }}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={300}
            />
            {/* <Accordion
                activeSections={this.state.activeSections}
                sections={fields}
                renderContent={this.renderContent}
                renderHeader={(content) => <View>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>{content}</Text>
                </View>}
                touchableProps={{
                    style: {
                        marginVertical: 10,
                        padding: 10,
                        borderRadius: 8,
                        backgroundColor: commonStyles.main.backgroundColor
                    }
                }}
                onChange={(indexes) => { this.setState({ activeSections: indexes }) }}
            /> */}
        </ScrollableMainPage>
    }
}