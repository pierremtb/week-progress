import { Box, Typography } from "@mui/material";
import { format } from "date-fns";

type DayProps = {
  date: Date;
  selected?: boolean;
  total: number;
}

export function Day(props: DayProps) {
  const selectedTextStyle = props.selected ? {
    color: 'primary.dark',
  } : {};
  const selectedStyle = props.selected ? {
    bgcolor: 'primary.dark',
    color: 'white',
  } : {};
  const secondsInMinute = 60;
  const hours = Math.floor(props.total / secondsInMinute);
  const minutes = props.total % secondsInMinute;
  const formatLength = 2;
  const formatFill = "0";
  const formattedHours = `${hours}`.padStart(formatLength, formatFill)
  const formattedMinutes = `${minutes}`.padStart(formatLength, formatFill)
  return (
    <Box sx={{ ...selectedTextStyle, textAlign: "center" }}>
      <Box>
        <Typography variant="body2">
          {format(props.date, "EEE").toUpperCase()}
        </Typography>
      </Box>
      <Box sx={{
        ...selectedStyle, borderRadius: "50%",
        paddingTop: "2px", marginTop: "2px"
      }}
        width={38} height={38} margin={"auto"}>
        <Typography variant="h6">
          {format(props.date, "d")}
        </Typography>
      </Box>
      <Box sx={{ marginTop: "2px" }}>
        <Typography variant="subtitle2">
          {formattedHours}:{formattedMinutes}
        </Typography>
      </Box>
    </Box>
  );
}