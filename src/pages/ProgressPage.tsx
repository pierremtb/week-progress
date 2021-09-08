import React from "react";
import { Button } from '@mui/material';
import ApiCalendar from '../utils/ApiCalendar';
import { startOfWeek, endOfWeek, differenceInMinutes, subDays, addDays } from 'date-fns'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const DEFAULT_CALENDAR = "primary";

export class ProgressPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      sign: ApiCalendar.sign,
      events: [],
      doneThisWeek: 0,
      plannedThisWeek: 0,
      baseDate: new Date(),
      loading: true,
      calendar: DEFAULT_CALENDAR,
      calendars: [DEFAULT_CALENDAR],
    };
    this.signUpdate = this.signUpdate.bind(this);
    ApiCalendar.onLoad(() => {
      ApiCalendar.listenSign(this.signUpdate);
    });
  }

  componentDidMount() {
    this.fetchCalendars();
    this.fetchData();
  }

  async fetchCalendars() {
    if (!ApiCalendar.sign) {
      return;
    }

    try {
      const { result } = await ApiCalendar.listCalendars({});
      console.log(result.items);
      this.setState({ calendars: result.items });
    } catch (e) {
      console.error(e);
    }
  }

  async fetchData() {
    if (!ApiCalendar.sign) {
      return;
    }

    this.setState({ loading: true });
    const now = new Date();
    try {
      const { result } = await ApiCalendar.listEvents({
        timeMin: startOfWeek(this.state.baseDate).toISOString(),
        timeMax: endOfWeek(this.state.baseDate).toISOString(),
        showDeleted: false,
        maxResults: 10,
        calendarId: this.state.calendar,
        singleEvents: true,
      });
      let plannedThisWeek = 0;
      let doneThisWeek = 0;
      console.log(result.items);
      if (result.items) {
        for (const event of result.items) {
          if (event.start && event.end) {
            const start = new Date(event.start?.dateTime!);
            const end = new Date(event.end?.dateTime!);
            const duration = differenceInMinutes(end, start);
            plannedThisWeek += duration;
            if (end < now) {
              doneThisWeek += duration;
            }
          }
        }
      }
      this.setState({ plannedThisWeek, doneThisWeek, loading: false });
    } catch (e) {
      console.error(e);
    }
  }

  public signUpdate(sign: boolean): any {
    console.log(sign);
    this.setState({
      sign
    })
  }

  signIn() {
    ApiCalendar.handleAuthClick();
  }

  setPreviousWeek() {
    this.setState({ baseDate: subDays(this.state.baseDate, 7) }, () => {
      this.fetchData();
    });
  }

  setCurrentWeek() {
    this.setState({ baseDate: new Date() }, () => {
      this.fetchData();
    });
  }

  setNextWeek() {
    this.setState({ baseDate: addDays(this.state.baseDate, 7) }, () => {
      this.fetchData();
    });
  }

  handleCalendarChange(event: SelectChangeEvent) {
    this.setState({ calendar: event.target.value })
  }

  render() {
    return (
      <Box padding={4}>
        {this.state.sign ?
          <div>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Calendar</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={this.state.calendar}
                  label="Calendar"
                  onChange={(event) => this.handleCalendarChange(event)}
                >
                  {this.state.calendars.map((c: gapi.client.calendar.Calendar) =>
                    <MenuItem value={c.id}>{c.summary}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
            <p>Week: {startOfWeek(this.state.baseDate).toLocaleDateString("en-us")}</p>
            <p>Done this week: {this.state.loading ? "-" : this.state.doneThisWeek / 60} hours</p>
            <p>Planned this week: {this.state.loading ? "-" : this.state.plannedThisWeek / 60} hours</p>
            <Button variant="contained" onClick={() => this.setPreviousWeek()}>Previous</Button>
            <Button variant="contained" onClick={() => this.setCurrentWeek()}>Current</Button>
            <Button variant="contained" onClick={() => this.setNextWeek()}>Next</Button>
          </div>
          :
          <Button variant="contained" onClick={this.signIn}>
            Sign in with Google</Button>
        }
      </Box>
    );
  }
}