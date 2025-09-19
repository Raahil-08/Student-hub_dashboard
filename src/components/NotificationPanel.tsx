import { useState } from "react";
import { Bell, Check, X, User, Award, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  id: string;
  type: 'achievement' | 'approval' | 'event' | 'message';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: 'Achievement Approved',
    description: 'Your "Outstanding Performance in Hackathon" achievement has been approved by faculty.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'event',
    title: 'Upcoming Event Reminder',
    description: 'Tech Conference 2024 is starting in 2 days. Don\'t forget to register!',
    timestamp: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'approval',
    title: 'Certificate Request',
    description: 'Faculty has requested additional documentation for your internship certificate.',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: '4',
    type: 'message',
    title: 'New Message',
    description: 'You have received a message from Dr. Smith regarding your project submission.',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'achievement',
    title: 'Portfolio Updated',
    description: 'Your portfolio has been successfully updated with 3 new achievements.',
    timestamp: '3 days ago',
    read: true,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'achievement':
      return <Award className="w-4 h-4 text-yellow-500" />;
    case 'approval':
      return <Check className="w-4 h-4 text-green-500" />;
    case 'event':
      return <Calendar className="w-4 h-4 text-blue-500" />;
    case 'message':
      return <MessageCircle className="w-4 h-4 text-purple-500" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
};

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div 
                    className={`p-3 rounded-lg transition-colors cursor-pointer group ${
                      !notification.read 
                        ? 'bg-muted/50 hover:bg-muted' 
                        : 'hover:bg-muted/30'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              !notification.read ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.timestamp}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full absolute right-2 top-4" />
                        )}
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator className="my-1" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {notifications.length > 0 && (
          <div className="p-3 border-t">
            <Button variant="ghost" className="w-full text-sm">
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}