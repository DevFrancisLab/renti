import { useState } from "react";
import { Bot, Send } from "lucide-react";

const mockResponses = {
  rent: "Rent is due on the 1st of every month. Overdue tenants are highlighted in the dashboard.",
  tenant: "You can view tenant details by clicking on a room in the Rooms grid or searching in the Tenants tab.",
  payment: "Payments can be recorded in the Payments tab or via Quick Actions.",
  maintenance: "Maintenance requests are managed in the Maintenance tab. Pending requests are shown in alerts.",
};

function getMockResponse(input) {
  const lower = input.toLowerCase();
  if (lower.includes("rent")) return mockResponses.rent;
  if (lower.includes("tenant")) return mockResponses.tenant;
  if (lower.includes("payment")) return mockResponses.payment;
  if (lower.includes("maintenance")) return mockResponses.maintenance;
  return "I'm here to help! Ask me about rent, tenants, payments, or maintenance.";
}

const AIAssistantWidget = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your Renti AI assistant. Ask me anything about rent, tenants, payments, or maintenance." },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setTimeout(() => {
      setMessages((msgs) => [...msgs, { sender: "bot", text: getMockResponse(input) }]);
    }, 600);
    setInput("");
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-card p-6 max-w-md mx-auto mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Bot size={24} className="text-primary" />
        <span className="text-lg font-semibold text-foreground">Renti AI Assistant</span>
      </div>
      <div className="flex flex-col gap-2 mb-4 h-48 overflow-y-auto bg-muted/10 rounded-lg p-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <span className={`px-3 py-2 rounded-lg text-sm ${msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
          placeholder="Ask about rent, tenants..."
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-primary text-primary-foreground rounded-lg px-3 py-2 flex items-center gap-1 hover:bg-primary/90 transition-colors"
          onClick={handleSend}
          aria-label="Send"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIAssistantWidget;
