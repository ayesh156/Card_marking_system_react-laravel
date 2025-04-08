import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const History = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            minHeight="100vh" // Full viewport height
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
                textAlign: "center", // Optional: Center text alignment
            }}
        >
            <Typography
                variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                textTransform={"capitalize"}
            >
                History
            </Typography>

        </Box>
    );
};

export default History;
