import React, { Component } from 'react'
import { Page, NavigationProps, api } from '../../util'
import { Event, EventComponent } from '../Calendar'
import { connect } from 'react-redux'
import { LoginState } from '../../redux/login'
import { RefreshControl, Text, View } from 'react-native'

class _AttentendEvents extends Component<NavigationProps & { state: { login: LoginState } }, { events: Event[], refreshing: boolean }> {
    constructor(props) {
        super(props)
        this.state = {
            events: [],
            refreshing: false
        }
    }

    componentDidMount = () => this.refresh()

    refresh = async () => {
        this.setState({ refreshing: true })
        let res = await api.get('/api/events/partecipations')
        if (res.success) this.setState({
            events: res.data.map(e => {
                e.start = new Date(e.start)
                e.end = new Date(e.end)
                return e
            })
        })
        this.setState({ refreshing: false })
    }

    render = () => <Page
        navigation={this.props.navigation}
        title="eventi attesi"
        backButton
        refreshControl={<RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.refresh}
        />}
    >
        {this.state.events.length || this.state.refreshing
            ? this.state.events.map(event => <EventComponent event={event} key={'event' + event.id} />)
            : <View style={{ padding: 40, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 18, color: '#999' }}>Non hai ancora confermato la tua partecipazione ad alcun evento</Text>
            </View>
        }
    </Page>
}
export default connect(state => ({ state }))(_AttentendEvents)