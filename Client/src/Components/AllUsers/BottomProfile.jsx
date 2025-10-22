import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import reception from "../../assets/UserRoleIcon/reception.png"
import admin from "../../assets/UserRoleIcon/administrator.png"
import doctor from "../../assets/UserRoleIcon/doctor.png"
import patient from "../../assets/UserRoleIcon/medical.png"
import nurse from "../../assets/UserRoleIcon/nurse.png"

const BottomProfile = () => {
  const { currentUser, isLoading } = useSelector((state) => state.auth);

  // Show loading state if data is being fetched
  if (isLoading) {
    return (
      <div className="h-20 bg-[var(--five)] flex items-center gap-3 px-10 w-full">
        <div className="w-15 h-15 rounded-full bg-gray-300 animate-pulse" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-20 bg-[var(--five)] flex items-center gap-3 px-6 w-full">
      <Avatar className="">
        <AvatarImage
          src={
            currentUser?.role === "Receptionist"
              ? reception
              : currentUser?.role === "Admin"
              ? admin
              : currentUser?.role === "Doctor"
              ? doctor
              : currentUser?.role === "Patient"
              ? patient
              : currentUser?.role === "Nurse"
              ? nurse
              : ""
          }
          alt={currentUser?.fullName || "User"}
        />
        <AvatarFallback>
          {currentUser?.fullName?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-white font-medium">
          {currentUser?.fullName || "Guest User"}
        </p>
        <p className="text-gray-200 text-sm">
          {currentUser?.email || "No email available"}
        </p>
      </div>
    </div>
  );
};

export default BottomProfile;
