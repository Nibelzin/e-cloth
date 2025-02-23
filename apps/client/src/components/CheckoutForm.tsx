import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { confirmOrder, createOrder, createPaymentIntent, updateOrderStatus } from '../api/orderService';
import { Address, OrderStatus, ProductInCart, User } from '../types/types';
import toast from 'react-hot-toast';

interface CheckoutFormProps {
    amount: number;
    formRef: React.RefObject<HTMLFormElement>;
    loading: boolean;
    discount: number;
    setLoading: (loading: boolean) => void;
    products: ProductInCart[];
    totalProductPrice: number;
    userAddress: Address | null;
    userData?: User;
}

const CheckoutForm = ({ amount, formRef, loading, setLoading, userData, userAddress, products, totalProductPrice, discount }: CheckoutFormProps) => {

    const [error, setError] = useState<string | undefined>(undefined);

    const stripe = useStripe();
    const elements = useElements();



    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            if (!userData?.id) return;

            event.preventDefault();
            setLoading(true)

            if (!stripe || !elements) {
                throw new Error('Stripe.js has not loaded yet.');
            }

            if (!userAddress?.id) {
                throw new Error('Endereço de entrega não selecionado');
            }

            const { error: submitError } = await elements.submit();

            if (submitError) {
                setError(submitError.message);
                return;
            }

            const { client_secret: clientSecret, id: paymentIntentId } = await createPaymentIntent(amount);

            if (!clientSecret || !paymentIntentId) {
                throw new Error('Erro ao criar pagamento');
            }

            const order = await createOrder({
                paymentIntentId: paymentIntentId,
                orderDate: new Date(),
                status: OrderStatus.PENDING,
                totalPrice: totalProductPrice,
                discount: discount > 0 ? discount : undefined,
                userId: userData.id,
                shippingAddressId: userAddress.id,
                orderItems: products.map(product => ({
                    price: product.price,
                    productId: product.id,
                    quantity: product.quantity,
                    sizeId: product.size.id!
                }))
            })

            // TODO: CONFIRMAR PAGAMENTO POR MEIO DE WEBHOOK
            await confirmOrder(order.id);

            const { error } = await stripe.confirmPayment({
                clientSecret: clientSecret!,
                elements,
                confirmParams: {
                    return_url: `http://localhost:5173/cart/checkout/confirmation?order=${order.id}`,
                }
            })


            if (error) {
                await updateOrderStatus(order.id, OrderStatus.CANCELED);
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