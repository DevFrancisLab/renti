
import { useState } from "react";
import { Plus, Mail, Phone, Edit2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Tenant {
  id: number;
  name: string;
  phone: string;
  email: string;
  room: string;
  moveInDate: string;
  leaseExpiry: string;
}

const initialTenants: Tenant[] = [
  { id: 1, name: "Alice Kipchoge", phone: "+254 712 345 678", email: "alice@example.com", room: "1A", moveInDate: "Jan 15, 2024", leaseExpiry: "Jan 14, 2025" },
  { id: 2, name: "Bob Kamau", phone: "+254 723 456 789", email: "bob@example.com", room: "1B", moveInDate: "Mar 01, 2023", leaseExpiry: "Feb 28, 2025" },
  { id: 3, name: "Carol Kipchoge", phone: "+254 734 567 890", email: "carol@example.com", room: "2B", moveInDate: "Jun 10, 2024", leaseExpiry: "Jun 09, 2025" },
];

function getStatus(leaseExpiry: string) {
  // Lease expiring soon if less than 30 days from today
  const today = new Date();
  const expiry = new Date(leaseExpiry);
  const diff = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 30) return { label: "Lease Expiring Soon", color: "bg-yellow-100 text-yellow-700" };
  return { label: "Active", color: "bg-green-100 text-green-700" };
}

const TenantsTab = () => {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerTenant, setDrawerTenant] = useState<Tenant | null>(null);

  // Filtered tenants
  const filteredTenants = tenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(search.toLowerCase()) ||
    tenant.room.toLowerCase().includes(search.toLowerCase()) ||
    tenant.phone.includes(search)
  );

  // Modal form handlers
  const handleAddTenant = () => {
    setModalOpen(true);
  };
  const handleModalSubmit = (tenant: Tenant) => {
    setTenants((prev) => [...prev, { ...tenant, id: prev.length + 1 }]);
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Tenants</h1>
          <p className="text-muted-foreground">View and manage all tenant information</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={handleAddTenant}>
          <Plus size={18} /> Add Tenant
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, room, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Tenants Table - Desktop */}
      <div className="hidden md:block bg-card border border-border rounded-2xl shadow-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Room</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Lease Start</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Lease End</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map((tenant) => {
              const status = getStatus(tenant.leaseExpiry);
              return (
                <tr key={tenant.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{tenant.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{tenant.phone}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{tenant.room}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{tenant.moveInDate}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{tenant.leaseExpiry}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>{status.label}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors mr-2"
                      onClick={() => setDrawerTenant(tenant)}
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tenants Cards - Mobile */}
      <div className="md:hidden grid gap-6">
        {filteredTenants.map((tenant) => {
          const status = getStatus(tenant.leaseExpiry);
          return (
            <div key={tenant.id} className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">{tenant.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>{status.label}</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-muted-foreground" />
                  <p className="text-muted-foreground">{tenant.phone}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-muted-foreground" />
                  <p className="text-muted-foreground">{tenant.email}</p>
                </div>
                <p className="text-sm"><span className="text-muted-foreground">Room:</span> <span className="font-medium text-foreground">{tenant.room}</span></p>
                <p className="text-sm"><span className="text-muted-foreground">Lease Start:</span> <span className="font-medium text-foreground">{tenant.moveInDate}</span></p>
                <p className="text-sm"><span className="text-muted-foreground">Lease End:</span> <span className="font-medium text-foreground">{tenant.leaseExpiry}</span></p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                  onClick={() => setDrawerTenant(tenant)}
                >
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Tenant Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-card border border-border rounded-2xl shadow-card p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">Add Tenant</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
                const email = (form.elements.namedItem("email") as HTMLInputElement).value;
                const room = (form.elements.namedItem("room") as HTMLInputElement).value;
                const moveInDate = (form.elements.namedItem("moveInDate") as HTMLInputElement).value;
                const leaseExpiry = (form.elements.namedItem("leaseExpiry") as HTMLInputElement).value;
                handleModalSubmit({
                  id: tenants.length + 1,
                  name,
                  phone,
                  email,
                  room,
                  moveInDate,
                  leaseExpiry,
                });
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  name="phone"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Assigned Room</label>
                <input
                  name="room"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Lease Start Date</label>
                <input
                  name="moveInDate"
                  type="date"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Lease End Date</label>
                <input
                  name="leaseExpiry"
                  type="date"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Tenant</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tenant Profile Drawer/Modal */}
      {drawerTenant && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30">
          <div className="bg-card border border-border rounded-2xl shadow-card p-8 w-full max-w-md md:max-w-lg md:mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Tenant Profile</h2>
              <Button variant="outline" size="sm" onClick={() => setDrawerTenant(null)}>Close</Button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="block text-sm text-muted-foreground mb-1">Name</span>
                <span className="text-lg font-semibold text-foreground">{drawerTenant.name}</span>
              </div>
              <div>
                <span className="block text-sm text-muted-foreground mb-1">Phone</span>
                <span className="text-lg font-semibold text-foreground">{drawerTenant.phone}</span>
              </div>
              <div>
                <span className="block text-sm text-muted-foreground mb-1">Email</span>
                <span className="text-lg font-semibold text-foreground">{drawerTenant.email}</span>
              </div>
              <div>
                <span className="block text-sm text-muted-foreground mb-1">Assigned Room</span>
                <span className="text-lg font-semibold text-foreground">{drawerTenant.room}</span>
              </div>
              <div>
                <span className="block text-sm text-muted-foreground mb-1">Lease Start Date</span>
                <span className="text-lg font-semibold text-foreground">{drawerTenant.moveInDate}</span>
              </div>
              <div>
                <span className="block text-sm text-muted-foreground mb-1">Lease End Date</span>
                <span className="text-lg font-semibold text-foreground">{drawerTenant.leaseExpiry}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantsTab;
