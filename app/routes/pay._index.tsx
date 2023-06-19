import { PaymentElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from '@stripe/react-stripe-js'


const Index = () => {

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (stripe && elements) {
            await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: 'http://localhost:3000/pay/success'
                }
            })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button>Complete Payment</button>
        </form>
    );
};

export default Index;