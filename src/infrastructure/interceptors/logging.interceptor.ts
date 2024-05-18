import { CallHandler, Injectable, Logger } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common";
import { NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { HashGeneratorUtil } from "src/utils/hash-generator";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    const hashTransacao = HashGeneratorUtil.generate();

    request.hash = hashTransacao;

    const metodo = `${context.getClass().name}.${context.getHandler().name}`;
    this.logger.log(`[${hashTransacao}] Executing method.`, metodo);

    const now = Date.now();

    return next.handle().pipe(
      tap(() => this.logger.log(`[${hashTransacao}] Method executed in ${Date.now() - now} ms.`, metodo)),

      catchError(error => {
        this.logger.error(`[${hashTransacao}] Method failed after ${Date.now() - now} ms.`, error.stack, metodo);
        throw error;
      }),
    );
  }
}
