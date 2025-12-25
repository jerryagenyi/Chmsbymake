import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Supabase admin client for user creation
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-1b8f0a52/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================

/**
 * POST /make-server-1b8f0a52/signup
 * Create a new user account with role
 */
app.post("/make-server-1b8f0a52/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, role = 'member' } = body;

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Create user with admin API
    // Note: email_confirm is set to true since we haven't configured an email server
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since email server not configured
      user_metadata: {
        name,
        role,
      },
    });

    if (error) {
      console.error('Sign up error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    const profile = {
      id: data.user.id,
      email: data.user.email,
      name,
      role,
      created_at: new Date().toISOString(),
    };

    await kv.set(`user_profile:${data.user.id}`, profile);

    return c.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

/**
 * GET /make-server-1b8f0a52/profile/:userId
 * Get user profile by ID
 */
app.get("/make-server-1b8f0a52/profile/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    
    // Get auth token from header
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Only allow users to access their own profile (unless admin)
    if (user.id !== userId && user.user_metadata?.role !== 'pastor') {
      return c.json({ error: 'Forbidden' }, 403);
    }

    // Get profile from KV store
    const profile = await kv.get(`user_profile:${userId}`);

    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({ error: 'Internal server error while fetching profile' }, 500);
  }
});

/**
 * PUT /make-server-1b8f0a52/profile/:userId
 * Update user profile
 */
app.put("/make-server-1b8f0a52/profile/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const updates = await c.req.json();
    
    // Get auth token
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify user
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Only allow users to update their own profile
    if (user.id !== userId) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    // Get current profile
    const currentProfile = await kv.get(`user_profile:${userId}`);

    if (!currentProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    // Merge updates (don't allow role changes via this endpoint)
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      id: userId, // Ensure ID doesn't change
      role: currentProfile.role, // Preserve role (only admins can change)
    };

    // Save updated profile
    await kv.set(`user_profile:${userId}`, updatedProfile);

    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: 'Internal server error while updating profile' }, 500);
  }
});

/**
 * GET /make-server-1b8f0a52/users
 * Get all users (admin only)
 */
app.get("/make-server-1b8f0a52/users", async (c) => {
  try {
    // Get auth token
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify user is admin (pastor or staff)
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userRole = user.user_metadata?.role;
    if (userRole !== 'pastor' && userRole !== 'staff') {
      return c.json({ error: 'Forbidden - Admin access required' }, 403);
    }

    // Get all user profiles
    const profiles = await kv.getByPrefix('user_profile:');

    return c.json({ users: profiles });
  } catch (error) {
    console.error('Get users error:', error);
    return c.json({ error: 'Internal server error while fetching users' }, 500);
  }
});

Deno.serve(app.fetch);