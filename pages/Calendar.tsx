import { LocaleConfig, Calendar } from 'react-native-calendars'
import React, { Component } from 'react'
import { NavigationProps, Page, serverUrl, commonStyles, api } from '../util'
import { Text, RefreshControl, View } from 'react-native'
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
        super(props)
        this.state = {
            refreshing: false,
            selectedDate: new Date(Date.now()).toISOString().split('T')[0],
            events: []
        }
    }

    componentDidMount() {
        this.refresh()
    }

    refresh() {
        this.setState({ refreshing: true })
        api.get('/api/events').then(async res => {
            let rows = await res.json()
            let evt = {}
            for (const row of rows) {
                evt[row.date.split('T')[0]] = row.description
            }
            this.setState({ events: rows, refreshing: false })
        })
    }

    render() {
        let mkDates = {}
        let todayEventComponents = []
        for (const event of this.state.events) {
            let date = event.date.split('T')[0]
            mkDates[date] = { marked: true }
            if (date == this.state.selectedDate) todayEventComponents.push(
                <View key={this.state.events.indexOf(event)}>
                    <Text>{event.description}</Text>
                </View>
            )
        }
        mkDates[this.state.selectedDate] = Object.assign({ selected: true }, mkDates[this.state.selectedDate])
        return (
            <Page navigation={this.props.navigation} title='calendario' refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()}></RefreshControl>
            }>
                <Calendar
                    theme={{
                        calendarBackground: '#22202a',
                        textSectionTitleColor: '#ee6913',
                        todayTextColor: commonStyles.mainColor,
                        dayTextColor: 'white',
                        textDisabledColor: '#777',
                        monthTextColor: commonStyles.mainColor,
                        dotColor: commonStyles.mainColor,
                        selectedDayBackgroundColor: commonStyles.mainColor,
                        arrowColor: commonStyles.mainColor,

                    }}
                    firstDay={1}
                    markedDates={mkDates}
                    onDayPress={(day) => { this.setState({ selectedDate: day.dateString }) }}
                />
                <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 40, fontWeight: 'bold' }}>Eventi:</Text>
                    {todayEventComponents}
                </View>
            </Page>
        )
    }
}