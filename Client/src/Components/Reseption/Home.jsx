import React from "react";
import Language from "@/Components/Language/Language";
import { useLanguage } from "@/Context/LanguageContext";
import { useSelector } from "react-redux";

const ReseptionHome = () => {
  const { currentUser } = useSelector((state) => state.auth);
  console.log(currentUser);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full bg-[var(--one)] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 bg-[var(--six)] rounded-xl p-4">
          <h1 className="text-white border-1 px-3 py-1 rounded-xl">
            {currentUser?.gender === "Male"
              ? "Mr"
              : currentUser?.gender === "Female"
              ? "Ms"
              : "Mr/Ms"}{" "}
            {currentUser?.fullName}
          </h1>
          <h1 className="text-white">{currentUser?.role}</h1>
          <Language />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="text-sm text-gray-300">
              {t("visitorsToday") || "Visitors Today"}
            </div>
            <div className="text-3xl font-bold text-white mt-2">0</div>
          </div>
       
          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="text-sm text-gray-300">
              {t("pendingCheckins") || "Pending Check-ins"}
            </div>
            <div className="text-3xl font-bold text-white mt-2">0</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        

          <div className="bg-gradient-to-b from-[var(--six)] to-[var(--five)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReseptionHome;
