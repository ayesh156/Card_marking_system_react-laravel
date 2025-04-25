import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Checkbox, useTheme, Box, Button, IconButton, InputBase, MenuItem, TextField, FormControl, Select, InputLabel } from "@mui/material";
import { tokens } from "../theme";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ToastContainer } from "react-toastify";
import axiosClient from "../../axios-client.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import ToastNotification from "../components/ToastNotification.jsx";
import { data } from "../data/mockData.js";
import Cookies from "js-cookie";
import CircularProgress, {
    circularProgressClasses,
} from '@mui/material/CircularProgress';

// Custom Circular Progress
function FacebookCircularProgress(props) {
    return (
        <Box sx={{ position: "relative" }}>
            <CircularProgress
                variant="determinate"
                sx={(theme) => ({
                    color: theme.palette.grey[200],
                    ...(theme.palette.mode === "dark" && {
                        color: theme.palette.grey[800],
                    }),
                })}
                size={60}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={(theme) => ({
                    color: "#1a90ff",
                    animationDuration: "550ms",
                    position: "absolute",
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: "round",
                    },
                    ...(theme.palette.mode === "dark" && {
                        color: "#308fe8",
                    }),
                })}
                size={60}
                thickness={4}
                {...props}
            />
        </Box>
    );
}

const GradePage = () => {
    const [children, setChildren] = useState([]); // List of children
    const [filteredChildren, setFilteredChildren] = useState([]); // Filtered list for search
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const [selectedClass, setSelectedClass] = useState(null); // State to store selectedClass
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const themeMode = theme.palette.mode === "dark" ? "dark" : "light";
    const [gradeTitle, setGradeTitle] = useState("Primary");
    const [currentDate, setCurrentDate] = useState("");
    const [grade, setGrade] = useState(null);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [years, setYears] = useState([]); // State to store years
    const [months, setMonths] = useState([]);

    // Function to determine which grades to show based on selectedClass
    const getGradeItems = () => {
        if (selectedClass === "E") {
            // Show Primary to Grade 11
            return [
                { title: "Primary", value: "P" },
                ...Array.from({ length: 11 }, (_, i) => ({
                    title: `Grade ${i + 1}`,
                    value: `${i + 1}`,
                })),
            ];
        } else if (selectedClass === "S") {
            // Show Grade 3 to Grade 5
            return Array.from({ length: 3 }, (_, i) => ({
                title: `Grade ${i + 3}`,
                value: `${i + 3}`,
            }));
        } else if (selectedClass === "M") {
            // Show Grade 6 to Grade 11
            return Array.from({ length: 6 }, (_, i) => ({
                title: `Grade ${i + 6}`,
                value: `${i + 6}`,
            }));
        }
        return []; // Default to no grades if no class is selected
    };

    const fetchYearsAndMonths = async () => {
        try {
            // Fetch years
            const yearsResponse = await axiosClient.get('/years');
            const formattedYears = yearsResponse.data.map((year) => ({
                value: year.id, // Use the `id` as the value
                label: year.year, // Use the `year` for display
            }));
            setYears(formattedYears);

            // Fetch months
            const monthsResponse = await axiosClient.get('/months');
            const formattedMonths = monthsResponse.data.map((month) => ({
                value: month.id, // Use the `id` as the value
                name: month.name, // Use the `name` for display
            }));
            setMonths(formattedMonths);

            // Auto-select the current year and month
            const currentDate = new Date();
            setYear(currentDate.getFullYear().toString());
            setMonth((currentDate.getMonth() + 1).toString()); // Months are 0-indexed
        } catch (error) {
            console.error("Error fetching years and months:", error);
        } finally {
            setIsPageLoading(false); // Set loading to false after fetching
        }
    };


    // Fetch current date for display
    useEffect(() => {
        const date = new Date();
        const options = { month: "long" };
        const month = date.toLocaleDateString("en-US", options);
        const year = date.getFullYear();
        setCurrentDate(`${year} ${month}`);

        fetchYearsAndMonths();

        const storedClass = Cookies.get("selectedClass"); // Retrieve selectedClass from cookies
        setSelectedClass(storedClass || null); // Set it in state or default to null
    }, []);

    // Fetch children data whenever the grade value is updated
    useEffect(() => {
        if (grade && year && month) {
            fetchFilteredReports(); // Fetch reports when the grade changes
        }
    }, [grade, year, month]); // Trigger this effect whenever the grade changes


    // Handle search input change
    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter children based on search query
        const filtered = children.filter((child) =>
            child.sno.toString().toLowerCase().includes(query) ||
            child.child_name.toLowerCase().includes(query) ||
            child.gWhatsapp.toLowerCase().includes(query)
        );
        setFilteredChildren(filtered);
    };


    useEffect(() => {
        const gradeItems = getGradeItems();
        if (gradeItems.length > 0) {
            setGrade(gradeItems[0].value); // Auto-select the first value
        }
    }, [selectedClass]);

    const fetchFilteredReports = async () => {
        setLoading(true);

        try {
            const response = await axiosClient.get('/history', {
                params: {
                    grade,
                    year,
                    month,
                    class: selectedClass,
                },
            });


            // Filter the response data
            const filteredData = response.data.filter((child) => {
                const weeksTrueCount = [
                    child.week1,
                    child.week2,
                    child.week3,
                    child.week4,
                    child.week5,
                ].filter(Boolean).length; // Count the number of true weeks

                // Include the child only if:
                // - status is true, OR
                // - at least two week is true AND paid is true
                return (
                    child.status || (weeksTrueCount >= 2 || child.paid)
                );
            });

            // Update the state with the filtered data
            setChildren(filteredData);
            setFilteredChildren(filteredData);
        } catch (error) {
            ToastNotification(`Error fetching reports: ${error}`, "error", themeMode);
            console.error("Error fetching reports:", error);
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
                    sx={{
                        color: params.row.notpaid ? "#E74C3C" : "#F1C40F", // Red if notpaid is true, yellow otherwise
                        "&.Mui-checked": {
                            color: params.row.notpaid ? "#E74C3C" : "#e3bc22", // Red if notpaid is true, yellow otherwise
                        },
                    }}
                />
            ),
        },
    ];

      if (isPageLoading) {
                return (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100vh"
                    >
                        {/* Use the custom circular progress */}
                        <FacebookCircularProgress />
                    </Box>
                );
            }

    return (
        <Box m="20px">
            <Header
                title="History"
                subtitle="Effortlessly Navigate History with Our Intuitive Interface.."
            />

            <Box
                sx={{
                    display: "flex", justifyContent: "space-between", gap: "100px", mt: 4,
                    "@media (max-width: 1300px)": {
                        flexDirection: "column", // Stack elements on small screens
                        gap: "10px", // Reduce gap for better spacing
                        mt: "20px",
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "20px", // Add spacing between the selects
                        "@media (max-width: 767px)": {
                            flexDirection: "column", // Stack selects on smaller screens
                            gap: "10px",
                        },
                    }}
                >
                    {/* Grade Select */}
                    <FormControl
                        variant="filled"
                        sx={{
                            minWidth: 149,
                            "& .MuiInputBase-root": {
                                backgroundColor: colors.primary[400],
                            },
                            "& .MuiInputBase-root:hover": {
                                backgroundColor: colors.primary[400],
                            },
                            "& .MuiInputBase-root.Mui-focused": {
                                backgroundColor: colors.primary[400],
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                                color: colors.primary[100],
                            },
                        }}
                    >
                        <InputLabel id="grade-select-label">Grade</InputLabel>
                        <Select
                            labelId="grade-select-label"
                            id="grade-select"
                            value={grade || ""}
                            onChange={(e) => {
                                setGrade(e.target.value); // Update the grade state
                                fetchFilteredReports(); // Fetch filtered reports
                            }}
                        >
                            {getGradeItems().map((item) => (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Year Select */}
                    <FormControl
                        variant="filled"
                        sx={{
                            minWidth: 149,
                            "& .MuiInputBase-root": {
                                backgroundColor: colors.primary[400],
                            },
                            "& .MuiInputBase-root:hover": {
                                backgroundColor: colors.primary[400],
                            },
                            "& .MuiInputBase-root.Mui-focused": {
                                backgroundColor: colors.primary[400],
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                                color: colors.primary[100],
                            },
                        }}
                    >
                        <InputLabel id="year-select-label">Year</InputLabel>
                        <Select
                            labelId="year-select-label"
                            id="year-select"
                            value={year || ""}
                            onChange={(e) => {
                                setYear(e.target.value); // Update the year state
                                fetchFilteredReports(); // Fetch filtered reports
                            }}
                        >
                            {years.map((y) => (
                                <MenuItem key={y.value} value={y.label}>
                                    {y.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Month Select */}
                    <FormControl
                        variant="filled"
                        sx={{
                            minWidth: 149,
                            "& .MuiInputBase-root": {
                                backgroundColor: colors.primary[400],
                            },
                            "& .MuiInputBase-root:hover": {
                                backgroundColor: colors.primary[400],
                            },
                            "& .MuiInputBase-root.Mui-focused": {
                                backgroundColor: colors.primary[400],
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                                color: colors.primary[100],
                            },
                        }}
                    >
                        <InputLabel id="month-select-label">Month</InputLabel>
                        <Select
                            labelId="month-select-label"
                            id="month-select"
                            value={month || ""}
                            onChange={(e) => {
                                setMonth(e.target.value); // Update the month state
                                fetchFilteredReports(); // Fetch filtered reports
                            }}
                        >
                            {months.map((m) => (
                                <MenuItem key={m.value} value={m.value}>
                                    {m.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
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
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by No. or Name"
                    />

                    <IconButton
                        type="button"
                        sx={{ p: 2 }}
                        onClick={() => {
                            if (searchQuery) { // Only call the function if there is a value
                                setSearchQuery(""); // Clear the search query
                                setFilteredChildren(children); // Reset the filtered children to the full list
                            }
                        }}
                    >
                        {searchQuery ? <RefreshOutlinedIcon /> : <SearchIcon />} {/* Show Refresh icon if there's text */}
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
                    rows={filteredChildren} // Use the formatted data
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
                    getRowId={(row) => row.child_id}// Use the `id` field as the unique identifier
                    sx={{
                        minWidth: '1000px',
                    }}
                />
            </Box>

        </Box>
    );
};

export default GradePage;
