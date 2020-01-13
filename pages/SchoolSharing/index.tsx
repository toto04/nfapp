import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Accordion from 'react-native-collapsible/Accordion'
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
        let fields = Object.keys(classStructure)
        return <ScrollableMainPage
            navigation={this.props.navigation}
            statusBarStyle='dark-content'
        >
            <Text style={{ fontWeight: 'bold', fontSize: 40 }}>School Sharing</Text>
            <Text style={{ alignSelf: 'center', textAlign: 'center', color: '#777', padding: 15, fontSize: 16 }}>Condividi i tuoi appunti con altri studenti per guadagnare punti!</Text>
            <Accordion
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
            />
        </ScrollableMainPage>
    }
}