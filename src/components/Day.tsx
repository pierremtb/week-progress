import { Box, Typography } from "@mui/material";
import { format } from "date-fns";

type DayProps = {
    date: Date;
    selected?: boolean;
}

export function Day(props: DayProps) {
    const selectedTextStyle = props.selected ? {
        color: 'primary.dark',
    } : {};
    const selectedStyle = props.selected ? {
        bgcolor: 'primary.dark',
        color: 'white',
    } : {};
    return (
        <Box sx={{ ...selectedTextStyle, textAlign: "center" }}>
            <Box>
                <Typography variant="body2">
                    {format(props.date, "EEE").toUpperCase()}
                </Typography>
            </Box>
            <Box sx={{ ...selectedStyle, borderRadius: "50%",
                   paddingTop: "2px", marginTop: "2px" }}
                   width={38} height={38} margin={"auto"}>
                <Typography variant="h6">
                    {format(props.date, "d")}
                </Typography>
            </Box>
        </Box>
    );
}