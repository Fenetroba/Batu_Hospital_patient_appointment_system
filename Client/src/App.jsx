import React, { useEffect, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useDispatch, useSelector } from "react-redux";
import { profile } from "./Stores/UserAuthslicer";
import PageProtector from "./Components/AllUsers/PageProtecter";
import DoctorHomePage from "./Page/Doctors/HomePage";

// Lazy load pages for better performance
const HomePage = React.lazy(() => import("./Page/Gusts/HomePage"));
const Login = React.lazy(() => import("./Page/Auth/Login"));
const Location = React.lazy(() => import("./Page/Location"));

const AdminHome = React.lazy(() => import("./Page/Admin/Homepage"));
const NurseHomePage = React.lazy(() => import("./Page/Nurse/HomePage"));
const ReseptionHomePage = React.lazy(() => import("./Page/Reseptions/HomePage"));
const PatientsHomePage = React.lazy(() => import("./Page/Patients/HomePage"));

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated,currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  return (
    <div className="bg-gradient-to-b from-[var(--one)] to-[var(--two)] min-h-screen">
      <Toaster position="top-center" />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--six)]"></div>
        </div>
      }>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} currentUser={currentUser}/>} />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <Login />
            } 
          />
          <Route path="/location" element={<Location />} />

          {/* Protected routes */}
          <Route
            path="/doctor/home"
            element={
              <PageProtector allowedRoles={['Doctor'] }>
                <DoctorHomePage />
              </PageProtector>
            }
          />
          <Route
            path="/admin/home"
            element={
              <PageProtector allowedRoles={['Admin']}>
                <AdminHome />
              </PageProtector>
            }
          />
          <Route
            path="/Nurse/home"
            element={
              <PageProtector allowedRoles={['Nurse']}>
                <NurseHomePage />
              </PageProtector>
            }
          />
          <Route
            path="/reseption/home"
            element={
              <PageProtector allowedRoles={['Receptionist']}>
                <ReseptionHomePage />
              </PageProtector>
            }
          />
          <Route
            path="/patients/home"
            element={
              <PageProtector allowedRoles={['Patient']}>
                <PatientsHomePage />
              </PageProtector>
            }
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
