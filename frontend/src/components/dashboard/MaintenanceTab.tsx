import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const statusOptions = ["Pending", "In Progress", "Completed"];
const priorityColors = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-blue-100 text-blue-700",
  Low: "bg-green-100 text-green-700",
};

const MaintenanceTab = () => {
  const [requests, setRequests] = useState([
    { id: 1, requestId: "MR-001", tenant: "Alice Kipchoge", room: "1A", issue: "Leaking tap in bathroom", priority: "High", status: "In Progress", submittedDate: "Feb 20, 2024" },
    { id: 2, requestId: "MR-002", tenant: "Carol Kipchoge", room: "2B", issue: "Door lock not working", priority: "Critical", status: "Pending", submittedDate: "Feb 22, 2024" },
    { id: 3, requestId: "MR-003", tenant: "Bob Kamau", room: "1B", issue: "Paint touch-up needed", priority: "Low", status: "Pending", submittedDate: "Feb 15, 2024" },
    { id: 4, requestId: "MR-004", tenant: "David Kipchoge", room: "3A", issue: "Electrical outlet not working", priority: "High", status: "Completed", submittedDate: "Feb 10, 2024" },
  ]);

  const handleStatusChange = (id: number, status: string) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Maintenance Requests</h1>
          <p className="text-muted-foreground">Manage property maintenance and repair requests</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <Plus size={18} /> New Request
        </Button>
      </div>

      {/* Requests Table */}
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Request ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Tenant Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Room Number</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Issue Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date Submitted</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Priority</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 font-medium text-primary">{request.requestId}</td>
                <td className="px-6 py-4 text-sm text-foreground">{request.tenant}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{request.room}</td>
                <td className="px-6 py-4 text-sm text-foreground">{request.issue}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{request.submittedDate}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[request.priority]}`}>{request.priority}</span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={request.status}
                    onChange={e => handleStatusChange(request.id, e.target.value)}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button size="sm" variant="outline">
                    Assign Vendor
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceTab;

