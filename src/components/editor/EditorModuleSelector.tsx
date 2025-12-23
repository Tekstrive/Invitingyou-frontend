import { Type, Image, Palette, Layers, Sparkles, Sticker } from "lucide-react";
import { cn } from "../../lib/utils";

export type EditorModule =
  | "text"
  | "images"
  | "background"
  | "stickers"
  | "layers"
  | "effects";

interface EditorModuleSelectorProps {
  activeModule: EditorModule;
  onModuleChange: (module: EditorModule) => void;
}

const modules = [
  {
    id: "text" as EditorModule,
    label: "Text",
    icon: Type,
    description: "Add and edit text",
  },
  {
    id: "images" as EditorModule,
    label: "Images",
    icon: Image,
    description: "Upload images",
  },
  {
    id: "background" as EditorModule,
    label: "Background",
    icon: Palette,
    description: "Change background",
  },
  {
    id: "stickers" as EditorModule,
    label: "Stickers",
    icon: Sticker,
    description: "Add stickers",
  },
  {
    id: "layers" as EditorModule,
    label: "Layers",
    icon: Layers,
    description: "Manage layers",
  },
  {
    id: "effects" as EditorModule,
    label: "Effects",
    icon: Sparkles,
    description: "Premium effects",
    isPremium: true,
  },
];

export const EditorModuleSelector = ({
  activeModule,
  onModuleChange,
}: EditorModuleSelectorProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">
        Modules
      </h3>
      <div className="space-y-1">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;

          return (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all group",
                isActive
                  ? "bg-brand-orange text-white shadow-md"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0",
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-white"
                )}
              />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{module.label}</span>
                  {module.isPremium && (
                    <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">
                      Pro
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "text-xs mt-0.5",
                    isActive
                      ? "text-white/80"
                      : "text-gray-500 group-hover:text-gray-400"
                  )}
                >
                  {module.description}
                </p>
              </div>
              {isActive && <div className="w-1 h-8 bg-white rounded-full" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
