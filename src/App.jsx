import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import SmileyFaces from "./components/SmileyFaces";
import InstancePage from "./pages/InstancePage";
import SurveyPage from "./pages/SurveyPage";
import CreateInstance from "./components/CreateInstance";
import ColorPicker from "./components/ColorPicker"
import './i18n.js';
import DashboardPage from "./pages/DashboardPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useContext } from "react";
import UserContext from "./contexts/user.jsx";
import QuestionEditView from "./components/QuestionEditView.jsx";
import MarkdownPage from "./pages/MarkdownPage.jsx";
import StartingInfo from "./components/StartingInfo.jsx";
import privacyPolicy from './privacy_policy.md'
import SocketIoTest from "./components/SocketIoTest.jsx";
import FullScreenBubbleView from "./components/FullScreenBubbleView.jsx";
import BodyRealTime from "./components/BodyRealTime.jsx";

function App() {

  const { preferences } = useContext(UserContext)
  const location = useLocation()

  const appTheme = createTheme({
    palette: {
        mode: (preferences.theme),
      }
    })

  const allowedRoutes = [
    '/privacy_policy',
  ]

  const hideNavBar = [
    '/room/',
    '/body/',
  ]

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme/>


      { !(hideNavBar.some((path) => location.pathname.includes(path))) &&
        // Don't show the navbar on pages in the hideNavBar array
        <NavBar/>
      }

      <Box sx={{p:1}}>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path='/privacy_policy' element={<MarkdownPage markdown={privacyPolicy}/>}/>

          {/* Instance paths */}
          <Route path="/instance/:id" element={<InstancePage/>} />
          <Route path="/instance/:id/edit" element={<QuestionEditView/>}/>
          <Route path="/instance/:id/analytics" element={<AnalyticsPage/>}/>
          <Route path="/instance/:id/survey" element={<SurveyPage/>} />
          
          {/* Test paths */}
          <Route path="/room/:id" element={<FullScreenBubbleView />} />
          <Route path="/body/:id" element={<BodyRealTime />} />
        </Routes>
      </Box>

      { !allowedRoutes.includes(location.pathname) &&
        // Don't block the user from seeing the privacy policy
        <StartingInfo/>
      }

    </ThemeProvider>
  )
}

export default App