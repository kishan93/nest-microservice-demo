export class CreateUserKeyDto {
  userId: number;
  rateLimit: number;
  expiration: Date;
}
