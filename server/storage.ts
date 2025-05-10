import { users, User, InsertUser, events, Event, InsertEvent, categories, Category, cities, City, ticketTypes, TicketType, InsertTicketType, orders, Order, InsertOrder, orderItems, OrderItem, InsertOrderItem } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Event methods
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  getFeaturedEvents(): Promise<Event[]>;
  getTrendingEvents(): Promise<Event[]>;
  getEventsByCategoryId(categoryId: number): Promise<Event[]>;
  getEventsByCityId(cityId: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: Omit<Category, "id">): Promise<Category>;
  
  // City methods
  getCities(): Promise<City[]>;
  getCity(id: number): Promise<City | undefined>;
  createCity(city: Omit<City, "id">): Promise<City>;
  
  // Ticket Type methods
  getTicketTypes(eventId: number): Promise<TicketType[]>;
  getTicketType(id: number): Promise<TicketType | undefined>;
  createTicketType(ticketType: InsertTicketType): Promise<TicketType>;
  updateTicketTypeAvailability(id: number, quantity: number): Promise<TicketType | undefined>;
  
  // Order methods
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Order Item methods
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private categories: Map<number, Category>;
  private cities: Map<number, City>;
  private ticketTypes: Map<number, TicketType>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  
  currentUserId: number;
  currentEventId: number;
  currentCategoryId: number;
  currentCityId: number;
  currentTicketTypeId: number;
  currentOrderId: number;
  currentOrderItemId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.categories = new Map();
    this.cities = new Map();
    this.ticketTypes = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    
    this.currentUserId = 1;
    this.currentEventId = 1;
    this.currentCategoryId = 1;
    this.currentCityId = 1;
    this.currentTicketTypeId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize with sample data
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Event methods
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async getFeaturedEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.isFeatured);
  }
  
  async getTrendingEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.isTrending);
  }
  
  async getEventsByCategoryId(categoryId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.categoryId === categoryId);
  }
  
  async getEventsByCityId(cityId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.cityId === cityId);
  }
  
  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const newEvent: Event = { ...event, id };
    this.events.set(id, newEvent);
    return newEvent;
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(category: Omit<Category, "id">): Promise<Category> {
    const id = this.currentCategoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // City methods
  async getCities(): Promise<City[]> {
    return Array.from(this.cities.values());
  }
  
  async getCity(id: number): Promise<City | undefined> {
    return this.cities.get(id);
  }
  
  async createCity(city: Omit<City, "id">): Promise<City> {
    const id = this.currentCityId++;
    const newCity: City = { ...city, id };
    this.cities.set(id, newCity);
    return newCity;
  }
  
  // Ticket Type methods
  async getTicketTypes(eventId: number): Promise<TicketType[]> {
    return Array.from(this.ticketTypes.values()).filter(ticketType => ticketType.eventId === eventId);
  }
  
  async getTicketType(id: number): Promise<TicketType | undefined> {
    return this.ticketTypes.get(id);
  }
  
  async createTicketType(ticketType: InsertTicketType): Promise<TicketType> {
    const id = this.currentTicketTypeId++;
    const newTicketType: TicketType = { ...ticketType, id };
    this.ticketTypes.set(id, newTicketType);
    return newTicketType;
  }
  
  async updateTicketTypeAvailability(id: number, quantity: number): Promise<TicketType | undefined> {
    const ticketType = this.ticketTypes.get(id);
    if (!ticketType) return undefined;
    
    const updatedTicketType: TicketType = {
      ...ticketType,
      availableQuantity: Math.max(0, ticketType.availableQuantity - quantity)
    };
    
    this.ticketTypes.set(id, updatedTicketType);
    return updatedTicketType;
  }
  
  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const newOrder: Order = { ...order, id, createdAt: new Date() };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  // Order Item methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }
  
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }
  
  // Initialize sample data
  private initializeData() {
    // Initialize categories
    const categoriesData: Omit<Category, "id">[] = [
      { name: "Concerts", icon: "music", iconBgColor: "bg-blue-50" },
      { name: "Sports", icon: "basketball-ball", iconBgColor: "bg-orange-50" },
      { name: "Theater", icon: "theater-masks", iconBgColor: "bg-purple-50" },
      { name: "Festivals", icon: "umbrella-beach", iconBgColor: "bg-green-50" }
    ];
    
    categoriesData.forEach(category => {
      const newCategory = { ...category, id: this.currentCategoryId++ };
      this.categories.set(newCategory.id, newCategory);
    });
    
    // Initialize cities
    const citiesData: Omit<City, "id">[] = [
      { name: "New York" },
      { name: "Los Angeles" },
      { name: "Chicago" },
      { name: "Miami" },
      { name: "Dallas" },
      { name: "Seattle" }
    ];
    
    citiesData.forEach(city => {
      const newCity = { ...city, id: this.currentCityId++ };
      this.cities.set(newCity.id, newCity);
    });
    
    // Initialize events
    const eventsData: Omit<Event, "id">[] = [
      {
        title: "The Soundwaves Tour 2023",
        description: "Experience the magical Soundwaves Tour with incredible artists and amazing music. This concert brings together some of the best musicians for an unforgettable night.",
        imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        venue: "Madison Square Garden",
        address: "4 Pennsylvania Plaza, New York, NY 10001",
        cityId: 1,
        categoryId: 1,
        startDate: new Date("2023-10-15T20:00:00"),
        endDate: new Date("2023-10-15T23:00:00"),
        isFeatured: true,
        isTrending: false,
        ageRestriction: "All ages welcome",
        entryPolicy: "Gates open at 6:00 PM. All attendees must have a valid ticket for entry."
      },
      {
        title: "Electric Dreams Festival",
        description: "The ultimate electronic music festival featuring world-famous DJs and incredible light shows. Dance the night away with electrifying beats and amazing visuals.",
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        venue: "Staples Center",
        address: "1111 S Figueroa St, Los Angeles, CA 90015",
        cityId: 2,
        categoryId: 1,
        startDate: new Date("2023-09-22T21:00:00"),
        endDate: new Date("2023-09-23T02:00:00"),
        isFeatured: true,
        isTrending: false,
        ageRestriction: "18+",
        entryPolicy: "Gates open at 7:00 PM. ID check required at entrance."
      },
      {
        title: "Hamilton: The Musical",
        description: "The iconic musical about Alexander Hamilton's extraordinary life story. Experience this revolutionary musical that has changed Broadway forever with its unique blend of hip-hop, jazz, R&B, and Broadway.",
        imageUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        venue: "Richard Rodgers Theatre",
        address: "226 W 46th St, New York, NY 10036",
        cityId: 1,
        categoryId: 3,
        startDate: new Date("2023-11-08T19:30:00"),
        endDate: new Date("2023-11-08T22:30:00"),
        isFeatured: true,
        isTrending: false,
        ageRestriction: "Recommended for ages 10+",
        entryPolicy: "Doors open 1 hour before performance. Latecomers will be seated at an appropriate break."
      },
      {
        title: "Lakers vs. Bulls",
        description: "Witness this exciting basketball matchup between two legendary NBA teams. The Lakers face off against the Bulls in what promises to be an action-packed game with thrilling moments.",
        imageUrl: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        venue: "United Center",
        address: "1901 W Madison St, Chicago, IL 60612",
        cityId: 3,
        categoryId: 2,
        startDate: new Date("2023-10-19T19:00:00"),
        endDate: new Date("2023-10-19T22:00:00"),
        isFeatured: true,
        isTrending: false,
        ageRestriction: "All ages welcome",
        entryPolicy: "Gates open 2 hours before game time. Enhanced security screening in effect."
      },
      {
        title: "Jazz Night: The Quartet",
        description: "Experience an intimate evening of jazz with The Quartet, featuring some of the finest jazz musicians on the scene today. Enjoy smooth melodies and improvised solos in a cozy atmosphere.",
        imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        venue: "Blue Note",
        address: "131 W 3rd St, New York, NY 10012",
        cityId: 1,
        categoryId: 1,
        startDate: new Date("2023-08-15T20:00:00"),
        endDate: new Date("2023-08-15T23:00:00"),
        isFeatured: false,
        isTrending: true,
        ageRestriction: "21+",
        entryPolicy: "Seating begins at 6:30 PM. Two drink minimum per person."
      },
      {
        title: "Philharmonic Orchestra",
        description: "The world-renowned Philharmonic Orchestra presents an evening of classical masterpieces. Conducted by Maestro James Reynolds, the program includes works by Mozart, Beethoven, and Tchaikovsky.",
        imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        venue: "Symphony Hall",
        address: "301 Massachusetts Ave, Boston, MA 02115",
        cityId: 3,
        categoryId: 1,
        startDate: new Date("2023-09-10T19:00:00"),
        endDate: new Date("2023-09-10T21:30:00"),
        isFeatured: false,
        isTrending: true,
        ageRestriction: "All ages welcome",
        entryPolicy: "Doors open at 6:30 PM. No late seating during performances."
      },
      {
        title: "Comedy Night: Dave Phillips",
        description: "Laugh until your sides hurt with comedian Dave Phillips, known for his quick wit and hilarious observations. Join us for a night of top-tier comedy entertainment.",
        imageUrl: "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
        venue: "The Comedy Store",
        address: "8433 Sunset Blvd, Los Angeles, CA 90069",
        cityId: 2,
        categoryId: 3,
        startDate: new Date("2023-07-28T21:00:00"),
        endDate: new Date("2023-07-28T23:00:00"),
        isFeatured: false,
        isTrending: true,
        ageRestriction: "18+",
        entryPolicy: "Doors open at 7:00 PM. Two item minimum purchase required."
      },
      {
        title: "NFL: Eagles vs. Cowboys",
        description: "The rivalry continues as the Philadelphia Eagles face off against the Dallas Cowboys in this exciting NFL game. Feel the energy as two legendary teams compete for victory.",
        imageUrl: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        venue: "Lincoln Financial Field",
        address: "1 Lincoln Financial Field Way, Philadelphia, PA 19148",
        cityId: 1,
        categoryId: 2,
        startDate: new Date("2023-10-22T13:00:00"),
        endDate: new Date("2023-10-22T16:00:00"),
        isFeatured: false,
        isTrending: false,
        ageRestriction: "All ages welcome",
        entryPolicy: "Gates open 2 hours before kickoff. Clear bag policy in effect."
      },
      {
        title: "Summer Sound Festival 2023",
        description: "The ultimate summer music festival with multiple stages and dozens of performers across all genres. Three days of non-stop music, food, art, and amazing experiences.",
        imageUrl: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        venue: "Randall's Island Park",
        address: "Randall's Island, New York, NY 10035",
        cityId: 1,
        categoryId: 4,
        startDate: new Date("2023-08-18T10:00:00"),
        endDate: new Date("2023-08-20T23:00:00"),
        isFeatured: false,
        isTrending: false,
        ageRestriction: "All ages. Children under 10 free with paying adult.",
        entryPolicy: "Gates open at 10:00 AM daily. Re-entry allowed with valid wristband."
      },
      {
        title: "The Phantom of the Opera",
        description: "The longest-running show in Broadway history, this unforgettable musical combines spectacular scenery with haunting music. Experience the magic of Andrew Lloyd Webber's masterpiece.",
        imageUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        venue: "Majestic Theatre",
        address: "245 W 44th St, New York, NY 10036",
        cityId: 1,
        categoryId: 3,
        startDate: new Date("2023-11-15T19:30:00"),
        endDate: new Date("2023-11-15T22:30:00"),
        isFeatured: false,
        isTrending: false,
        ageRestriction: "Recommended for ages 8+",
        entryPolicy: "Doors open 45 minutes before performance. No late seating until intermission."
      },
      {
        title: "Coldplay: Music of the Spheres World Tour",
        description: "Coldplay brings their spectacular Music of the Spheres World Tour to the Rose Bowl! Experience an unforgettable night of music, lights, and special effects as the band performs their greatest hits along with new music from their latest album. The tour has been acclaimed for its groundbreaking sustainability initiatives and interactive elements that create a unique concert experience for fans. Don't miss your chance to see one of the world's biggest bands live in concert!",
        imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80",
        venue: "Rose Bowl Stadium",
        address: "1001 Rose Bowl Dr, Pasadena, CA 91103",
        cityId: 2,
        categoryId: 1,
        startDate: new Date("2023-11-12T20:00:00"),
        endDate: new Date("2023-11-12T23:30:00"),
        isFeatured: true,
        isTrending: true,
        ageRestriction: "All ages welcome. Children under 2 years do not require a ticket.",
        entryPolicy: "Gates open at 6:00 PM. All attendees must have a valid ticket for entry."
      }
    ];
    
    eventsData.forEach(event => {
      const newEvent = { ...event, id: this.currentEventId++ };
      this.events.set(newEvent.id, newEvent);
    });
    
    // Initialize ticket types
    const ticketTypesData: Omit<TicketType, "id">[] = [
      // Coldplay concert tickets
      {
        eventId: 11,
        name: "General Admission",
        description: "Standing room only, first come first served",
        price: 99.00,
        availableQuantity: 1000,
        maxPerOrder: 8
      },
      {
        eventId: 11,
        name: "Premium Seats",
        description: "Reserved seating, Best views, Exclusive entrance",
        price: 179.00,
        availableQuantity: 500,
        maxPerOrder: 6
      },
      {
        eventId: 11,
        name: "VIP Package",
        description: "Front row, Meet & greet, Exclusive merchandise",
        price: 349.00,
        availableQuantity: 100,
        maxPerOrder: 4
      },
      // The Soundwaves Tour tickets
      {
        eventId: 1,
        name: "Standard",
        description: "Regular seating with good views",
        price: 59.00,
        availableQuantity: 500,
        maxPerOrder: 6
      },
      {
        eventId: 1,
        name: "Premium",
        description: "Better seating with excellent views",
        price: 89.00,
        availableQuantity: 300,
        maxPerOrder: 4
      },
      // Electric Dreams Festival tickets
      {
        eventId: 2,
        name: "General Entry",
        description: "Basic festival entry",
        price: 75.00,
        availableQuantity: 2000,
        maxPerOrder: 8
      },
      {
        eventId: 2,
        name: "VIP Entry",
        description: "VIP area access, express entry, premium viewing areas",
        price: 150.00,
        availableQuantity: 500,
        maxPerOrder: 4
      },
      // Hamilton tickets
      {
        eventId: 3,
        name: "Balcony",
        description: "Upper level seating",
        price: 120.00,
        availableQuantity: 200,
        maxPerOrder: 6
      },
      {
        eventId: 3,
        name: "Orchestra",
        description: "Main floor seating",
        price: 220.00,
        availableQuantity: 300,
        maxPerOrder: 4
      },
      // Lakers vs Bulls tickets
      {
        eventId: 4,
        name: "Upper Level",
        description: "Upper section seating",
        price: 85.00,
        availableQuantity: 800,
        maxPerOrder: 8
      },
      {
        eventId: 4,
        name: "Lower Level",
        description: "Lower section seating with better views",
        price: 150.00,
        availableQuantity: 400,
        maxPerOrder: 6
      },
      {
        eventId: 4,
        name: "Courtside",
        description: "Premium courtside seating",
        price: 450.00,
        availableQuantity: 50,
        maxPerOrder: 2
      }
    ];
    
    ticketTypesData.forEach(ticketType => {
      const newTicketType = { ...ticketType, id: this.currentTicketTypeId++ };
      this.ticketTypes.set(newTicketType.id, newTicketType);
    });
  }
}

export const storage = new MemStorage();
