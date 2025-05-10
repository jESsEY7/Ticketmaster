import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { Loader2, CreditCard, Lock, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

// Form validation schema
const paymentSchema = z.object({
  cardName: z.string().min(3, { message: "Name is required" }),
  cardNumber: z.string().refine(val => /^\d{16}$/.test(val), { message: "Card number must be 16 digits" }),
  expiryMonth: z.string().refine(val => /^\d{2}$/.test(val) && parseInt(val) >= 1 && parseInt(val) <= 12, { message: "Invalid month" }),
  expiryYear: z.string().refine(val => /^\d{2}$/.test(val) && parseInt(val) >= new Date().getFullYear() % 100, { message: "Invalid year" }),
  cvv: z.string().refine(val => /^\d{3,4}$/.test(val), { message: "CVV must be 3-4 digits" }),
});

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/checkout/:eventId");
  const { toast } = useToast();
  const { user } = useAuth();
  const eventId = params?.eventId ? parseInt(params.eventId) : 0;
  
  const [selectedTickets, setSelectedTickets] = useState<{
    [key: number]: number;
  }>({});
  
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  
  // Initialize form
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    },
  });
  
  // Fetch event details
  const { data: event, isLoading: isLoadingEvent } = useQuery<any>({
    queryKey: [`/api/events/${eventId}`],
    enabled: !!eventId,
  });
  
  // Fetch ticket types for this event
  const { data: ticketTypes, isLoading: isLoadingTickets } = useQuery<any[]>({
    queryKey: [`/api/events/${eventId}/tickets`],
    enabled: !!eventId,
    onSuccess: (data) => {
      // Get selected tickets from localStorage
      const storedTickets = localStorage.getItem(`selectedTickets-${eventId}`);
      if (storedTickets) {
        setSelectedTickets(JSON.parse(storedTickets));
      }
    },
  });
  
  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return res.json();
    },
    onSuccess: (data) => {
      setOrderComplete(true);
      setOrderId(data.order.id);
      
      // Clear selected tickets from localStorage
      localStorage.removeItem(`selectedTickets-${eventId}`);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/tickets`] });
      
      toast({
        title: "Order Successful",
        description: "Your tickets have been booked successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Calculate totals
  const calculateTotals = () => {
    if (!ticketTypes) return { subtotal: 0, serviceFee: 0, total: 0, totalTickets: 0 };
    
    const totalTickets = Object.entries(selectedTickets).reduce(
      (sum, [ticketId, qty]) => sum + qty,
      0
    );
    
    const subtotal = ticketTypes.reduce(
      (sum, ticket) => sum + (selectedTickets[ticket.id] || 0) * ticket.price,
      0
    );
    
    const serviceFee = subtotal * 0.12; // 12% service fee
    const total = subtotal + serviceFee;
    
    return { subtotal, serviceFee, total, totalTickets };
  };
  
  const { subtotal, serviceFee, total, totalTickets } = calculateTotals();
  
  // Submit order
  const onSubmit = (formValues: z.infer<typeof paymentSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your purchase",
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
      navigate(`/events/${eventId}`);
      return;
    }
    
    // Create order items from selected tickets
    const items = Object.entries(selectedTickets)
      .filter(([, qty]) => qty > 0)
      .map(([ticketTypeId, quantity]) => {
        const ticketType = ticketTypes?.find(t => t.id === parseInt(ticketTypeId));
        return {
          ticketTypeId: parseInt(ticketTypeId),
          quantity,
          pricePerItem: ticketType?.price || 0,
        };
      });
    
    // Create order
    createOrderMutation.mutate({
      userId: user.id,
      status: "completed",
      totalAmount: total,
      serviceFee,
      items,
    });
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
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-4">The event you're trying to checkout doesn't exist.</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
        <Footer />
      </>
    );
  }
  
  // If order is complete, show confirmation
  if (orderComplete) {
    return (
      <>
        <Helmet>
          <title>Order Confirmation | TicketRaha</title>
        </Helmet>
        
        <Header />
        
        <main className="bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-2xl">Thank You for Your Order!</CardTitle>
                <CardDescription>Your tickets have been booked successfully.</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><span className="font-medium">Order ID:</span> #{orderId}</p>
                      <p><span className="font-medium">Event:</span> {event.title}</p>
                      <p><span className="font-medium">Date:</span> {format(new Date(event.startDate), "EEEE, MMMM d, yyyy • h:mm a")}</p>
                      <p><span className="font-medium">Venue:</span> {event.venue}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Ticket Summary</h3>
                    <div className="space-y-2">
                      {ticketTypes && Object.entries(selectedTickets)
                        .filter(([, qty]) => qty > 0)
                        .map(([ticketTypeId, quantity]) => {
                          const ticket = ticketTypes.find(t => t.id === parseInt(ticketTypeId));
                          return ticket ? (
                            <div key={ticketTypeId} className="flex justify-between">
                              <span>{quantity}x {ticket.name}</span>
                              <span>${(quantity * ticket.price).toFixed(2)}</span>
                            </div>
                          ) : null;
                        })
                      }
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Service fees</span>
                        <span>${serviceFee.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg text-sm">
                    <p>A confirmation email has been sent to your registered email address. You can also view your tickets in your account dashboard.</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-center gap-4">
                <Button onClick={() => navigate("/")}>Back to Home</Button>
                <Button variant="outline">View My Tickets</Button>
              </CardFooter>
            </Card>
          </div>
        </main>
        
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Checkout | TicketRaha</title>
        <meta name="description" content="Complete your ticket purchase securely on TicketRaha" />
      </Helmet>
      
      <Header />
      
      <main className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Details
                  </CardTitle>
                  <CardDescription>
                    Enter your card information to complete your purchase
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="cardName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cardholder Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="4111 1111 1111 1111" 
                                maxLength={16}
                                {...field}
                                onChange={(e) => {
                                  // Only allow digits
                                  const value = e.target.value.replace(/\D/g, '');
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="expiryMonth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Month</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="MM" 
                                  maxLength={2}
                                  {...field}
                                  onChange={(e) => {
                                    // Only allow digits
                                    const value = e.target.value.replace(/\D/g, '');
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="expiryYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="YY" 
                                  maxLength={2}
                                  {...field}
                                  onChange={(e) => {
                                    // Only allow digits
                                    const value = e.target.value.replace(/\D/g, '');
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="123" 
                                  maxLength={4}
                                  {...field}
                                  onChange={(e) => {
                                    // Only allow digits
                                    const value = e.target.value.replace(/\D/g, '');
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mt-4">
                        <Lock className="h-4 w-4 mr-2" />
                        <span>Your payment information is encrypted and secure</span>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-secondary hover:bg-orange-600 mt-6"
                        disabled={createOrderMutation.isPending}
                      >
                        {createOrderMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Pay $${total.toFixed(2)}`
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(event.startDate), "EEE, MMM d • h:mm a")}
                      </p>
                      <p className="text-sm text-gray-500">{event.venue}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      {ticketTypes && Object.entries(selectedTickets)
                        .filter(([, qty]) => qty > 0)
                        .map(([ticketTypeId, quantity]) => {
                          const ticket = ticketTypes.find(t => t.id === parseInt(ticketTypeId));
                          return ticket ? (
                            <div key={ticketTypeId} className="flex justify-between">
                              <span>{quantity}x {ticket.name}</span>
                              <span>${(quantity * ticket.price).toFixed(2)}</span>
                            </div>
                          ) : null;
                        })
                      }
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Service fees</span>
                        <span>${serviceFee.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
