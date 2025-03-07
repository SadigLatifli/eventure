import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

// Save the sidebar state to localStorage
export function saveSidebarState(isOpen: boolean) {
  localStorage.setItem("sidebarState", JSON.stringify(isOpen));
}

// Retrieve the sidebar state from localStorage
export function getSidebarState(): boolean {
  const savedState = localStorage.getItem("sidebarState");
  return savedState ? JSON.parse(savedState) : true; // Default to open
}




// Extend dayjs with advancedFormat to support tokens like "dddd"
dayjs.extend(advancedFormat);

export const formatDateTime = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";
  return dayjs(dateString).format("dddd DD.MM.YYYY HH:mm");
};