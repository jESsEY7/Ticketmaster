import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertOrderSchema, insertOrderItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // API Routes
  // Get all events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });
  
  // Get featured events
  app.get("/api/events/featured", async (req, res) => {
    try {
      const featuredEvents = await storage.getFeaturedEvents();
      res.json(featuredEvents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured events" });
    }
  });
  
  // Get trending events
  app.get("/api/events/trending", async (req, res) => {
    try {
      const trendingEvents = await storage.getTrendingEvents();
      res.json(trendingEvents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending events" });
    }
  });
  
  // Get event by ID
  app.get("/api/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });
  
  // Get events by category
  app.get("/api/events/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const events = await storage.getEventsByCategoryId(categoryId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events by category" });
    }
  });
  
  // Get events by city
  app.get("/api/events/city/:cityId", async (req, res) => {
    try {
      const cityId = parseInt(req.params.cityId);
      if (isNaN(cityId)) {
        return res.status(400).json({ message: "Invalid city ID" });
      }
      
      const events = await storage.getEventsByCityId(cityId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events by city" });
    }
  });
  
  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  // Get all cities
  app.get("/api/cities", async (req, res) => {
    try {
      const cities = await storage.getCities();
      res.json(cities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });
  
  // Get ticket types for an event
  app.get("/api/events/:id/tickets", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }
      
      const ticketTypes = await storage.getTicketTypes(eventId);
      res.json(ticketTypes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ticket types" });
    }
  });
  
  // Create order (requires authentication)
  app.post("/api/orders", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      
      const order = await storage.createOrder(orderData);
      
      // Process order items
      const orderItems = req.body.items;
      if (!Array.isArray(orderItems) || orderItems.length === 0) {
        return res.status(400).json({ message: "Order must contain at least one item" });
      }
      
      const processedItems = [];
      
      for (const item of orderItems) {
        const orderItemData = insertOrderItemSchema.parse({
          ...item,
          orderId: order.id,
        });
        
        // Check ticket availability and update inventory
        const ticketType = await storage.getTicketType(orderItemData.ticketTypeId);
        if (!ticketType) {
          return res.status(404).json({ message: `Ticket type with ID ${orderItemData.ticketTypeId} not found` });
        }
        
        if (ticketType.availableQuantity < orderItemData.quantity) {
          return res.status(400).json({ 
            message: `Not enough tickets available for ${ticketType.name}. Only ${ticketType.availableQuantity} remaining.` 
          });
        }
        
        await storage.updateTicketTypeAvailability(orderItemData.ticketTypeId, orderItemData.quantity);
        
        const orderItem = await storage.createOrderItem(orderItemData);
        processedItems.push(orderItem);
      }
      
      res.status(201).json({ order, items: processedItems });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  
  // Get user's orders (requires authentication)
  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const orders = await storage.getOrders(req.user!.id);
      
      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          return { ...order, items };
        })
      );
      
      res.json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
