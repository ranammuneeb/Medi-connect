const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');

const processPayment = async (req, res) => {
  try {
    const { appointmentId, amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: 'usd',
      metadata: { appointmentId }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { appointmentId, transactionId } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { paymentStatus: 'paid', status: 'confirmed' },
      { new: true }
    );
    if (appointment) {
      if (transactionId) {
        await Payment.create({
          appointmentId,
          transactionId,
          amount: appointment.fee,
          status: 'succeeded'
        });
      }
      res.json(appointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { processPayment, confirmPayment };