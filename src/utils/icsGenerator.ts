/**
 * Generate .ics (iCalendar) file content for calendar apps
 * Following RFC 5545 iCalendar specification
 */

interface EventData {
  title: string;
  description?: string;
  eventDate: Date | string;
  venue?: string;
}

/**
 * Format date to iCalendar format (YYYYMMDDTHHMMSSZ)
 */
function formatICSDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  const seconds = String(d.getUTCSeconds()).padStart(2, "0");

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Escape special characters in iCalendar text fields
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Generate .ics file content
 */
export function generateICS(event: EventData): string {
  const startDate = formatICSDate(event.eventDate);

  // Assume 2-hour duration if not specified
  const endDate = new Date(
    typeof event.eventDate === "string" ? event.eventDate : event.eventDate
  );
  endDate.setHours(endDate.getHours() + 2);
  const endDateFormatted = formatICSDate(endDate);

  const title = escapeICSText(event.title);
  const description = event.description ? escapeICSText(event.description) : "";
  const location = event.venue ? escapeICSText(event.venue) : "";

  // Generate unique ID
  const uid = `${Date.now()}@invitingyou.com`;
  const timestamp = formatICSDate(new Date());

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//InvitingYou//Event Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDateFormatted}`,
    `SUMMARY:${title}`,
    description ? `DESCRIPTION:${description}` : "",
    location ? `LOCATION:${location}` : "",
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter((line) => line !== "") // Remove empty lines
    .join("\r\n");

  return icsContent;
}

/**
 * Trigger download of .ics file in browser
 */
export function downloadICS(
  icsContent: string,
  filename: string = "event.ics"
): void {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(link.href);
}
