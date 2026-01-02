
import {
  LayoutDashboard,
  FolderKanban,
  User,
  Users,
  Settings,
  Contact,
  Newspaper,
  GitBranch
} from "lucide-react";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/dashboard",
  },
  {
    label: "Projects",
    icon: FolderKanban,
    children: [
      { label: "All Projects", to: "/projects" },
      { label: "Create Project", to: "/projects/create" },
      { label: "Archived", to: "/projects/archived" },
    ],
  },
  {
    label: "Code",
    icon: GitBranch,
    children: [
      { label: "All Code", to: "/code" },
      { label: "Create Code", to: "/code/create" },
    ],
  },
  {
    label: "Admin",
    icon: Users,
    children: [
      { label: "All", to: "/admin" },
      { label: "Create", to: "/admin/create" },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    to: "/settings",
  },
  {
    label: "Tags",
    icon: Settings,
    to: "/tag",
  },
  {
    label: "Contacts",
    icon: Contact,
    to: "/contacts",
  },
  {
    label: "NewsLetter",
    icon: Newspaper,
    to: "/newsletter",
  },
];
