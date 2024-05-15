import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'UP',
      moment: new Date().toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      }),
    };
  }
}
