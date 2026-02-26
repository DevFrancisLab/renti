import { useEffect, useState } from "react";
import { AlertCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockAlerts = [
  { id: 1, type: "rent", message: "Rent is due today for 2 tenants." },
  { id: 2, type: "maintenance", message: "3 maintenance requests are pending." },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

const Greeting = ({ name = "Frank" }) => {
  const [greeting, setGreeting] = useState(getGreeting());
  const [alerts, setAlerts] = useState(mockAlerts);

  useEffect(() => {
    const timer = setInterval(() => setGreeting(getGreeting()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl md:text-3xl font-bold text-primary">{greeting}, {name}!</span>
        <Bell className="text-primary" size={24} />
      </div>
      {alerts.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-yellow-800">
              <AlertCircle size={18} className="text-yellow-600" />
              <span className="text-sm font-medium">{alert.message}</span>
              {alert.type === "rent" && <Button size="sm" variant="outline" className="ml-auto">View Payments</Button>}
              {alert.type === "maintenance" && <Button size="sm" variant="outline" className="ml-auto">View Requests</Button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Greeting;
