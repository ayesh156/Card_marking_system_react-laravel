import { useState, useEffect, useCallback } from "react";
import {Menu, MenuItem, ProSidebar} from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListIcon from '@mui/icons-material/List';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import "react-toastify/dist/ReactToastify.css";
import "react-pro-sidebar/dist/css/styles.css";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();

  useEffect(() => {
    // Check if the current location pathname matches the 'to' prop
    if (location.pathname === to) {
      setSelected(title);
    }
  }, [location, to, setSelected, title]);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ onLogin }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[900]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      {/*<ToastContainer />*/}
      <ProSidebar width="220px" image="../../assets/bg.png" collapsed={isCollapsed} >
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="end"
                alignItems="center"
              >
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="5px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  width="100px"
                  height="100px"
                  src={"../../assets/Zynergy.jpg"}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                    ZYNERGY
                  {/*{initialValues.first_name === "" ? "Name" : initialValues.first_name}*/}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                    zynergyedu@gmail.com
                {/*{U_EMAIL}*/}
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              ></Box>
            </Box>
          )}

          {/* MENU ITEMS */}

          <Box
            paddingLeft={isCollapsed ? undefined : "13%"}
          >
            <Item
              title="Logout"
              to="/"
              icon={<ExitToAppIcon />}
              selected={selected}
              setSelected={setSelected}
            />
              <Item
                  title="Classes"
                  to="/"
                  icon={<ListIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />
          </Box>

          <Box mb="10px" paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[100]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed ? "Grades" : "Grade..."}
            </Typography>
            <Item
              title="Primary"
              to="/primary"
              icon={<RadioButtonCheckedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
              <Item
                  title="Grade1"
                  to="/grade1"
                  icon={<RadioButtonCheckedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />

              <Item
                  title="Grade2"
                  to="/grade2"
                  icon={<RadioButtonCheckedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />

              <Item
                  title="Grade3"
                  to="/grade3"
                  icon={<RadioButtonCheckedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />

              <Item
                  title="Grade4"
                  to="/grade4"
                  icon={<RadioButtonCheckedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />

              <Item
                  title="Grade5"
                  to="/grade5"
                  icon={<RadioButtonCheckedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />

              <Item
                  title="Grade6"
                  to="/grade6"
                  icon={<RadioButtonCheckedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />

              <Item
                  title="Grade7"
                  to="/grade7"
                  icon={<RadioButtonCheckedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />

              <Item
                  title="Grade8"
                  to="/grade8"
                  icon={<RadioButtonCheckedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />

              <Item
                  title="Grade9"
                  to="/grade9"
                  icon={<RadioButtonCheckedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />

              <Item
                  title="Grade10"
                  to="/grade10"
                  icon={<RadioButtonCheckedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />

              <Item
                  title="Grade11"
                  to="/grade11"
                  icon={<RadioButtonCheckedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />

              <Typography
                  variant="h6"
                  color={colors.grey[100]}
                  sx={{ m: "15px 0 5px 20px" }}
              >
                  Others
              </Typography>
              <Item
                  title="Message"
                  to="/message"
                  icon={<ChatOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />
              <Item
                  title="Settings"
                  to="/settings"
                  icon={<SettingsOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />
              <Item
                  title="History"
                  to="/history"
                  icon={<HistoryOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
              />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
