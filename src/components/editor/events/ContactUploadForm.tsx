import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../ui/Button";

// Schema Definition
const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().max(20, "Phone number is too long").optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

interface ContactUploadFormProps {
  onSubmit: (data: ContactFormData) => void;
  isLoading?: boolean;
}

export const ContactUploadForm = ({
  onSubmit,
  isLoading,
}: ContactUploadFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const handleFormSubmit = (data: ContactFormData) => {
    onSubmit(data);
    reset(); // Clear form after submission
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">Add Guest Manually</h3>
        <p className="text-sm text-gray-500">
          Add guests one at a time using this form
        </p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className={`block w-full rounded-lg border-gray-300 shadow-sm focus:ring-brand-orange focus:border-brand-orange sm:text-sm px-4 py-2 ${
              errors.name
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            placeholder="e.g. John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className={`block w-full rounded-lg border-gray-300 shadow-sm focus:ring-brand-orange focus:border-brand-orange sm:text-sm px-4 py-2 ${
              errors.email
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            placeholder="e.g. john@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            {...register("phone")}
            className={`block w-full rounded-lg border-gray-300 shadow-sm focus:ring-brand-orange focus:border-brand-orange sm:text-sm px-4 py-2 ${
              errors.phone
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            placeholder="e.g. +1234567890"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          isLoading={isLoading}
          variant="primary"
          className="w-full rounded-full h-11"
        >
          Add Guest
        </Button>
      </div>
    </form>
  );
};
