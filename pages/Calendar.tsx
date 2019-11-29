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
        let date = new Date()
        super(props)
        this.state = {
            refreshing: false,
            selectedDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
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
                evt[row.date] = row.description
            }
            this.setState({ events: rows, refreshing: false })
        })
    }

    render() {
        let mkDates = {}
        let todayEventComponents = []
        for (const event of this.state.events) {
            let date = event.date
            mkDates[date] = { marked: true }
            if (date == this.state.selectedDate) todayEventComponents.push(
                <View key={this.state.events.indexOf(event)} style={{
                    margin: 20,
                    marginBottom: 0,
                    backgroundColor: commonStyles.backgroundColor,
                    borderRadius: 10, padding: 20,
                    shadowOpacity: 0.2,
                    shadowOffset: { width: 0, height: 5 },
                    shadowRadius: 5,
                    elevation: 5
                }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>{event.description}</Text>
                </View>
            )
        }
        mkDates[this.state.selectedDate] = Object.assign({ selected: true }, mkDates[this.state.selectedDate])
        let eventPaddingOffset = 200
        return (
            <Page
                navigation={this.props.navigation}
                title='calendario'
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()} tintColor={'white'} />
                }
                style={{ backgroundColor: '#22202a', flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                contentInset={{ bottom: -eventPaddingOffset }}
                stickyHeaderIndices={[0]}
            >
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
                <View style={{ padding: 10, backgroundColor: '#fff', flex: 1, paddingBottom: eventPaddingOffset + 20, borderRadius: 10, zIndex: 1000 }}>
                    <Text style={{ fontSize: 40, fontWeight: 'bold' }}>Eventi:</Text>
                    {todayEventComponents.length != 0 ? todayEventComponents : <Text style={{ alignSelf: 'center', fontSize: 25, color: '#aaa', margin: 20 }}>Nessun evento</Text>}
                </View>
            </Page>
        )
    }
}