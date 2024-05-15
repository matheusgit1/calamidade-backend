import { CallHandler, Logger } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { HashGeneratorUtil } from 'src/utils/hash-generator';

export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    const hashTransacao = HashGeneratorUtil.generate();
    request.hash = hashTransacao;

    const metodo = `${context.getClass().name}.${context.getHandler().name}`;
    this.logger.log(`[${hashTransacao}] Executing method.`, metodo);
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `[${hashTransacao}] Method executed in ${Date.now() - now} ms.`,
            metodo,
          ),
        ),
      );
  }
}
