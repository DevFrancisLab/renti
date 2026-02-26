import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import RoomsTab from "@/components/dashboard/RoomsTab";
import RoomsGrid from "@/components/dashboard/RoomsGrid";
import TenantsTab from "@/components/dashboard/TenantsTab";
import PaymentsTab from "@/components/dashboard/PaymentsTab";
import MaintenanceTab from "@/components/dashboard/MaintenanceTab";
import ReportsTab from "@/components/dashboard/ReportsTab";
import LeaseManagementTab from "@/components/dashboard/LeaseManagementTab";
import SettingsTab from "@/components/dashboard/SettingsTab";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "rooms":
        return <RoomsTab />;
      case "tenants":
        return <TenantsTab />;
      case "payments":
        return <PaymentsTab />;
      case "maintenance":
        return <MaintenanceTab />;
      case "lease":
        return <LeaseManagementTab />;
      case "settings":
        return <SettingsTab />;
      case "reports":
        return <ReportsTab />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Top Bar */}
        <TopBar />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
