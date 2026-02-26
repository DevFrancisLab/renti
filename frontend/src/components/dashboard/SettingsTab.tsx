import { useState } from "react";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "property", label: "Property Info" },
  { id: "payment", label: "Payment Config" },
  { id: "notifications", label: "Notifications" },
];

const SettingsTab = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({ name: "Frank Kipchoge", email: "frank@renti.com" });
  const [property, setProperty] = useState({ name: "Renti Apartments", address: "123 Main St, Nairobi" });
  const [payment, setPayment] = useState({ method: "Mpesa", account: "123456" });
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Settings</h1>
      <div className="flex border-b border-border mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Settings */}
      {activeTab === "profile" && (
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit" className="mt-4">Save Profile</Button>
        </form>
      )}

      {/* Property Information Settings */}
      {activeTab === "property" && (
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Property Name</label>
            <input
              type="text"
              value={property.name}
              onChange={e => setProperty({ ...property, name: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              value={property.address}
              onChange={e => setProperty({ ...property, address: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit" className="mt-4">Save Property Info</Button>
        </form>
      )}

      {/* Payment Configuration Section */}
      {activeTab === "payment" && (
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <select
              value={payment.method}
              onChange={e => setPayment({ ...payment, method: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary"
            >
              <option value="Mpesa">Mpesa</option>
              <option value="Bank">Bank</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Account/Number</label>
            <input
              type="text"
              value={payment.account}
              onChange={e => setPayment({ ...payment, account: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-2 focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit" className="mt-4">Save Payment Config</Button>
        </form>
      )}

      {/* Notification Preferences Toggle */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Enable Notifications</span>
            <button
              type="button"
              className={`w-12 h-6 rounded-full transition-colors ${notifications ? "bg-primary" : "bg-muted"}`}
              onClick={() => setNotifications(!notifications)}
            >
              <span className={`block w-5 h-5 rounded-full bg-background shadow transform transition-transform ${notifications ? "translate-x-6" : "translate-x-1"}`}></span>
            </button>
            <span className="text-xs text-muted-foreground">{notifications ? "On" : "Off"}</span>
          </div>
          <Button className="mt-4">Save Notification Preferences</Button>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
