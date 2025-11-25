import { Home, Inbox, Settings, User, FileText, Bell } from "lucide-react";
import Users from "./User";
import Reports from "./Reports";
import Inboxs from "./Inbox";
import Setting from "../AllUsers/Setting";
import NotificationManager from "./NotificationManager";
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
import AdminHome from "@/Components/Admin/Home";

// Menu items.
const items = [
  {
    title: "Home",
    icon: Home,
  },
  {
    title: "Inbox",
    icon: Inbox,
  },
  {
    title: "Users",
    icon: User,
  },
  {
    title: "Notifications",
    icon: Bell,
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

const AdminSidebar = () => {
  const [OpenFile, setOpenFile] = useState("");
  console.log(OpenFile);
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="bg-[var(--six)]">
          <SidebarGroup>
            <SidebarGroupLabel className=" text-[var(--two)] text-[19px] mb-10 font-bold">
              Admin DASHBOARD
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
          <AdminHome />
        ) : OpenFile === "Inbox" ? (
          <Inboxs />
        ) : OpenFile === "Users" ? (
          <Users />
        ) : OpenFile === "Notifications" ? (
          <NotificationManager />
        ) : OpenFile === "Reports" ? (
          <Reports />
        ) : OpenFile === "Settings" ? (
          <Setting />
        ) : <AdminHome />}
      </main>
    </SidebarProvider>
  );
};
export default AdminSidebar;
