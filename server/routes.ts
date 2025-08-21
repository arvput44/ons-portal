import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertSiteSchema, insertBillSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Sites routes
  app.get('/api/sites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { utilityType, searchTerm, status } = req.query;
      
      let sites;
      if (searchTerm) {
        sites = await storage.searchSites(userId, searchTerm, utilityType, status);
      } else {
        sites = await storage.getUserSites(userId, utilityType);
      }
      
      res.json(sites);
    } catch (error) {
      console.error("Error fetching sites:", error);
      res.status(500).json({ message: "Failed to fetch sites" });
    }
  });

  app.post('/api/sites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const siteData = insertSiteSchema.parse({ ...req.body, userId });
      const site = await storage.createSite(siteData);
      res.json(site);
    } catch (error) {
      console.error("Error creating site:", error);
      res.status(500).json({ message: "Failed to create site" });
    }
  });

  app.put('/api/sites/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const site = await storage.updateSite(id, updateData);
      res.json(site);
    } catch (error) {
      console.error("Error updating site:", error);
      res.status(500).json({ message: "Failed to update site" });
    }
  });

  // Bills routes
  app.get('/api/bills', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { validationStatus, month, status, utilityType } = req.query;
      const bills = await storage.getUserBills(userId, validationStatus, month, status, utilityType);
      res.json(bills);
    } catch (error) {
      console.error("Error fetching bills:", error);
      res.status(500).json({ message: "Failed to fetch bills" });
    }
  });

  app.post('/api/bills', isAuthenticated, async (req: any, res) => {
    try {
      const billData = insertBillSchema.parse(req.body);
      const bill = await storage.createBill(billData);
      res.json(bill);
    } catch (error) {
      console.error("Error creating bill:", error);
      res.status(500).json({ message: "Failed to create bill" });
    }
  });

  app.put('/api/bills/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const bill = await storage.updateBill(id, updateData);
      res.json(bill);
    } catch (error) {
      console.error("Error updating bill:", error);
      res.status(500).json({ message: "Failed to update bill" });
    }
  });

  // Solar installations routes
  app.get('/api/solar-installations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const installations = await storage.getUserSolarInstallations(userId);
      res.json(installations);
    } catch (error) {
      console.error("Error fetching solar installations:", error);
      res.status(500).json({ message: "Failed to fetch solar installations" });
    }
  });

  // Smart meter installations routes
  app.get('/api/smart-meter-installations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const installations = await storage.getUserSmartMeterInstallations(userId);
      res.json(installations);
    } catch (error) {
      console.error("Error fetching smart meter installations:", error);
      res.status(500).json({ message: "Failed to fetch smart meter installations" });
    }
  });

  // Documents routes
  app.get('/api/documents', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { documentType, postcode } = req.query;
      const documents = await storage.getUserDocuments(userId, documentType, postcode);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // HH Data routes
  app.get('/api/hh-data', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const hhData = await storage.getUserHhData(userId);
      res.json(hhData);
    } catch (error) {
      console.error("Error fetching HH data:", error);
      res.status(500).json({ message: "Failed to fetch HH data" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserSiteStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching analytics stats:", error);
      res.status(500).json({ message: "Failed to fetch analytics stats" });
    }
  });

  // File download route (placeholder - would need proper file serving implementation)
  app.get('/api/download/:type/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { type, id } = req.params;
      // TODO: Implement file download logic based on type (bill, hh-data, document)
      res.json({ message: `Download ${type} with ID ${id}` });
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
