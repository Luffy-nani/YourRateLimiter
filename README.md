# YourRateLimiter

> Rate Limiting as a Service — instead of building rate limiting into every app yourself, just make one API call and let YourRateLimiter handle it.

## The Problem

Without rate limiting, anyone can spam your API with thousands of requests per second — crashing your server or abusing your service. YourRateLimiter sits as a sidecar service. Your app asks it one question: *"should I allow this request?"* and gets a simple yes/no back.

```
Your App  ──── POST /check ────▶  YourRateLimiter
                                        ↓
                                   Redis counter
                                        ↓
                ◀── { allowed: true/false } ──
```

## Stack

| | Technology | Why |
|---|---|---|
| API | Node.js + Express | Fast, lightweight |
| Counters | Redis | In-memory, sub-millisecond |
| Storage | MongoDB | Persistent, aggregation pipelines |
| Auth | SHA-256 + JWT | Secure, stateless |
| OAuth | Passport.js + GitHub | Developer login |
| Infrastructure | Docker + Docker Compose | One command setup |
| Dashboard | React + Chart.js | Analytics UI |

## Architecture

```
┌──────────────────────────────────────┐
│           Developer's App            │
│  POST /check                         │
│  Headers: { x-api-key: "rl_xxx" }   │
│  Body: { userId, endpoint }          │
└─────────────────┬────────────────────┘
                  ↓
┌──────────────────────────────────────┐
│           YourRateLimiter            │
│  1. Verify API key → MongoDB         │
│  2. Find rule for endpoint           │
│  3. Run algorithm → Redis            │
│  4. Log result → MongoDB (async)     │
│  5. Return { allowed, remaining }    │
└──────┬───────────────────┬───────────┘
       ↓                   ↓
   Redis                MongoDB
   Counters           Clients, Rules
                      Audit Logs
```

## Algorithms

**Fixed Window** — divides time into fixed buckets. Simple, fast. Edge case: user can spike at window boundaries.

**Sliding Window** — always looks at last N seconds from now. Fixes edge spikes. Uses Redis sorted sets.

**Token Bucket** — bucket of tokens, refills over time. Allows controlled bursts.

## Quick Start

1. Clone and create `.env`:
```env
PORT=3000
MONGO_URI=mongodb://mongodb:27017/yourratelimiter
REDIS_URL=redis://redis:6379
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret
JWT_SECRET=your_secret
```

2. Run:
```bash
docker-compose up --build
```

## API Reference

**Register a client:**
```bash
POST /api/clients/register
{ "appName": "my-app", "rules": [
  { "endpoint": "/login", "limit": 5, "windowSize": 60, "algorithm": "sliding" },
  { "endpoint": "*", "limit": 100, "windowSize": 60, "algorithm": "fixed" }
]}
```

**Check rate limit:**
```bash
POST /api/check
x-api-key: rl_xxxx
{ "userId": "user_123", "endpoint": "/login" }
```

Response:
```json
{ "allowed": true, "remaining": 4, "resetTime": 1748275260 }
```

Headers returned:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1748275260
```

**Other endpoints:**
```
GET    /api/clients/me         → your client info
PUT    /api/clients/rules      → update rules
POST   /api/clients/rotate-key → rotate API key
DELETE /api/clients            → deactivate account
GET    /auth/github            → login with GitHub
```

## Integration

```js
app.post('/login', async (req, res) => {
  const result = await fetch('http://localhost:3000/api/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.RATELIMITER_API_KEY
    },
    body: JSON.stringify({ userId: req.ip, endpoint: '/login' })
  }).then(r => r.json())

  if (!result.allowed) {
    return res.status(429).json({ error: 'Too many requests' })
  }
  // continue
})
```

## Security

- API keys hashed with SHA-256 — never stored in plaintext
- GitHub OAuth uses Authorization Code Flow — token never appears in URL
- JWT for dashboard auth
- Multi-tenant isolation — clients cannot access each other's data
- Helmet.js security headers
- Addresses OWASP API Security Top 10 — API4: Unrestricted Resource Consumption

## Challenges & Learnings

- Understood why bcrypt can't be used for API key lookups → switched to SHA-256
- Implemented OAuth Authorization Code Flow instead of token-in-URL for security
- Learned why Redis sorted sets are the right data structure for sliding window
- Designed multi-tenant isolation without complex permission systems
- Learned the difference between Redis (speed) and MongoDB (persistence) and when to use each

## Future Plans

- Anomaly detection — flag suspicious traffic patterns using statistical analysis
- Auto algorithm selection based on real-time traffic analysis
- Webhook notifications when clients get throttled
- npm package — `npm install yourratelimiter-client`
- PKCE flow for production OAuth

---
