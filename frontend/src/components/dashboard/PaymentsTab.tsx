import { useState } from "react";
import { Plus, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const months = ["All", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const statusOptions = ["All", "Paid", "Pending", "Overdue"];

const PaymentsTab = () => {
  const payments = [
    { id: 1, tenant: "Alice Kipchoge", room: "1A", amount: "KES 45,000", dueDate: "Feb 28, 2024", status: "Paid", date: "Feb 26, 2024", method: "M-Pesa" },
    { id: 2, tenant: "Bob Kamau", room: "1B", amount: "KES 45,000", dueDate: "Feb 28, 2024", status: "Paid", date: "Feb 28, 2024", method: "Bank Transfer" },
    { id: 3, tenant: "Carol Kipchoge", room: "2B", amount: "KES 50,000", dueDate: "Feb 28, 2024", status: "Pending", date: "—", method: "—" },
    { id: 4, tenant: "David Kipchoge", room: "3A", amount: "KES 48,000", dueDate: "Jan 28, 2024", status: "Overdue", date: "—", method: "—" },
  ];

  const [month, setMonth] = useState("All");
        const [status, setStatus] = useState("All");

        const getStatusIcon = (status: string) => {
          switch (status) {
            case "Paid":
              return <CheckCircle size={16} className="text-green-600" />;
            case "Pending":
              return <Clock size={16} className="text-yellow-600" />;
            case "Overdue":
              return <AlertCircle size={16} className="text-red-600" />;
            default:
              return null;
          }
        };

        const getStatusColor = (status: string) => {
          switch (status) {
            case "Paid":
              return "bg-green-100 text-green-700";
            case "Pending":
              return "bg-yellow-100 text-yellow-700";
            case "Overdue":
              return "bg-red-100 text-red-700";
            default:
              return "bg-gray-100 text-gray-700";
          }
        };

        // Filter payments
        const filteredPayments = payments.filter((p) => {
          const monthMatch = month === "All" || p.dueDate.startsWith(month);
          const statusMatch = status === "All" || p.status === status;
          return monthMatch && statusMatch;
        });

        return (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Payments</h1>
                <p className="text-muted-foreground">Track all rental payments and transactions</p>
              </div>
              <Button className="gap-2 w-full sm:w-auto">
                <Plus size={18} /> Record Payment
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <select
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="w-full md:w-40 px-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full md:w-40 px-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
                <p className="text-sm text-muted-foreground mb-2">Total Expected</p>
                <p className="text-2xl font-bold text-foreground">KES 425,000</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
                <p className="text-sm text-muted-foreground mb-2">Paid This Month</p>
                <p className="text-2xl font-bold text-green-600">KES 380,000</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
                <p className="text-sm text-muted-foreground mb-2">Pending/Overdue</p>
                <p className="text-2xl font-bold text-red-600">KES 45,000</p>
              </div>
            </div>

            {/* Payments Table - Desktop */}
            <div className="hidden md:block bg-card border border-border rounded-2xl shadow-card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Tenant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Due Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Payment Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className={`border-b border-border hover:bg-muted/20 transition-colors ${payment.status === "Overdue" ? "bg-red-50" : ""}`}>
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{payment.tenant}</p>
                        <p className="text-sm text-muted-foreground">Room {payment.room}</p>
                      </td>
                      <td className="px-6 py-4 text-lg font-bold text-foreground">{payment.amount}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{payment.dueDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)} ${payment.status === "Overdue" ? "ring-2 ring-red-400" : ""}`}>\n                    {getStatusIcon(payment.status)} {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{payment.date}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{payment.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payments Cards - Mobile */}
            <div className="md:hidden grid gap-6">
              {filteredPayments.map((payment) => (
                <div key={payment.id} className={`bg-card border border-border rounded-2xl p-6 shadow-card ${payment.status === "Overdue" ? "bg-red-50" : ""}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{payment.tenant}</h3>
                      <p className="text-sm text-muted-foreground">Room {payment.room}</p>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)} ${payment.status === "Overdue" ? "ring-2 ring-red-400" : ""}`}>\n                {getStatusIcon(payment.status)} {payment.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-lg font-bold text-foreground">{payment.amount}</p>
                    <p className="text-sm text-muted-foreground">Due: {payment.dueDate}</p>
                    {payment.date !== "—" && (
                      <p className="text-sm text-muted-foreground">Paid: {payment.date} via {payment.method}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      };

      export default PaymentsTab;
