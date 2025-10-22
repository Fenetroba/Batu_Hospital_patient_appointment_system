import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import Appointment from "./Appointment";
import Inboxs from "./Inbox";
import Patient from "./Patient";
import Setting from "../AllUsers/Setting";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarProvider,
} from "@/Components/ui/sidebar";
import HomePage from "./Home";
import BottomProfile from "../AllUsers/BottomProfile";
import { useState } from "react";

// Menu items.
const items = [
  {
    title: "Home",
    icon: Home,
  },
  {
    title:"Inboxs",
    icon: Inbox,
  },
  {
    title: "Appointments",
    icon: Calendar,
  },
  {
    title: "Find Patients",
    icon: Search,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

const DoctorsSidebar = () => {
  const [OpenFile, setOpenFile] = useState("");
  console.log(OpenFile);
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="bg-[var(--six)]">
          <SidebarGroup>
            <SidebarGroupLabel className=" text-[var(--two)] text-[19px] mb-10 font-bold">
              DOCTORS DASHBOARD
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-[var(--three)] hover:text-[var(--six)]"
                    >
                      <button
                        onClick={() => setOpenFile(item.title)}
                      >
                        <item.icon className="text-[var(--two)]" />
                        <span className="text-[var(--two)]  ">
                          {item.title}
                        </span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <BottomProfile />
      </Sidebar>
      <main className="flex-1 p-4">
        <SidebarTrigger />
        {OpenFile === "Home" ? (
          <HomePage />
        ) : OpenFile === "Inboxs" ? (
          <Inbox />
        ) : OpenFile === "Appointments" ? (
          <Appointment />
        ) : OpenFile === "Find Patients" ? (
          <Patient />
        ) : OpenFile === "Settings" ? (
          <Setting />
        ) : <HomePage />}
      </main>
    </SidebarProvider>
  );
};
export default DoctorsSidebar;
