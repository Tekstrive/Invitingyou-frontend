import { useState } from "react";

export interface EventDetailsFormData {
  title: string;
  description: string;
  eventDate: string;
  venue: string;
}

interface EventDetailsFormProps {
  initialData?: Partial<EventDetailsFormData>;
  onSubmit: (data: EventDetailsFormData) => void;
  isLoading?: boolean;
}

export const EventDetailsForm = ({
  initialData,
  onSubmit,
  isLoading,
}: EventDetailsFormProps) => {
  const [formData, setFormData] = useState<EventDetailsFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    eventDate: initialData?.eventDate || "",
    venue: initialData?.venue || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-brand-black mb-1">
          Event Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-black mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-black mb-1">
          Event Date & Time
        </label>
        <input
          type="datetime-local"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-brand-cream rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cream-dark"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-black mb-1">
          Venue
        </label>
        <input
          type="text"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-brand-cream rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cream-dark"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-brand-black text-white rounded-md hover:bg-brand-black/90 disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Continue"}
      </button>
    </form>
  );
};
