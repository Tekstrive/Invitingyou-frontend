import { Mail, Calendar, Users, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

const features = [
  {
    name: "Beautiful Designs",
    description:
      "Choose from hundreds of hand-crafted templates or create your own from scratch using our powerful editor.",
    icon: Heart,
  },
  {
    name: "Seamless RSVP",
    description:
      "Track opens, clicks, and responses in real-time. Manage your guest list with zero stress.",
    icon: Users,
  },
  {
    name: "Ad-Free Experience",
    description:
      "Your guests deserve the best. No pop-ups, no banners, just your beautiful invitation.",
    icon: Mail,
  },
  {
    name: "Smart Reminders",
    description:
      "Automatically send reminders to guests who haven't responded or event updates to everyone.",
    icon: Calendar,
  },
];

export const Features = () => {
  return (
    <div className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:text-center mb-16">
          <h2 className="text-brand-orange font-semibold tracking-wide uppercase text-sm">
            Why InvitingYou?
          </h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-brand-mirage sm:text-4xl">
            Everything you need for the perfect event
          </p>
          <p className="mt-4 max-w-2xl text-xl text-neutral-500 lg:mx-auto">
            From the first save-the-date to the final thank you note, we make
            hosting effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.name}
              className="border-none shadow-none bg-brand-sand/30 hover:bg-brand-sand transition-colors duration-300"
            >
              <CardHeader>
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-brand-mirage text-brand-orange mb-4 mx-auto md:mx-0">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <CardTitle className="text-lg font-sans font-semibold text-center md:text-left text-brand-mirage">
                  {feature.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-neutral-500 text-center md:text-left">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
