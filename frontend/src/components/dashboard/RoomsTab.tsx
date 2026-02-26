
import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Room {
  id: number;
  number: string;
  floor: string;
  tenant: string;
  status: "Occupied" | "Vacant";
  rent: number;
}

const initialRooms: Room[] = [
  { id: 1, number: "101", floor: "1", tenant: "Alice Kipchoge", status: "Occupied", rent: 45000 },
  { id: 2, number: "102", floor: "1", tenant: "Vacant", status: "Vacant", rent: 45000 },
  { id: 3, number: "201", floor: "2", tenant: "Bob Kamau", status: "Occupied", rent: 50000 },
  { id: 4, number: "202", floor: "2", tenant: "Vacant", status: "Vacant", rent: 50000 },
];

const RoomsTab = () => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Occupied" | "Vacant">("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);

  // Filtered and searched rooms
  const filteredRooms = rooms.filter((room) => {
    const matchesStatus = filter === "All" || room.status === filter;
    const matchesSearch =
      room.number.includes(search) ||
      room.tenant.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Modal form handlers
  const handleAddRoom = () => {
    setEditRoom(null);
    setModalOpen(true);
  };
  const handleEditRoom = (room: Room) => {
    setEditRoom(room);
    setModalOpen(true);
  };
  const handleDeleteRoom = (id: number) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };
  const handleModalSubmit = (room: Room) => {
    if (editRoom) {
      setRooms((prev) => prev.map((r) => (r.id === room.id ? room : r)));
    } else {
      setRooms((prev) => [...prev, { ...room, id: prev.length + 1 }]);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Rooms</h1>
          <p className="text-muted-foreground">Manage all your properties and rooms</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={handleAddRoom}>
          <Plus size={18} /> Add Room
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by room number or tenant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="w-full md:w-40 px-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">All</option>
          <option value="Occupied">Occupied</option>
          <option value="Vacant">Vacant</option>
        </select>
      </div>

      {/* Rooms Table */}
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Room Number</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Floor</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Tenant Assigned</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Monthly Rent</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map((room) => (
              <tr key={room.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-foreground">{room.number}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{room.floor}</td>
                <td className="px-6 py-4 text-sm text-foreground">{room.tenant}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    room.status === "Occupied"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {room.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-primary">KES {room.rent.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors mr-2"
                    onClick={() => handleEditRoom(room)}
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-card border border-border rounded-2xl shadow-card p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">{editRoom ? "Edit Room" : "Add Room"}</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const number = (form.elements.namedItem("number") as HTMLInputElement).value;
                const floor = (form.elements.namedItem("floor") as HTMLInputElement).value;
                const tenant = (form.elements.namedItem("tenant") as HTMLInputElement).value;
                const status = (form.elements.namedItem("status") as HTMLSelectElement).value as "Occupied" | "Vacant";
                const rent = parseInt((form.elements.namedItem("rent") as HTMLInputElement).value);
                handleModalSubmit({
                  id: editRoom ? editRoom.id : rooms.length + 1,
                  number,
                  floor,
                  tenant,
                  status,
                  rent,
                });
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Room Number</label>
                <input
                  name="number"
                  defaultValue={editRoom?.number || ""}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Floor</label>
                <input
                  name="floor"
                  defaultValue={editRoom?.floor || ""}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tenant Assigned</label>
                <input
                  name="tenant"
                  defaultValue={editRoom?.tenant || ""}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={editRoom?.status || "Occupied"}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Occupied">Occupied</option>
                  <option value="Vacant">Vacant</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Monthly Rent (KES)</label>
                <input
                  name="rent"
                  type="number"
                  defaultValue={editRoom?.rent || 0}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editRoom ? "Save Changes" : "Add Room"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsTab;
