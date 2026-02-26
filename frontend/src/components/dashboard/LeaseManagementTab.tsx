import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, AlertCircle } from "lucide-react";

interface Lease {
  id: number;
  tenant: string;
  room: string;
  startDate: string;
  endDate: string;
  rent: number;
}

const initialLeases: Lease[] = [
  { id: 1, tenant: "Alice Kipchoge", room: "1A", startDate: "2024-01-15", endDate: "2025-01-14", rent: 45000 },
  { id: 2, tenant: "Bob Kamau", room: "1B", startDate: "2023-03-01", endDate: "2025-02-28", rent: 45000 },
  { id: 3, tenant: "Carol Kipchoge", room: "2B", startDate: "2024-06-10", endDate: "2025-06-09", rent: 50000 },
  { id: 4, tenant: "David Kipchoge", room: "3A", startDate: "2024-02-01", endDate: "2024-03-15", rent: 48000 },
];

function isExpiringSoon(endDate: string) {
  const today = new Date();
  const expiry = new Date(endDate);
  const diff = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diff < 30;
}

const LeaseManagementTab = () => {
  const [leases] = useState<Lease[]>(initialLeases);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Lease Management</h1>
          <p className="text-muted-foreground">Manage lease agreements and expiry alerts</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <FileText size={18} /> Generate Lease Agreement
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Tenant Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Room</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Start Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">End Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Monthly Rent</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Expiry Alert</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leases.map((lease) => (
              <tr key={lease.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{lease.tenant}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{lease.room}</td>
                <td className="px-6 py-4 text-sm text-foreground">{lease.startDate}</td>
                <td className="px-6 py-4 text-sm text-foreground">{lease.endDate}</td>
                <td className="px-6 py-4 text-sm font-bold text-primary">KES {lease.rent.toLocaleString()}</td>
                <td className="px-6 py-4">
                  {isExpiringSoon(lease.endDate) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      <AlertCircle size={14} /> Expiring Soon
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Download size={16} /> Download PDF
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

export default LeaseManagementTab;
