import { useState, useEffect } from "react";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {Checkbox, useTheme, Box, Button, IconButton, InputBase, Typography, TextField} from "@mui/material";
import { tokens } from "../theme";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {toast, ToastContainer} from "react-toastify";
import axiosClient from "../../axios-client.js";
import {Link} from "react-router-dom";
import Header from "../components/Header.jsx";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';

const GradePage = () => {
    const [children, setChildren] = useState([]); // List of children
    const [weeks, setWeeks] = useState({}); // Stores selected weeks
    const [paidStatus, setPaidStatus] = useState({}); // Stores paid status separately
    const [loading, setLoading] = useState(true); // Loading state
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [sendBtnLoading, setSendBtnLoading] = useState(false);

    // Fetch children data
    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const response = await axiosClient.get("/children");
                setChildren(response.data);
            } catch (error) {
                toast.error(`Error fetching children: ${error}`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: theme.palette.mode === "dark" ? "dark" : "light",
                });
                console.error("Error fetching children:", error);
            }
        };

        fetchChildren();
    }, []);

    // Fetch child reports when children data is available
    useEffect(() => {
        if (children.length === 0) return; // Ensure children data is available

        const fetchReports = async () => {
            try {
                const newWeeks = {}; // Temporary object for weeks
                const newPaidStatus = {}; // Temporary object for paid status

                for (const child of children) {
                    const response = await axiosClient.get(`/child_reports/${child.id}`);

                    if (response.data) {
                        newWeeks[child.id] = {
                            week1: response.data.week1 || false,
                            week2: response.data.week2 || false,
                            week3: response.data.week3 || false,
                            week4: response.data.week4 || false,
                            week5: response.data.week5 || false,
                        };
                        newPaidStatus[child.id] = response.data.paid || false;
                    }
                }

                setWeeks(newWeeks); // Update weeks state
                setPaidStatus(newPaidStatus); // Update paid state
                setLoading(false);
            } catch (error) {
                toast.error(`Error fetching reports: ${error}`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: theme.palette.mode === "dark" ? "dark" : "light",
                });
                console.error("Error fetching reports:", error);
                setLoading(false);
            }
        };

        fetchReports();
    }, [children]);

    // Handle checkbox change for weeks (Auto-send update)
    const handleWeekCheckboxChange = async (childId, week) => {
        const isUnchecked = weeks[childId]?.[week]; // Check if the current state is checked
        const updatedWeeks = {
            ...weeks[childId],
            [week]: !weeks[childId]?.[week], // Toggle value
        };

        setWeeks(prevWeeks => ({
            ...prevWeeks,
            [childId]: updatedWeeks,
        }));

        setLoading(true);

        // Send updated data to backend
        try {

            await axiosClient.post("/save_report", {
                child_id: childId,
                weeks: updatedWeeks,
            });

            // Show toast notification **only when unchecked**
            if (isUnchecked) {
                toast.warning(`No. ${childId} Week ${week.replace("week", "")} unchecked!`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: theme.palette.mode === "dark" ? "dark" : "light",
                });
            }

            setLoading(false);
        } catch (error) {
            toast.error(`Error updating week report: ${error}`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: theme.palette.mode === "dark" ? "dark" : "light",
            });
            console.error("Error updating week report:", error);
            setLoading(false);
        }
    };

    // Handle checkbox change for paid status (Auto-send update)
    const handlePaidCheckboxChange = async (childId) => {
        const isUnchecked = paidStatus[childId]; // Check if the current state is checked
        const updatedPaidStatus = !isUnchecked;

        setPaidStatus(prevPaidStatus => ({
            ...prevPaidStatus,
            [childId]: updatedPaidStatus,
        }));

        setLoading(true);

        // Send updated paid status to backend
        try {
            await axiosClient.post("/update_paid_status", {
                child_id: childId,
                paid: updatedPaidStatus,
            });

            // Show different toasts based on check/uncheck action
            if (isUnchecked) {
                toast.warning(`No. ${childId} Paid status unchecked!`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: theme.palette.mode === "dark" ? "dark" : "light",
                });
            } else {
                toast.success(`No. ${childId} Paid status checked!`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: theme.palette.mode === "dark" ? "dark" : "light",
                });
            }

            setLoading(false);
        } catch (error) {
            toast.error(`Error updating paid status: ${error}`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: theme.palette.mode === "dark" ? "dark" : "light",
            });
            console.error("Error updating paid status:", error);
            setLoading(true);
        }
    };


    // Define columns for DataGrid
    const columns = [
        {
            field: "id",
            headerName: "No.",
        },
        {
            field: "name",
            headerName: "Customer",
            flex: 1,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
                <Button  className="name-column--cell" style={{textTransform:"capitalize", color: "#2ECC71"}}>
                    {params.value}
                </Button>
            )
        },
        { field: "number", headerName: "Contact", flex: 1 },
        {
            field: "week1",
            headerName: "Week 1",
            flex: 1,
            renderCell: (params) => (
                <Checkbox
                    checked={Boolean(weeks[params.row.id]?.week1)}
                    onChange={() => handleWeekCheckboxChange(params.row.id, "week1")}
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
            field: "week2",
            headerName: "Week 2",
            flex: 1,
            renderCell: (params) => (
                <Checkbox
                    checked={Boolean(weeks[params.row.id]?.week2)}
                    onChange={() => handleWeekCheckboxChange(params.row.id, "week2")}
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
            field: "week3",
            headerName: "Week 3",
            flex: 1,
            renderCell: (params) => (
                <Checkbox
                    checked={Boolean(weeks[params.row.id]?.week3)}
                    onChange={() => handleWeekCheckboxChange(params.row.id, "week3")}
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
            field: "week4",
            headerName: "Week 4",
            flex: 1,
            renderCell: (params) => (
                <Checkbox
                    checked={Boolean(weeks[params.row.id]?.week4)}
                    onChange={() => handleWeekCheckboxChange(params.row.id, "week4")}
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
            field: "week5",
            headerName: "Week 5",
            flex: 1,
            renderCell: (params) => (
                <Checkbox
                    checked={Boolean(weeks[params.row.id]?.week5)}
                    onChange={() => handleWeekCheckboxChange(params.row.id, "week5")}
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
            flex: 1,
            renderCell: (params) => (
                <Checkbox
                    checked={Boolean(paidStatus[params.row.id])}
                    onChange={() => handlePaidCheckboxChange(params.row.id)}
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
            flex: 1,
            renderCell: () => (
                <IconButton sx={{ color: "#E74C3C" }}>
                    <DeleteOutlineIcon />
                </IconButton>
            ),
        }
    ];

    return (
        <Box m="20px">
            <Box
                sx={{ display: "flex", justifyContent: "space-between", gap: "100px" }}
            >
                <Header
                    title="Grade 1"
                    subtitle="Effortlessly manage grades with our intuitive interface."
                />
                <Link to={"/invoices/create-student"}>
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
                        }}
                    >
                        Create new student
                    </Button>
                </Link>
            </Box>
            <Box
                sx={{ display: "flex", justifyContent: "space-between", gap: "100px" }}
            >
                <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{ mb: "5px" }}
                    textTransform={"capitalize"}
                >
                    2025 March
                </Typography>
                <Box
                    display="flex"
                    backgroundColor={colors.primary[400]}
                    borderRadius="3px"
                >
                    <InputBase
                        sx={{
                            ml: 2,
                            flex: 1,
                            color: colors.grey[100],
                            p: 1.5,
                            fontSize: 16,
                            fontWeight: "500",
                            minWidth: 400
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
                rows={children}
                columns={columns}
                loading={loading}
                slots={{ toolbar: GridToolbar }}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                slotProps={{
                    loadingOverlay: {
                        variant: 'linear-progress',
                        noRowsVariant: 'linear-progress',
                        sx: {
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: `${colors.primary[800]}`,// Change progress bar color
                            },
                            '& .MuiLinearProgress-root': {
                                backgroundColor: `${colors.grey[100]}`, // Change track (background) color
                            },
                        },
                    },

                }}
            />
            </Box>
            <Box
                sx={{ display: "flex", justifyContent: "space-between", gap: "50px", mt: 5 }}
            >
                <TextField
                    label="Invoice Notes"
                    multiline
                    rows={5}
                    fullWidth
                    color="secondary"
                    sx={{ width: "60%", backgroundColor:colors.primary[400]  }}
                />
                <Box
                    sx={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexDirection: "column", gap: 3 }}
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
