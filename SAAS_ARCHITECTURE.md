# LinearAI SaaS Architecture Documentation

## 1. Tech Stack Overview
- **Frontend**: React 18 + Vite (or Next.js for Production)
- **Styling**: Tailwind CSS (Minimal Black & White aesthetic)
- **State Management**: React Context API + LocalStorage
- **Authentication**: Google OAuth 2.0
- **Database**: PostgreSQL (Prisma ORM recommended)
- **Payments**: Stripe (Subscriptions & Webhooks)
- **AI Engine**: Llama 3.2 Vision (via Groq) + Custom OpenCV/Canvas Processing
- **Storage**: Cloudinary / AWS S3

## 2. Folder Structure
```text
/src
  /components
    /admin         # Admin specific components
    /dashboard     # User dashboard components
    /ui            # Reusable shadcn-like components
    LandingPage.tsx
    Pricing.tsx
  /context
    AuthContext.tsx
    SubscriptionContext.tsx
  /hooks
    useImageEditor.ts
  /utils
    imageProcessor.ts
    stripe.ts
    groq.ts
  App.tsx
  main.tsx
```

## 3. Database Schema (PostgreSQL)
```prisma
model User {
  id                String   @id @default(uuid())
  email             String   @unique
  name              String
  image             String?
  role              Role     @default(USER)
  subscription      Subscription?
  usageLimit        Int      @default(3)
  conversions       Conversion[]
  createdAt         DateTime @default(now())
}

model Subscription {
  id            String   @id
  userId        String   @unique
  status        String   // active, canceled, past_due
  plan          Plan     @default(FREE)
  stripeId      String?
  endDate       DateTime?
  user          User     @relation(fields: [userId], references: [id])
}

model Conversion {
  id          String   @id @default(uuid())
  userId      String
  style       String
  imageUrl    String
  creditsUsed Int      @default(1)
  createdAt   DateTime @default(now())
}

model CreditTransaction {
  id          String   @id @default(uuid())
  userId      String
  amount      Int
  type        TransactionType // EARN, SPEND
  description String
  createdAt   DateTime @default(now())
}

enum Role { USER, ADMIN }
enum Plan { FREE, PRO, ENTERPRISE }
enum TransactionType { EARN, SPEND }
```

## 5. Credit Logic
- **Signup**: +5 Credits.
- **Conversion**: -1 Credit.
- **Pro Plan**: +100 Credits/mo.
- **Enterprise**: Unlimited (flag bypass).
- **Admin**: Can override `credits` field directly.
- **Webhooks**: Stripe `invoice.paid` triggers credit reset/top-up.


## 4. Scalability Plan
1. **Edge Processing**: Move image processing to Edge Functions (Vercel/Cloudflare) to reduce latency.
2. **Caching**: Use Redis to store user session and daily usage counts to minimize DB hits.
3. **Queueing**: For high-res vectorization, use a worker queue (BullMQ/RabbitMQ) to handle processing asynchronously.
4. **CDN**: Serve all generated assets via a global CDN with signed URLs for security.
