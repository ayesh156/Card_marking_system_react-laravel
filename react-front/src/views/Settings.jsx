import { Typography, Select, Box, useTheme, Button, TextField, useMediaQuery, IconButton, FormControl, InputLabel, MenuItem } from "@mui/material";
import { tokens } from "../theme";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Cookies from "js-cookie";
import axiosClient from "../../axios-client";
import { ToastContainer } from "react-toastify";
import ToastNotification from "../components/ToastNotification.jsx";
import CircularProgress, {
    circularProgressClasses,
} from '@mui/material/CircularProgress';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const userEmail = "zynergyedu@gmail.com";

const customerSchema = yup.object().shape({
    name: yup
        .string()
        .required("Name is required"),
    email: yup
        .string()
        .required("Email is required")
});

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

const Settings = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:800px)");
    const navigate = useNavigate();
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState("No selected file");
    const [selectedImage, setSelectedImage] = useState(null);
    const [initialFormValues, setInitialFormValues] = useState({
        name: "",
        email: "",
        password: "",
        beforePaymentTemplate: "",
        afterPaymentTemplate: "",
    });
    const [grades, setGrades] = useState([]); // Grades for the "Grade" dropdown
    const [selectedGrade, setSelectedGrade] = useState(""); // Initialize to empty string
    const [days, setDays] = useState([
        { value: 1, label: "Monday" },
        { value: 2, label: "Tuesday" },
        { value: 3, label: "Wednesday" },
        { value: 4, label: "Thursday" },
        { value: 5, label: "Friday" },
        { value: 6, label: "Saturday" },
        { value: 7, label: "Sunday" },
    ]); // Days of the week
    const [selectedDay, setSelectedDay] = useState(""); // Selected day
    const hasGradeSet = useRef(false); // Ref to track if grades have been set
    const [selectedClass, setSelectedClass] = useState(Cookies.get("selectedClass") || ""); // Selected class

    useEffect(() => {
        const gradeItems = getGradeItems();
        setGrades(gradeItems); // Update the grades state

        // Set the default selected grade to "Primary" (P) if available
        if (gradeItems.length > 0 && !hasGradeSet.current) {
            const defaultGrade = gradeItems.find((grade) => grade.value === "P");
            const initialGrade = defaultGrade ? defaultGrade.value : gradeItems[0].value;
            setSelectedGrade(initialGrade);
            hasGradeSet.current = true;

            // Fetch the day_id for "Primary" and the selected class
            if (selectedClass && initialGrade) {
                fetchDay(initialGrade);
            }
        } else if (gradeItems.length === 0) {
            setSelectedGrade(""); // Reset to empty string if no grades are available
            setSelectedDay(""); // Reset day as well
        }
    }, [selectedClass]);

    // Function to fetch day_id from backend
    const fetchDay = async (grade) => {
        try {
            const response = await axiosClient.post("/get-day", {
                grade: grade,
                class: selectedClass,
            });

            // Update the "Day" dropdown based on the response
            const dayId = response.data.day || "";
            if (dayId && days.some((day) => day.value === dayId)) {
                setSelectedDay(dayId); // Automatically select the correct day
            } else {
                setSelectedDay(""); // Reset the selected day if no match is found
            }
        } catch (error) {
            console.error("Error fetching day:", error);
            setSelectedDay(""); // Reset on error
        }
    };

    useEffect(() => {
        // Replace with the actual user's email (from auth or route)
        axiosClient.get(`/users/${userEmail}`)
            .then(res => {
                const user = res.data;
                setInitialFormValues({
                    name: user.name || "",
                    email: user.email || "",
                    password: "",
                    beforePaymentTemplate: user.Before_Payment_Template || "",
                    afterPaymentTemplate: user.After_Payment_Template || "",
                });
                if (user.image_path) {
                    setSelectedImage(`${API_BASE_URL}/storage/${user.image_path}`);
                }
            })
            .catch(err => {
                console.error("Failed to load user:", err);
            })
            .finally(() => {
                setIsPageLoading(false); // loading done
            });
    }, []);

    // Function to determine which grades to show based on selectedClass
    const getGradeItems = () => {
        if (selectedClass === "E") {
            // Show Primary to Grade 11
            return [
                { value: "P", label: "Primary" },
                ...Array.from({ length: 11 }, (_, i) => ({
                    value: `${i + 1}`,
                    label: `Grade ${i + 1}`,
                })),
            ];
        } else if (selectedClass === "S") {
            // Show Grade 3 to Grade 5
            return Array.from({ length: 3 }, (_, i) => ({
                value: `${i + 3}`,
                label: `Grade ${i + 3}`,
            }));
        } else if (selectedClass === "M") {
            // Show Grade 6 to Grade 11
            return Array.from({ length: 6 }, (_, i) => ({
                value: `${i + 6}`,
                label: `Grade ${i + 6}`,
            }));
        }
        return []; // Default to no grades if no class is selected
    };

    // Handle grade selection
    const handleGradeChange = async (selectedOption) => {
        setSelectedGrade(selectedOption); // Update the selected grade

        try {
            // Send the selected grade and class to the backend
            const response = await axiosClient.post("/get-day", {
                grade: selectedOption,
                class: selectedClass,
            });

            // Update the "Day" dropdown based on the response
            const dayId = response.data.day || "";
            if (dayId) {
                setSelectedDay(dayId); // Automatically select the correct day
            } else {
                setSelectedDay(""); // Reset the selected day if no match is found
            }
        } catch (error) {
            console.error("Error fetching day:", error);
            setSelectedDay(""); // Reset on error
        }
    };


    const handleFormSubmit = async (values) => {

        setIsLoading(true); // Set loading state to true

        // Construct the payload as a plain object
        const payload = {
            name: values.name,
            email: values.email,
            password: values.password, // Add password field
            beforePaymentTemplate: values.beforePaymentTemplate,
            afterPaymentTemplate: values.afterPaymentTemplate,
            status: true, // Default status
            mode: 'A', // Example mode
            image: selectedImage, // Include the image as a base64 string if needed
        };

        try {
            // Send the payload to the backend
            await axiosClient.put(`/users/${values.email}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error saving user:', error);
            ToastNotification("An error occurred while saving the user. Please try again.", "error", theme.palette.mode);
        }
        
        try {
            // Send the grade, class name, and day ID to the backend
            await axiosClient.post("/days", {
                grade: selectedGrade,
                class: selectedClass,
                day_id: selectedDay,
            });

            
        } catch (error) {
            console.error("Error saving or updating record:", error);
            ToastNotification("An error occurred while saving the data. Please try again.", "error", theme.palette.mode);
        } finally {
            setIsLoading(false); // Set loading state to false
        }

        ToastNotification("Setting Updated Successfully", "success", theme.palette.mode);
    };

    const selectImage = (event, setFieldValue) => {
        const file = event.currentTarget.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFieldValue("image", reader.result);
                setSelectedImage(reader.result);
                setFileName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

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
            <ToastContainer />
            <Button
                sx={{ display: "flex", alignItems: "center" }}
                color="inherit"
                onClick={() => {
                    navigate(-1);
                }}
            >
                <KeyboardArrowLeftOutlinedIcon sx={{ fontSize: "35px" }} />
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    textTransform={"capitalize"}
                    color={colors.grey[100]}
                >
                    Settings
                </Typography>
            </Button>
            <Formik
                initialValues={initialFormValues}
                enableReinitialize
                validationSchema={customerSchema}
                onSubmit={handleFormSubmit}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm, isValid }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                mt: 5,
                                gridColumn: "span 4",
                                marginX: isNonMobile ? "15vw" : undefined,
                            }}
                        >
                            <Box
                                sx={{
                                    gridColumn: "span 4",
                                    position: "relative",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {selectedImage ? (
                                    <IconButton
                                        sx={{ position: "absolute", top: -35, right: isNonMobile ? 35 : 0 }}
                                        onClick={() => {
                                            setFileName("No selected file");
                                            setSelectedImage(null);
                                        }}
                                    >
                                        <ClearIcon
                                            sx={{
                                                fontSize: "25px",
                                                color: colors.redAccent[500],
                                                fontWeight: "bold",
                                            }}
                                        />
                                    </IconButton>
                                ) : undefined}
                                <Box
                                    className="image-area"
                                    style={{
                                        border: `2px dashed ${colors.blueAccent[500]}`,
                                        width: isNonMobile ? "30vw" : "100vw",
                                    }}
                                    onClick={() => document.querySelector(".input-field").click()}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="input-field"
                                        hidden
                                        onChange={(event) => selectImage(event, setFieldValue)}
                                    />
                                    {selectedImage ? (
                                        <img src={selectedImage} height={230} alt={fileName} />
                                    ) : (
                                        <>
                                            <CloudUploadIcon
                                                sx={{ fontSize: "60px", color: colors.blueAccent[500] }}
                                            />
                                            <Typography
                                                variant="h5"
                                                sx={{ fontWeight: "bold" }}
                                                color={colors.grey[400]}
                                            >
                                                Browse logo to upload
                                            </Typography>
                                            <Typography
                                                sx={{ marginTop: "15px" }}
                                                variant="h6"
                                                color={colors.grey[400]}
                                            >
                                                Maximum file size : 5MB
                                            </Typography>
                                            <Typography variant="h6" color={colors.grey[400]}>
                                                JPG or PNG formats{" "}
                                            </Typography>
                                            <Typography variant="h6" color={colors.grey[400]}>
                                                Recommended size 225x225 pixels
                                            </Typography>
                                            {touched.image && errors.image && (
                                                <Typography variant="body2" color="error">
                                                    {errors.image}
                                                </Typography>
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Box>
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                                value={values.name}
                                name="name"
                                sx={{
                                    gridColumn: "span 4",
                                    "& .MuiInputBase-root": {
                                        backgroundColor: colors.primary[400],
                                    },
                                    "& .MuiInputBase-root.Mui-hovered": {
                                        backgroundColor: colors.primary[400],
                                    },
                                    "& .MuiInputBase-root.Mui-focused": {
                                        backgroundColor: colors.primary[400],
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: colors.primary[100],
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="email"
                                label="Email"
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                value={values.email}
                                sx={{
                                    gridColumn: "span 4",
                                    "& .MuiInputBase-root": {
                                        backgroundColor: colors.primary[400],
                                    },
                                    "& .MuiInputBase-root.Mui-hovered": {
                                        backgroundColor: colors.primary[400],
                                    },
                                    "& .MuiInputBase-root.Mui-focused": {
                                        backgroundColor: colors.primary[400],
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: colors.primary[100],
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Before Payment Template"
                                name="beforePaymentTemplate"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.beforePaymentTemplate}
                                sx={{
                                    gridColumn: "span 4",
                                    "& .MuiInputBase-root": {
                                        backgroundColor: colors.primary[400],
                                    },
                                    "& .MuiInputBase-root.Mui-hovered": {
                                        backgroundColor: colors.primary[400],
                                    },
                                    "& .MuiInputBase-root.Mui-focused": {
                                        backgroundColor: colors.primary[400],
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: colors.primary[100],
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="After Payment Template"
                                name="afterPaymentTemplate"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.afterPaymentTemplate}
                                sx={{
                                    gridColumn: "span 4",
                                    "& .MuiInputBase-root": {
                                        backgroundColor: colors.primary[400],
                                    },
                                    "& .MuiInputBase-root.Mui-hovered": {
                                        backgroundColor: colors.primary[400],
                                    },
                                    "& .MuiInputBase-root.Mui-focused": {
                                        backgroundColor: colors.primary[400],
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: colors.primary[100],
                                    },
                                }}
                            />
                            {/* Grade Dropdown */}
                            <Box
                                sx={{
                                    display: "flex",
                                    gridColumn: "span 4",
                                    justifyContent: "space-between",
                                    gap: "20px", // Add spacing between the selects
                                    "@media (max-width: 767px)": {
                                        flexDirection: "column", // Stack selects on smaller screens
                                        gap: 3,
                                    },
                                }}
                            >

                                {/* Grade Dropdown */}
                                <FormControl fullWidth variant="filled"
                                    sx={{
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
                                    }}>
                                    <InputLabel id="grade-select-label">Grade</InputLabel>
                                    <Select
                                        labelId="grade-select-label"
                                        id="grade-select"
                                        value={selectedGrade || ""}
                                        onChange={(event) => handleGradeChange(event.target.value)} // Handle grade change
                                    >
                                        {grades.map((grade, index) => (
                                            <MenuItem key={index} value={grade.value}>
                                                {grade.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Day Dropdown */}
                                <FormControl fullWidth variant="filled" sx={{
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
                                }}>
                                    <InputLabel id="day-select-label">Day</InputLabel>
                                    <Select
                                        labelId="day-select-label"
                                        id="day-select"
                                        value={selectedDay || ""} // Ensure value is a string
                                        onChange={(event) => setSelectedDay(event.target.value)} // Handle day change
                                    >
                                        {days.map((day, index) => (
                                            <MenuItem key={index} value={day.value || day}> {/* Ensure value is a string */}
                                                {day.label || day} {/* Ensure children is a string */}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Button
                                endIcon={<SaveIcon />}
                                variant="contained"
                                type="submit"
                                loading={isLoading}
                                sx={{
                                    gridColumn: "span 4",
                                    marginTop: "15px",
                                    textTransform: "capitalize",
                                    color: colors.grey[100],
                                    fontSize: "17px",
                                    fontWeight: "500",
                                    paddingY: "10px",
                                    backgroundColor: colors.blueAccent[700],
                                    "&:hover": {
                                        backgroundColor: colors.blueAccent[600],
                                    },
                                    width: "150px", // Fixed width for larger screens
                                    justifySelf: "flex-end", // Right align the button
                                    "@media (max-width: 767px)": {
                                        width: "100%", // Full width for screens smaller than 767px
                                        justifySelf: "stretch", // Ensure the button stretches to full width
                                    },
                                }}
                            >
                                Save
                            </Button>


                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

export default Settings;
