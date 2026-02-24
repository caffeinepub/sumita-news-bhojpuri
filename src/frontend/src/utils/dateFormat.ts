import type { Time } from "../backend.d";

export function formatDate(time: Time): string {
  const date = new Date(Number(time) / 1000000); // Convert nanoseconds to milliseconds
  
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

export function formatDateLong(time: Time): string {
  const date = new Date(Number(time) / 1000000);
  
  const months = [
    "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
    "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

export function getRelativeTime(time: Time): string {
  const date = new Date(Number(time) / 1000000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "अभी";
  if (diffMins < 60) return `${diffMins} मिनट पहले`;
  if (diffHours < 24) return `${diffHours} घंटे पहले`;
  if (diffDays < 7) return `${diffDays} दिन पहले`;
  
  return formatDateLong(time);
}
