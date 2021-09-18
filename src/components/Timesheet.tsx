import { Refresh } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, IconButton, Typography } from "@mui/material";
import { addDays, isSameDay, startOfWeek } from "date-fns";
import { Day } from "./Day";

type TimesheetProps = {
    loading: boolean;
    baseDate: Date;
    doneThisWeek: number;
    plannedThisWeek: number;
    onRefresh: () => void;
    onPrevious: () => void;
    onCurrent: () => void;
    onNext: () => void;
};

export function Timesheet(props: TimesheetProps) {
  const today = new Date();
  const weekDays: Date[] = [];
  const daysInWeek = 7;
  for (let weekDayIdx = 0; weekDayIdx < daysInWeek; weekDayIdx++) {
    weekDays.push(addDays(props.baseDate, weekDayIdx));
  }
  return (
            <Card>
              <CardHeader
                action={
                  <IconButton aria-label="settings" onClick={() => props.onRefresh()}>
                    <Refresh />
                  </IconButton>
                }
                title="Timesheet"
                // subheader={"Week starting on " + startOfWeek(props.baseDate).toLocaleDateString("en-us")}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    {weekDays.map(d => 
                      <Grid item xs>
                        <Day date={d} selected={isSameDay(d, today)} />
                      </Grid>)
                    }
                  </Grid>
                </Box>
                <Box marginTop={2}>
                  <Typography variant="body1">
                    Total
                  </Typography>
                  <Typography variant="body2">
                    Planned this week: {props.loading ? "-" : props.plannedThisWeek / 60} hours
                    <br />
                    So far: {props.loading ? "-" : props.doneThisWeek / 60} hours
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
              <Button onClick={() => props.onPrevious()}>Previous</Button>
              <Button onClick={() => props.onCurrent()}>Current</Button>
              <Button onClick={() => props.onNext()}>Next</Button>
              </CardActions>
            </Card>
    );
}