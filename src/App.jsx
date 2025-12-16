import {Routes, Route} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Feed from "./pages/Feed.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";


function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/">
                    <ProtectedRoute>
                        <Feed/>
                    </ProtectedRoute>
                </Route>
                <Route path="/login">
                        <Login/>
                </Route>
                <Route path="/profile/:userId">
                    <ProtectedRoute>
                        <Profile/>
                    </ProtectedRoute>
                </Route>
            </Routes>
        </Layout>
    );
}

export default App;