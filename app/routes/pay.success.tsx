import { useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState } from "react";

const Index = () => {

    const stripe = useStripe();

    const [paymentStatus, setPaymentStatus] = useState("");

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret as string).then(({ paymentIntent }) => {
            setPaymentStatus(paymentIntent?.status as string);
        });
    }, [stripe]);


    return (
        <h3>{paymentStatus}</h3>
    )

}

export default Index;