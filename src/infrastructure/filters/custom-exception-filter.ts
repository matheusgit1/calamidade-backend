import { Response, Request } from "express";
import { ArgumentsHost, BadRequestException, ExceptionFilter, ForbiddenException, HttpStatus, Injectable, NotFoundException, UnauthorizedException, Logger } from "@nestjs/common";
import { BusinessException } from "../exceptions/business.exception";
import { ResourceNotFoundException } from "../exceptions/resource-not-found.exception";
import { ProxyException } from "../exceptions/proxy.exception";
import { InvalidInputException } from "../exceptions/invalid-input.exception";
import { QueryFailedError } from "typeorm";

@Injectable()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger(CustomExceptionFilter.name);
  }

  logStackTrace(exception: any, request: Request) {
    if (request.hash) {
      this.logger.error(`[${request.hash}] Request processed with error`, exception.stack);
    } else {
      this.logger.error(`Request processed with error`, exception.stack);
    }
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { hash } = request;

    this.logStackTrace(exception, request);

    if (exception.response?.status && exception.response?.errors) {
      return response.status(exception.response.status).json({
        transaction: hash,
        description: "Exception",
        erros: exception.response.errors,
      });
    }

    switch (exception.constructor) {
      case BadRequestException:
        return response.status(HttpStatus.BAD_REQUEST).json({
          transaction: hash,

          description: exception.message ?? "Bad Request",
          erros: exception.response.message,
        });
      case UnauthorizedException:
        return response.status(HttpStatus.UNAUTHORIZED).json({
          transaction: hash,
          description: exception.message ?? "Unauthorized",
        });
      case ForbiddenException:
        return response.status(HttpStatus.FORBIDDEN).json({
          transaction: hash,
          description: "Forbidden",
        });
      case ResourceNotFoundException:
        return response.status(HttpStatus.NOT_FOUND).json({
          transaction: hash,
          description: exception.message ?? "Resource not found",
        });
      case NotFoundException:
        return response.status(HttpStatus.NOT_FOUND).json({
          transaction: hash,
          description: exception.message ?? "Not found",
        });
      case InvalidInputException:
        return response.status(HttpStatus.BAD_REQUEST).json({
          transaction: hash,
          description: exception.message ?? "Bad Request",
        });
      case ProxyException:
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          transaction: hash,
          description: "Internal Server Error",
        });
      case BusinessException:
        return response.status(HttpStatus.BAD_REQUEST).json({
          transaction: hash,
          description: exception.message ?? "Bad Request",
        });
      /**
       * add more as needed
       */
      default:
        this.logger.verbose(exception);
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          transaction: hash,
          description: "Unmapped error",
        });
    }
  }
}
