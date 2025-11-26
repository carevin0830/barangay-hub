import { Users, Building2, Activity, FileText } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import heroImage from "@/assets/barangay-hero.jpg";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

const Dashboard = () => {
  const { data: residents = [] } = useQuery({
    queryKey: ['residents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('residents')
        .select('*')
        .eq('status', 'Active');
      if (error) throw error;
      return data;
    },
  });

  const { data: households = [] } = useQuery({
    queryKey: ['households'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('households')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: certificates = [] } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: ordinances = [] } = useQuery({
    queryKey: ['ordinances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ordinances')
        .select('*')
        .eq('status', 'Active');
      if (error) throw error;
      return data;
    },
  });

  const populationData = useMemo(() => {
    const ageGroups = {
      "0-18": 0,
      "19-30": 0,
      "31-45": 0,
      "46-60": 0,
      "60+": 0,
    };

    residents.forEach((resident) => {
      const age = resident.age;
      if (age <= 18) ageGroups["0-18"]++;
      else if (age <= 30) ageGroups["19-30"]++;
      else if (age <= 45) ageGroups["31-45"]++;
      else if (age <= 60) ageGroups["46-60"]++;
      else ageGroups["60+"]++;
    });

    return Object.entries(ageGroups).map(([ageGroup, count]) => ({
      ageGroup,
      count,
    }));
  }, [residents]);

  const recentResidentsCount = useMemo(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return residents.filter(r => new Date(r.created_at) >= oneMonthAgo).length;
  }, [residents]);

  const recentHouseholdsCount = useMemo(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return households.filter(h => new Date(h.created_at) >= oneMonthAgo).length;
  }, [households]);

  const pendingCertificates = useMemo(() => {
    return certificates.filter(c => c.status === 'Pending').length;
  }, [certificates]);
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
            value={residents.length.toLocaleString()}
            icon={Users}
            trend={`+${recentResidentsCount} this month`}
            trendUp
          />
          <DashboardCard
            title="Total Households"
            value={households.length.toLocaleString()}
            icon={Building2}
            trend={`+${recentHouseholdsCount} this month`}
            trendUp
          />
          <DashboardCard
            title="Active Ordinances"
            value={ordinances.length}
            icon={Activity}
            trend={`${ordinances.length} total`}
          />
          <DashboardCard
            title="Certificates Issued"
            value={certificates.length}
            icon={FileText}
            trend={`${pendingCertificates} pending`}
          />
        </div>

        {/* Population Chart */}
        <Card>
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
      </div>
    </div>
  );
};

export default Dashboard;
