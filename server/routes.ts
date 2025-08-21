import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const MOCK_USER_ID = 'user-1';

  // Mock auth route - always return the mock user
  app.get('/api/auth/user', async (req, res) => {
    try {
      const user = await storage.getUser(MOCK_USER_ID);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Sites routes
  app.get('/api/sites', async (req, res) => {
    try {
      const { utilityType, searchTerm, status } = req.query;
      
      let sites;
      if (searchTerm) {
        sites = await storage.searchSites(MOCK_USER_ID, searchTerm as string, utilityType as string, status as string);
      } else {
        sites = await storage.getUserSites(MOCK_USER_ID, utilityType as string);
      }
      
      res.json(sites);
    } catch (error) {
      console.error("Error fetching sites:", error);
      res.status(500).json({ message: "Failed to fetch sites" });
    }
  });

  app.post('/api/sites', async (req, res) => {
    try {
      const siteData = { ...req.body, userId: MOCK_USER_ID };
      const site = await storage.createSite(siteData);
      res.json(site);
    } catch (error) {
      console.error("Error creating site:", error);
      res.status(500).json({ message: "Failed to create site" });
    }
  });

  app.put('/api/sites/:id', async (req, res) => {
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
  app.get('/api/bills', async (req, res) => {
    try {
      const { validationStatus, month, status, utilityType } = req.query;
      const bills = await storage.getUserBills(MOCK_USER_ID, validationStatus as string, month as string, status as string, utilityType as string);
      res.json(bills);
    } catch (error) {
      console.error("Error fetching bills:", error);
      res.status(500).json({ message: "Failed to fetch bills" });
    }
  });

  app.post('/api/bills', async (req, res) => {
    try {
      const billData = req.body;
      const bill = await storage.createBill(billData);
      res.json(bill);
    } catch (error) {
      console.error("Error creating bill:", error);
      res.status(500).json({ message: "Failed to create bill" });
    }
  });

  app.put('/api/bills/:id', async (req, res) => {
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
  app.get('/api/solar-installations', async (req, res) => {
    try {
      const installations = await storage.getUserSolarInstallations(MOCK_USER_ID);
      res.json(installations);
    } catch (error) {
      console.error("Error fetching solar installations:", error);
      res.status(500).json({ message: "Failed to fetch solar installations" });
    }
  });

  // Smart meter installations routes
  app.get('/api/smart-meter-installations', async (req, res) => {
    try {
      const installations = await storage.getUserSmartMeterInstallations(MOCK_USER_ID);
      res.json(installations);
    } catch (error) {
      console.error("Error fetching smart meter installations:", error);
      res.status(500).json({ message: "Failed to fetch smart meter installations" });
    }
  });

  // Documents routes
  app.get('/api/documents', async (req, res) => {
    try {
      const { documentType, postcode } = req.query;
      const documents = await storage.getUserDocuments(MOCK_USER_ID, documentType as string, postcode as string);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // HH Data routes
  app.get('/api/hh-data', async (req, res) => {
    try {
      const hhData = await storage.getUserHhData(MOCK_USER_ID);
      res.json(hhData);
    } catch (error) {
      console.error("Error fetching HH data:", error);
      res.status(500).json({ message: "Failed to fetch HH data" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/stats', async (req, res) => {
    try {
      const stats = await storage.getUserSiteStats(MOCK_USER_ID);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching analytics stats:", error);
      res.status(500).json({ message: "Failed to fetch analytics stats" });
    }
  });

  // Query routes
  app.get('/api/queries', async (req, res) => {
    try {
      const { status, priority, queryType } = req.query;
      const queries = await storage.getUserQueries(MOCK_USER_ID, status as string, priority as string, queryType as string);
      res.json(queries);
    } catch (error) {
      console.error("Error fetching queries:", error);
      res.status(500).json({ message: "Failed to fetch queries" });
    }
  });

  app.post('/api/queries', async (req, res) => {
    try {
      const queryData = { ...req.body, userId: MOCK_USER_ID };
      const query = await storage.createQuery(queryData);
      res.json(query);
    } catch (error) {
      console.error("Error creating query:", error);
      res.status(500).json({ message: "Failed to create query" });
    }
  });

  app.put('/api/queries/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const query = await storage.updateQuery(id, updateData);
      res.json(query);
    } catch (error) {
      console.error("Error updating query:", error);
      res.status(500).json({ message: "Failed to update query" });
    }
  });

  // File download route (placeholder)
  app.get('/api/download/:type/:id', async (req, res) => {
    try {
      const { type, id } = req.params;
      res.json({ message: `Download ${type} with ID ${id}` });
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
