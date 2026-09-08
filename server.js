require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/key", (req, res) => res.json({ key: process.env.RAZORPAY_KEY_ID }));

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.post("/create-order", async (req, res) => {
  try {
    const { amount, name, phone } = req.body;
    if (!Number.isInteger(amount) || amount < 100) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `foodtruck_${Date.now()}`,
      notes: { customer_name: name || "", customer_phone: phone || "" }
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create payment order" });
  }
});

app.post("/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ verified: false, error: "Invalid signature" });
    }

    // TODO: Save the paid order to a database/order system before fulfilling it.
    res.json({ verified: true, payment_id: razorpay_payment_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ verified: false, error: "Verification failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Food Truck running at http://localhost:${PORT}`));
