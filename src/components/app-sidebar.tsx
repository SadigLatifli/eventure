import { User2, ChevronsUpDown } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  // SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { items } from "@/constants/paths";
import BookMoodLogo from "../assets/eventure.svg";
import BMLogo from "../assets/eventure.svg";
// import { useAuth } from "@/api/queries/authQueries";
// import { signOut } from "@/utils/auth";
import { useSelector } from "react-redux";
import { selectUserData } from "@/redux/userSlice";
import { useUserAuth } from "@/api/queries/authQueries";

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const userData = useSelector(selectUserData);

  const { logoutMutation } = useUserAuth();

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        // Optionally, programmatically navigate to login
        // e.g., navigate('/login')
      },
    });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-center">
        {open ? (
          <img
            src={BookMoodLogo}
            alt="Main logo"
            className="min-w-16 min-h-8 object-cover"
          />
        ) : (
          <img
            src={BMLogo}
            alt="Small Logo"
            className="min-w-16 min-h-8 object-cover h-auto w-auto"
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location?.pathname === item?.url}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />{" "}
                  {`${userData?.firstName ?? ""} ${userData?.lastName ?? ""}`.trim() ||
                    "User"}
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={logoutMutation.isLoading}
                >
                  <span>
                    {logoutMutation.isLoading ? "Signing out..." : "Sign out"}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
