import React, { Component } from 'react'
import { Text, RefreshControl, View } from 'react-native'
import Accordion from 'react-native-collapsible/Accordion'
import { ScrollView, FlatList } from 'react-native-gesture-handler'
import { getStatusBarHeight } from 'react-native-safe-area-view';

export default class SchoolSharing extends Component<{}, { activeSections: number[] }> {
    state = { activeSections: [] }
    renderContent() {
        return <FlatList
            data={[0, 1, 2, 3, 4, 5]}
            renderItem={({ index }) => <Text style={{ padding: 10, fontSize: 20 }}>{`Classe ${index + 1}^`}</Text>}
            keyExtractor={item => item + ''}
        />
    }

    render() {
        let sections = ['Scientifico', 'Linguistico', 'Artistico']
        return <ScrollView
            style={{ paddingTop: getStatusBarHeight() }}
            contentContainerStyle={{ margin: 20, paddingBottom: 50 }}
        >
            <Text style={{ fontWeight: 'bold', fontSize: 40 }}>School Sharing</Text>
            <Accordion
                activeSections={this.state.activeSections}
                sections={sections}
                renderContent={this.renderContent}
                renderHeader={(content) => <Text style={{ paddingVertical: 10, fontSize: 25, fontWeight: 'bold' }}>{content}</Text>}
                onChange={(indexes) => { this.setState({ activeSections: indexes }) }}
            />
        </ScrollView>
    }
}