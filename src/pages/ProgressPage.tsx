import React from "react";
import { Button, Card, CardActions, CardContent, CardHeader, IconButton, Link, Paper, TextField, Typography } from '@mui/material';
import ApiCalendar from '../utils/ApiCalendar';
import { startOfWeek, endOfWeek, differenceInMinutes, subDays, addDays } from 'date-fns'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker } from "@mui/lab";
import { Refresh } from "@mui/icons-material";

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
    ApiCalendar.onLoad(() => {
      ApiCalendar.listenSign((sign: boolean) => {
        this.setState({ sign });
      });
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

  async signIn() {
    try {
      await ApiCalendar.handleAuthClick();
      await this.fetchCalendars();
      this.setState({ sign: true });
    } catch (e) {
      console.log(e);
      this.setState({ sign: false });
    }
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
    this.setState({ calendar: event.target.value }, () => {
      this.fetchData();
    });
  }

  render() {
    return (
      <Box sx={{ width: '100%', maxWidth: 500, margin: 'auto', padding: 4 }}>
        <Typography variant="h3" component="div" gutterBottom>
          Week Progress
        </Typography>
        {this.state.sign ?
          <div>
            <Box sx={{ minWidth: 120, marginBottom: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Pick the calendar</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={this.state.calendar}
                  label="Pick the calendar"
                  onChange={(event) => this.handleCalendarChange(event)}
                >
                  {this.state.calendars.map((c: gapi.client.calendar.Calendar) =>
                    <MenuItem value={c.id}>{c.summary}</MenuItem>
                  )}
                </Select>
                <Box marginBottom={2}></Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Pick any date"
                    value={this.state.baseDate}
                    onChange={(date: any) => {
                      this.setState({ baseDate: new Date(date) });
                    }}
                    renderInput={(params: any) => <TextField {...params} />}
                  />
                </LocalizationProvider>

              </FormControl>
            </Box>
            <Card>
              <CardHeader
                action={
                  <IconButton aria-label="settings" onClick={() => this.fetchData()}>
                    <Refresh />
                  </IconButton>
                }
                title="Timesheet"
                subheader={"Week starting on " + startOfWeek(this.state.baseDate).toLocaleDateString("en-us")}
              />
              <CardContent>
                <Typography variant="body2">
                  Planned this week: {this.state.loading ? "-" : this.state.plannedThisWeek / 60} hours
                  <br />
                  So far: {this.state.loading ? "-" : this.state.doneThisWeek / 60} hours
                </Typography>
              </CardContent>
              <CardActions>
              <Button onClick={() => this.setPreviousWeek()}>Previous</Button>
              <Button onClick={() => this.setCurrentWeek()}>Current</Button>
              <Button onClick={() => this.setNextWeek()}>Next</Button>
              </CardActions>
            </Card>
          </div>
          :
          <Button variant="contained" onClick={() => this.signIn()}>
            Sign in with Google</Button>
        }
        <Typography variant="caption" component="div" paddingTop={4} gutterBottom>
          Hosted (code + bundle) on <Link href="https://github.com/pierremtb/week-progress">GitHub</Link> 💛. 
          <br />
          Copyright © 2021 <Link href="https://pierrejacquier.com">Pierre Jacquier</Link>.
        </Typography>
      </Box>
    );
  }
}