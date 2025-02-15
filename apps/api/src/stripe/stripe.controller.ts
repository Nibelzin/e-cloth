import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {

    constructor(private readonly stripeService: StripeService) {}

    @Post('create-payment-intent')
    async createPaymentIntent(@Body() body: { amount: number }) {
        return this.stripeService.createPaymentIntent({ amount: body.amount });
    }

}
