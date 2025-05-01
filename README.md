# Supermarket Billing System

A complete web-based billing application for supermarkets, built with **React** for the frontend and **Flask** for the backend, including **Tailwind CSS** for styling and **Razorpay** integration for online payments.

---

## 🚀 Features

- Add items to cart with name, price, and quantity
- 💵 Auto calculation of GST (5%)
-  Real-time billing summary
- Generate and print/download invoice
- 💳 Razorpay payment gateway integration
- 📆 Real-time date & time display
- 🎨 Fully responsive and styled with Tailwind CSS

---

## Tech Stack

| Frontend       | Backend       | Payment Gateway |
|----------------|----------------|------------------|
| React.js       | Flask (Python) | Razorpay         |
| Tailwind CSS   | SQLite         |                  |

---

## 📦 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/mahi0331-supermarket-billing-system.git
cd mahi0331-supermarket-billing-system
```

### 2️⃣ Run Backend (Flask)

```bash
cd server
python -m venv .venv
pip install razorpay
pip install flask
pip install flask flask-cors razorpay
pip install setuptools
python Pay.py
```
### The Flask server will run at: http://localhost:5000

### 3️⃣ Run Frontend (React)

```bash
cd client
npm install
npm start
```
### The React app will run at: http://localhost:3000

### 💳 Razorpay Integration
1. Uses Razorpay Checkout.js in the frontend <br>
2. Backend creates an order via Razorpay API <br>

### 📷 Screenshots
### Dark Mode
![Screenshot 2025-05-01 204530](https://github.com/user-attachments/assets/f4392f1e-6527-4fe4-b6b2-24e254484a40)

### Light Mode
![Screenshot 2025-05-01 204849](https://github.com/user-attachments/assets/c6e7b12b-838e-432e-bdc1-7fd7ce2cdb09)

### Razorpay Gateway
![Screenshot 2025-05-01 204545](https://github.com/user-attachments/assets/3e417d68-be39-42a6-bc5b-c133bd970da6)

### Invoice Generation (PDF Downloading)
![Screenshot 2025-05-01 204615](https://github.com/user-attachments/assets/2a64e5cc-e8ef-49e1-822b-d0e7fcdab883)


### 📌 Future Improvements
1. Add user authentication <br>
2. Enable payment method selection (UPI, Card, Wallet) <br>
3. Add downloadable PDF receipt support <br>
4. Deploy with Docker or Vercel + Render <br>

### 👨‍💻 Author
**Mahanth K S** <br>
Supermarket Billing System <br>





