import { useState, useEffect, useCallback } from "react";
import { Box, TextField, useTheme, Typography, Button } from "@mui/material";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { tokens } from "../../theme";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import * as yup from "yup";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Loader from "../../components/Loader";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL, U_EMAIL } from "../../config";

const initialFormValues = {
  name: "",
  email: "",
  mobile: "",
  address1: "",
  address2: "",
  city: "",
  postal: "",
  province: "", // Make sure this matches the initial value of your Select component
  instructions: "",
  account: "",
  fax: "",
  telephone: "",
  website: "",
  notes: "",
};

const phoneRegExp = /^[0]{1}[1245678]{1}[01245678]{1}[0-9]{7}$/;

const customerSchema = yup.object().shape({
  name: yup.string().required("required"),
  mobile: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  telephone: yup.string().matches(phoneRegExp, 'Phone number is not valid')
});

const New_Customer = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:800px)");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState(1);
  const [initialValuesSet, setInitialValuesSet] = useState(false);
  const [toastDisplayed, setMsgDisplayed] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [isNameFieldEmpty, setNameFieldEmpty] = useState(true);

  const fetchProvince = useCallback(() => {
    axios
      .get(`${BASE_URL}/system-api/getProvinces`)
      .then(function (response) {
        if (response.data.status === 1) {
          setProvinces(response.data.province);
          setMsgDisplayed(true);
        } else {
          setToastMsg(response.data.message);
        }
      })
      .catch(function (error) {
        console.error("Error fetching customer data:", error);
        setToastMsg(error);
      })
      .finally(function () {
        setInitialValuesSet(true);
      });
  }, []);

  useEffect(() => {
    if (!initialValuesSet) {
      fetchProvince();
    }
  }, [initialValuesSet, fetchProvince]);

  useEffect(() => {
    if (initialValuesSet && !toastDisplayed && toastMsg) {
      setTimeout(() => {
        toast.error(toastMsg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: theme.palette.mode === "dark" ? "dark" : "light",
        });
        setMsgDisplayed(true);
      }, 1000);
    }
  }, [initialValuesSet, toastDisplayed, toastMsg, theme.palette.mode]);

  const saveCustomer = (values, { resetForm }) => {
    const updatedValues = {
      ...values,
      province: parseInt(selectedProvince), // Include selected province in the saved object
      user_email: U_EMAIL,
    };
    setIsLoading(true);

    axios
      .post(`${BASE_URL}/system-api/customer`, updatedValues)
      .then((response) => {
        // Handle successful response, if needed
        // console.log(response.data);
        if (response.data.status === 1) {
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: theme.palette.mode === "dark" ? "dark" : "light",
          });
        } else {
          setToastMsg(response.data.message);
        }
      })
      .catch((error) => {
        setToastMsg(error);
      })
      .finally(function () {
        resetForm();
        setSelectedProvince(1);
        setIsLoading(false);
      });

    if (toastMsg) {
      toast.error(toastMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme.palette.mode === "dark" ? "dark" : "light",
      });
    }
  };

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
          New Customer
        </Typography>
      </Button>
      <Formik
        onSubmit={saveCustomer} // Pass values to saveCustomer function
        initialValues={initialFormValues}
        validationSchema={customerSchema}
      >
        {({ values,errors, touched, handleBlur, handleChange, handleSubmit, resetForm, isValid }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                gridColumn: "span 4",
                marginX: isNonMobile ? "20vw" : undefined,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Contact
              </Typography>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={(event) => {
                  handleChange(event);
                  setNameFieldEmpty(event.target.value.trim() === ""); // Access value property before calling trim
                }}
                name="name"
                value={values.name}
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{
                  gridColumn: "span 4",
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary[100],
                  },
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                name="email"
                value={values.email}
                sx={{
                  gridColumn: "span 4",
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary[100],
                  },
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Mobile"
                onBlur={handleBlur}
                onChange={handleChange}
                name="mobile"
                value={values.mobile}
                error={!!touched.mobile && !!errors.mobile}
                helperText={touched.mobile && errors.mobile}
                sx={{
                  gridColumn: "span 4",
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary[100],
                  },
                }}
              />

              <Box sx={{ gridColumn: "span 4" }}>
                <Divider />
              </Box>

              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Billing
              </Typography>
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
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary[100],
                  },
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="City"
                onBlur={handleBlur}
                onChange={handleChange}
                name="city"
                value={values.city}
                sx={{
                  gridColumn: "span 4",
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary[100],
                  },
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Postal/Zip code"
                onBlur={handleBlur}
                onChange={handleChange}
                name="postal"
                value={values.postal}
                sx={{
                  gridColumn: "span 4",
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary[100],
                  },
                }}
              />
              <FormControl
                variant="filled"
                color="secondary"
                fullWidth
                sx={{
                  gridColumn: "span 4",
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary[100],
                  },
                }}
              >
                <InputLabel id="demo-select-small-label">Province</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={selectedProvince}
                  label="Province"
                  onChange={(e) => setSelectedProvince(e.target.value)}
                >
                  {provinces.map((province) => (
                    <MenuItem key={province.id} value={province.id}>
                      {province.name} Province
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                rows={7}
                multiline
                variant="filled"
                type="text"
                label="Delivery instructions"
                onBlur={handleBlur}
                onChange={handleChange}
                name="instructions"
                value={values.instructions}
                sx={{
                  gridColumn: "span 4",
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary[100],
                  },
                }}
              />
              <Box sx={{ gridColumn: "span 4" }}>
                <Divider />
              </Box>

              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Other
              </Typography>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Account number"
                onBlur={handleBlur}
                onChange={handleChange}
                name="account"
                value={values.account}
                sx={{
                  gridColumn: "span 4",
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary[100],
                  },
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Fax"
                onBlur={handleBlur}
                onChange={handleChange}
                name="fax"
                value={values.fax}
                sx={{
                  gridColumn: "span 4",
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary[100],
                  },
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Telephone"
                onBlur={handleBlur}
                onChange={handleChange}
                name="telephone"
                value={values.telephone}
                error={!!touched.telephone && !!errors.telephone}
                helperText={touched.telephone && errors.telephone}
                sx={{
                  gridColumn: "span 4",
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary[100],
                  },
                }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Website"
                onBlur={handleBlur}
                onChange={handleChange}
                name="website"
                value={values.website}
                sx={{
                  gridColumn: "span 4",
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary[100],
                  },
                }}
              />
              <TextField
                fullWidth
                rows={7}
                multiline
                variant="filled"
                type="text"
                label="Internal notes"
                onBlur={handleBlur}
                onChange={handleChange}
                name="notes"
                value={values.notes}
                sx={{
                  gridColumn: "span 4",
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: colors.primary[100],
                  },
                }}
              />

              <LoadingButton
                loading={isLoading}
                loadingPosition="end"
                endIcon={<SaveIcon />}
                variant="contained"
                disabled={!isValid || isNameFieldEmpty}
                type="submit"
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
                }}
              >
                Save
              </LoadingButton>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default New_Customer;
