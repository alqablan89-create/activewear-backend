import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { setupAuth, requireAuth, requireAdmin } from "./auth";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { users, products, categories, orders, orderItems, discountCodes } from "@shared/schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Public routes - Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const allCategories = await db.select().from(categories).orderBy(categories.displayOrder);
      res.json(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Public routes - Products
  app.get("/api/products", async (req, res) => {
    try {
      const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
      res.json(allProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/new", async (req, res) => {
    try {
      const newProducts = await db
        .select()
        .from(products)
        .where(eq(products.isNew, true))
        .orderBy(desc(products.createdAt))
        .limit(8);
      res.json(newProducts);
    } catch (error) {
      console.error("Error fetching new products:", error);
      res.status(500).json({ error: "Failed to fetch new products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const featuredProducts = await db
        .select()
        .from(products)
        .where(eq(products.isFeatured, true))
        .orderBy(desc(products.createdAt))
        .limit(8);
      res.json(featuredProducts);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ error: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, req.params.id));
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.get("/api/products/category/:categoryId", async (req, res) => {
    try {
      const categoryProducts = await db
        .select()
        .from(products)
        .where(eq(products.categoryId, req.params.categoryId))
        .orderBy(desc(products.createdAt));
      res.json(categoryProducts);
    } catch (error) {
      console.error("Error fetching category products:", error);
      res.status(500).json({ error: "Failed to fetch category products" });
    }
  });

  // Object storage routes
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const [orderStats] = await db
        .select({
          totalRevenue: sql<number>`COALESCE(SUM(CAST(${orders.total} AS DECIMAL)), 0)`,
          totalOrders: sql<number>`COUNT(*)`,
        })
        .from(orders);

      const [productStats] = await db
        .select({
          totalProducts: sql<number>`COUNT(*)`,
        })
        .from(products);

      const [userStats] = await db
        .select({
          totalUsers: sql<number>`COUNT(*)`,
        })
        .from(users);

      res.json({
        totalRevenue: Number(orderStats.totalRevenue),
        totalOrders: Number(orderStats.totalOrders),
        totalProducts: Number(productStats.totalProducts),
        totalUsers: Number(userStats.totalUsers),
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Admin - Products
  app.post("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const normalizedImages = req.body.images?.map((img: string) =>
        objectStorageService.normalizeObjectEntityPath(img)
      ) || [];

      const [newProduct] = await db
        .insert(products)
        .values({
          ...req.body,
          images: normalizedImages,
        })
        .returning();

      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const normalizedImages = req.body.images?.map((img: string) =>
        objectStorageService.normalizeObjectEntityPath(img)
      ) || [];

      const [updatedProduct] = await db
        .update(products)
        .set({
          ...req.body,
          images: normalizedImages,
        })
        .where(eq(products.id, req.params.id))
        .returning();

      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      await db.delete(products).where(eq(products.id, req.params.id));
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Admin - Categories
  app.post("/api/admin/categories", requireAdmin, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const normalizedImageUrl = req.body.imageUrl
        ? objectStorageService.normalizeObjectEntityPath(req.body.imageUrl)
        : null;

      const [newCategory] = await db
        .insert(categories)
        .values({
          ...req.body,
          imageUrl: normalizedImageUrl,
        })
        .returning();

      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.put("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const normalizedImageUrl = req.body.imageUrl
        ? objectStorageService.normalizeObjectEntityPath(req.body.imageUrl)
        : null;

      const [updatedCategory] = await db
        .update(categories)
        .set({
          ...req.body,
          imageUrl: normalizedImageUrl,
        })
        .where(eq(categories.id, req.params.id))
        .returning();

      if (!updatedCategory) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      await db.delete(categories).where(eq(categories.id, req.params.id));
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
