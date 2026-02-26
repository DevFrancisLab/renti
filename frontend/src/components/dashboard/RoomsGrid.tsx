import { useState } from "react";
import { BadgeCheck, BadgeAlert, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockRooms = [
  { id: "1A", status: "Occupied", tenant: { name: "Alice Kipchoge", email: "alice@renti.com", phone: "+254700000001" } },
  { id: "1B", status: "Vacant", tenant: null },
  { id: "2A", status: "Occupied", tenant: { name: "Bob Kamau", email: "bob@renti.com", phone: "+254700000002" } },
  { id: "2B", status: "Occupied", tenant: { name: "Carol Kipchoge", email: "carol@renti.com", phone: "+254700000003" } },
  { id: "3A", status: "Vacant", tenant: null },
  { id: "3B", status: "Occupied", tenant: { name: "Emma Kipchoge", email: "emma@renti.com", phone: "+254700000004" } },
  { id: "4A", status: "Occupied", tenant: { name: "Frank Kipchoge", email: "frank@renti.com", phone: "+254700000005" } },
];

const statusColors = {
  Occupied: "bg-green-100 text-green-700",
  Vacant: "bg-gray-100 text-gray-700",
};

const RoomsGrid = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Room Occupancy Grid</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {mockRooms.map(room => (
          <button
            key={room.id}
            className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-border shadow bg-background hover:bg-primary/10 hover:scale-105 transition-transform"
            onClick={() => setSelectedRoom(room)}
            aria-label={`Room ${room.id}`}
          >
            <span className="text-xl font-bold text-foreground">{room.id}</span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[room.status]}`}
            >
              {room.status === "Occupied" ? <BadgeCheck size={16} /> : <BadgeAlert size={16} />}
              {room.status}
            </span>
          </button>
        ))}
      </div>

      {/* Tenant Info Modal */}
      {selectedRoom && selectedRoom.status === "Occupied" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedRoom(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="flex items-center gap-4 mb-4">
              <User size={32} className="text-primary" />
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">{selectedRoom.tenant.name}</h3>
                <p className="text-sm text-muted-foreground">Room {selectedRoom.id}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">Email:</span> {selectedRoom.tenant.email}</p>
              <p><span className="font-medium">Phone:</span> {selectedRoom.tenant.phone}</p>
            </div>
            <Button className="mt-6 w-full" onClick={() => alert(`Contacting ${selectedRoom.tenant.name}`)}>Contact Tenant</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsGrid;
