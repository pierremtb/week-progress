import { Refresh } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, IconButton, LinearProgress, Typography } from "@mui/material";
import { addDays, isSameDay } from "date-fns";
import { Day } from "./Day";

type TimesheetProps = {
  loading: boolean;
  baseDate: Date;
  doneThisWeek: number;
  plannedThisWeek: number;
  perDayTotals: number[];
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
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {weekDays.map((day, dayIdx) =>
              <Grid item xs>
                <Day date={day} total={props.perDayTotals[dayIdx]}
                  selected={isSameDay(day, today)} />
              </Grid>)
            }
          </Grid>
        </Box>
        <Box marginTop={2}>
          <Typography variant="body1">
            Progress
          </Typography>
          <Box marginY={1}>
            <LinearProgress
              variant={props.loading ? "indeterminate" : "determinate"}
              value={props.doneThisWeek / props.plannedThisWeek * 100} />
          </Box>
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