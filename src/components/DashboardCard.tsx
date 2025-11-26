import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  href?: string;
}

const DashboardCard = ({ title, value, icon: Icon, trend, trendUp, href }: DashboardCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (href) {
      navigate(href);
    }
  };

  return (
    <Card 
      className={`transition-all hover:shadow-lg ${href ? 'cursor-pointer hover:scale-105' : ''}`}
      onClick={handleClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-secondary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {trend && (
          <p className={`text-xs mt-1 ${trendUp ? 'text-secondary' : 'text-muted-foreground'}`}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
