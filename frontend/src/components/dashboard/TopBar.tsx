import { useState } from "react";
import { Bell, Search, Settings, LogOut, AlertCircle, Calendar, Wrench, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const TopBar = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      type: "payment",
      title: "Late Payment Alert",
      message: "David Kipchoge (Room 3A) - 25 days overdue",
      icon: AlertCircle,
      color: "text-red-600",
      badge: "bg-red-100",
    },
    {
      id: 2,
      type: "payment",
      title: "Late Payment Alert",
      message: "Frank Kipchoge (Room 4A) - 5 days overdue",
      icon: AlertCircle,
      color: "text-red-600",
      badge: "bg-red-100",
    },
    {
      id: 3,
      type: "lease",
      title: "Lease Expiry Alert",
      message: "Bob Kamau (Room 1B) - Expires in 5 days",
      icon: Calendar,
      color: "text-orange-600",
      badge: "bg-orange-100",
    },
    {
      id: 4,
      type: "maintenance",
      title: "Pending Maintenance Approval",
      message: "Alice Kipchoge (Room 1A) - Plumbing request awaiting approval",
      icon: Wrench,
      color: "text-blue-600",
      badge: "bg-blue-100",
    },
  ];

  const latePayments = notifications.filter((n) => n.type === "payment").length;
  const leaseAlerts = notifications.filter((n) => n.type === "lease").length;
  const maintenancePending = notifications.filter((n) => n.type === "maintenance").length;
  const totalNotifications = notifications.length;

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Search Bar - Hidden on mobile, visible on tablet+ */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search properties, tenants..."
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Search Icon */}
          <button className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors text-foreground">
            <Search size={20} />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
            >
              <Bell size={20} />
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full text-xs font-bold flex items-center justify-center">
                  {totalNotifications}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotificationOpen && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 z-40 md:hidden"
                  onClick={() => setIsNotificationOpen(false)}
                />

                {/* Dropdown Panel */}
                <div className="absolute top-full right-0 mt-2 w-96 max-w-[calc(100vw-1rem)] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="bg-muted/30 border-b border-border p-4">
                    <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
                  </div>

                  {/* Notification Stats */}
                  <div className="grid grid-cols-3 gap-3 p-4 border-b border-border bg-background/50">
                    <div className="text-center">
                      <p className="text-lg font-bold text-red-600">{latePayments}</p>
                      <p className="text-xs text-muted-foreground">Late Payments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-orange-600">{leaseAlerts}</p>
                      <p className="text-xs text-muted-foreground">Lease Alerts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{maintenancePending}</p>
                      <p className="text-xs text-muted-foreground">Maintenance</p>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => {
                        const IconComponent = notification.icon;
                        return (
                          <div
                            key={notification.id}
                            className="px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start gap-3">
                              <div className={`${notification.badge} ${notification.color} p-2 rounded-lg flex-shrink-0`}>
                                <IconComponent size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                                <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle dismiss
                                }}
                                className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
                              >
                                <X size={14} className="text-muted-foreground" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center">
                        <Bell size={32} className="text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No notifications</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-border p-3 bg-muted/20">
                    <button className="w-full px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      View All Alerts
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Settings */}
          <button className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground">
            <Settings size={20} />
          </button>

          {/* User Profile */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold">
              JK
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground">John Kamau</p>
              <p className="text-xs text-muted-foreground">Landlord</p>
            </div>
          </div>

          {/* Mobile User Menu */}
          <button className="sm:hidden p-2 hover:bg-muted rounded-lg transition-colors text-foreground">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
