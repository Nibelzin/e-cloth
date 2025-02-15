import { CardElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { createOrder, createPaymentIntent } from '../api/orderService';
import { Address, OrderStatus, ProductInCart, User } from '../types/types';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

interface CheckoutFormProps {
    amount: number;
    formRef: React.RefObject<HTMLFormElement>;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    products: ProductInCart[];
    totalProductPrice: number;
    userAddress: Address | null;
    userData?: User;
}

const CheckoutForm = ({ amount, formRef, loading, setLoading, userData, userAddress, products, totalProductPrice }: CheckoutFormProps) => {

    const [error, setError] = useState<string | undefined>(undefined);

    const stripe = useStripe();
    const elements = useElements();



    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            if (!userData?.id || !userAddress?.id) return;

            event.preventDefault();
            setLoading(true)

            if (!stripe || !elements) {
                throw new Error('Stripe.js has not loaded yet.');
            }

            const { error: submitError } = await elements.submit();

            if (submitError) {
                setError(submitError.message);
                return;
            }

            const { client_secret:clientSecret, id:paymentIntentId } = await createPaymentIntent(amount);

            if (!clientSecret || !paymentIntentId) {
                throw new Error('Erro ao criar pagamento');
            }

            const order = await createOrder({
                paymentIntentId: paymentIntentId!,
                orderDate: new Date(),
                status: OrderStatus.PENDING,
                totalPrice: totalProductPrice,
                userId: userData.id,
                shippingAddressId: userAddress.id,
                orderItems: products.map(product => ({
                    id: product.id,
                    price: product.price,
                    productId: product.id,
                    quantity: product.quantity,
                    sizeId: product.size.id!
                }))
            })

            const { error } = await stripe.confirmPayment({
                clientSecret: clientSecret!,
                elements,
                confirmParams: {
                    return_url: `http://localhost:5173/cart/checkout?amount=${amount}`,
                }
            })

            if (error) {
                setError(error.message);
                throw new Error(error.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} ref={formRef}>
            <PaymentElement />
        </form>
    );
}

export default CheckoutForm;