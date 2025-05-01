from flask import Flask, request, jsonify
from flask_cors import CORS
import razorpay

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app)

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=("razorpay_api_key", "razorpay_api_secret"))

@app.route('/create-order', methods=['POST'])
def create_order():
    data = request.get_json()
    amount = int(data['amount'])  # Amount in paise
    order = razorpay_client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": "1"
    })
    return jsonify(order)

# Run the server
if __name__ == "__main__":
    app.run(debug=True)
