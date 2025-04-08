import { useState, useEffect, useCallback } from "react";
import {
    Box,
    TextField,
    useTheme,
    Typography,
    Button,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    Radio
} from "@mui/material";
import dayjs from "dayjs";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation, useNavigate } from "react-router-dom";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { tokens } from "../theme.js";
import SaveIcon from "@mui/icons-material/Save";
import * as yup from "yup";;
import Loader from "../components/Loader.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import axiosClient from "../../axios-client.js";
import ToastNotification from "../components/ToastNotification.jsx";
import CircularProgress, {
    circularProgressClasses,
  } from '@mui/material/CircularProgress';
import { student } from "../data/mockData.js";
  

const phoneRegExp = /^[0-9]{10}$/; // Adjusted for 10-digit phone numbers

const customerSchema = yup.object().shape({
    sno: yup
        .string()
        .required("Student number is required")
        .max(20, "Student number must not exceed 20 characters"),
    name: yup
        .string()
        .required("Name is required")
        .max(100, "Name must not exceed 100 characters"),
    gWhatsapp: yup
        .string()
        .required("Guardian's WhatsApp is required")
        .matches(phoneRegExp, "Guardian's WhatsApp must be a valid 10-digit number"),
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

const New_Customer = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:800px)");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false); // Track loading state
    const [initialValuesSet, setInitialValuesSet] = useState(true);
    const navigate = useNavigate();
    const location = useLocation(); // Access the passed state
    const [initialFormValues, setInitialFormValues] = useState({
        sno: "",
        name: "",
        dob: null,
        address1: "",
        address2: "",
        school: "",
        gName: "",
        gMobile: "",
        gWhatsapp: "",
        gender: "female",
    });
    // Extract the grade or primary from the URL
    const [pageTitle, setPageTitle] = useState("");

    const themeMode = theme.palette.mode === "dark" ? "dark" : "light";

    const childId = location.state?.child; // Get the child_id from the state

    // Determine if this is an update or a new customer
    const isUpdate = Boolean(childId);

    useEffect(() => {
        const pathName = location.pathname.split("/")[1]; // Get the part after "/"
        if (pathName === "primary") {
            setPageTitle(isUpdate ? "Update Primary Student" : "New Primary Student");
        } else if (/^grade\d+$/i.test(pathName)) {
            const gradeNumber = pathName.replace("grade", ""); // Extract the grade number
            setPageTitle(isUpdate ? `Grade ${gradeNumber} Update Student` : `Grade ${gradeNumber} New Student`);
        } else {
            setPageTitle(isUpdate ? "Update Student" : "New Student"); // Default title
        }
    }, [location, isUpdate]);

    useEffect(() => {
        if (childId) {

            // Fetch data from the mockdata for the given child_id
            setIsPageLoading(true);
            
            const studentData = student.find((item) => item.id === childId); // Find the object by id
            if (studentData) {
                setInitialFormValues({
                    sno: studentData.sno || "",
                    name: studentData.name || "",
                    dob: studentData.dob || null,
                    address1: studentData.address1 || "",
                    address2: studentData.address2 || "",
                    school: studentData.school || "",
                    gName: studentData.gName || "",
                    gMobile: studentData.gMobile || "",
                    gWhatsapp: studentData.gWhatsapp || "",
                    gender: studentData.gender || "female",
                });
                setIsPageLoading(false);
            } else {
                console.error("Student not found");
            }

            // Backend
            
            // axiosClient
            //     .get(`/children/${childId}`) // Replace with your backend endpoint                
            //     .then(({ data }) => {
            //         setInitialFormValues({
            //             sno: data.sno || "",
            //             name: data.name || "",
            //             dob: data.dob || null,
            //             address1: data.address1 || "",
            //             address2: data.address2 || "",
            //             school: data.school || "",
            //             gName: data.gName || "",
            //             gMobile: data.gMobile || "",
            //             gWhatsapp: data.gWhatsapp || "",
            //             gender: data.gender || "female",
            //         });
            //         console.log(data);
            //     })
            //     .catch((error) => {
            //         ToastNotification("Failed to fetch student data", "error", theme.palette.mode);
            //         console.error("Error fetching student data:", error);
            //     })
            //     .finally(() => {
            //         setIsPageLoading(false);
            //     });
        }
    }, [childId]);
   

    const handleFormSubmit = async (values, { resetForm }) => {
        setIsLoading(true);
        // console.log(dataToSend);
        try {
            if (isUpdate) {
                // If updating, send a PUT request with the entire object
                await axiosClient.put(`/children/${childId}`, values).then(({ data }) => {
                    ToastNotification(data.message,"success", themeMode);
                });
            } else {
                // If creating, send a POST request
                await axiosClient.post("/children", values).then(({ data }) => {
                    ToastNotification(data.message,"success", themeMode);
                    resetForm();
                });
            }
        } catch (err) {
            const response = err.response;
    
            if (response && response.data && response.data.message) {
                // Show error message from API response
                ToastNotification(response.data.message, "error", themeMode);
            } else {
                // Fallback error message
                ToastNotification("An unexpected error occurred!", "error", themeMode);
            }
        } finally {
            setIsLoading(false);
        }
    };

     // Show loader while data is being fetched
    
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

    if (!initialValuesSet) {
        return <Loader />;
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
                    {pageTitle}
                </Typography>
            </Button>
            <Formik
                initialValues={initialFormValues}
                enableReinitialize
                validationSchema={customerSchema}
                onSubmit={handleFormSubmit}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm, isValid }) => (
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
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Student No"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                name="sno"
                                error={touched.sno && Boolean(errors.sno)}
                                helperText={touched.sno && errors.sno}
                                value={values.sno}
                                disabled={isUpdate}
                                sx={{
                                    gridColumn: "span 4",
                                    "& .MuiInputBase-root": {
                                        backgroundColor: colors.primary[400],
                                    },
                                    "& .MuiInputBase-root.Mui-disabled": {
                                        backgroundColor: colors.primary[400], // Change the background color when disabled
                                        color: colors.grey[100], // Optional: Change the text color when disabled
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
                                label="Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                name="name"
                                value={values.name}
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
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
                            <Box sx={{
                                display: "flex", gap: "20px", marginTop: "10px", gridColumn: "span 4",
                                width: "100%",      // Ensure it takes full width up to the max width
                                flexWrap: "wrap",
                                // Media query for small screens
                                "@media (max-width: 1150px)": {
                                    flexDirection: "column", // Stack items vertically
                                    gap: "10px", // Reduce gap between elements on small screens
                                },
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    flex: 1,
                                    maxWidth: "50%",
                                    "@media (max-width: 1150px)": {
                                        maxWidth: "100%",
                                    }
                                }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={["DatePicker"]}>
                                            <DatePicker
                                                value={values.dob ? dayjs(values.dob) : null} // Convert Formik's string value to a Dayjs object
                                                onChange={(newValue) => {
                                                    handleChange({
                                                        target: {
                                                            name: "dob",
                                                            value: newValue ? newValue.format("YYYY-MM-DD") : "", // Convert Dayjs object to string
                                                        },
                                                    });
                                                }}
                                                label="Date of Birth"
                                                format="YYYY-MM-DD"
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        variant: "filled",
                                                        name: "dob",
                                                        onBlur: handleBlur,
                                                        sx: {
                                                            minWidth: "600px",
                                                            gridColumn: "span 4", // This line applies the grid styling
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
                                                        },
                                                    },
                                                }}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Box>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "30px",
                                    flex: 1,
                                    maxWidth: "50%",
                                    "@media (max-width: 1150px)": {
                                        maxWidth: "100%",
                                        mt: "20px"
                                    },
                                    "@media (max-width: 767px)": {
                                        gap: "10px",
                                    }
                                }}>
                                    <FormLabel>Gender : </FormLabel>
                                    <RadioGroup
                                        row
                                        name="gender"
                                        onChange={handleChange}
                                        value={values.gender}
                                        sx={{
                                            display: "flex", gap: "10px", justifyContent: "space-between", "@media (max-width: 767px)": {
                                                gap: "0px",
                                            }
                                        }}
                                    >
                                        <FormControlLabel value="female" control={<Radio sx={{
                                            color: "white",
                                            "&.Mui-checked": { color: "white" },
                                        }} />} label="Female" />
                                        <FormControlLabel value="male" control={<Radio sx={{
                                            color: "white",
                                            "&.Mui-checked": { color: "white" },
                                        }} />} label="Male" />
                                    </RadioGroup>
                                </Box>
                            </Box>
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Address line 1"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.address1}
                                name="address1"
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
                                label="Address line 2"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.address2}
                                name="address2"
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
                                label="School"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                name="school"
                                value={values.school}
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
                                label="Guardian’s Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                name="gName"
                                value={values.gName}
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

                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    gridColumn: "span 4",
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Guardian’s Mobile"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    name="gMobile"
                                    value={values.gMobile}
                                    sx={{
                                        gridColumn: "span 2",
                                        "@media (max-width: 1150px)": {
                                            gridColumn: "span 4",// Reduce gap between elements on small screens
                                        },
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
                                    label="Guardian’s Whatsapp"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.gWhatsapp}
                                    error={touched.gWhatsapp && Boolean(errors.gWhatsapp)}
                                    helperText={touched.gWhatsapp && errors.gWhatsapp}
                                    name="gWhatsapp"
                                    sx={{
                                        gridColumn: "span 2",
                                        "@media (max-width: 1150px)": {
                                            gridColumn: "span 4",// Reduce gap between elements on small screens
                                        },
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
                                    backgroundColor: isUpdate ? colors.primary[700] : colors.blueAccent[700],
                                    "&:hover": {
                                        backgroundColor: isUpdate ? colors.primary[600] : colors.blueAccent[600],
                                    },
                                    width: "150px", // Fixed width for larger screens
                                    justifySelf: "flex-end", // Right align the button
                                    "@media (max-width: 767px)": {
                                        width: "100%", // Full width for screens smaller than 767px
                                        justifySelf: "stretch", // Ensure the button stretches to full width
                                    },
                                }}
                            >
                                {isUpdate ? "Update" : "Save"}
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

export default New_Customer;
