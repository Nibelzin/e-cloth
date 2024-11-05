import { WebhookEvent } from '@clerk/clerk-sdk-node';
import {
  Body,
  Controller,
  Headers,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ClerkUserEventData } from 'src/user/dto/clerk-user-event-data.interface';
import { UserService } from 'src/user/user.service';
import { Webhook } from 'svix';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async handleWebhook(
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const WEBHOOK_SECRET = this.configService.get<string>(
      'CLERK_WEBHOOK_SECRET',
    );
    if (!WEBHOOK_SECRET) {
      throw new InternalServerErrorException('Webhook secret not found');
    }

    const webhook = new Webhook(WEBHOOK_SECRET);
    let event: WebhookEvent;

    try {
      event = webhook.verify(JSON.stringify(body), {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent;

      const eventType = event.type;
      const clerkData = event.data as ClerkUserEventData;
      const userDto = this.userService.clerkDataToUserDTO(clerkData);

      switch (eventType) {
        case 'user.created':
          return res.status(HttpStatus.CREATED).json(
            await this.userService.createUser({
              clerkId: userDto.clerkId,
              email: userDto.email,
              firstName: userDto.firstName,
              lastName: userDto.lastname,
            }),
          );
        case 'user.updated':
          return res.status(HttpStatus.OK).json(
            await this.userService.updateUser({
              where: { clerkId: userDto.clerkId },
              data: {
                clerkId: userDto.clerkId,
                email: userDto.email,
                firstName: userDto.firstName,
                lastName: userDto.lastname,
              },
            }),
          );
        case 'user.deleted':
            return res.status(HttpStatus.OK).json(
                await this.userService.deleteUser({
                    clerkId: clerkData.id
                })
            )
        default:
            throw new InternalServerErrorException(`Unhandled event type: ${eventType}`)
      }

    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
  }
}

