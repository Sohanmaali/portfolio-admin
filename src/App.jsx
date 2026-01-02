import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";

import { useDispatch, useSelector } from "react-redux";

import { fetchUserProfile } from "./services/authService";
import { setUser } from "./store/authSlice";
import { useEffect } from "react";


import AdminLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import ContactInquiry from "./pages/ContactInquiry";
import NewsletterAdminPage from "./pages/Newsletter";
import Create from "./pages/project/Create";
import All from "./pages/project/All";
import CodeCreate from "./pages/code/Create"
import CodeAll from "./pages/code/All"
import Tag from "./pages/Tag"
import Login from "./pages/auth/Login";
import PrivateRoute from "./components/ProtectedRoute";
import AdminCreate from './pages/user/admin/Create'
import AdminAll from './pages/user/admin/All'

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const { data } = await fetchUserProfile();
          dispatch(
            setUser({
              user: data,
              accessToken: token,
              refreshToken: Cookies.get(`${import.meta.env.VITE_APP_TOKEN_PREFICS}_refreshToken`) || null,
            })
          );
        } catch (error) {
          console.log("Error fetching user:", error);
        }
      }
    };

    fetchUser();
  }, [dispatch, token]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="projects" element={<All />} />
            <Route path="projects/create" element={<Create />} />
            <Route path="projects/:id/edit" element={<Create />} />

            <Route path="code" element={<CodeAll />} />
            <Route path="code/create" element={<CodeCreate />} />
            <Route path="code/:id/edit" element={<CodeCreate />} />

            <Route path="tag" element={<Tag />} />


            {/* <Route path="admin" element={<AdminCreate />} /> */}

            <Route path="admin" element={<AdminAll />} />
            <Route path="admin/create" element={<AdminCreate />} />
            <Route path="admin/:id/edit" element={<AdminCreate />} />


            <Route path="settings" element={<Settings />} />
            <Route path="contacts" element={<ContactInquiry />} />
            <Route path="newsletter" element={<NewsletterAdminPage />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;