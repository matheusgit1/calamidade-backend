import { BadRequestException, ForbiddenException, HttpStatus, NotFoundException, UnauthorizedException, Logger } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { BusinessException } from "../exceptions/business.exception";
import { ResourceNotFoundException } from "../exceptions/resource-not-found.exception";
import { ProxyException } from "../exceptions/proxy.exception";
import { InvalidInputException } from "../exceptions/invalid-input.exception";

import { CustomExceptionFilter } from "./custom-exception-filter";

const mockAppLoggerService = {
  setContext: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};
const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetRequest = jest.fn().mockImplementation(() => ({
  hash: "123",
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: mockGetRequest,
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe("CustomExceptionFilter", () => {
  let service: CustomExceptionFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomExceptionFilter,
        {
          provide: Logger,
          useValue: mockAppLoggerService,
        },
      ],
    }).compile();
    service = module.get<CustomExceptionFilter>(CustomExceptionFilter);
  });
  test("Should be defined", () => {
    expect(service).toBeDefined();
  });

  test("UnauthorizedException", () => {
    service.catch(new UnauthorizedException(), mockArgumentsHost);
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith({
      description: "Unauthorized",
      transaction: "123",
    });
  });

  test("ForbiddenException", () => {
    service.catch(new ForbiddenException(), mockArgumentsHost);
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith({
      description: "Forbidden",

      transaction: "123",
    });
  });

  test("BadRequestException", () => {
    service.catch(new BadRequestException(), mockArgumentsHost);
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({}));
  });

  test("BusinessException", () => {
    service.catch(new BusinessException(91, "Teste"), mockArgumentsHost);
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith({
      description: "Teste",

      transaction: "123",
    });
  });

  test("ResourceNotFoundException", () => {
    service.catch(new ResourceNotFoundException("Resource not found"), mockArgumentsHost);
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith({
      description: "Resource not found",
      transaction: "123",
    });
  });

  test("NotFoundException", () => {
    service.catch(new NotFoundException(), mockArgumentsHost);
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith({
      description: "Not Found",
      transaction: "123",
    });
  });

  test("ProxyException", () => {
    service.catch(new ProxyException("erro", "test-mock-erro"), mockArgumentsHost);
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith({
      description: "Internal Server Error",
      transaction: "123",
    });
  });

  test("InvalidInputException", () => {
    service.catch(new InvalidInputException("erro"), mockArgumentsHost);
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith({
      description: "erro",
      transaction: "123",
    });
  });

  test("Unmaped error", () => {
    service.catch(new Error("Random"), mockArgumentsHost);
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith({
      description: "Unmapped error",
      transaction: "123",
    });
  });

  test("should log without hash", () => {
    mockGetRequest.mockReturnValueOnce(() => ({}));
    service.catch(new Error(), mockArgumentsHost);
  });
});
