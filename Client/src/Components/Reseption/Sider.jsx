import { Home, Inbox, Settings, User,FileText } from "lucide-react";
import Users from "./Patients";
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
import ReseptionHome from "./Home";


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
    title: "Patients",
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

const ReseptionSidebar = () => {
  const [OpenFile, setOpenFile] = useState("");

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="bg-[var(--six)]">
          <SidebarGroup>
            <SidebarGroupLabel className=" text-[var(--two)] text-[18px] mb-10 font-bold">
              RESEPTION DASHBOARD
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
      <main className="flex-1 p-4 overflow-x-hidden">
        <SidebarTrigger />
        {OpenFile === "Home" ? (
          <ReseptionHome />
        ) : OpenFile === "Inbox" ? (
          <Inboxs />
        ) : OpenFile === "Patients" ? (
          <Users />
        ) : OpenFile === "Reports" ? (
          <Reports />
        ) : OpenFile === "Settings" ? (
          <Setting />
        ) : <ReseptionHome />}
      </main>
    </SidebarProvider>
  );
};
export default ReseptionSidebar;
