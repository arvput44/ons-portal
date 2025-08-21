import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  integer,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sites table for managing client sites
export const sites = pgTable("sites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  siteName: varchar("site_name").notNull(),
  siteAddress: text("site_address").notNull(),
  utilityType: varchar("utility_type").notNull(), // 'electricity', 'gas', 'water'
  mpanMprnSpid: varchar("mpan_mprn_spid").notNull(), // The unique identifier
  accountId: varchar("account_id"),
  contractStartDate: date("contract_start_date"),
  contractEndDate: date("contract_end_date"),
  dayUnitRate: decimal("day_unit_rate", { precision: 10, scale: 4 }),
  nightUnitRate: decimal("night_unit_rate", { precision: 10, scale: 4 }),
  eveningUnitRate: decimal("evening_unit_rate", { precision: 10, scale: 4 }),
  standingCharges: decimal("standing_charges", { precision: 10, scale: 4 }),
  mopCharges: decimal("mop_charges", { precision: 10, scale: 2 }),
  dcDaCharges: decimal("dc_da_charges", { precision: 10, scale: 2 }),
  kvaCharges: decimal("kva_charges", { precision: 10, scale: 2 }),
  eac: integer("eac"), // Estimated Annual Consumption
  status: varchar("status").notNull().default('pending'), // 'registered', 'pending', 'objected'
  supplier: varchar("supplier"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bills table for invoice management
export const bills = pgTable("bills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  siteId: varchar("site_id").notNull().references(() => sites.id),
  mpanMprnSpid: varchar("mpan_mprn_spid").notNull(),
  generationDate: date("generation_date").notNull(),
  billRefNo: varchar("bill_ref_no").notNull(),
  type: varchar("type").notNull(), // 'bill', 'credit_note'
  fromDate: date("from_date").notNull(),
  toDate: date("to_date").notNull(),
  dueDate: date("due_date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  vatPercentage: decimal("vat_percentage", { precision: 5, scale: 2 }),
  status: varchar("status").notNull().default('unpaid'), // 'paid', 'unpaid', 'overdue'
  validationStatus: varchar("validation_status").notNull().default('validated'), // 'validated', 'incorrect'
  query: text("query"), // For incorrect bills - description of the issue
  billFilePath: varchar("bill_file_path"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Solar installations table
export const solarInstallations = pgTable("solar_installations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  siteId: varchar("site_id").notNull().references(() => sites.id),
  siteAddress: text("site_address").notNull(),
  installationDate: date("installation_date"),
  status: varchar("status").notNull().default('upcoming'), // 'installed', 'upcoming'
  upcomingInstallation: date("upcoming_installation"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Smart meter installations table
export const smartMeterInstallations = pgTable("smart_meter_installations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  siteId: varchar("site_id").notNull().references(() => sites.id),
  mpanMprn: varchar("mpan_mprn").notNull(),
  fuel: varchar("fuel").notNull(), // 'electricity', 'gas'
  mop: varchar("mop").notNull(), // Meter Operator
  jobId: varchar("job_id"),
  status: varchar("status").notNull().default('upcoming'), // 'installed', 'upcoming_installation', 'job_status_failed', 'not_eligible'
  installationDate: date("installation_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Documents table for storing client documents
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  documentType: varchar("document_type").notNull(), // 'vat_form', 'complaint_procedure', 'meter_picture', 'site_mapping', 'monthly_edi_report', 'carbon_report'
  documentName: varchar("document_name").notNull(),
  filePath: varchar("file_path").notNull(),
  postcode: varchar("postcode"), // For filtering by location
  month: varchar("month"), // For monthly reports
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// HH Data table for half-hourly consumption data
export const hhData = pgTable("hh_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  siteId: varchar("site_id").notNull().references(() => sites.id),
  mpan: varchar("mpan").notNull(),
  date: date("date").notNull(),
  dataFilePath: varchar("data_file_path"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sites: many(sites),
  documents: many(documents),
}));

export const sitesRelations = relations(sites, ({ one, many }) => ({
  user: one(users, {
    fields: [sites.userId],
    references: [users.id],
  }),
  bills: many(bills),
  solarInstallations: many(solarInstallations),
  smartMeterInstallations: many(smartMeterInstallations),
  hhData: many(hhData),
}));

export const billsRelations = relations(bills, ({ one }) => ({
  site: one(sites, {
    fields: [bills.siteId],
    references: [sites.id],
  }),
}));

export const solarInstallationsRelations = relations(solarInstallations, ({ one }) => ({
  site: one(sites, {
    fields: [solarInstallations.siteId],
    references: [sites.id],
  }),
}));

export const smartMeterInstallationsRelations = relations(smartMeterInstallations, ({ one }) => ({
  site: one(sites, {
    fields: [smartMeterInstallations.siteId],
    references: [sites.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
}));

export const hhDataRelations = relations(hhData, ({ one }) => ({
  site: one(sites, {
    fields: [hhData.siteId],
    references: [sites.id],
  }),
}));

// Insert schemas
export const insertSiteSchema = createInsertSchema(sites).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBillSchema = createInsertSchema(bills).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSolarInstallationSchema = createInsertSchema(solarInstallations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSmartMeterInstallationSchema = createInsertSchema(smartMeterInstallations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHhDataSchema = createInsertSchema(hhData).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertSite = z.infer<typeof insertSiteSchema>;
export type Site = typeof sites.$inferSelect;
export type InsertBill = z.infer<typeof insertBillSchema>;
export type Bill = typeof bills.$inferSelect;
export type InsertSolarInstallation = z.infer<typeof insertSolarInstallationSchema>;
export type SolarInstallation = typeof solarInstallations.$inferSelect;
export type InsertSmartMeterInstallation = z.infer<typeof insertSmartMeterInstallationSchema>;
export type SmartMeterInstallation = typeof smartMeterInstallations.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertHhData = z.infer<typeof insertHhDataSchema>;
export type HhData = typeof hhData.$inferSelect;
