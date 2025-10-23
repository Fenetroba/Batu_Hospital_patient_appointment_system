import { Home, Inbox, Settings, User,FileText } from "lucide-react";
import Appointment from "./Appointment";
import Reports from "./Reports";
import Inboxs from "./Inbox";
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

import BottomProfile from "../AllUsers/BottomProfile";
import { useState } from "react";
import NurseHome from "./Home";


// Menu items.
const items = [
  {
    title: "Home",
    icon: Home,
  },
  {
    title:"Inbox",
    icon: Inbox,
  },
  {
    title: "Appointment",
    icon: User,
  },
  {
    title: "Reports",
    icon: FileText,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

const NurseSidebar = () => {
  const [OpenFile, setOpenFile] = useState("");

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="bg-[var(--six)]">
          <SidebarGroup>
            <SidebarGroupLabel className=" text-[var(--two)] text-[19px] mb-10 font-bold">
              NURSE DASHBOARD
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
          <NurseHome />
        ) : OpenFile === "Inbox" ? (
          <Inboxs />
        ) : OpenFile === "Appointment" ? (
          <Appointment />
        ) : OpenFile === "Reports" ? (
          <Reports />
        ) : OpenFile === "Settings" ? (
          <Setting />
        ) : <NurseHome />}
      </main>
    </SidebarProvider>
  );
};
export default NurseSidebar;
