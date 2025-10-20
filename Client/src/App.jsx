import React, { useEffect } from "react";
import { Button } from "./Components/ui/button";
import HomePage from "./Page/Gusts/HomePage";
import Login from "./Page/Auth/Login";
import { Route, Routes } from "react-router-dom";
import Location from "./Page/Location";
import DoctorsLayer from "./Page/Doctors/Layer/DoctorsLayer";
import Doctors from "./Page/Doctors/HomePage";
import AdminHome from "./Page/Admin/Homepage";
import { Toaster } from "@/components/ui/sonner";
import { useDispatch, useSelector } from "react-redux";
import { profile } from "./Stores/UserAuthslicer";
import PageProtector from "./Components/AllUsers/PageProtecter";
const App = () => {
  const dispatch = useDispatch();
  const { currentUser,isLoading,isAuthenticated } = useSelector((state) => state.user);
  console.log(currentUser);
  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  return (
    <div className="bg-gradient-to-b from-[var(--one)] to-[var(--two)] h-[100dvh]">
      <Toaster />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <PageProtector allowedRoles={['Admin','Patient','Doctor','Nurse','Receptionist']} user={currentUser} isAuthenticated={isAuthenticated}>
              <Login />
            </PageProtector>
          }
        />
        <Route path="/location" element={<Location />} />

        <Route path="/doctors/home" element={<PageProtector allowedRoles={['Doctor']}><DoctorsLayer /></PageProtector>} />
        <Route path="/admin/home" element={<PageProtector allowedRoles={['Admin']}><AdminHome /></PageProtector>} />
      </Routes>
    </div>
  );
};

export default App;
