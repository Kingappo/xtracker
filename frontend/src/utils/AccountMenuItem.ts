import { User, Lock, FileText, Trash2, MessageSquare } from "lucide-react";
export const menuItems = [
  {
    to: "/account/profile",
    icon: User,
    label: "Profile",
    description: "View your account details",
    danger: false,
  },
  {
    to: "/account/change-password",
    icon: Lock,
    label: "Change Password",
    description: "Update your login password",
    danger: false,
  },
  {
    to: "/account/statement",
    icon: FileText,
    label: "Generate Statement",
    description: "Download or print a statement of account",
    danger: false,
  },
  {
    to: "/account/review",
    icon: MessageSquare,
    label: "Send Feedback",
    description: "Tell us what you think of XTracker",
    danger: false,
  },
  {
    to: "/account/delete",
    icon: Trash2,
    label: "Delete Account",
    description: "Permanently remove your account and data",
    danger: true,
  },
];
