import { LocaleConfig, Calendar } from 'react-native-calendars'
import React, { Component } from 'react'
import { NavigationProps, commonStyles, api, ScrollableMainPage, ShadowCard } from '../util'
import { Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { getStatusBarHeight } from 'react-native-safe-area-view'
LocaleConfig.locales['it'] = {
    monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
    monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
    dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
    dayNamesShort: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
}
LocaleConfig.defaultLocale = 'it'

interface calendarState {
    refreshing: boolean,
    selectedDate: string,
    events: { date: string, description: string }[]
}

export default class CalendarPage extends Component<NavigationProps, calendarState> {
    constructor(props) {
        let date = new Date()
        super(props)
        this.state = {
            refreshing: false,
            selectedDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            events: []
        }
    }

    async refresh() {
        this.setState({ refreshing: true })
        let rows = await api.get('/api/events')
        let evt = {}
        for (const row of rows) {
            evt[row.date] = row.description
        }
        this.setState({ events: rows, refreshing: false })
    }

    render() {
        let mkDates = {}
        let todayEventComponents = []
        for (const event of this.state.events) {
            let date = event.date
            mkDates[date] = { marked: true }
            if (date == this.state.selectedDate) todayEventComponents.push(
                <ShadowCard key={this.state.events.indexOf(event)} style={{
                    margin: 20,
                    marginBottom: 0,
                }}>
                    <View style={{
                        backgroundColor: commonStyles.main.backgroundColor,
                        padding: 20,
                    }}>
                        <Text style={{ color: 'white', fontSize: 18 }}>{event.description}</Text>
                    </View>
                </ShadowCard>
            )
        }
        mkDates[this.state.selectedDate] = Object.assign({ selected: true }, mkDates[this.state.selectedDate])
        let eventPaddingOffset = 300
        return (
            <ScrollableMainPage
                navigation={this.props.navigation}
                refreshOptions={{
                    refreshing: this.state.refreshing,
                    onRefresh: this.refresh.bind(this),
                    color: 'white'
                }}
                statusBarStyle='light-content'
                style={{ backgroundColor: commonStyles.main.backgroundColor, flex: 1 }}
                overrideStyles
                contentContainerStyle={{ flexGrow: 1 }}
                contentInset={{ bottom: -eventPaddingOffset }}
                stickyHeaderIndices={[0]}
            >
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 40, margin: 20, marginBottom: 0, color: commonStyles.main.color }}>Calendario</Text>
                    <Calendar
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
                        markedDates={mkDates}
                        onDayPress={(day) => { this.setState({ selectedDate: day.dateString }) }}
                    />
                </View>
                <View style={{ padding: 10, backgroundColor: '#fff', flex: 1, paddingBottom: eventPaddingOffset + 60, borderRadius: 10, zIndex: 1000 }}>
                    <Text style={{ fontSize: 40, fontWeight: 'bold' }}>Eventi:</Text>
                    {todayEventComponents.length != 0 ? todayEventComponents : <Text style={{ alignSelf: 'center', fontSize: 25, color: '#aaa', margin: 20 }}>Nessun evento</Text>}
                </View>
            </ScrollableMainPage>
        )
    }
}