import { Typography, Box, useTheme, Paper } from "@mui/material";
import { tokens } from "../theme";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import ClassChart from "../components/ClassChart";
import StatsCard from "../components/StatsCard";
import RecentPayments from "../components/RecentPayments";
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined';
import Cookies from "js-cookie";
import axiosClient from "../../axios-client";

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentDate, setCurrentDate] = useState("");
    const [selectedClass, setSelectedClass] = useState(null);
    const [classCount, setClassCount] = useState(0);
    const [attendanceChartData, setAttendanceChartData] = useState([]);
    const [paymentData, setPaymentData] = useState([]);


    // Dashboard stats state
    const [dashboardStats, setDashboardStats] = useState({
        total_students: 0,
        paid_students: 0,
        paid_student_percentage: 0,
        attendance_last_week: 0,
        attendance_last_week_percentage: 0,
        paid_last_month: 0,
        paid_last_month_percentage: 0,
    });

    // Fetch number of classes and calculate revenue value
    const fetchClassCount = async () => {
        try {
            // Get number of classes
            const classesRes = await axiosClient.get('/classes-count');
            const classesCount = classesRes.data.count;
            // console.log(classesRes.data.count);

            // Calculate number of weeks from Jan 1 to today
            const startOfYear = new Date(new Date().getFullYear(), 0, 1);
            const today = new Date();
            const diffInDays = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
            const weeks = Math.ceil(diffInDays / 7);
            // console.log(weeks);

            // Calculate revenue value
            setClassCount(weeks * classesCount);
        } catch (e) {
            setClassCount(0);
        }
    };

    useEffect(() => {
        const date = new Date();
        const options = { month: "long" };
        const month = date.toLocaleDateString("en-US", options);
        const year = date.getFullYear();
        setCurrentDate(`${year} ${month}`);

        const storedClass = Cookies.get("selectedClass");
        setSelectedClass(storedClass || null);

        // Fetch dashboard stats from backend
        if (storedClass) {
            axiosClient
                .get(`/dashboard-stats?selectedClass=${storedClass}`)
                .then(res => setDashboardStats(res.data))
                .catch(() => { });
        }

        axiosClient.get('/monthly-attendance-stats')
            .then(res => {
                setAttendanceChartData(res.data);
                console.log(res.data);
            })
            .catch(() => { });

        fetchClassCount();

        axiosClient.get('/recent-payments')
            .then(res => {
                setPaymentData(res.data);
                console.log(res.data);
            })
            .catch(() => { });
    }, []);

    // Use backend data for stats cards
    const statsData = [
        {
            title: 'All Students',
            value: dashboardStats.total_students,
            subtext: '100%',
            icon: <PeopleIcon />,
            color: colors.greenAccent[400]
        },
        {
            title: 'Paid Students',
            value: dashboardStats.paid_students,
            subtext: `${dashboardStats.paid_student_percentage}%`,
            icon: <AttachMoneyIcon />,
            color: colors.greenAccent[400]
        },
        {
            title: 'Attendance Last Week',
            value: dashboardStats.attendance_last_week,
            subtext: `${dashboardStats.attendance_last_week_percentage}%`,
            icon: <RuleOutlinedIcon />,
            color: colors.greenAccent[400]
        },
        {
            title: 'Paid Last Month',
            value: dashboardStats.paid_last_month,
            subtext: `${dashboardStats.paid_last_month_percentage}%`,
            icon: <EventRepeatOutlinedIcon />,
            color: colors.greenAccent[400]
        },
    ];

    const classData = {
        value: classCount,
        chartData: attendanceChartData
    };




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
                    title="Dashboard"
                    subtitle="Welcome to your dashboard."
                />
                <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                    sx={{
                        mb: "5px",
                        textAlign: { xs: "right", md: "left" }, // Right on mobile, left on desktop
                        "@media (max-width: 767px)": {
                            fontSize: "24px",
                        },
                    }}
                    textTransform={"capitalize"}
                >
                    {currentDate}
                </Typography>
            </Box>

            {/* Stats Cards - Using Flexbox instead of Grid */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 2
                }}
            >
                {statsData.map((stat, index) => (
                    <Box
                        key={index}
                        sx={{
                            flexBasis: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 12px)' },
                            flexGrow: 1
                        }}
                    >
                        <StatsCard
                            title={stat.title}
                            value={stat.value}
                            subtext={stat.subtext}
                            icon={stat.icon}
                            color={stat.color}
                        />
                    </Box>
                ))}
            </Box>

            {/* Charts and Payments - Using Flexbox instead of Grid */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >
                {/* Class Chart */}
                {/* Class Chart */}
                <Box
                    sx={{
                        flexBasis: { xs: '100%', md: 'calc(66.666% - 8px)' },
                        flexGrow: 1,
                        overflowX: { xs: 'auto', md: 'hidden' },  // Enable horizontal scroll on mobile
                        WebkitOverflowScrolling: 'touch'  // Smooth scrolling on iOS
                    }}
                >
                    <Box sx={{ minWidth: { xs: '600px', md: '100%' } }}>  {/* Minimum width on mobile */}
                        <Paper
                            sx={{
                                p: 2,
                                height: '100%',
                                borderRadius: 1,
                                boxShadow: 3,
                                bgcolor: colors.primary[400]
                            }}
                        >
                            <ClassChart value={classData.value} chartData={classData.chartData} />
                        </Paper>
                    </Box>
                </Box>

                {/* Recent Payments */}
                <Box
                    sx={{
                        flexBasis: { xs: '100%', md: 'calc(33.333% - 8px)' },
                        flexGrow: 1
                    }}
                >
                    <Paper
                        sx={{
                            p: 2,
                            height: '100%',
                            bgcolor: colors.primary[400],
                            borderRadius: 1,
                            boxShadow: 3
                        }}
                    >
                        <RecentPayments payments={paymentData} />
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
