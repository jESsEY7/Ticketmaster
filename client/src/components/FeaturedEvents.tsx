import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import EventCard from "./EventCard";

interface FeaturedEventsProps {
  cityId: number | null;
  searchQuery: string;
  categoryFilter: string;
}

export default function FeaturedEvents({
  cityId,
  searchQuery,
  categoryFilter
}: FeaturedEventsProps) {
  // Fetch featured events
  const { data: events, isLoading } = useQuery<any[]>({
    queryKey: ['/api/events/featured'],
  });
  
  // Fetch ticket types to get minimum prices
  const { data: allTickets, isLoading: isLoadingTickets } = useQuery<any[]>({
    queryKey: ['/api/events/featured/tickets'],
    enabled: !!events && events.length > 0,
    queryFn: async () => {
      // This wouldn't be efficient in a real app - you'd have an API endpoint
      // that returns events with their minimum prices. This is just a workaround.
      const ticketPromises = events?.map(event => 
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
    
    return matchesCity && matchesSearch && matchesCategory;
  }) || [];
  
  // Get minimum price for each event
  const getMinPrice = (eventId: number) => {
    if (!allTickets) return undefined;
    
    const eventTickets = allTickets.flat().filter(ticket => ticket.eventId === eventId);
    if (!eventTickets.length) return undefined;
    
    return Math.min(...eventTickets.map(ticket => ticket.price));
  };
  
  return (
    <section className="py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Featured Events</h2>
          <Link href="/events">
            <a className="text-primary font-medium hover:text-blue-700">
              View all <span aria-hidden="true">→</span>
            </a>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                variant="featured"
                minPrice={getMinPrice(event.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
