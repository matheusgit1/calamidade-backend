// import request from "supertest";
// import { HttpStatus } from "@nestjs/common";
// import { AccidentEntity } from "../../src/modules/accidents/entities/accident.entity";
// import { OrganizationEntity } from "../../src/modules/organization/entities/organization.entity";
// import { FileEntity } from "../../src/modules/file/entities/file.entity";
// import { RequestEntity } from "../../src/modules/request/entities/request.entity";
// import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL, TESTER_EMAIL, TESTER_PASSWORD } from "../utils/constants";
// import { FactoryAccident, FactoryOrganization, FactoryFile, FactoryRequest } from "../utils/factories";

// describe("AccidentsController (e2e)", () => {
//   let createdAccidentId: number;
//   let token: string;
//   let tokenAdmin: string;
//   let userAdminId: string;
//   let organizationId: string;
//   let fileId: number;
//   let requestId: number;

//   const app = APP_URL;

//   const accidentData: Partial<AccidentEntity> = FactoryAccident();
//   const organizationData: Partial<OrganizationEntity> = FactoryOrganization();
//   const fileData: Partial<FileEntity> = FactoryFile();
//   const requestData: Partial<RequestEntity> = FactoryRequest();

//   beforeAll(async () => {
//     // Login with test user
//     await request(app)
//       .post(`/${process.env.API_PREFIX}/v1/auth/email/login`)
//       .send({ email: TESTER_EMAIL, password: TESTER_PASSWORD })
//       .then(({ body }) => {
//         token = body.token;
//       });

//     // Login with admin user
//     await request(app)
//       .post(`/${process.env.API_PREFIX}/v1/auth/admin/email/login`)
//       .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
//       .then(({ body }) => {
//         tokenAdmin = body.token;
//         userAdminId = body.user.id;
//       });

//     // Create an organization
//     await request(app)
//       .post(`/${process.env.API_PREFIX}/v1/organization`)
//       .auth(tokenAdmin, { type: "bearer" })
//       .send({ ...organizationData, manager: userAdminId })
//       .then(({ body }) => {
//         organizationId = body.id;
//       });

//     // Create a request
//     await request(app)
//       .post(`/${process.env.API_PREFIX}/v1/request`)
//       .auth(tokenAdmin, { type: "bearer" })
//       .send({ ...requestData, organization: organizationId })
//       .then(({ body }) => {
//         requestId = body.id;
//       });

//     // Create a file
//     await request(app)
//       .post(`/${process.env.API_PREFIX}/v1/file`)
//       .auth(tokenAdmin, { type: "bearer" })
//       .send(fileData)
//       .then(({ body }) => {
//         fileId = body.id;
//       });

//     // Create an accident
//     await request(app)
//       .post(`/${process.env.API_PREFIX}/v1/accident`)
//       .auth(tokenAdmin, { type: "bearer" })
//       .send({ ...FactoryAccident(), requestId, fileId })
//       .then(({ body }) => {
//         createdAccidentId = body.id;
//       });
//   });

//   describe("creating", () => {
//     it("New accident entity", async () => {
//       const mockAccident = { ...FactoryAccident(), requestId, fileId };

//       await request(app).post(`/${process.env.API_PREFIX}/v1/accident`).auth(tokenAdmin, { type: "bearer" }).send(mockAccident).expect(HttpStatus.CREATED);
//     });

//     describe("(error)", () => {
//       it("New accident entity with invalid data", async () => {
//         const invalidAccidentData = { ...FactoryAccident(), date: "invalid-date", requestId, fileId };

//         const response = await request(app)
//           .post(`/${process.env.API_PREFIX}/v1/accident`)
//           .auth(tokenAdmin, { type: "bearer" })
//           .send(invalidAccidentData)
//           .expect(HttpStatus.BAD_REQUEST);

//         expect(response.body.message).toContain("date must be a valid ISO 8601 date string");
//       });

//       it("New accident entity with request not found", async () => {
//         const response = await request(app)
//           .post(`/${process.env.API_PREFIX}/v1/accident`)
//           .auth(tokenAdmin, { type: "bearer" })
//           .send({ ...FactoryAccident(), requestId: 9999, fileId })
//           .expect(HttpStatus.BAD_REQUEST);

//         expect(response.body.message).toBe("Request not found");
//       });

//       it("New accident entity with file not found", async () => {
//         const response = await request(app)
//           .post(`/${process.env.API_PREFIX}/v1/accident`)
//           .auth(tokenAdmin, { type: "bearer" })
//           .send({ ...FactoryAccident(), requestId, fileId: 9999 })
//           .expect(HttpStatus.BAD_REQUEST);

//         expect(response.body.message).toBe("File not found");
//       });
//     });
//   });

//   it("Retrieve list of accident entities", async () => {
//     await request(app).get(`/${process.env.API_PREFIX}/v1/accident/list`).auth(token, { type: "bearer" }).expect(HttpStatus.OK);
//   });

//   it("Retrieve a single accident entity by ID", async () => {
//     await request(app).get(`/${process.env.API_PREFIX}/v1/accident/${createdAccidentId}`).auth(token, { type: "bearer" }).expect(HttpStatus.OK);
//   });

//   it("Update an accident entity", async () => {
//     const updatedAccidentData = {
//       file: fileData,
//     };

//     await request(app).patch(`/${process.env.API_PREFIX}/v1/accident/${createdAccidentId}`).auth(token, { type: "bearer" }).send(updatedAccidentData).expect(HttpStatus.OK);
//   });

//   it("Delete an accident entity", async () => {
//     await request(app).delete(`/${process.env.API_PREFIX}/v1/accident/${createdAccidentId}`).auth(token, { type: "bearer" }).expect(HttpStatus.NO_CONTENT);
//   });
// });
