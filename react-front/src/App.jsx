import {CssBaseline, ThemeProvider} from "@mui/material";
import {ColorModeContext, useMode} from "./theme.js";
import {useState} from "react";
import Sidebar from "./components/global/Sidebar.jsx";
import Topbar from "./components/global/Topbar.jsx";
import {Route, Routes} from "react-router-dom";
import GradePage from "./views/GradePage.jsx";

function App() {
  const [theme, colorMode] = useMode();
    const [authenticated, setAuthenticated] = useState(true);

    const handleLogin = () => {
        // Toggle the authenticated state
        setAuthenticated((authenticated) => !authenticated);
    };

  return (
    <>
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {authenticated ? (
                    <div className="app">
                        <Sidebar onLogin={handleLogin} />
                        <main className="content">
                            <Topbar />
                            <Routes>
                                <Route path="/" element={<GradePage />} />
                                <Route path="*" element={<GradePage />} />
                            </Routes>
                        </main>
                    </div>
                ) : (
                    <Routes>
                    </Routes>
                )}
            </ThemeProvider>
        </ColorModeContext.Provider>

    </>
  )
}

export default App
