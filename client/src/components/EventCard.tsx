import { Link } from "wouter";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, BadgeCheck, Flame, Star, Users, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    venue: string;
    address: string;
    cityId: number;
    categoryId: number;
    startDate: string;
    endDate?: string;
    isFeatured: boolean;
    isTrending: boolean;
  };
  variant?: "featured" | "trending" | "upcoming";
  minPrice?: number;
}

export default function EventCard({ event, variant = "featured", minPrice }: EventCardProps) {
  // Format the date
  const eventDate = new Date(event.startDate);
  const formattedDate = format(eventDate, "EEE, MMM d • h:mm a");
  
  // Determine the badge based on event properties
  const getBadgeContent = () => {
    if (event.isFeatured) {
      return {
        text: "Featured",
        icon: <BadgeCheck className="h-3 w-3 mr-1" />,
        className: "bg-secondary text-white"
      };
    }
    return null;
  };
  
  // Get status indicator based on event properties
  const getStatusIndicator = () => {
    // This is a simplified logic, in a real app you might have more complex conditions
    if (event.categoryId === 1) { // Concerts
      return {
        icon: <Ticket className="mr-1 text-primary" />,
        text: "Limited tickets"
      };
    } else if (event.categoryId === 2) { // Sports
      return {
        icon: <Flame className="mr-1 text-secondary" />,
        text: "Selling fast"
      };
    } else if (event.categoryId === 3) { // Theater
      return {
        icon: <Star className="mr-1 text-yellow-500" />,
        text: "Top rated"
      };
    } else { // Festivals or others
      return {
        icon: <Users className="mr-1 text-primary" />,
        text: "Group packages"
      };
    }
  };
  
  const badge = getBadgeContent();
  const statusIndicator = getStatusIndicator();
  
  // Render different card layouts based on the variant
  if (variant === "trending") {
    return (
      <div className="event-card bg-white rounded-xl shadow-md overflow-hidden">
        <Link href={`/events/${event.id}`}>
          <a className="block">
            <div className="relative h-48">
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white">{event.title}</h3>
                <p className="text-sm text-gray-200">{event.venue} • {event.address.split(',')[0]}</p>
              </div>
            </div>
          </a>
        </Link>
      </div>
    );
  }
  
  if (variant === "upcoming") {
    return (
      <div className="event-card bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-1/4 h-48 sm:h-auto">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                    {event.categoryId === 1 ? "Concerts" : 
                     event.categoryId === 2 ? "Sports" : 
                     event.categoryId === 3 ? "Theater" : "Festivals"}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                </div>
                {minPrice && (
                  <span className="text-sm font-semibold text-primary">From ${minPrice}</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">{event.venue} • {event.address.split(',')[0]}</p>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>{formattedDate}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-600">
                  {statusIndicator.icon}
                  {statusIndicator.text}
                </span>
              </div>
              <Link href={`/events/${event.id}`}>
                <Button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Buy Tickets
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Default (featured) card
  return (
    <div className="event-card bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-48">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        {badge && (
          <Badge 
            className={cn("absolute top-3 right-3 font-bold px-3 py-1", badge.className)}
          >
            {badge.icon}
            {badge.text}
          </Badge>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">{formattedDate}</span>
          {minPrice && (
            <span className="text-sm font-semibold text-primary">From ${minPrice}</span>
          )}
        </div>
        <Link href={`/events/${event.id}`}>
          <a className="block">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
          </a>
        </Link>
        <p className="text-sm text-gray-600 mb-4">{event.venue} • {event.address.split(',')[0]}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 flex items-center">
            {statusIndicator.icon}
            {statusIndicator.text}
          </span>
          <Link href={`/events/${event.id}`}>
            <Button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Buy Tickets
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
