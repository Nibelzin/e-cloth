import { WebhookEvent } from '@clerk/clerk-sdk-node';
import { Body, Controller, Headers, InternalServerErrorException, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { Webhook } from 'svix';

@Controller('webhook')
export class WebhookController {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ){}

    @Post()
    async handleWebhook(
        @Headers('svix-id') svixId: string,
        @Headers('svix-timestamp') svixTimestamp: string,
        @Headers('svix-signature') svixSignature: string,
        @Body() body: any
    ) {
        const WEBHOOK_SECRET = this.configService.get<string>('CLERK_WEBHOOK_SECRET')
        if(!WEBHOOK_SECRET){
            throw new InternalServerErrorException('Webhook secret not found')
        }

        const webhook = new Webhook(WEBHOOK_SECRET)
        let event: WebhookEvent

        try {
            event = webhook.verify(JSON.stringify(body), {
                'svix-id': svixId,
                'svix-timestamp': svixTimestamp,
                'svix-signature': svixSignature
            }) as WebhookEvent

            const eventType = event.type

            if (eventType === 'user.created'){
                console.log(event.data.first_name)
            }

            return { status: 'success' };
        } catch {
            throw new InternalServerErrorException('Webhook verification failed')
        }
    }
}
