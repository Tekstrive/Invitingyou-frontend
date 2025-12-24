import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Button } from "../ui/Button";

// Schema Definition
const eventDetailsSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please select a valid date and time",
  }),
  venue: z.string().max(300, "Venue name is too long").optional(),
});

export type EventDetailsFormData = z.infer<typeof eventDetailsSchema>;

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventDetailsFormData>({
    resolver: zodResolver(eventDetailsSchema),
    defaultValues: {
      title: "",
      description: "",
      eventDate: "",
      venue: "",
      ...initialData,
    },
  });

  // Reset form when initialData changes (e.g. fetching from API)
  useEffect(() => {
    if (initialData) {
      // Ensure date format is compatible with input type="datetime-local" if necessary
      // Often requires YYYY-MM-DDThh:mm format
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h3 className="text-lg font-bold text-gray-900">Event Details</h3>
        <p className="text-sm text-gray-500">
          Tell your guests the who, what, when, and where.
        </p>
      </div>

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Event Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          {...register("title")}
          className={`block w-full rounded-lg border-gray-300 shadow-sm focus:ring-brand-orange focus:border-brand-orange sm:text-sm px-4 py-2 ${
            errors.title
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : ""
          }`}
          placeholder="e.g. Sarah's 30th Birthday Bash"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label
          htmlFor="eventDate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Date & Time <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="datetime-local"
            id="eventDate"
            {...register("eventDate")}
            className={`block w-full rounded-lg border-gray-300 shadow-sm focus:ring-brand-orange focus:border-brand-orange sm:text-sm px-4 py-2 ${
              errors.eventDate
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
          />
        </div>
        {errors.eventDate && (
          <p className="mt-1 text-sm text-red-600">
            {errors.eventDate.message}
          </p>
        )}
      </div>

      {/* Venue */}
      <div>
        <label
          htmlFor="venue"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Venue / Location
        </label>
        <input
          type="text"
          id="venue"
          {...register("venue")}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-brand-indigo focus:border-brand-indigo sm:text-sm px-4 py-2"
          placeholder="e.g. 123 Party Lane, Springfield or 'Zoom'"
        />
        {errors.venue && (
          <p className="mt-1 text-sm text-red-600">{errors.venue.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description / Additional Info
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description")}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-brand-indigo focus:border-brand-indigo sm:text-sm px-4 py-2"
          placeholder="Parking info, dress code, what to bring..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="pt-6 flex justify-end">
        <Button
          type="submit"
          isLoading={isLoading}
          variant="secondary"
          className="rounded-full px-10 h-12 text-base font-semibold"
        >
          Save & Continue
        </Button>
      </div>
    </form>
  );
};
