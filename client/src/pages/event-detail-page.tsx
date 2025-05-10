import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { Loader2, Calendar, MapPin, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TicketSelector from "@/components/TicketSelector";
import { useAuth } from "@/hooks/use-auth";

export default function EventDetailPage() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/events/:id");
  const { toast } = useToast();
  const { user } = useAuth();
  const eventId = params?.id ? parseInt(params.id) : 0;
  
  const [selectedTickets, setSelectedTickets] = useState<{
    [key: number]: number;
  }>({});
  
  // Calculate total tickets and amount
  const totalTickets = Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  
  // Fetch event details
  const { data: event, isLoading: isLoadingEvent } = useQuery<any>({
    queryKey: [`/api/events/${eventId}`],
    enabled: !!eventId,
  });
  
  // Fetch ticket types for this event
  const { data: ticketTypes, isLoading: isLoadingTickets } = useQuery<any[]>({
    queryKey: [`/api/events/${eventId}/tickets`],
    enabled: !!eventId,
  });
  
  // Calculate subtotal, fees, and total
  const subtotal = ticketTypes
    ? ticketTypes.reduce(
        (sum, ticket) => 
          sum + (selectedTickets[ticket.id] || 0) * ticket.price, 
        0
      )
    : 0;
  
  const serviceFee = subtotal * 0.12; // 12% service fee
  const total = subtotal + serviceFee;
  
  const handleProceedToCheckout = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue with your purchase",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (totalTickets === 0) {
      toast({
        title: "No tickets selected",
        description: "Please select at least one ticket to proceed",
        variant: "destructive",
      });
      return;
    }
    
    navigate(`/checkout/${eventId}`);
  };
  
  if (isLoadingEvent || isLoadingTickets) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }
  
  if (!event) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
        <Footer />
      </>
    );
  }
  
  const formattedDate = event.startDate 
    ? format(new Date(event.startDate), "EEEE, MMMM d, yyyy • h:mm a")
    : "Date TBA";
  
  return (
    <>
      <Helmet>
        <title>{event.title} | TicketRaha</title>
        <meta name="description" content={`${event.title} at ${event.venue}. ${event.description.substring(0, 160)}...`} />
        <meta property="og:title" content={`${event.title} | TicketRaha`} />
        <meta property="og:description" content={`${event.title} at ${event.venue}. Get tickets now!`} />
        <meta property="og:image" content={event.imageUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      <main className="bg-white pb-12">
        <div className="relative h-64 sm:h-80">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <Badge variant="outline" className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
                {event.categoryId === 1 ? "Concert" : 
                 event.categoryId === 2 ? "Sports" : 
                 event.categoryId === 3 ? "Theater" : "Festival"}
              </Badge>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              
              <div className="flex items-center mb-4 text-gray-700">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <span>{formattedDate}</span>
              </div>
              
              <div className="flex items-center mb-6 text-gray-700">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <span>{event.venue} • {event.address}</span>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Event</h2>
                <p className="text-gray-700 mb-3">{event.description}</p>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Event Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Entry Policy</h3>
                    <p className="text-sm text-gray-700">{event.entryPolicy}</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Age Restrictions</h3>
                    <p className="text-sm text-gray-700">{event.ageRestriction}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3 bg-gray-50 rounded-lg p-5 h-fit sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Tickets</h2>
              
              <div className="space-y-4">
                {ticketTypes && ticketTypes.map((ticket) => (
                  <TicketSelector
                    key={ticket.id}
                    ticket={ticket}
                    selectedQuantity={selectedTickets[ticket.id] || 0}
                    onChange={(quantity) => {
                      setSelectedTickets(prev => ({
                        ...prev,
                        [ticket.id]: quantity
                      }));
                    }}
                  />
                ))}
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalTickets} {totalTickets === 1 ? 'ticket' : 'tickets'})</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service fees</span>
                  <span className="font-medium">${serviceFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between pt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="mt-6 w-full bg-secondary hover:bg-orange-600"
                onClick={handleProceedToCheckout}
                disabled={totalTickets === 0}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
