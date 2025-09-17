// payment.js

class Payment {
  constructor(amount) {
    this.amount = amount;
  }

  process() {
    throw new Error("process() must be implemented in subclass");
  }
}

class UpiPayment extends Payment {
  process() {
    return { success: true, message: `Payment received via UPI for ₹${this.amount}` };
  }
}

class CashPayment extends Payment {
  process() {
    return { success: true, message: `Payment received via Cash for ₹${this.amount}` };
  }
}

class CardPayment extends Payment {
  process() {
    return { success: true, message: `Payment received via Card for ₹${this.amount}` };
  }
}

function createPayment(amount, method) {
  switch (method) {
    case "UPI": return new UpiPayment(amount);
    case "CASH": return new CashPayment(amount);
    case "CARD": return new CardPayment(amount);
    default: throw new Error("Invalid payment method. Use UPI, CASH, or CARD.");
  }
}

module.exports = { createPayment };
