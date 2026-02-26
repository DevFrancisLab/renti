import { Clock, DollarSign, Wrench, FileText } from "lucide-react";

const mockActivity = [
  {
    id: 1,
    type: "payment",
    icon: <DollarSign size={20} className="text-green-600" />,
    title: "Payment Received",
    description: "KES 45,000 from Alice Kipchoge",
    timestamp: "Feb 22, 2026, 09:15 AM",
  },
  {
    id: 2,
    type: "maintenance",
    icon: <Wrench size={20} className="text-orange-600" />,
    title: "Maintenance Request",
    description: "Leaking tap reported by Bob Kamau",
    timestamp: "Feb 21, 2026, 16:40 PM",
  },
  {
    id: 3,
    type: "lease",
    icon: <FileText size={20} className="text-blue-600" />,
    title: "Lease Updated",
    description: "Lease agreement renewed for Carol Kipchoge",
    timestamp: "Feb 20, 2026, 11:30 AM",
  },
  {
    id: 4,
    type: "payment",
    icon: <DollarSign size={20} className="text-green-600" />,
    title: "Payment Received",
    description: "KES 48,000 from David Kipchoge",
    timestamp: "Feb 19, 2026, 14:10 PM",
  },
];

const RecentActivityTimeline = () => (
  <div className="bg-card border border-border rounded-2xl shadow-card p-6 max-w-md mx-auto mb-8">
    <h2 className="text-lg font-semibold mb-4 text-foreground">Recent Activity</h2>
    <ol className="relative border-l border-border">
      {mockActivity.map((item) => (
        <li key={item.id} className="mb-8 ml-6">
          <span className="absolute -left-5 top-1 flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border">
            {item.icon}
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-foreground">{item.title}</span>
            <span className="text-xs text-muted-foreground">{item.description}</span>
            <div className="flex items-center gap-1 mt-1">
              <Clock size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{item.timestamp}</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  </div>
);

export default RecentActivityTimeline;
