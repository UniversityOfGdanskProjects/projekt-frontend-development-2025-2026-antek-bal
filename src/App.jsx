import {Routes, Route} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Feed from "./pages/Feed.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";


function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Feed/>}></Route>
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/profile/:userId" element={<Profile/>}></Route>
            </Routes>
        </Layout>
    );
}

export default App;