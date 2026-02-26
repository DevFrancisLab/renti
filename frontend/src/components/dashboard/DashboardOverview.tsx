import { useState, useMemo } from "react";
import { TrendingUp, Users, Home, DollarSign, CheckCircle2, AlertCircle, Eye, CheckCheck, Wrench, Check, X, XCircle, UserPlus, Bot } from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Greeting from "@/components/dashboard/Greeting";
import AIAssistantWidget from "@/components/dashboard/AIAssistantWidget";

interface KPICardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  iconBgColor: string;
  iconColor: string;
}

interface Tenant {
  id: number;
  name: string;
  room: string;
  rent: number;
  status: "Paid" | "Due" | "Overdue";
  lastPayment: string;
}

interface MaintenanceRequest {
  id: string;
  tenantName: string;
  room: string;
  type: "Plumbing" | "Electrical" | "Other";
  status: "Pending" | "In Progress" | "Completed";
  submittedDate: string;
}

const KPICard = ({ icon, title, value, description, iconBgColor, iconColor }: KPICardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl ${iconBgColor} flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium mb-2">{title}</p>
      <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{value}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

const DashboardOverview = () => {
  // Mock data
  const initialTenants: Tenant[] = [
    { id: 1, name: "Alice Kipchoge", room: "1A", rent: 45000, status: "Paid", lastPayment: "Feb 22, 2024" },
    { id: 2, name: "Bob Kamau", room: "1B", rent: 45000, status: "Due", lastPayment: "Feb 15, 2024" },
    { id: 3, name: "Carol Kipchoge", room: "2B", rent: 50000, status: "Paid", lastPayment: "Feb 20, 2024" },
    { id: 4, name: "David Kipchoge", room: "3A", rent: 48000, status: "Overdue", lastPayment: "Jan 28, 2024" },
    { id: 5, name: "Emma Kipchoge", room: "3B", rent: 40000, status: "Paid", lastPayment: "Feb 21, 2024" },
    { id: 6, name: "Frank Kipchoge", room: "4A", rent: 52000, status: "Due", lastPayment: "Feb 10, 2024" },
  ];

  const initialMaintenanceRequests: MaintenanceRequest[] = [
    { id: "MR-001", tenantName: "Alice Kipchoge", room: "1A", type: "Plumbing", status: "Pending", submittedDate: "Feb 22, 2024" },
    { id: "MR-002", tenantName: "Bob Kamau", room: "1B", type: "Electrical", status: "In Progress", submittedDate: "Feb 20, 2024" },
    { id: "MR-003", tenantName: "Carol Kipchoge", room: "2B", type: "Other", status: "Pending", submittedDate: "Feb 21, 2024" },
  ];

  // State management
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(initialMaintenanceRequests);
  const [showOverdueBanner, setShowOverdueBanner] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);

  // Computed values for KPIs
  const kpisData = useMemo(() => {
    const totalCollected = tenants
      .filter((t) => t.status === "Paid")
      .reduce((sum, t) => sum + t.rent, 0);

    const totalUpcoming = tenants
      .filter((t) => t.status === "Due" || t.status === "Overdue")
      .reduce((sum, t) => sum + t.rent, 0);

    const occupied = tenants.length;
    const vacant = 2;
    const occupancyRate = ((occupied / (occupied + vacant)) * 100).toFixed(1);

    const pendingMaintenance = maintenanceRequests.filter((r) => r.status === "Pending").length;
    const inProgressMaintenance = maintenanceRequests.filter((r) => r.status === "In Progress").length;

    return {
      totalCollected,
      totalUpcoming,
      occupied,
      vacant,
      occupancyRate,
      pendingMaintenance,
      inProgressMaintenance,
    };
  }, [tenants, maintenanceRequests]);

  const kpiStats = [
    {
      icon: <DollarSign size={28} />,
      title: "Total Rent Collected",
      value: `KES ${(kpisData.totalCollected / 1000000).toFixed(2)}M`,
      description: `This month (${tenants.filter((t) => t.status === "Paid").length} of ${tenants.length} properties paid)`,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: <Home size={28} />,
      title: "Rooms Occupied / Vacant",
      value: `${kpisData.occupied} / ${kpisData.vacant}`,
      description: `${kpisData.occupancyRate}% occupancy rate`,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: <TrendingUp size={28} />,
      title: "Upcoming Rent Due",
      value: `KES ${(kpisData.totalUpcoming / 1000).toFixed(0)}K`,
      description: "Due in the next 7 days",
      iconBgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      icon: <AlertCircle size={28} />,
      title: "Pending Maintenance",
      value: (kpisData.pendingMaintenance + kpisData.inProgressMaintenance).toString(),
      description: `${kpisData.pendingMaintenance} Pending • ${kpisData.inProgressMaintenance} In Progress`,
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  // Computed chart data
  const rentCollectionData = useMemo(() => {
    const baseMonth = 1800000;
    const growth = 100000;
    return [
      { month: "Sep", collected: baseMonth, target: baseMonth + 200000 },
      { month: "Oct", collected: baseMonth + growth, target: baseMonth + growth + 150000 },
      { month: "Nov", collected: baseMonth + growth * 2, target: baseMonth + growth * 2 + 100000 },
      { month: "Dec", collected: baseMonth + growth * 3, target: baseMonth + growth * 3 + 50000 },
      { month: "Jan", collected: baseMonth + growth * 4 - 50000, target: baseMonth + growth * 4 },
      { month: "Feb", collected: kpisData.totalCollected, target: baseMonth + growth * 5 },
    ];
  }, [kpisData.totalCollected]);

  const occupancyData = useMemo(() => [
    { name: "Occupied", value: kpisData.occupied, fill: "#0ea5e9" },
    { name: "Vacant", value: kpisData.vacant, fill: "#cbd5e1" },
  ], [kpisData.occupied, kpisData.vacant]);

  // Handler functions for interactivity
  const handleMaintenanceApprove = (id: string) => {
    setMaintenanceRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "In Progress" } : req
      )
    );
  };

  const handleMaintenanceReject = (id: string) => {
    setMaintenanceRequests((prev) =>
      prev.filter((req) => req.id !== id)
    );
  };

  const handlePaymentStatusChange = (tenantId: number) => {
    setTenants((prev) =>
      prev.map((tenant) => {
        if (tenant.id === tenantId) {
          const newStatus = tenant.status === "Paid" ? "Due" : "Paid";
          return { ...tenant, status: newStatus as "Paid" | "Due" | "Overdue" };
        }
        return tenant;
      })
    );
  };

  // Quick Actions handlers (mock)
  const handleQuickAction = (action: string) => {
    alert(`Quick Action: ${action}`);
  };

  // Calculate overdue rent summary
  const overdueTenants = tenants.filter((t) => t.status === "Overdue");
  const overdueAmount = overdueTenants.reduce((sum, t) => sum + t.rent, 0);

  return (
    <div className="flex flex-col gap-8 relative">
      {/* Overdue Banner */}
      {showOverdueBanner && overdueTenants.length > 0 && (
        <div className="relative flex items-center gap-4 bg-red-100 border border-red-300 rounded-xl px-6 py-4 text-red-800 shadow-md">
          <span className="text-lg font-semibold">⚠️ Overdue Rent:</span>
          <span className="text-md font-medium">KES {overdueAmount.toLocaleString()} overdue from {overdueTenants.length} tenant{overdueTenants.length > 1 ? "s" : ""}</span>
          <button
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            onClick={() => setShowOverdueBanner(false)}
            aria-label="Dismiss overdue banner"
          >
            <XCircle size={22} />
          </button>
        </div>
      )}
      <Greeting name="Frank" />
      {/* Quick Actions Card */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-6 mb-4 shadow-card">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h2>
        <div className="flex gap-4">
          <button
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-background border border-border shadow hover:bg-primary/10 hover:scale-105 transition-transform group"
            onClick={() => handleQuickAction("Record Payment")}
            aria-label="Record Payment"
          >
            <DollarSign size={28} className="text-green-600 group-hover:text-green-800 transition-colors" />
            <span className="text-xs font-medium text-green-700 group-hover:text-green-900">Record Payment</span>
          </button>
          <button
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-background border border-border shadow hover:bg-primary/10 hover:scale-105 transition-transform group"
            onClick={() => handleQuickAction("Add Tenant")}
            aria-label="Add Tenant"
          >
            <UserPlus size={28} className="text-blue-600 group-hover:text-blue-800 transition-colors" />
            <span className="text-xs font-medium text-blue-700 group-hover:text-blue-900">Add Tenant</span>
          </button>
          <button
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-background border border-border shadow hover:bg-primary/10 hover:scale-105 transition-transform group"
            onClick={() => handleQuickAction("Add Room")}
            aria-label="Add Room"
          >
            <Home size={28} className="text-purple-600 group-hover:text-purple-800 transition-colors" />
            <span className="text-xs font-medium text-purple-700 group-hover:text-purple-900">Add Room</span>
          </button>
          <button
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-background border border-border shadow hover:bg-primary/10 hover:scale-105 transition-transform group"
            onClick={() => handleQuickAction("Create Maintenance Request")}
            aria-label="Create Maintenance Request"
          >
            <Wrench size={28} className="text-orange-600 group-hover:text-orange-800 transition-colors" />
            <span className="text-xs font-medium text-orange-700 group-hover:text-orange-900">Create Maintenance</span>
          </button>
        </div>
      </div>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiStats.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} />
        ))}
      </div>
      {/* Floating AI Assistant Icon */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-primary text-primary-foreground rounded-full shadow-lg p-4 hover:bg-primary/90 transition-colors flex items-center justify-center"
        onClick={() => setShowAIChat(true)}
        aria-label="Open AI Assistant"
        style={{ boxShadow: '0 4px 16px rgba(80,80,180,0.15)' }}
      >
        <Bot size={28} />
      </button>
      {/* AI Assistant Chat Popup */}
      {showAIChat && (
        <div className="fixed bottom-24 right-8 z-50">
          <div className="relative">
            <AIAssistantWidget />
            <button
              className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 shadow hover:bg-red-700 transition-colors"
              onClick={() => setShowAIChat(false)}
              aria-label="Close AI Assistant"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
