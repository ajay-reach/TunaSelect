import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { authMiddleware, exchangeCodeForSessionToken, getOAuthRedirectUrl, deleteSession, MOCHA_SESSION_TOKEN_COOKIE_NAME } from "@getmocha/users-service/backend";

const app = new Hono<{ Bindings: Env }>();

// Auth endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Fish and segments endpoints
app.get('/api/fish', async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM fish WHERE is_available = 1 ORDER BY created_at DESC"
  ).all();

  return c.json(results);
});

app.get('/api/fish/:id', async (c) => {
  const fishId = c.req.param('id');
  
  const fish = await c.env.DB.prepare(
    "SELECT * FROM fish WHERE id = ? AND is_available = 1"
  ).bind(fishId).first();

  if (!fish) {
    return c.json({ error: 'Fish not found' }, 404);
  }

  const { results: segments } = await c.env.DB.prepare(
    "SELECT * FROM segments WHERE fish_id = ? ORDER BY name"
  ).bind(fishId).all();

  return c.json({ fish, segments });
});

// Reserve segments temporarily
app.post('/api/segments/reserve', authMiddleware, async (c) => {
  const body = await c.req.json();
  const { segmentIds } = body;
  
  if (!segmentIds || !Array.isArray(segmentIds)) {
    return c.json({ error: 'Invalid segment IDs' }, 400);
  }

  const reserveUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

  for (const segmentId of segmentIds) {
    await c.env.DB.prepare(
      "UPDATE segments SET reserved_until = ? WHERE id = ? AND is_available = 1 AND (reserved_until IS NULL OR reserved_until < datetime('now'))"
    ).bind(reserveUntil, segmentId).run();
  }

  return c.json({ success: true, reserveUntil });
});

// Create order
app.post('/api/orders', authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const { fishId, segmentIds, customerName, customerEmail, customerPhone, deliveryAddress, deliveryDate } = body;

  if (!fishId || !segmentIds || !Array.isArray(segmentIds) || !customerName || !customerEmail) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  // Get fish details
  const fish = await c.env.DB.prepare("SELECT * FROM fish WHERE id = ?").bind(fishId).first();
  if (!fish) {
    return c.json({ error: 'Fish not found' }, 404);
  }

  // Get segment details
  const segmentPlaceholders = segmentIds.map(() => '?').join(',');
  const { results: segments } = await c.env.DB.prepare(
    `SELECT * FROM segments WHERE id IN (${segmentPlaceholders}) AND fish_id = ? AND is_available = 1`
  ).bind(...segmentIds, fishId).all();

  if (segments.length !== segmentIds.length) {
    return c.json({ error: 'Some segments are not available' }, 400);
  }

  const totalWeight = segments.reduce((sum: number, segment: any) => sum + segment.weight_kg, 0);
  const totalPrice = totalWeight * (fish.price_per_kg as number);

  // Create order
  const order = await c.env.DB.prepare(
    `INSERT INTO orders (user_id, fish_id, segment_ids, total_weight_kg, total_price, customer_name, customer_email, customer_phone, delivery_address, delivery_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    user!.id,
    fishId,
    JSON.stringify(segmentIds),
    totalWeight,
    totalPrice,
    customerName,
    customerEmail,
    customerPhone,
    deliveryAddress,
    deliveryDate
  ).run();

  // Mark segments as unavailable
  for (const segmentId of segmentIds) {
    await c.env.DB.prepare(
      "UPDATE segments SET is_available = 0 WHERE id = ?"
    ).bind(segmentId).run();
  }

  return c.json({ 
    orderId: order.meta.last_row_id,
    totalWeight,
    totalPrice,
    success: true 
  });
});

// Get user orders
app.get('/api/orders', authMiddleware, async (c) => {
  const user = c.get("user");
  
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC"
  ).bind(user!.id).all();

  return c.json(results);
});

export default app;
