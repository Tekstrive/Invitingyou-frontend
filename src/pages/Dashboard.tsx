import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Calendar, Plus, Loader2 } from "lucide-react";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/Button";
import { EventCard } from "../components/dashboard/EventCard";

interface Event {
  _id: string;
  title: string;
  eventDate?: string;
  venue?: string;
  status: string;
  guestCount?: number;
  rsvpCount?: number;
  createdAt: string;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setEvents(result.events || []);
      } else {
        setError("Failed to load events");
      }
    } catch (err) {
      console.error("Error loading events:", err);
      setError("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/dashboard/events/${eventId}`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/events/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        // Remove the event from the local state
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== eventId)
        );
      } else {
        const result = await response.json();
        alert(result.message || "Failed to delete event");
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event. Please try again.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-brand-mirage">Dashboard</h1>
            <p className="mt-2 text-neutral-500">Welcome back, {user?.name}</p>
          </div>
          <Button
            onClick={() => navigate("/templates")}
            className="rounded-full shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Event
          </Button>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-brand-orange mb-4" />
            <p className="text-neutral-500">Loading your celebrations...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-500 mb-4">{error}</p>
            <Button variant="outline" onClick={loadEvents}>
              Try Again
            </Button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-sm border border-dashed border-brand-sea/30">
            <div className="h-16 w-16 bg-brand-sand rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-8 w-8 text-brand-sea" />
            </div>
            <h3 className="text-xl font-semibold text-brand-mirage mb-2">
              No events yet
            </h3>
            <p className="text-neutral-500 max-w-md mx-auto mb-8">
              You haven't created any events yet. Start by choosing a template
              for your special occasion.
            </p>
            <Button onClick={() => navigate("/templates")}>
              Browse Templates
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onClick={() => handleEventClick(event._id)}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
