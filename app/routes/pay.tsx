import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Outlet, useLoaderData } from "@remix-run/react";

import { json } from "@remix-run/node";

const stripePromise = loadStripe('pk_test_')

export async function loader() {

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  return json(paymentIntent);
}

const Payment = () => {
  const paymentIntent = useLoaderData<typeof loader>();

  return (
    <Elements stripe={stripePromise} options={{ clientSecret: paymentIntent.client_secret }}>
      <h1>Make Payment</h1>
      <Outlet />
    </Elements>
  );
};


export default Payment;