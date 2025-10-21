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
          <h1 className="text-white">
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
              {t("appointmentsToday") || "Appointments Today"}
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
          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                {t("todayAppointments") || "Today's Appointments"}
              </h2>
              <a href="#" className="text-[var(--one)] text-sm">
                {t("viewAll") || "View all"}
              </a>
            </div>
            <div className="text-gray-300 text-sm">
              {t("noAppointments") || "No appointments scheduled."}
            </div>
          </div>

          <div className="bg-[var(--six)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                {t("quickActions") || "Quick Actions"}
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="bg-[var(--one)] text-black font-semibold px-4 py-2 rounded-md"
              >
                {t("createAppointment") || "Create Appointment"}
              </a>
              <a
                href="#"
                className="bg-[var(--one)] text-black font-semibold px-4 py-2 rounded-md"
              >
                {t("checkInPatient") || "Check-in Patient"}
              </a>
              <a
                href="#"
                className="bg-[var(--one)] text-black font-semibold px-4 py-2 rounded-md"
              >
                {t("managePayments") || "Manage Payments"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReseptionHome;
