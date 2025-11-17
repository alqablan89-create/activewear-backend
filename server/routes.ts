import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { setupAuth, requireAuth, requireAdmin } from "./auth";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { users, products, categories, orders, orderItems, discountCodes, carts, cartItems, shippingAddresses, orderStatusHistory, wishlists } from "@shared/schema";
import { eq, desc, and, gte, lte, sql, or } from "drizzle-orm";

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

  app.post("/api/objects/upload-public", async (req, res) => {
    try {
      const { fileName } = req.body;
      const objectStorageService = new ObjectStorageService();
      const { uploadURL, publicURL } = await objectStorageService.getPublicObjectUploadURL(fileName);
      res.json({ uploadURL, publicURL });
    } catch (error) {
      console.error("Error getting public upload URL:", error);
      res.status(500).json({ error: "Failed to get public upload URL" });
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

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    try {
      let cart;
      
      if (req.isAuthenticated()) {
        // Get or create cart for logged-in user
        [cart] = await db.select().from(carts).where(eq(carts.userId, req.user!.id));
        if (!cart) {
          [cart] = await db.insert(carts).values({ userId: req.user!.id }).returning();
        }
      } else {
        // Get or create cart for guest using session
        if (!req.session.cartId) {
          [cart] = await db.insert(carts).values({ sessionId: req.sessionID }).returning();
          req.session.cartId = cart.id;
        } else {
          [cart] = await db.select().from(carts).where(eq(carts.id, req.session.cartId));
        }
      }

      // Get cart items with product details
      const items = await db
        .select({
          id: cartItems.id,
          quantity: cartItems.quantity,
          selectedColor: cartItems.selectedColor,
          selectedSize: cartItems.selectedSize,
          product: products,
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.cartId, cart.id));

      res.json({ cart, items });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const { productId, quantity, selectedColor, selectedSize } = req.body;
      
      // Validate inputs
      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }
      if (!quantity || quantity < 1 || !Number.isInteger(quantity)) {
        return res.status(400).json({ error: "Quantity must be a positive integer" });
      }

      let cart;
      if (req.isAuthenticated()) {
        [cart] = await db.select().from(carts).where(eq(carts.userId, req.user!.id));
        if (!cart) {
          [cart] = await db.insert(carts).values({ userId: req.user!.id }).returning();
        }
      } else {
        if (!req.session.cartId) {
          [cart] = await db.insert(carts).values({ sessionId: req.sessionID }).returning();
          req.session.cartId = cart.id;
        } else {
          [cart] = await db.select().from(carts).where(eq(carts.id, req.session.cartId));
        }
      }

      // Check if item already exists in cart
      const [existingItem] = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.cartId, cart.id),
            eq(cartItems.productId, productId),
            selectedColor ? eq(cartItems.selectedColor, selectedColor) : sql`${cartItems.selectedColor} IS NULL`,
            selectedSize ? eq(cartItems.selectedSize, selectedSize) : sql`${cartItems.selectedSize} IS NULL`
          )
        );

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        const [updated] = await db
          .update(cartItems)
          .set({ quantity: newQuantity })
          .where(eq(cartItems.id, existingItem.id))
          .returning();
        res.json(updated);
      } else {
        // Add new item
        const [newItem] = await db
          .insert(cartItems)
          .values({
            cartId: cart.id,
            productId,
            quantity,
            selectedColor,
            selectedSize,
          })
          .returning();
        res.status(201).json(newItem);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ error: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      
      // Validate quantity
      if (!quantity || quantity < 1 || !Number.isInteger(quantity)) {
        return res.status(400).json({ error: "Quantity must be a positive integer" });
      }

      // Get the cart item with its cart
      const [item] = await db
        .select({
          item: cartItems,
          cart: carts,
        })
        .from(cartItems)
        .innerJoin(carts, eq(cartItems.cartId, carts.id))
        .where(eq(cartItems.id, req.params.id));

      if (!item) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      // Verify ownership
      if (req.isAuthenticated()) {
        if (item.cart.userId !== req.user!.id) {
          return res.status(403).json({ error: "Unauthorized" });
        }
      } else {
        if (!req.session.cartId || item.cart.id !== req.session.cartId) {
          return res.status(403).json({ error: "Unauthorized" });
        }
      }

      // Update quantity
      const [updated] = await db
        .update(cartItems)
        .set({ quantity })
        .where(eq(cartItems.id, req.params.id))
        .returning();
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      // Get the cart item with its cart
      const [item] = await db
        .select({
          item: cartItems,
          cart: carts,
        })
        .from(cartItems)
        .innerJoin(carts, eq(cartItems.cartId, carts.id))
        .where(eq(cartItems.id, req.params.id));

      if (!item) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      // Verify ownership
      if (req.isAuthenticated()) {
        if (item.cart.userId !== req.user!.id) {
          return res.status(403).json({ error: "Unauthorized" });
        }
      } else {
        if (!req.session.cartId || item.cart.id !== req.session.cartId) {
          return res.status(403).json({ error: "Unauthorized" });
        }
      }

      await db.delete(cartItems).where(eq(cartItems.id, req.params.id));
      res.sendStatus(204);
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({ error: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      let cart;
      if (req.isAuthenticated()) {
        [cart] = await db.select().from(carts).where(eq(carts.userId, req.user!.id));
      } else if (req.session.cartId) {
        [cart] = await db.select().from(carts).where(eq(carts.id, req.session.cartId));
      }

      if (cart) {
        await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));
      }
      res.sendStatus(204);
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  // Wishlist routes
  app.get("/api/wishlist", async (req, res) => {
    try {
      let wishlistItems = [];
      
      if (req.isAuthenticated()) {
        wishlistItems = await db
          .select({
            id: wishlists.id,
            productId: wishlists.productId,
            createdAt: wishlists.createdAt,
            product: products,
          })
          .from(wishlists)
          .leftJoin(products, eq(wishlists.productId, products.id))
          .where(eq(wishlists.userId, req.user!.id));
      } else if (req.session.id) {
        wishlistItems = await db
          .select({
            id: wishlists.id,
            productId: wishlists.productId,
            createdAt: wishlists.createdAt,
            product: products,
          })
          .from(wishlists)
          .leftJoin(products, eq(wishlists.productId, products.id))
          .where(eq(wishlists.sessionId, req.session.id));
      }
      
      res.json(wishlistItems);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ error: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    try {
      const { productId } = req.body;
      
      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      // Check if product exists
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, productId));
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Check if already in wishlist
      let existing;
      if (req.isAuthenticated()) {
        [existing] = await db
          .select()
          .from(wishlists)
          .where(
            and(
              eq(wishlists.userId, req.user!.id),
              eq(wishlists.productId, productId)
            )
          );
      } else {
        [existing] = await db
          .select()
          .from(wishlists)
          .where(
            and(
              eq(wishlists.sessionId, req.session.id),
              eq(wishlists.productId, productId)
            )
          );
      }

      if (existing) {
        return res.status(400).json({ error: "Product already in wishlist" });
      }

      // Add to wishlist
      const [wishlistItem] = await db
        .insert(wishlists)
        .values({
          userId: req.isAuthenticated() ? req.user!.id : null,
          sessionId: req.isAuthenticated() ? null : req.session.id,
          productId,
        })
        .returning();

      res.status(201).json(wishlistItem);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ error: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:id", async (req, res) => {
    try {
      const [item] = await db
        .select()
        .from(wishlists)
        .where(eq(wishlists.id, req.params.id));

      if (!item) {
        return res.status(404).json({ error: "Wishlist item not found" });
      }

      // Check ownership
      if (req.isAuthenticated()) {
        if (item.userId !== req.user!.id) {
          return res.status(403).json({ error: "Unauthorized" });
        }
      } else {
        if (item.sessionId !== req.session.id) {
          return res.status(403).json({ error: "Unauthorized" });
        }
      }

      await db.delete(wishlists).where(eq(wishlists.id, req.params.id));
      res.sendStatus(204);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ error: "Failed to remove from wishlist" });
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

  // Admin orders routes
  app.get("/api/admin/orders", requireAdmin, async (req, res) => {
    try {
      const allOrders = await db
        .select()
        .from(orders)
        .orderBy(desc(orders.createdAt));
      
      res.json(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/orders/:id", requireAdmin, async (req, res) => {
    try {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, req.params.id));

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Fetch order items with product details
      const items = await db
        .select({
          id: orderItems.id,
          productId: orderItems.productId,
          quantity: orderItems.quantity,
          price: orderItems.price,
          selectedColor: orderItems.selectedColor,
          selectedSize: orderItems.selectedSize,
          product: {
            nameEn: products.nameEn,
            nameAr: products.nameAr,
            images: products.images,
          },
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, req.params.id));

      res.json({ ...order, items });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.put("/api/admin/orders/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;

      if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const [updated] = await db
        .update(orders)
        .set({ status })
        .where(eq(orders.id, req.params.id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Add to status history
      await db.insert(orderStatusHistory).values({
        orderId: req.params.id,
        status,
        note: `Status changed to ${status} by admin`,
      });

      res.json(updated);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Admin users routes
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const allUsers = await db
        .select({
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          isAdmin: users.isAdmin,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt));
      
      // Get order count for each user
      const usersWithStats = await Promise.all(
        allUsers.map(async (user) => {
          const orderCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(orders)
            .where(eq(orders.userId, user.id));
          
          return {
            ...user,
            orderCount: Number(orderCount[0]?.count || 0),
          };
        })
      );
      
      res.json(usersWithStats);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const [user] = await db
        .select({
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          isAdmin: users.isAdmin,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, req.params.id));

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Fetch user's orders
      const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, req.params.id))
        .orderBy(desc(orders.createdAt));

      // Fetch user's shipping addresses
      const addresses = await db
        .select()
        .from(shippingAddresses)
        .where(eq(shippingAddresses.userId, req.params.id))
        .orderBy(desc(shippingAddresses.isDefault));

      res.json({ ...user, orders: userOrders, addresses });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Admin - Discount Codes
  app.get("/api/admin/discounts", requireAdmin, async (req, res) => {
    try {
      const allDiscounts = await db
        .select()
        .from(discountCodes)
        .orderBy(desc(discountCodes.createdAt));
      res.json(allDiscounts);
    } catch (error) {
      console.error("Error fetching discount codes:", error);
      res.status(500).json({ error: "Failed to fetch discount codes" });
    }
  });

  app.post("/api/admin/discounts", requireAdmin, async (req, res) => {
    try {
      const { code, type, value, minPurchase, isActive, expiresAt, bundleProducts } = req.body;

      // Validate required fields
      if (!code || !type || !value) {
        return res.status(400).json({ error: "Code, type, and value are required" });
      }

      // Validate type
      if (!['percentage', 'fixed', 'bundle'].includes(type)) {
        return res.status(400).json({ error: "Invalid discount type" });
      }

      // Check if code already exists
      const [existing] = await db
        .select()
        .from(discountCodes)
        .where(eq(discountCodes.code, code.toUpperCase()));

      if (existing) {
        return res.status(400).json({ error: "Discount code already exists" });
      }

      const [newDiscount] = await db
        .insert(discountCodes)
        .values({
          code: code.toUpperCase(),
          type,
          value,
          minPurchase: minPurchase || null,
          isActive: isActive ?? true,
          expiresAt: expiresAt || null,
          bundleProducts: bundleProducts || null,
        })
        .returning();

      res.status(201).json(newDiscount);
    } catch (error) {
      console.error("Error creating discount code:", error);
      res.status(500).json({ error: "Failed to create discount code" });
    }
  });

  app.put("/api/admin/discounts/:id", requireAdmin, async (req, res) => {
    try {
      const { code, type, value, minPurchase, isActive, expiresAt, bundleProducts } = req.body;

      // Validate required fields
      if (!code || !type || !value) {
        return res.status(400).json({ error: "Code, type, and value are required" });
      }

      // Validate type
      if (!['percentage', 'fixed', 'bundle'].includes(type)) {
        return res.status(400).json({ error: "Invalid discount type" });
      }

      // Check if code exists for other discounts
      const [existing] = await db
        .select()
        .from(discountCodes)
        .where(
          and(
            eq(discountCodes.code, code.toUpperCase()),
            sql`${discountCodes.id} != ${req.params.id}`
          )
        );

      if (existing) {
        return res.status(400).json({ error: "Discount code already exists" });
      }

      const [updatedDiscount] = await db
        .update(discountCodes)
        .set({
          code: code.toUpperCase(),
          type,
          value,
          minPurchase: minPurchase || null,
          isActive: isActive ?? true,
          expiresAt: expiresAt || null,
          bundleProducts: bundleProducts || null,
        })
        .where(eq(discountCodes.id, req.params.id))
        .returning();

      if (!updatedDiscount) {
        return res.status(404).json({ error: "Discount code not found" });
      }

      res.json(updatedDiscount);
    } catch (error) {
      console.error("Error updating discount code:", error);
      res.status(500).json({ error: "Failed to update discount code" });
    }
  });

  app.delete("/api/admin/discounts/:id", requireAdmin, async (req, res) => {
    try {
      await db.delete(discountCodes).where(eq(discountCodes.id, req.params.id));
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting discount code:", error);
      res.status(500).json({ error: "Failed to delete discount code" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
