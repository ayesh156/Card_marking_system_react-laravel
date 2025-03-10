import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme.js";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon  from "@mui/icons-material/DarkModeOutlined";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box display="flex" justifyContent="end" p={2}>
      {/* ICONS */}
      <Box display="flex" gap={1}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
        </IconButton>
        <Link to="/history" style={{ textDecoration: 'none' }}>
        <IconButton>
          <HistoryOutlinedIcon />
        </IconButton>
        </Link>
        <Link to="/message" style={{ textDecoration: 'none' }}>
        <IconButton>
          <ChatOutlinedIcon />
        </IconButton>
        </Link>
        <Link to="/settings" style={{ textDecoration: 'none' }}>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        </Link>
      </Box>
    </Box>
  );
};

export default Topbar;
