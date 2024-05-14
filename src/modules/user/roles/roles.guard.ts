import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // TODO - to implement auth middleware

    // const roles = this.reflector.getAllAndOverride<number[]>('roles', [
    //   context.getClass(),
    //   context.getHandler(),
    // ]);

    this.reflector.getAllAndOverride<number[]>('roles', [
      context.getClass(),
      context.getHandler(),
    ]);
    // if (!roles.length) {
    //   return true;
    // }
    // const request = context.switchToHttp().getRequest();

    // return roles.includes(request.user?.role?.id);

    return true;
  }
}
