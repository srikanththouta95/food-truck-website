# Food Truck — Razorpay Online Payments

1. Install Node.js.
2. Copy `.env.example` to `.env`.
3. Create a Razorpay account and generate TEST API keys.
4. Put the TEST Key ID and TEST Key Secret in `.env`.
5. Run `npm install`.
6. Run `npm start`.
7. Open http://localhost:3000.

For live payments, complete Razorpay onboarding/KYC and replace test keys with live keys. Never expose the Key Secret in browser code or commit `.env`.

The server creates a Razorpay order, opens Standard Checkout, and verifies the returned payment signature server-side.
