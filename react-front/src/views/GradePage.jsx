import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Checkbox, useTheme, Box, Button, IconButton, InputBase, Typography, TextField } from "@mui/material";
import { tokens } from "../theme";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { toast, ToastContainer } from "react-toastify";
import axiosClient from "../../axios-client.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import ToastNotification from "../components/ToastNotification.jsx";
import { data } from "../data/mockData.js";

const GradePage = () => {
    const [children, setChildren] = useState(data); // List of children
    const [loading, setLoading] = useState(false); // Loading state
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [sendBtnLoading, setSendBtnLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    const themeMode = theme.palette.mode === "dark" ? "dark" : "light";
    const [gradeTitle, setGradeTitle] = useState("Primary");
    const [currentDate, setCurrentDate] = useState("");


    // Set the header title based on the location path name
    useEffect(() => {
        const pathName = location.pathname.split("/")[1]; // Get the part after "/"
        if (pathName && /^grade\d+$/i.test(pathName)) {
            // If pathName starts with "grade" (case-insensitive) followed by a number, add a space
            const formattedTitle = pathName.replace(/grade(\d+)/i, "Grade $1");
            setGradeTitle(formattedTitle);
        } else {
            // Default behavior
            setGradeTitle(pathName.charAt(0).toUpperCase() + pathName.slice(1));
        }
    }, [location]);


    const fetchChildren = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get("/child_reports");
            // setChildren(response.data);
            // console.log(response.data);
        } catch (error) {
            ToastNotification(`Error fetching children: ${error}`, "error", themeMode);
            console.error("Error fetching children:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch children data
    useEffect(() => {
        const date = new Date();
        const options = { month: "long" };
        const month = date.toLocaleDateString("en-US", options);
        const year = date.getFullYear();
        setCurrentDate(`${year} ${month}`);

        fetchChildren();
    }, []);


    // Handle checkbox change for weeks (Auto-send update)
    const handleWeekCheckboxChange = async (childId, week) => {
        // Find the current state of the checkbox
        const isUnchecked = children.find((child) => child.child_id === childId)[week];

        // Retrieve the `sno` of the child
        const child = children.find((child) => child.child_id === childId);
        const sno = child?.sno || "Unknown"; // Fallback to "Unknown" if `sno` is not found

        // Update the `children` state locally
        const updatedChildren = children.map((child) => {
            if (child.child_id === childId) {
                return {
                    ...child,
                    [week]: !child[week], // Toggle the week value
                };
            }
            return child;
        });

        setChildren(updatedChildren); // Update the state to re-render the table

        setLoading(true);

        // Send updated data to the backend
        try {
            await axiosClient.post("/save_report", {
                child_id: childId,
                weeks: {
                    [week]: updatedChildren.find((child) => child.child_id === childId)[week],
                },
            });

            // Show warning toast only if the checkbox was unchecked
            if (isUnchecked) {
                ToastNotification(`No. ${sno} Week ${week.replace("week", "")} unchecked!`, "warning", themeMode);
            }

        } catch (error) {
            ToastNotification(`Error updating week report: ${error}`, "error", themeMode);
            console.error("Error updating week report:", error);

        } finally {
            setLoading(false);
        }
    };

    const getCurrentWeek = () => {
        const today = new Date(); // Current date: March 24, 2025
        // const today = new Date('2025-03-08');
        const dayOfMonth = today.getDate();
        const weekNumber = Math.ceil(dayOfMonth / 7);
        return Math.min(weekNumber, 5); // Cap at 5 weeks
    };

    const handleDelete = async (childId) => {
        if (!window.confirm("Are you sure you want to delete this record?")) {
            return; // Exit if the user cancels the confirmation
        }

        setLoading(true); // Show loading state
        try {
            // Send delete request to the backend
            await axiosClient.delete(`/children/${childId}`);
            ToastNotification("Record deleted successfully!", "success", themeMode);

            // Reload the table by refetching the data
            fetchChildren();
        } catch (error) {
            ToastNotification(`Error deleting record: ${error}`, "error", themeMode);
            console.error("Error deleting record:", error);
        } finally {
            setLoading(false); // Hide loading state
        }
    };


    const currentWeek = getCurrentWeek();

    // Handle checkbox change for paid status (Auto-send update)
    const handlePaidCheckboxChange = async (childId) => {
        // Find the current state of the `paid` checkbox
        const isUnchecked = children.find((child) => child.child_id === childId).paid;

        // Retrieve the `sno` of the child
        const child = children.find((child) => child.child_id === childId);
        const sno = child?.sno || "Unknown"; // Fallback to "Unknown" if `sno` is not found

        // Update the `children` state locally
        const updatedChildren = children.map((child) => {
            if (child.child_id === childId) {
                return {
                    ...child,
                    paid: !child.paid, // Toggle the paid value
                };
            }
            return child;
        });

        setChildren(updatedChildren); // Update the state to re-render the table

        setLoading(true);

        // Send updated paid status to the backend
        try {
            await axiosClient.post("/update_paid_status", {
                child_id: childId,
                paid: updatedChildren.find((child) => child.child_id === childId).paid,
            });

            // Show different toast notifications based on the action
            if (isUnchecked) {
                ToastNotification(`No. ${sno} Paid status unchecked!`, "warning", themeMode);
            } else {
                ToastNotification(`No. ${sno} Paid status checked!`, "success", themeMode);
            }

        } catch (error) {
            ToastNotification(`Error updating paid status: ${error}`, "error", themeMode);
            console.error("Error updating paid status:", error);

        } finally {
            setLoading(false);
        }
    };

    // Define columns for DataGrid
    const columns = [
        {
            field: "sno",
            headerName: "No.",
            flex: 0.5
        },
        {
            field: "child_name",
            headerName: "Student",
            flex: 1.2,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
                <Button
                    className="name-column--cell"
                    style={{
                        textTransform: "capitalize",
                        color: params.row.register ? "#2ECC71" : "#E74C3C", // Green if registered, red if not
                    }}
                    onClick={() => {
                        navigate(`/${gradeTitle.toLowerCase().replace(" ", "")}/student`, {
                            state: { child: params.row.child_id }, // Pass the selected child object as state
                        });
                    }}
                >
                    {params.value}
                </Button>
            )
        },
        { field: "gWhatsapp", headerName: "Contact", flex: 1 },
        {
            field: "week1",
            headerName: "Week 1",
            flex: 0.7,
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.week1}
                    onChange={() => handleWeekCheckboxChange(params.row.child_id, "week1")}
                    disabled={currentWeek > 1} // Disable if before current week
                    sx={{
                        color: `${colors.grey[100]}`,
                        "&.Mui-checked": { color: `${colors.grey[100]}` },
                        "&.Mui-disabled": { color: `${colors.grey[500]}` }, // Style for disabled state
                    }}
                />
            ),
        },
        {
            field: "week2",
            headerName: "Week 2",
            flex: 0.7,
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.week2}
                    onChange={() => handleWeekCheckboxChange(params.row.child_id, "week2")}
                    disabled={currentWeek > 2} // Disable if before current week
                    sx={{
                        color: `${colors.grey[100]}`,
                        "&.Mui-checked": { color: `${colors.grey[100]}` },
                        "&.Mui-disabled": { color: `${colors.grey[500]}` },
                    }}
                />
            ),
        },
        {
            field: "week3",
            headerName: "Week 3",
            flex: 0.7,
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.week3}
                    onChange={() => handleWeekCheckboxChange(params.row.child_id, "week3")}
                    disabled={currentWeek > 3} // Disable if before current week
                    sx={{
                        color: `${colors.grey[100]}`,
                        "&.Mui-checked": { color: `${colors.grey[100]}` },
                        "&.Mui-disabled": { color: `${colors.grey[500]}` },
                    }}
                />
            ),
        },
        {
            field: "week4",
            headerName: "Week 4",
            flex: 0.7,
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.week4}
                    onChange={() => handleWeekCheckboxChange(params.row.child_id, "week4")}
                    disabled={currentWeek > 4} // Disable if before current week
                    sx={{
                        color: `${colors.grey[100]}`,
                        "&.Mui-checked": { color: `${colors.grey[100]}` },
                        "&.Mui-disabled": { color: `${colors.grey[500]}` },
                    }}
                />
            ),
        },
        {
            field: "week5",
            headerName: "Week 5",
            flex: 0.7,
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.week5}
                    onChange={() => handleWeekCheckboxChange(params.row.child_id, "week5")}
                    sx={{
                        color: `${colors.grey[100]}`, // Unchecked color
                        "&.Mui-checked": {
                            color: `${colors.grey[100]}`, // Checked color
                        },
                    }}
                />
            ),
        },
        {
            field: "paid",
            headerName: "Paid",
            flex: 0.7,
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.paid}
                    onChange={() => handlePaidCheckboxChange(params.row.child_id)}
                    sx={{
                        color: "#F1C40F", // Unchecked color
                        "&.Mui-checked": {
                            color: "#e3bc22", // Checked color
                        },
                    }}
                />
            ),
        },
        {
            field: "action",
            headerName: "Action",
            flex: 0.5,
            renderCell: (params) => (
                <IconButton sx={{ color: "#E74C3C" }}
                    onClick={() => handleDelete(params.row.child_id)}>
                    <DeleteOutlineIcon />
                </IconButton>
            ),
        }
    ];

    return (
        <Box m="20px">
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "100px",
                    flexWrap: "wrap", // Ensures wrapping on smaller screens
                    "@media (max-width: 950px)": {
                        flexDirection: "column", // Stack elements on small screens
                        gap: "0", // Reduce gap for better spacing
                    },
                }}
            >
                <Header
                    title={gradeTitle}
                    subtitle="Effortlessly manage grades with our intuitive interface."
                />
                <Link
                    to={`/${gradeTitle.toLowerCase().replace(" ", "")}/student`} // Dynamically set the path
                    style={{ marginLeft: "auto" }}
                >
                    <Button
                        sx={{
                            textTransform: "none",
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "17px",
                            paddingX: "25px",
                            height: "50px",
                            fontWeight: "500",
                            "&:hover": {
                                backgroundColor: colors.blueAccent[800],
                            },
                            "@media (max-width: 767px)": {
                                fontSize: "14px",
                                paddingX: "20px",
                                height: "40px",
                            },
                        }}
                    >
                        Register new student
                    </Button>
                </Link>
            </Box>
            <Box
                sx={{
                    display: "flex", justifyContent: "space-between", gap: "100px",
                    "@media (max-width: 997px)": {
                        flexDirection: "column", // Stack elements on small screens
                        gap: "10px", // Reduce gap for better spacing
                        mt: "20px",
                    },
                }}
            >
                <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{
                        mb: "5px", "@media (max-width: 767px)": {
                            fontSize: "24px",
                        },
                    }}
                    textTransform={"capitalize"}
                >
                    {currentDate}
                </Typography>
                <Box
                    display="flex"
                    backgroundColor={colors.primary[400]}
                    borderRadius="3px"
                    sx={{
                        "@media (max-width: 767px)": {
                            maxWidth: 400,
                            ml: "auto",
                        },
                    }}
                >
                    <InputBase
                        sx={{
                            ml: 2,
                            flex: 1,
                            color: colors.grey[100],
                            p: 1.5,
                            fontSize: 16,
                            fontWeight: "500",
                            minWidth: 400,
                            "@media (max-width: 767px)": {
                                maxWidth: 350,
                                minWidth: 0,
                                fontSize: "14px",
                                p: 1,
                            },
                        }}
                        placeholder="Search by No. or Name"
                    />

                    <IconButton type="button" sx={{ p: 1 }}>
                        <SearchIcon />
                    </IconButton>

                </Box>
            </Box>
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    overflow: "auto",
                    "& .MuiDataGrid-cell": {
                        borderBottom: `1px solid ${colors.grey[300]}`, // Change this to your desired color
                    },
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeader": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[500]} !important`,
                    },
                }}
            >
                <ToastContainer />
                <DataGrid
                    rows={children} // Use the formatted data
                    columns={columns}
                    loading={loading}
                    slotProps={{
                        loadingOverlay: {
                            variant: 'linear-progress',
                            noRowsVariant: 'linear-progress',
                            sx: {
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: colors.grey[100], // White for dark mode, black for light mode
                                },
                            },
                        },
                    }}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                    getRowId={(row) => row.child_id} // Use the `id` field as the unique identifier
                    sx={{
                        minWidth: '1000px',
                    }}
                />
            </Box>
            <Box
                sx={{
                    display: "flex", justifyContent: "space-between", gap: "50px", mt: 5, "@media (max-width: 767px)": {
                        flexDirection: "column",
                        gap: "5px",
                    },
                }}
            >
                <TextField
                    label="Invoice Notes"
                    multiline
                    rows={5}
                    fullWidth
                    color="secondary"
                    sx={{
                        width: "60%", backgroundColor: colors.primary[400], "@media (max-width: 767px)": {
                            width: "100%"
                        },
                    }}
                />
                <Box
                    sx={{
                        display: "flex", justifyContent: "space-between", alignItems: "end", flexDirection: "column", gap: 3, "@media (max-width: 767px)": {
                            gap: 1,
                            mt: 1,
                            width: "100%",
                            alignItems: "stretch",
                        },
                    }}
                >
                    <Button
                        endIcon={<RefreshOutlinedIcon />}
                        variant="contained"
                        type="submit"
                        sx={{
                            gridColumn: "span 4",
                            width: "120px",
                            textTransform: "capitalize",
                            color: colors.grey[100],
                            fontSize: "17px",
                            fontWeight: "500",
                            paddingY: "10px",
                            backgroundColor: colors.redAccent[600],
                            "&:hover": {
                                backgroundColor: colors.redAccent[500],
                            },
                            "@media (max-width: 767px)": {
                                width: "100%",
                                fontSize: "14px",
                                paddingX: "20px",
                                height: "40px",
                            },
                        }}
                    >
                        Clear
                    </Button>
                    <Button
                        loading={sendBtnLoading}
                        loadingPosition="end"
                        endIcon={<SendIcon />}
                        variant="contained"
                        type="submit"
                        sx={{
                            gridColumn: "span 4",
                            width: "150px",
                            textTransform: "capitalize",
                            color: colors.grey[100],
                            fontSize: "17px",
                            fontWeight: "500",
                            paddingY: "10px",
                            backgroundColor: colors.blueAccent[700],
                            "&:hover": {
                                backgroundColor: colors.blueAccent[600],
                            },
                            "@media (max-width: 767px)": {
                                width: "100%",
                                fontSize: "14px",
                                paddingX: "20px",
                                height: "40px",
                            },
                        }}
                    >
                        Send All
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default GradePage;
