import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import EventCard from "./EventCard";

export default function TrendingSection() {
  // Fetch trending events
  const { data: trendingEvents, isLoading } = useQuery<any[]>({
    queryKey: ['/api/events/trending'],
  });
  
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Trending This Week</h2>
          <Link href="/events?filter=trending">
            <a className="text-primary font-medium hover:text-blue-700">
              View all <span aria-hidden="true">→</span>
            </a>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : trendingEvents && trendingEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingEvents.slice(0, 3).map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                variant="trending" 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trending events</h3>
            <p className="text-gray-500">
              Check back soon for trending events in your area
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
