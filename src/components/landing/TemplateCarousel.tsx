import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

// Mock data for templates
const templates = [
  {
    id: 1,
    title: "Floral Wedding",
    category: "Wedding",
    color: "bg-rose-100",
    image:
      "https://images.unsplash.com/photo-1519225468359-2996bc15e527?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 2,
    title: "Gold Birthday",
    category: "Birthday",
    color: "bg-neutral-900",
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c539d174?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    title: "Holiday Party",
    category: "Holiday",
    color: "bg-green-800",
    image:
      "https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 4,
    title: "Summer Brunch",
    category: "Party",
    color: "bg-yellow-100",
    image:
      "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=400",
  },
];

export const TemplateCarousel = () => {
  return (
    <div className="bg-brand-sage-light py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-brand-black">
              Trending Designs
            </h2>
            <p className="mt-2 text-neutral-600">
              Hand-picked templates for your next occasion.
            </p>
          </div>
          <Link
            to="/templates"
            className="hidden md:block text-brand-black font-medium hover:text-brand-gold hover:underline underline-offset-4 decoration-2"
          >
            View Collection &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {templates.map((template) => (
            <div key={template.id} className="group relative cursor-pointer">
              <div className="aspect-[3/4] w-full overflow-hidden rounded-lg shadow-md bg-white group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <img
                  src={template.image}
                  alt={template.title}
                  className="h-full w-full object-cover object-center opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <Button variant="secondary" className="w-full">
                    Use this Design
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-brand-gold transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-sm text-gray-500">{template.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link to="/templates">
            <Button variant="outline">View All Templates</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
