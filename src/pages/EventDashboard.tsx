import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getErrorMessage } from "../utils/errorHandler";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/Button";
import { RSVPTracker } from "../components/dashboard/RSVPTracker";
import { GuestList } from "../components/dashboard/GuestList";
import { ArrowLeft, Loader2, Calendar, MapPin } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Event {
  _id: string;
  title: string;
  description?: string;
  eventDate?: string;
  venue?: string;
  status: string;
}

interface Guest {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface RSVPStats {
  attending: number;
  not_attending: number;
  maybe: number;
  pending: number;
  total: number;
}

interface GuestWithRSVP {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  rsvpStatus?: "attending" | "not_attending" | "maybe" | null;
  respondedAt?: string;
}

export const EventDashboard = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<GuestWithRSVP[]>([]);
  const [stats, setStats] = useState<RSVPStats>({
    attending: 0,
    not_attending: 0,
    maybe: 0,
    pending: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId && token) {
      fetchEventData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, token]);

  const fetchEventData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch event details
      const eventResponse = await axios.get(
        `${API_URL}/api/events/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (eventResponse.data.success) {
        setEvent(eventResponse.data.event);
      }

      // Fetch RSVPs with stats
      const rsvpResponse = await axios.get(
        `${API_URL}/api/events/${eventId}/rsvps`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (rsvpResponse.data) {
        const { rsvps, stats: rsvpStats } = rsvpResponse.data;
        setStats(rsvpStats);

        // Fetch all guests
        const guestsResponse = await axios.get(
          `${API_URL}/api/events/${eventId}/guests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (guestsResponse.data.success) {
          const allGuests = guestsResponse.data.guests;

          // Merge guests with RSVP data
          const guestsWithRSVP: GuestWithRSVP[] = allGuests.map(
            (guest: Guest) => {
              // Find RSVP by matching guestId
              const rsvp = rsvps.find(
                (
                  r: Record<string, unknown> & {
                    guestId?: string | { _id: string };
                  }
                ) => {
                  const rsvpGuestId =
                    typeof r.guestId === "string" ? r.guestId : r.guestId?._id;
                  return rsvpGuestId === guest._id;
                }
              );
              return {
                ...guest,
                rsvpStatus: rsvp?.status || null,
                respondedAt: rsvp?.respondedAt || undefined,
              };
            }
          );

          setGuests(guestsWithRSVP);
        }
      }
    } catch (err: unknown) {
      console.error("Error fetching event data:", err);
      setError(getErrorMessage(err) || "Failed to load event data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ["Name", "Email", "Phone", "RSVP Status", "Responded At"];
    const rows = guests.map((guest) => [
      guest.name,
      guest.email || "",
      guest.phone || "",
      guest.rsvpStatus || "Pending",
      guest.respondedAt ? new Date(guest.respondedAt).toLocaleDateString() : "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Create download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${event?.title || "event"}_guests.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-brand-orange mb-4" />
          <p className="text-brand-mirage/60">Loading event dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !event) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-24">
            <p className="text-red-500 mb-4">{error || "Event not found"}</p>
            <Button onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-4xl font-bold text-brand-mirage mb-4">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-brand-mirage/70">
            {event.eventDate && (
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-brand-orange" />
                <span>
                  {new Date(event.eventDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            {event.venue && (
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-brand-orange" />
                <span>{event.venue}</span>
              </div>
            )}
          </div>

          {event.description && (
            <p className="mt-4 text-brand-mirage/70">{event.description}</p>
          )}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* RSVP Tracker - Takes 1 column */}
          <div className="lg:col-span-1">
            <RSVPTracker stats={stats} />
          </div>

          {/* Guest List - Takes 2 columns */}
          <div className="lg:col-span-2">
            <GuestList guests={guests} onExportCSV={handleExportCSV} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
