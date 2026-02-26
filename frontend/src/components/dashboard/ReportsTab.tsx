import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";

const monthlyRevenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 13500 },
  { month: "Mar", revenue: 12800 },
  { month: "Apr", revenue: 14000 },
  { month: "May", revenue: 15000 },
  { month: "Jun", revenue: 14500 },
  { month: "Jul", revenue: 15500 },
  { month: "Aug", revenue: 16000 },
  { month: "Sep", revenue: 15800 },
  { month: "Oct", revenue: 16200 },
  { month: "Nov", revenue: 17000 },
  { month: "Dec", revenue: 17500 },
];

const occupancyData = [
  { name: "Occupied", value: 85 },
  { name: "Vacant", value: 15 },
];
const occupancyColors = ["#4F46E5", "#E5E7EB"];

const latePaymentsData = [
  { month: "Jan", late: 3 },
  { month: "Feb", late: 2 },
  { month: "Mar", late: 4 },
  { month: "Apr", late: 1 },
  { month: "May", late: 2 },
  { month: "Jun", late: 3 },
  { month: "Jul", late: 2 },
  { month: "Aug", late: 1 },
  { month: "Sep", late: 2 },
  { month: "Oct", late: 3 },
  { month: "Nov", late: 2 },
  { month: "Dec", late: 1 },
];

const ReportsTab = () => {
  const reports = [
    {
      id: 1,
      title: "Monthly Revenue Report",
      period: "February 2024",
      date: "Generated on Feb 22, 2024",
      description: "Comprehensive revenue summary including payments, outstanding amounts, and trends.",
    },
    {
      id: 2,
      title: "Occupancy Report",
      period: "February 2024",
      date: "Generated on Feb 22, 2024",
      description: "Overview of room occupancy rates, vacant units, and tenant status.",
    },
    {
      id: 3,
      title: "Tenant Payment History",
      period: "January - February 2024",
      date: "Generated on Feb 22, 2024",
      description: "Detailed payment records for all tenants including payment dates and methods.",
    },
    {
      id: 4,
      title: "Maintenance Summary",
      period: "February 2024",
      date: "Generated on Feb 22, 2024",
      description: "Summary of all maintenance requests, completion rates, and pending issues.",
    },
  ];

  const generateReport = (title: string) => {
    alert(`Generating: ${title}`);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Analytics Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Reports & Analytics</h1>
            <p className="text-muted-foreground">View revenue, occupancy, and payment analytics</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleExport("csv")} variant="outline" className="gap-2">
              <FileText size={18} /> Export CSV
            </Button>
            <Button onClick={() => handleExport("pdf")} variant="outline" className="gap-2">
              <Download size={18} /> Export PDF
            </Button>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-card border border-border rounded-2xl shadow-card p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Rate Chart */}
        <div className="bg-card border border-border rounded-2xl shadow-card p-6">
          <h2 className="text-xl font-semibold mb-4">Occupancy Rate</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={occupancyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {occupancyData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={occupancyColors[idx]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Late Payment Statistics */}
        <div className="bg-card border border-border rounded-2xl shadow-card p-6">
          <h2 className="text-xl font-semibold mb-4">Late Payment Statistics</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={latePaymentsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="late" fill="#F59E42" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Existing Report Generation & Previous Reports Section */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-6">Generate & Download Reports</h2>
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Generate New Report</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 text-center"
              onClick={() => generateReport("Monthly Revenue Report")}
            >
              <span className="text-lg">📊</span>
              <span className="text-sm font-medium">Revenue</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 text-center"
              onClick={() => generateReport("Occupancy Report")}
            >
              <span className="text-lg">📈</span>
              <span className="text-sm font-medium">Occupancy</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 text-center"
              onClick={() => generateReport("Tenant Payment Report")}
            >
              <span className="text-lg">💳</span>
              <span className="text-sm font-medium">Payments</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2 text-center"
              onClick={() => generateReport("Maintenance Report")}
            >
              <span className="text-lg">🔧</span>
              <span className="text-sm font-medium">Maintenance</span>
            </Button>
          </div>
        </div>

        {/* Previous Reports */}
        <h2 className="text-xl font-bold text-foreground mb-6">Previous Reports</h2>
        <div className="grid grid-cols-1 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>Period: <span className="text-foreground font-medium">{report.period}</span></span>
                    <span>{report.date}</span>
                  </div>
                </div>
                <Button className="gap-2 w-full sm:w-auto" onClick={() => downloadReport(report.title)}>
                  <Download size={18} /> Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
// Export button handlers
const handleExport = (type: "csv" | "pdf") => {
  alert(`Exported ${type.toUpperCase()} (placeholder)`);
};
};

const downloadReport = (title: string) => {
  alert(`Downloading: ${title}`);
};

export default ReportsTab;
