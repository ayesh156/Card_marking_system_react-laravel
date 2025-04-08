import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme.js";
import { useState, useEffect } from "react";
import Sidebar from "./components/global/Sidebar.jsx";
import Topbar from "./components/global/Topbar.jsx";
import { Route, Routes, useNavigate } from "react-router-dom";
import GradePage from "./views/GradePage.jsx";
import StudentPage from "./views/StudentPage.jsx";
import Classes from "./views/Classes.jsx";
import Login from "./views/Login.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Cookies from "js-cookie";

function App() {
    const [theme, colorMode] = useMode();
    const navigate = useNavigate();

    // Load initial states from localStorage
    const [authenticated, setAuthenticated] = useState(() => {
        return Cookies.get("authenticated") === "true";
    });
    const [classSelected, setClassSelected] = useState(() => {
        return Cookies.get("classSelected") === "true";
    });
    const [selectedClass, setSelectedClass] = useState(() => {
        return Cookies.get("selectedClass") || null;
    });

    // Update the grade value in cookies based on selectedClass
    useEffect(() => {
        if (selectedClass === "E") {
            Cookies.set("grade", "P"); // Primary
        } else if (selectedClass === "M") {
            Cookies.set("grade", "6"); // Grade 6
        } else if (selectedClass === "S") {
            Cookies.set("grade", "3"); // Grade 3
        } else {
            Cookies.remove("grade"); // Clear grade if no valid selectedClass
        }
    }, [selectedClass]);

    // Save states to cookies whenever they change
    useEffect(() => {
        Cookies.set("authenticated", authenticated);
        Cookies.set("classSelected", classSelected);
        Cookies.set("selectedClass", selectedClass);
    }, [authenticated, classSelected, selectedClass]);

    const handleLogin = () => {
        setAuthenticated(true); // Set authenticated to true
        navigate("/"); // Navigate to the main app layout
    };

    const handleClassSelection = (className) => {
        setClassSelected(true); // Mark a class as selected
        setSelectedClass(className); // Set the selected class
        navigate("/"); // Navigate to the main app layout
    };

    return (
        <>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {authenticated ? (
                        classSelected ? (
                            <div className="app">
                                <Sidebar onLogin={handleLogin} />
                                <main className="content">
                                    {/* Pass selectedClass to Topbar */}
                                    <Topbar />
                                    <Routes>
                                        {/* Pass selectedClass to GradePage and StudentPage */}
                                        <Route path="/" element={<Dashboard />} />

                                         {/* Loop for GradePage and StudentPage */}
                                        {["primary", ...Array.from({ length: 11 }, (_, i) => `grade${i + 1}`)].map((path) => (
                                            <Route key={path} path={`/${path}`} element={<GradePage />} />
                                        ))}
                                        {["primary", ...Array.from({ length: 11 }, (_, i) => `grade${i + 1}`)].map((path) => (
                                            <Route key={`${path}/student`} path={`/${path}/student`} element={<StudentPage />} />
                                        ))}

                                        <Route path="*" element={<Dashboard />} />
                                    </Routes>
                                </main>
                            </div>
                        ) : (
                            <Routes>
                                <Route path="/" element={<Classes onClassSelect={handleClassSelection} />} />
                            </Routes>
                        )
                    ) : (
                        <Routes>
                            <Route path="/" element={<Login onLogin={handleLogin} />} />
                        </Routes>
                    )}
                </ThemeProvider>
            </ColorModeContext.Provider>
        </>
    );
}

export default App;
