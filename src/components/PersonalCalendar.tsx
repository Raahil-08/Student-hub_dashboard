import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PersonalEvent {
  id: string;
  date: Date;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
}

const priorityConfig = {
  high: { label: 'High Priority', color: 'bg-red-500', textColor: 'text-red-500' },
  medium: { label: 'Medium Priority', color: 'bg-orange-500', textColor: 'text-orange-500' },
  low: { label: 'Low Priority', color: 'bg-green-500', textColor: 'text-green-500' },
};

export function PersonalCalendar() {
  const [selected, setSelected] = useState<Date>();
  const [events, setEvents] = useState<PersonalEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventPriority, setEventPriority] = useState<'high' | 'medium' | 'low'>('low');

  const handleAddEvent = () => {
    if (selected && eventTitle.trim()) {
      const newEvent: PersonalEvent = {
        id: Date.now().toString(),
        date: selected,
        title: eventTitle.trim(),
        description: eventDescription.trim() || undefined,
        priority: eventPriority,
      };
      setEvents([...events, newEvent]);
      setEventTitle("");
      setEventDescription("");
      setEventPriority('low');
      setIsDialogOpen(false);
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const hasEvents = (date: Date) => {
    return getEventsForDate(date).length > 0;
  };

  const getHighestPriorityForDate = (date: Date) => {
    const dateEvents = getEventsForDate(date);
    if (dateEvents.length === 0) return null;
    
    // Return the highest priority (high > medium > low)
    if (dateEvents.some(event => event.priority === 'high')) return 'high';
    if (dateEvents.some(event => event.priority === 'medium')) return 'medium';
    return 'low';
  };

  const getEventsByPriority = (priority: 'high' | 'medium' | 'low') => {
    return events.map(event => event.date).filter(date => 
      getHighestPriorityForDate(date) === priority
    );
  };

  return (
    <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Personal Reminders
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Personal Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Selected Date: {selected ? format(selected, 'PPP') : 'No date selected'}
                </label>
              </div>
              <div>
                <Input
                  placeholder="Event title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
              </div>
              <div>
                <Input
                  placeholder="Description (optional)"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <Select value={eventPriority} onValueChange={(value: 'high' | 'medium' | 'low') => setEventPriority(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    <SelectItem value="high" className="hover:bg-accent">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        High Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="medium" className="hover:bg-accent">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        Medium Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="low" className="hover:bg-accent">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        Low Priority
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleAddEvent} 
                disabled={!selected || !eventTitle.trim()}
                className="w-full"
              >
                Add Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={setSelected}
            className={cn("p-3 pointer-events-auto calendar-with-dots")}
            modifiers={{
              highPriority: getEventsByPriority('high'),
              mediumPriority: getEventsByPriority('medium'),
              lowPriority: getEventsByPriority('low'),
            }}
            modifiersClassNames={{
              highPriority: "high-priority-day",
              mediumPriority: "medium-priority-day", 
              lowPriority: "low-priority-day",
            }}
            footer={
              selected ? (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Selected: {format(selected, 'PPP')}
                  </p>
                  {getEventsForDate(selected).length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Events:</p>
                      {getEventsForDate(selected).map((event) => (
                        <div key={event.id} className="p-2 rounded bg-accent/20 text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${priorityConfig[event.priority].color}`}></div>
                            <p className="font-medium">{event.title}</p>
                          </div>
                          {event.description && (
                            <p className="text-muted-foreground ml-4">{event.description}</p>
                          )}
                          <p className={`text-xs ml-4 ${priorityConfig[event.priority].textColor}`}>
                            {priorityConfig[event.priority].label}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-4">Pick a day to add events.</p>
              )
            }
          />
        </div>
      </div>

    </div>
  );
}