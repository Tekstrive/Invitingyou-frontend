import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EditorHeader } from "../components/editor/EditorHeader";
import { MainLayout } from "../components/layout/MainLayout";
import api from "../services/api";
import { Edit2, Users, Calendar, MapPin, Clock } from "lucide-react";

export const ReviewInvitation = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);

  // Fetch event data
  const { data: eventData, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const response = await api.get(`/events/${eventId}`);
      return response.data.data;
    },
    enabled: !!eventId,
  });

  const handleBack = () => {
    navigate(`/event/${eventId}/guests`);
  };

  const handleSend = () => {
    navigate(`/event/${eventId}/send`);
  };

  const handleEditDesign = () => {
    navigate(`/event/${eventId}/design`);
  };

  const handleEditDetails = () => {
    navigate(`/event/${eventId}/details`);
  };

  const handleEditGuests = () => {
    navigate(`/event/${eventId}/guests`);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
        </div>
      </MainLayout>
    );
  }

  if (!eventData) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Event Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The event you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-brand-orange text-white rounded-sm hover:bg-brand-orange/90"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const guestCount = eventData.guests?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <EditorHeader
        currentStep={4}
        eventId={eventId!}
        onBack={handleBack}
        onNext={handleSend}
        canProceed={true}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Review Your Invitation
          </h1>
          <p className="text-gray-600">
            Review all details before sending your invitations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Card Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Card Design
                </h2>
                <button
                  onClick={handleEditDesign}
                  className="text-brand-orange hover:text-brand-orange/80 text-sm font-medium flex items-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              {/* Card Preview Placeholder */}
              <div className="aspect-[3/4] bg-gradient-to-br from-brand-sand to-brand-sea/20 rounded-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">🎨</div>
                  <p className="text-sm text-gray-600">Card Preview</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details Card */}
            <div className="bg-white rounded-sm shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Event Details
                </h2>
                <button
                  onClick={handleEditDetails}
                  className="text-brand-orange hover:text-brand-orange/80 text-sm font-medium flex items-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="space-y-4">
                {/* Event Name */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {eventData.name || "Untitled Event"}
                  </h3>
                  <p className="text-gray-600">
                    {eventData.description || "No description"}
                  </p>
                </div>

                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-brand-orange mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Date & Time</p>
                    <p className="text-gray-600">
                      {eventData.date
                        ? new Date(eventData.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Not set"}
                    </p>
                    {eventData.time && (
                      <p className="text-gray-600">{eventData.time}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                {eventData.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-brand-orange mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">{eventData.location}</p>
                    </div>
                  </div>
                )}

                {/* RSVP Deadline */}
                {eventData.rsvpDeadline && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-brand-orange mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">RSVP Deadline</p>
                      <p className="text-gray-600">
                        {new Date(eventData.rsvpDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Guest List Card */}
            <div className="bg-white rounded-sm shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Guest List
                </h2>
                <button
                  onClick={handleEditGuests}
                  className="text-brand-orange hover:text-brand-orange/80 text-sm font-medium flex items-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-brand-orange" />
                <p className="text-gray-900">
                  <span className="font-semibold text-2xl">{guestCount}</span>{" "}
                  <span className="text-gray-600">
                    {guestCount === 1 ? "guest" : "guests"}
                  </span>
                </p>
              </div>

              {guestCount > 0 && eventData.guests && (
                <div className="space-y-2">
                  {eventData.guests
                    .slice(0, 5)
                    .map((guest: Record<string, unknown>, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {typeof guest.name === "string"
                              ? guest.name
                              : "Unknown"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {typeof guest.email === "string"
                              ? guest.email
                              : typeof guest.phone === "string"
                                ? guest.phone
                                : "No contact info"}
                          </p>
                        </div>
                      </div>
                    ))}

                  {guestCount > 5 && (
                    <button
                      onClick={handleEditGuests}
                      className="text-brand-orange hover:text-brand-orange/80 text-sm font-medium mt-2"
                    >
                      View all {guestCount} guests →
                    </button>
                  )}
                </div>
              )}

              {guestCount === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 mb-4">No guests added yet</p>
                  <button
                    onClick={handleEditGuests}
                    className="text-brand-orange hover:text-brand-orange/80 font-medium"
                  >
                    Add Guests
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={handleBack}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 font-medium"
              >
                ← Back to Guests
              </button>
              <button
                onClick={handleSend}
                disabled={isSending || guestCount === 0}
                className="px-8 py-3 bg-brand-orange text-white rounded-sm hover:bg-brand-orange/90 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSending ? "Processing..." : "Continue to Send →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
