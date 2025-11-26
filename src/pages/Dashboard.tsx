import { Users, Building2, Activity, FileText } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import heroImage from "@/assets/barangay-hero.jpg";

const populationData = [
  { ageGroup: "0-18", count: 245 },
  { ageGroup: "19-30", count: 382 },
  { ageGroup: "31-45", count: 428 },
  { ageGroup: "46-60", count: 315 },
  { ageGroup: "60+", count: 187 },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80" />
        <div className="relative h-full flex items-center px-8">
          <div>
            <h1 className="text-4xl font-bold text-primary-foreground mb-2">
              Barangay Data Hub
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Streamlined community management and data insights
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <DashboardCard
            title="Total Residents"
            value="1,557"
            icon={Users}
            trend="+12 this month"
            trendUp
          />
          <DashboardCard
            title="Total Households"
            value="423"
            icon={Building2}
            trend="+5 this month"
            trendUp
          />
          <DashboardCard
            title="Ongoing Activities"
            value="8"
            icon={Activity}
            trend="3 this week"
          />
          <DashboardCard
            title="Reports Submitted"
            value="24"
            icon={FileText}
            trend="6 pending"
          />
        </div>

        {/* Charts and Notifications */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Population Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Population Distribution by Age Group</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={populationData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="ageGroup" 
                    className="text-sm"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    className="text-sm"
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--secondary))" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Notifications Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-secondary pl-4 py-2">
                <p className="font-medium text-sm">New Birth Registration</p>
                <p className="text-xs text-muted-foreground">Baby Cruz - Zone 3</p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
              <div className="border-l-4 border-accent pl-4 py-2">
                <p className="font-medium text-sm">Upcoming Meeting</p>
                <p className="text-xs text-muted-foreground">Barangay Council Meeting</p>
                <p className="text-xs text-muted-foreground mt-1">Tomorrow, 2:00 PM</p>
              </div>
              <div className="border-l-4 border-primary pl-4 py-2">
                <p className="font-medium text-sm">Report Submitted</p>
                <p className="text-xs text-muted-foreground">Street light repair - Zone 5</p>
                <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
              </div>
              <div className="border-l-4 border-muted pl-4 py-2">
                <p className="font-medium text-sm">Activity Completed</p>
                <p className="text-xs text-muted-foreground">Clean-up Drive - Success</p>
                <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
