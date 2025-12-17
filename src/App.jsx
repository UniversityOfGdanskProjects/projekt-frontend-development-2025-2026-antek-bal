import {Routes, Route} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Feed from "./pages/Feed.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import ChatDock from "./components/Chat/ChatDock.jsx";


function App() {
    return (
        <AuthProvider>
            <ChatProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Feed/>
                            </ProtectedRoute>
                        }></Route>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/profile/:userId" element={
                            <ProtectedRoute>
                                <Profile/>
                            </ProtectedRoute>
                        }></Route>
                    </Routes>
                </Layout>
                <ChatDock/>
            </ChatProvider>
        </AuthProvider>

    );
}

export default App;