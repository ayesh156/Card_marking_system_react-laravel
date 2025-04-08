import { Box, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme.js";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isSmallScreen = useMediaQuery("(max-width:768px)");
  const [selectedClass, setSelectedClass] = useState(null);

  // Retrieve selected class from localStorage
  useEffect(() => {
    const storedClass = localStorage.getItem("selectedClass");
    setSelectedClass(storedClass); // Set the selected class from localStorage
  }, []);

  // Map selectedClass to full class name
  const getClassName = (classCode) => {
    switch (classCode) {
      case "E":
        return "English";
      case "S":
        return "Scholarship";
      case "M":
        return "Mathematics";
      default:
        return null; // Return null if no matching class
    }
  };

  const className = getClassName(selectedClass);

  return (
    <Box
      display="flex"
      flexDirection={isSmallScreen ? "column" : "row"} // Column for mobile, row for desktop
      alignItems={isSmallScreen ? "center" : "flex-start"} // Center for mobile, left-align for desktop
      justifyContent="space-between"
      p={2}
    >
      {/* Selected Class Name */}
      {!isSmallScreen && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: colors.grey[100],
            textAlign: "left",
            wordWrap: "break-word",
            maxWidth: "300px", // Limit width for desktop
          }}
        >
          {className ? `${className} Class` : "No Class Selected"}
        </Typography>
      )}

      {/* ICONS */}
      <Box display="flex" gap={2} justifyContent="center" mb={isSmallScreen ? 2 : 0}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
        </IconButton>
        <Link to="/history" style={{ textDecoration: "none" }}>
          <IconButton>
            <HistoryOutlinedIcon />
          </IconButton>
        </Link>
        <Link to="/message" style={{ textDecoration: "none" }}>
          <IconButton>
            <ChatOutlinedIcon />
          </IconButton>
        </Link>
        <Link to="/settings" style={{ textDecoration: "none" }}>
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>
        </Link>
      </Box>

      {/* Selected Class Name for Mobile */}
      {isSmallScreen && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: colors.grey[100],
            textAlign: "center",
            wordWrap: "break-word",
            maxWidth: "100%", // Full width for mobile
          }}
        >
          {className ? `${className} Class` : "No Class Selected"}
        </Typography>
      )}
    </Box>
  );
};

export default Topbar;
