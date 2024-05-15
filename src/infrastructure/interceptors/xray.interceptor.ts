import { HttpAdapterHost } from '@nestjs/core';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as AWSXray from 'aws-xray-sdk';

@Injectable()
export class XRayInterceptor implements NestInterceptor {
  constructor(private readonly httpAdapter: HttpAdapterHost) {}

  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        tap(() =>
          this.httpAdapter.httpAdapter.use(AWSXray.express.closeSegment()),
        ),
      );
  }
}
