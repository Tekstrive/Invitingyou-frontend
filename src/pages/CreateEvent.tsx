import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/errorHandler";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Check } from "lucide-react";
import {
  EventDetailsForm,
  type EventDetailsFormData,
} from "../components/events/EventDetailsForm";
import {
  RSVPSettings,
  type RSVPSettingsFormData,
} from "../components/events/RSVPSettings";
import {
  ContactUploadForm,
  type ContactFormData,
} from "../components/events/ContactUploadForm";
import {
  CSVUploader,
  type ParsedGuest,
} from "../components/events/CSVUploader";
import { ContactList, type Guest } from "../components/events/ContactList";
import { SendInvitesButton } from "../components/events/SendInvitesButton";

type WizardStep = 1 | 2 | 3;

export const CreateEvent = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [eventDetailsData, setEventDetailsData] = useState<
    Partial<EventDetailsFormData> | undefined
  >(undefined);
  const [rsvpSettingsData, setRsvpSettingsData] = useState<
    Partial<RSVPSettingsFormData> | undefined
  >(undefined);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [deletingGuestId, setDeletingGuestId] = useState<string | undefined>();
  const [uploadingCSV, setUploadingCSV] = useState(false);

  // ... (Keep existing useEffect data fetching logic) ...
  // Fetch existing event data if we have an eventId
  useEffect(() => {
    if (eventId && token) {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      fetch(`${apiUrl}/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const event = data.event;

            // Format event date for datetime-local input
            let formattedEventDate = "";
            if (event.eventDate) {
              const date = new Date(event.eventDate);
              formattedEventDate = date.toISOString().slice(0, 16);
            }

            // Format RSVP deadline for datetime-local input
            let formattedRsvpDeadline = "";
            if (event.rsvpDeadline) {
              const date = new Date(event.rsvpDeadline);
              formattedRsvpDeadline = date.toISOString().slice(0, 16);
            }

            // Set event details data
            setEventDetailsData({
              title: event.title,
              description: event.description,
              venue: event.venue,
              eventDate: formattedEventDate,
            });

            // Set RSVP settings data
            setRsvpSettingsData({
              rsvpEnabled: !!(
                event.rsvpDeadline ||
                event.guestLimit ||
                event.customQuestions?.length > 0
              ),
              rsvpDeadline: formattedRsvpDeadline,
              guestLimit: event.guestLimit || null,
              allowGuestView: event.allowGuestView || false,
              customQuestions:
                event.customQuestions?.map((q: string) => ({ question: q })) ||
                [],
            });
          }
        })
        .catch((err) => console.error("Failed to load event", err));
    }
  }, [eventId, token]);

  // ... (Keep existing handlers, just copy them) ...
  const handleEventDetailsSubmit = async (data: EventDetailsFormData) => {
    if (!eventId || !token) return;

    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update event");
      }

      // Success - move to next step
      setCurrentStep(2);
    } catch (error) {
      console.error("Error saving event details:", error);
      alert("Failed to save event details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRSVPSettingsSubmit = async (data: RSVPSettingsFormData) => {
    if (!eventId || !token) return;

    setIsLoading(true);
    try {
      // Transform the data to match backend schema
      const updateData = {
        rsvpDeadline:
          data.rsvpEnabled && data.rsvpDeadline ? data.rsvpDeadline : null,
        guestLimit:
          data.rsvpEnabled && data.guestLimit ? data.guestLimit : null,
        allowGuestView: data.rsvpEnabled ? data.allowGuestView : false,
        customQuestions: data.rsvpEnabled
          ? data.customQuestions.map((q) => q.question)
          : [],
      };

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update RSVP settings");
      }

      // Success - move to next step
      setCurrentStep(3);
    } catch (error) {
      console.error("Error saving RSVP settings:", error);
      alert("Failed to save RSVP settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  };

  // Load guests when on step 3
  useEffect(() => {
    if (currentStep === 3 && eventId && token) {
      loadGuests();
    }
  }, [currentStep, eventId, token]);

  const loadGuests = async () => {
    if (!eventId || !token) return;

    setLoadingGuests(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/events/${eventId}/guests`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setGuests(result.guests || []);
      }
    } catch (error) {
      console.error("Error loading guests:", error);
    } finally {
      setLoadingGuests(false);
    }
  };

  const handleAddGuest = async (data: ContactFormData) => {
    if (!eventId || !token) return;

    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/events/${eventId}/guests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add guest");
      }

      // Reload guests
      await loadGuests();
    } catch (error: unknown) {
      console.error("Error adding guest:", error);
      alert(getErrorMessage(error) || "Failed to add guest.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!eventId || !token) return;

    setDeletingGuestId(guestId);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(
        `${apiUrl}/api/events/${eventId}/guests/${guestId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete guest");
      }

      // Reload guests
      await loadGuests();
    } catch (error: unknown) {
      console.error("Error deleting guest:", error);
      alert(getErrorMessage(error) || "Failed to delete guest.");
    } finally {
      setDeletingGuestId(undefined);
    }
  };

  const handleCSVUpload = async (guestsData: ParsedGuest[]) => {
    if (!eventId || !token) return;

    setUploadingCSV(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(
        `${apiUrl}/api/events/${eventId}/guests/upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ guests: guestsData }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to upload guests");
      }

      // Show summary
      alert(
        `Upload complete!\n\nImported: ${result.imported}\nFailed: ${
          result.failed
        }${result.errors.length > 0 ? "\n\nCheck console for errors" : ""}`
      );

      if (result.errors.length > 0) {
        console.error("CSV Upload Errors:", result.errors);
      }

      // Reload guests
      await loadGuests();
    } catch (error: unknown) {
      console.error("Error uploading CSV:", error);
      alert(getErrorMessage(error) || "Failed to upload CSV.");
    } finally {
      setUploadingCSV(false);
    }
  };

  const handlePublishSuccess = () => {
    // Reload event data to update status
    if (eventId && token) {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      fetch(`${apiUrl}/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Event status should now be 'sent'
            console.log("Event status updated:", data.event.status);
          }
        })
        .catch((err) => console.error("Failed to reload event", err));
    }
  };

  const handleFinish = () => {
    navigate("/dashboard");
  };

  const steps = [
    { number: 1, title: "Event Details" },
    { number: 2, title: "RSVP & Settings" },
    { number: 3, title: "Guest List" },
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress Stepper */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-brand-black text-center mb-8">
            Design Your Experience
          </h1>
          <div className="flex justify-center items-center space-x-4">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`
                            flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all
                            ${
                              currentStep >= step.number
                                ? "bg-brand-mirage text-white"
                                : "bg-brand-sand text-neutral-400"
                            }
                         `}
                >
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`ml-3 font-medium ${
                    currentStep >= step.number
                      ? "text-brand-mirage"
                      : "text-neutral-400"
                  }`}
                >
                  {step.title}
                </span>
                {step.number < 3 && (
                  <div className="w-12 h-px bg-neutral-200 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <Card className="shadow-lg border-brand-sand bg-white overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">
                {currentStep === 1 && "Start with the details"}
                {currentStep === 2 && "Configure RSVP options"}
                {currentStep === 3 && "Manage your guest list"}
              </h2>
              {currentStep > 1 && (
                <Button variant="ghost" onClick={handleBack} size="sm">
                  &larr; Back
                </Button>
              )}
            </div>

            {currentStep === 1 && (
              <EventDetailsForm
                initialData={eventDetailsData}
                onSubmit={handleEventDetailsSubmit}
                isLoading={isLoading}
              />
            )}

            {currentStep === 2 && (
              <RSVPSettings
                initialData={rsvpSettingsData}
                onSubmit={handleRSVPSettingsSubmit}
                isLoading={isLoading}
              />
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-bold text-brand-mirage text-lg">
                      Add Individual Guest
                    </h3>
                    <ContactUploadForm
                      onSubmit={handleAddGuest}
                      isLoading={isLoading}
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-brand-mirage text-lg">
                      Bulk Upload
                    </h3>
                    <CSVUploader
                      onUpload={handleCSVUpload}
                      isUploading={uploadingCSV}
                    />
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-8">
                  <h3 className="font-bold text-brand-mirage text-lg mb-4">
                    Guest List ({guests.length})
                  </h3>
                  {loadingGuests ? (
                    <div className="text-center py-8">Loading...</div>
                  ) : (
                    <ContactList
                      guests={guests}
                      onDelete={handleDeleteGuest}
                      isDeleting={deletingGuestId}
                    />
                  )}
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-neutral-100">
                  <Button variant="outline" onClick={handleFinish}>
                    Finish Later
                  </Button>
                  {eventId && (
                    <SendInvitesButton
                      eventId={eventId}
                      guestCount={guests.length}
                      onSuccess={handlePublishSuccess}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};
