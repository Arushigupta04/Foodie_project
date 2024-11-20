import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const Checkout = ({ totalAmount, handlePayment }) => {
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState(''); // New state for email
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (address.trim() === '' || email.trim() === '') {
      alert('Please enter your delivery address and email.');
      return;
    }

    setLoading(true);

    try {
      await handlePayment({ address, paymentMethod, email }); // Pass email to handlePayment
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const handleCheckout = async () => {
    const amount = totalAmount; // Use the subtotal for the payment amount
    console.log("outside try")
    try {
        // Create an order on the server
        const response = await fetch('http://localhost:5000/api/v1/pay/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount,
                currency: 'INR',
            }),
        });
        console.log(response)
        
        const data = await response.json();
        console.log(data)
        const { order } = data;
        console.log("insdie try2")
        // Initialize Razorpay payment
        const options = {
            key: 'rzp_test_XaigqT7nptLPme', // Replace with your Razorpay API key
            amount: order.amount, // Amount in paise
            currency: order.currency,
            name: 'Foodie', // Your company or website name
            description: 'Invoice Payment', // A brief description
            order_id: order.id, // The Razorpay order ID created on the server
            handler: async function (response) {
              console.log("inside the handler function")
                console.log("sdcvfewsxdcv dswdcfv"+response)
                // Log the response to ensure you're getting the correct data
                console.log("start")
                console.log("Razorpay Response: ", response);

                const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

                if (razorpay_payment_id && razorpay_order_id && razorpay_signature) {
                    toast.success('Payment successful!');

                    // Send payment details to your server for verification using fetch
                    try {
                        console.log("dcswdxcdxccfvdwecf")
                        const verificationResponse = await fetch(
                            'http://localhost:5000/api/v1/pay/paymentverification',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    razorpay_order_id, // Razorpay field names must match
                                    razorpay_payment_id,
                                    razorpay_signature,
                                    amount
                                }),
                            }
                        );

                        const verificationData = await verificationResponse.json();
                        console.log('Payment verification response:', verificationData);

                        if (verificationData.success) {
                            // Further action (e.g., save invoice)
                            // handleGeneratePDF()
                            // navigate("pay-success")
                            console.log("doneeeeeeeeeeeeeeeeeeee")
                            // setCartItems("")
                            // console.log(cartItems)
                            console.log("he above after the cart items ");
                        } else {
                            toast.error('Payment verification failed!');
                        }
                    } catch (error) {
                        console.error('Error verifying payment:', error);
                        toast.error('Payment verification failed!');
                    }
                } else {
                    console.error('Payment failed or incomplete response.');
                    toast.error('Payment failed or incomplete response.');
                }
            },
            prefill: {
                name: 'Customer Name', // Prefilled customer name
                email: 'customer@example.com', // Prefilled customer email
                contact: '9999999999', // Prefilled customer contact number
            },
            notes: {
                address: 'Customer Address', // Any additional notes you want to send
            },
            theme: {
                color: '#F37254', // Customize your Razorpay payment popup's color
            },
        };
        console.log(options)
        console.log("insdie try3")
        // setCartItems([])
        // console.log(cartItems)
        // console.log(cartItems)
        const razorpay = new window.Razorpay(options);
        razorpay.open();
    } catch (error) {
        console.log("insdie error")
        console.error('Payment Error:', error);
        toast.error('Payment failed. Please try again.');
    }
};

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Checkout</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Delivery Address</label>
            <textarea
              className="form-control"
              id="address"
              rows="3"
              value={address}
              onChange={handleAddressChange}
              placeholder="Enter your delivery address..."
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email..."
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
            <select
              className="form-select"
              id="paymentMethod"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="Pay On Delivery">Pay on Delivery</option>
            </select>
          </div>
          <p><strong>Total Amount: ₹{totalAmount}</strong></p>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            onClick={handleCheckout}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
