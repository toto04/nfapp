import { LocaleConfig, Calendar, DotMarking } from 'react-native-calendars'
import React, { Component } from 'react'
import { NavigationProps, commonStyles, api, ScrollableMainPage, ShadowCard, formatDate } from '../util'
import { Text, View, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native-gesture-handler'

LocaleConfig.locales['it'] = {
    monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
    monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
    dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
    dayNamesShort: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
}
LocaleConfig.defaultLocale = 'it'

export interface Event {
    id: number,
    start: Date,
    end: Date,
    title: string,
    body: string,
    partecipates?: boolean
}

interface calendarState {
    refreshing: boolean,
    selectedDate: string,
    events: { [date: string]: Event[] },
    markedDates: { [date: string]: DotMarking }
}

export class EventComponent extends Component<{ event: Event }, { partecipates: boolean }> {
    constructor(props) {
        super(props)
        this.state = {
            partecipates: this.props.event.partecipates
        }
    }

    render = () => <ShadowCard style={{
        margin: 20,
        marginBottom: 0,
    }}>
        <View style={{
            backgroundColor: commonStyles.main.backgroundColor,
            padding: 10,
        }}>
            <View style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <View style={{ paddingBottom: 10 }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 20,
                        fontWeight: 'bold'
                    }}>{this.props.event.title}</Text>
                    <Text style={{
                        color: '#fffb',
                        fontSize: 16,
                        // fontWeight: 'bold'
                    }}>{formatDate(this.props.event.start.toISOString())}</Text>
                </View>
                <TouchableOpacity
                    style={{
                        marginRight: 5,
                        paddingLeft: 5,
                        width: 35,
                        height: 35,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onPress={async () => {
                        api.post('/api/events/setPartecipation/' + this.props.event.id, { partecipates: !this.state.partecipates })
                        this.setState({ partecipates: !this.state.partecipates })
                    }}
                >
                    <Icon
                        color={commonStyles.main.color}
                        name={'ios-star' + (this.state.partecipates ? '' : '-outline')}
                        size={35}
                    />
                </TouchableOpacity>
            </View>
            <Text style={{ color: 'white', fontSize: 16 }}>{this.props.event.body}</Text>
        </View>
    </ShadowCard>
}

export default class CalendarPage extends Component<NavigationProps, calendarState> {
    ref: any
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false,
            selectedDate: this.props.navigation.state.params?.eventDate ?? new Date().toISOString().split('T')[0],
            events: {},
            markedDates: {}
        }
        this.props.navigation.addListener('didFocus', () => {
            let evtDate = this.props.navigation.state.params?.eventDate
            if (evtDate) {
                this.setState({ selectedDate: evtDate })
                this.refresh()
            }
        })
    }

    async componentDidMount() {
        this.setState(await this.fetchEvents())
    }

    async fetchEvents() {
        let result = await api.get('/api/events')
        let events = {}
        let markedDates: { [date: string]: DotMarking } = {}
        if (result.success) {
            let evts = result.data.map(e => {
                e.start = new Date(e.start)
                e.end = new Date(e.end)
                return e
            })
            for (const event of evts) {
                let key = event.start.toISOString().split('T')[0]
                markedDates[key] = { marked: true }
                if (events[key]) events[key].push(event)
                else events[key] = [event]
            }
        }
        return { events, markedDates }
    }

    async refresh() {
        this.setState({ refreshing: true })
        let newState = await this.fetchEvents()
        this.setState({ ...newState, refreshing: false })
    }

    private renderEvents = () => {
        return this.state.events[this.state.selectedDate]?.map((event, i) => <EventComponent key={'event' + i} event={event} />)
    }

    render() {
        let todayEventComponents = this.renderEvents()
        let markedDates = { ...this.state.markedDates }
        markedDates[this.state.selectedDate] = Object.assign({ selected: true }, markedDates[this.state.selectedDate])
        let eventPaddingOffset = 400
        return (
            <ScrollableMainPage
                ref={r => { if (r) this.ref = r }}
                navigation={this.props.navigation}
                refreshOptions={{
                    refreshing: this.state.refreshing,
                    onRefresh: this.refresh.bind(this),
                    color: 'white'
                }}
                statusBarStyle='light-content'
                style={{ backgroundColor: commonStyles.main.backgroundColor }}
                overrideStyles
                contentInset={{ bottom: -eventPaddingOffset }}
                stickyHeaderIndices={[0]}
            >
                <View style={{ paddingTop: 20 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 40, marginHorizontal: 20, color: commonStyles.main.color }}>Calendario</Text>
                    <Calendar
                        current={this.state.selectedDate}
                        style={{
                            minHeight: 360
                        }}
                        theme={{
                            calendarBackground: commonStyles.main.backgroundColor,
                            textSectionTitleColor: commonStyles.main.color,
                            todayTextColor: commonStyles.main.color,
                            dayTextColor: 'white',
                            textDisabledColor: '#777',
                            monthTextColor: commonStyles.main.color,
                            dotColor: commonStyles.main.color,
                            selectedDayBackgroundColor: commonStyles.main.color,
                            arrowColor: commonStyles.main.color,
                        }}
                        firstDay={1}
                        markedDates={markedDates}
                        onDayPress={(day) => {
                            this.setState({ selectedDate: day.dateString })
                            this.ref.scrollView.scrollTo({ y: -10000, animated: true })
                        }}
                        onMonthChange={() => this.ref.scrollView.scrollTo({ y: -10000, animated: true })}
                    />
                </View>
                <View style={{
                    padding: 10,
                    marginTop: Platform.OS == 'ios' ? 0 : 25,
                    minHeight: Platform.OS == 'ios' ? 500 + eventPaddingOffset : 400,
                    backgroundColor: '#fff',
                    width: '100%',
                    paddingBottom: 60 + (Platform.OS == 'ios' ? eventPaddingOffset : 0),
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    zIndex: 1000
                }}>
                    <Text style={{ fontSize: 40, fontWeight: 'bold' }}>Eventi:</Text>
                    {todayEventComponents ?? <Text style={{ alignSelf: 'center', fontSize: 25, color: '#aaa', margin: 20 }}>Nessun evento</Text>}
                </View>
            </ScrollableMainPage>
        )
    }
}