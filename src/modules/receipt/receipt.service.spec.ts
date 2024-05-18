import { Test, TestingModule } from "@nestjs/testing";
import { ReceiptService } from "./receipt.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ReceiptEntity } from "./entities/receipt.entity";
import { RequestEntity } from "src/modules/request/entities/request.entity";
import { CreateReceiptDto } from "./dto/create-receipt.dto";
import { BadRequestException } from "@nestjs/common";
import { RequestStatusEnum } from "src/modules/request/enums/status.enum";
import { FileEntity } from "../file/entities/file.entity";
import { ReceiptType } from "./entities/receipt-type.entity";

describe("ReceiptService", () => {
  let service: ReceiptService;
  let receiptRepository: Repository<ReceiptEntity>;
  let requestRepository: Repository<RequestEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiptService,
        {
          provide: getRepositoryToken(ReceiptEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(RequestEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ReceiptService>(ReceiptService);
    receiptRepository = module.get<Repository<ReceiptEntity>>(getRepositoryToken(ReceiptEntity));
    requestRepository = module.get<Repository<RequestEntity>>(getRepositoryToken(RequestEntity));
  });

  describe("validateAndUpdateRequest", () => {
    it("should throw an error if request is not found", async () => {
      jest.spyOn(requestRepository, "findOne").mockResolvedValue(null);

      const dto: CreateReceiptDto = {
        file: 1 as unknown as FileEntity,
        receiptType: 1 as unknown as ReceiptType,
        request: 1 as unknown as RequestEntity,
        provenValue: 100,
      };

      await expect(service["validateAndUpdateRequest"](dto)).rejects.toThrow(BadRequestException);
    });

    it("should throw an error if request status is not deferred", async () => {
      const request = new RequestEntity();
      request.statusId = RequestStatusEnum.analysis;

      jest.spyOn(requestRepository, "findOne").mockResolvedValue(request);

      const dto: CreateReceiptDto = {
        file: 1 as unknown as FileEntity,
        provenValue: 100,
        receiptType: 1 as unknown as ReceiptType,
        request: 1 as unknown as RequestEntity,
      };

      await expect(service["validateAndUpdateRequest"](dto)).rejects.toThrow(BadRequestException);
    });

    it("should throw an error if provenValue is greater than request amount", async () => {
      const request = new RequestEntity();
      request.statusId = RequestStatusEnum.accepted;
      request.amount = 50;

      jest.spyOn(requestRepository, "findOne").mockResolvedValue(request);

      const dto: CreateReceiptDto = {
        provenValue: 100,
        file: 1 as unknown as FileEntity,
        receiptType: 1 as unknown as ReceiptType,
        request: 1 as unknown as RequestEntity,
      };

      await expect(service["validateAndUpdateRequest"](dto)).rejects.toThrow(BadRequestException);
    });

    it("should throw an error if total provenValue exceeds request amount", async () => {
      const request = new RequestEntity();
      request.statusId = RequestStatusEnum.accepted;
      request.amount = 100;

      const existingReceipts = [new ReceiptEntity(), new ReceiptEntity()];
      existingReceipts[0].provenValue = 30;
      existingReceipts[1].provenValue = 50;

      jest.spyOn(requestRepository, "findOne").mockResolvedValue(request);
      jest.spyOn(receiptRepository, "find").mockResolvedValue(existingReceipts);

      const dto: CreateReceiptDto = {
        file: 1 as unknown as FileEntity,
        receiptType: 1 as unknown as ReceiptType,
        request: 1 as unknown as RequestEntity,
        provenValue: 30,
      };

      await expect(service["validateAndUpdateRequest"](dto)).rejects.toThrow(BadRequestException);
    });

    it("should update request status if total provenValue equals request amount", async () => {
      const request = new RequestEntity();
      request.statusId = RequestStatusEnum.accepted;
      request.amount = 100;

      const existingReceipts = [new ReceiptEntity(), new ReceiptEntity()];
      existingReceipts[0].provenValue = 30;
      existingReceipts[1].provenValue = 50;

      jest.spyOn(requestRepository, "findOne").mockResolvedValue(request);
      jest.spyOn(receiptRepository, "find").mockResolvedValue(existingReceipts);
      jest.spyOn(requestRepository, "save").mockResolvedValue(request);

      const dto: CreateReceiptDto = {
        file: 1 as unknown as FileEntity,
        receiptType: 1 as unknown as ReceiptType,
        request: 1 as unknown as RequestEntity,
        provenValue: 20,
      };

      await service["validateAndUpdateRequest"](dto);

      expect(request.statusId).toBe(RequestStatusEnum.concluded);
      expect(requestRepository.save).toHaveBeenCalledWith(request);
    });

    it("should pass validation if all conditions are met", async () => {
      const request = new RequestEntity();
      request.statusId = RequestStatusEnum.accepted;
      request.amount = 100;

      const existingReceipts = [new ReceiptEntity(), new ReceiptEntity()];
      existingReceipts[0].provenValue = 30;
      existingReceipts[1].provenValue = 50;

      jest.spyOn(requestRepository, "findOne").mockResolvedValue(request);
      jest.spyOn(receiptRepository, "find").mockResolvedValue(existingReceipts);

      const dto: CreateReceiptDto = {
        file: 1 as unknown as FileEntity,
        receiptType: 1 as unknown as ReceiptType,
        request: 1 as unknown as RequestEntity,
        provenValue: 10,
      };

      await expect(service["validateAndUpdateRequest"](dto)).resolves.not.toThrow();
    });
  });
});
