import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private readonly configService: ConfigService) {
        this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'))
    }

    getStripeClient() {
        return this.stripe;
    }

    createPaymentIntent({ amount }: { amount: number }) {
        return this.stripe.paymentIntents.create({
            amount: amount,
            currency: 'BRL',
            automatic_payment_methods: { enabled: true }
        })
    }
}
