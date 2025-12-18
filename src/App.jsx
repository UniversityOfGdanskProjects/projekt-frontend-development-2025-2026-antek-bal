import {Routes, Route} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Feed from "./pages/Feed.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import ChatDock from "./components/Chat/ChatDock.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import {PostProvider} from "./context/PostContext.jsx";


function App() {
    return (
        <AuthProvider>
            <PostProvider>
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
                            <Route path="/admin" element={
                                <AdminRoute>
                                    <AdminPanel/>
                                </AdminRoute>
                            }></Route>
                        </Routes>
                    </Layout>
                    <ChatDock/>
                </ChatProvider>
            </PostProvider>
        </AuthProvider>

    );
}

export default App;