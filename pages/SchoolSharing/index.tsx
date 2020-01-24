import React, { Component } from 'react'
import { Text, Image, Dimensions, Modal } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import images from '../../assets/fields/images'
import { FlatList, TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler'
import { NavigationProps, commonStyles, ScrollableMainPage, Class, Page } from '../../util';
const { classStructure } = Class

export default class SchoolSharing extends Component<NavigationProps, { visibleSection?: string }> {
    state = {
        visibleSection: undefined
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
                    return <TouchableHighlight
                        style={{
                            width: 300,
                            height: 450,
                            borderRadius: 10,
                            overflow: 'hidden'
                        }}
                        onPress={() => {
                            if (this.state.visibleSection) this.setState({ visibleSection: undefined }, () => this.setState({ visibleSection: item }))
                            else this.setState({ visibleSection: item })
                        }}
                    >
                        <Image
                            source={images[item]}
                            style={{ width: 300, height: 450 }}
                            resizeMode={'contain'}
                        />
                    </TouchableHighlight>
                }}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={300}
            />
            <Modal
                visible={!!this.state.visibleSection}
                animationType='slide'
                onRequestClose={() => this.setState({ visibleSection: undefined })}
            >
                {/* TODO: questa va decisamente migliorata */}
                <Page
                    title={this.state.visibleSection}
                    downButton
                    navigation={this.props.navigation}
                    customAction={() => this.setState({ visibleSection: undefined })}
                >
                    <FlatList
                        data={classStructure[this.state.visibleSection]}
                        renderItem={({ item, index }) => <TouchableOpacity
                            style={{
                                padding: 10,
                                paddingHorizontal: 30
                            }}
                            onPress={() => {
                                this.props.navigation.navigate('SubjectsDetailPage', {
                                    classContext: { field: this.state.visibleSection, classIndex: index }
                                })
                                this.setState({ visibleSection: undefined })
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{`Classe ${item.year}`}</Text>
                        </TouchableOpacity>}
                        keyExtractor={item => item.year}
                    />
                </Page>
            </Modal>
        </ScrollableMainPage>
    }
}