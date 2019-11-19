import { LocaleConfig, Calendar } from 'react-native-calendars'
import React, { Component } from 'react'
import { NavigationProps, Page } from '../util'
LocaleConfig.locales['it'] = {
    monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
    monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
    dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
    dayNamesShort: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
}
LocaleConfig.defaultLocale = 'it'

export default class CalendarPage extends Component<NavigationProps, { selectedDate: string }> {
    constructor(props) {
        super(props)
        this.state = {
            selectedDate: new Date(Date.now()).toISOString().split('T')[0]
        }
    }

    render() {
        let mkDates = {}
        mkDates[this.state.selectedDate] = { selected: true }
        return (
            <Page navigation={this.props.navigation} title='calendario' >
                <Calendar
                    firstDay={1}
                    markedDates={mkDates}
                    onDayPress={(day) => { this.setState({ selectedDate: day.dateString }) }}
                />
            </Page>
        )
    }
}