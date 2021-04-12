import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const url = '<a href="/users">/users</a>';
    return `Hello World! You can manage your users at ${url}`;
  }
}
