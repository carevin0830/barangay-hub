import { LucideIcon } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const Placeholder = ({ title, description, icon: Icon }: PlaceholderProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
          <Icon className="h-10 w-10 text-secondary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-muted-foreground max-w-md">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Placeholder;
