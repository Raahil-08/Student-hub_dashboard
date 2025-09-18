import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, MapPin, Clock, Users } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: "upcoming" | "ongoing" | "ended";
  capacity: number;
  registered: number;
  organizer: string;
  image?: string;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Annual Tech Fest 2024",
    description: "Join us for the biggest technology festival featuring coding competitions, workshops, and tech talks by industry experts.",
    date: "2024-03-15",
    time: "09:00 AM",
    location: "Main Auditorium",
    category: "Technical",
    status: "upcoming",
    capacity: 500,
    registered: 342,
    organizer: "Computer Science Department"
  },
  {
    id: "2",
    title: "Cultural Night - Harmony",
    description: "A spectacular evening of music, dance, and cultural performances by students from various departments.",
    date: "2024-03-10",
    time: "06:00 PM",
    location: "Open Air Theatre",
    category: "Cultural",
    status: "ongoing",
    capacity: 800,
    registered: 756,
    organizer: "Cultural Committee"
  },
  {
    id: "3",
    title: "Career Fair 2024",
    description: "Meet with top recruiters and explore exciting career opportunities across various industries.",
    date: "2024-03-20",
    time: "10:00 AM",
    location: "Exhibition Hall",
    category: "Career",
    status: "upcoming",
    capacity: 1000,
    registered: 423,
    organizer: "Placement Cell"
  },
  {
    id: "4",
    title: "Sports Championship",
    description: "Inter-college sports tournament featuring cricket, football, basketball, and athletics.",
    date: "2024-03-25",
    time: "08:00 AM",
    location: "Sports Complex",
    category: "Sports",
    status: "upcoming",
    capacity: 300,
    registered: 189,
    organizer: "Sports Department"
  },
  {
    id: "5",
    title: "Innovation Workshop",
    description: "Learn about latest innovations in AI, blockchain, and IoT from industry professionals.",
    date: "2024-03-12",
    time: "02:00 PM",
    location: "Innovation Lab",
    category: "Workshop",
    status: "ongoing",
    capacity: 100,
    registered: 95,
    organizer: "Innovation Cell"
  },
  {
    id: "6",
    title: "Art Exhibition - Canvas Dreams",
    description: "Showcase of amazing artwork, paintings, and sculptures created by talented students.",
    date: "2024-03-30",
    time: "11:00 AM",
    location: "Art Gallery",
    category: "Arts",
    status: "upcoming",
    capacity: 200,
    registered: 87,
    organizer: "Fine Arts Department"
  }
];

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(event => event.status === statusFilter.toLowerCase());
    }

    // Category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter, categoryFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "upcoming":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "ended":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technical":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Cultural":
        return "bg-pink-500/10 text-pink-500 border-pink-500/20";
      case "Sports":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "Career":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      case "Workshop":
        return "bg-teal-500/10 text-teal-500 border-teal-500/20";
      case "Arts":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusCounts = () => {
    return {
      All: events.length,
      Upcoming: events.filter(e => e.status === 'upcoming').length,
      Ongoing: events.filter(e => e.status === 'ongoing').length,
      Ended: events.filter(e => e.status === 'ended').length
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Calendar className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Upcoming Events</h1>
          <p className="text-muted-foreground">Discover and register for exciting college events</p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Badge 
            key={status}
            variant={statusFilter === status ? "default" : "secondary"}
            className="cursor-pointer px-3 py-1"
            onClick={() => setStatusFilter(status)}
          >
            {status}: {count}
          </Badge>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search events, organizers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Technical">Technical</SelectItem>
            <SelectItem value="Cultural">Cultural</SelectItem>
            <SelectItem value="Sports">Sports</SelectItem>
            <SelectItem value="Career">Career</SelectItem>
            <SelectItem value="Workshop">Workshop</SelectItem>
            <SelectItem value="Arts">Arts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No events found matching your criteria.</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300 border-border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                  <Badge className={`text-xs ${getStatusColor(event.status)} capitalize`}>
                    {event.status}
                  </Badge>
                </div>
                <Badge className={`w-fit text-xs ${getCategoryColor(event.category)}`}>
                  {event.category}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {event.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{event.registered}/{event.capacity} registered</span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-3">
                    Organized by {event.organizer}
                  </p>
                  
                  <Button 
                    className="w-full" 
                    variant={event.status === 'ongoing' ? 'default' : 'outline'}
                    disabled={event.registered >= event.capacity || event.status === 'ended'}
                  >
                    {event.status === 'ended' ? 'Event Ended' :
                     event.registered >= event.capacity ? 'Registration Full' :
                     event.status === 'ongoing' ? 'Join Now' : 'Register'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}