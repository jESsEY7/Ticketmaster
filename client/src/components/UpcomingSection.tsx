import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard from "./EventCard";

interface UpcomingSectionProps {
  cityId: number | null;
  searchQuery: string;
  categoryFilter: string;
}

export default function UpcomingSection({
  cityId,
  searchQuery,
  categoryFilter
}: UpcomingSectionProps) {
  const [visibleEvents, setVisibleEvents] = useState(3);
  
  // Fetch all events
  const { data: events, isLoading } = useQuery<any[]>({
    queryKey: ['/api/events'],
  });
  
  // Fetch ticket types to get minimum prices
  const { data: allTickets, isLoading: isLoadingTickets } = useQuery<any[]>({
    queryKey: ['/api/events/tickets'],
    enabled: !!events && events.length > 0,
    queryFn: async () => {
      // This wouldn't be efficient in a real app - you'd have an API endpoint
      // that returns events with their minimum prices. This is just a workaround.
      const ticketPromises = events?.slice(0, visibleEvents).map(event => 
        fetch(`/api/events/${event.id}/tickets`).then(res => res.json())
      ) || [];
      
      return Promise.all(ticketPromises);
    }
  });
  
  // Filter events based on city, search query, and category
  const filteredEvents = events?.filter(event => {
    const matchesCity = cityId ? event.cityId === cityId : true;
    const matchesSearch = searchQuery 
      ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = categoryFilter && categoryFilter !== "all" 
      ? event.categoryId === parseInt(categoryFilter) 
      : true;
    
    // Filter out featured events to avoid duplication
    const isRegular = !event.isFeatured;
    
    return matchesCity && matchesSearch && matchesCategory && isRegular;
  })?.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) || [];
  
  // Get minimum price for each event
  const getMinPrice = (eventId: number) => {
    if (!allTickets) return undefined;
    
    const eventTickets = allTickets.flat().filter(ticket => ticket.eventId === eventId);
    if (!eventTickets.length) return undefined;
    
    return Math.min(...eventTickets.map(ticket => ticket.price));
  };
  
  const handleLoadMore = () => {
    setVisibleEvents(prev => prev + 3);
  };
  
  return (
    <section className="py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 font-heading">Upcoming Events</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {filteredEvents.slice(0, visibleEvents).map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  variant="upcoming"
                  minPrice={getMinPrice(event.id)}
                />
              ))}
            </div>
            
            {visibleEvents < filteredEvents.length && (
              <div className="mt-8 text-center">
                <Button 
                  variant="outline" 
                  onClick={handleLoadMore}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg"
                >
                  Load More Events
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
