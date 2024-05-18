import request from "supertest";
import { HttpStatus } from "@nestjs/common";
import { CooperatedEntity } from "../../src/modules/cooperated/entities/cooperated.entity";
import { OrganizationEntity } from "../../src/modules/organization/entities/organization.entity";
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL, TESTER_EMAIL, TESTER_PASSWORD } from "../utils/constants";
import { generateCPFNumbers } from "../utils/generators";

function FactoryCooperated(): Partial<CooperatedEntity> {
  return {
    email: `fakeemail2${Date.now()}@gmail.com`,
    firstName: "Morgan",
    lastName: "Stark",
    phone: "+551677777777",
    document: generateCPFNumbers(),
  };
}

function FactoryOrganization(): Partial<OrganizationEntity> {
  return {
    name: "Morgan",
    email: `fakeemail2${Date.now()}@gmail.com`,
    document: generateCPFNumbers(),
  };
}

describe("CooperatedController (e2e)", () => {
  let createdCooperatedId: number;
  let token: string;
  let tokenAdmin: string;
  let userAdminId: string;
  let organizationId: string;

  const app = APP_URL;

  const cooperatedData: Partial<CooperatedEntity> = FactoryCooperated();

  const organizationData: Partial<OrganizationEntity> = FactoryOrganization();

  beforeAll(async () => {
    // login with test user
    await request(app)
      .post(`/${process.env.API_PREFIX}/v1/auth/email/login`)
      .send({ email: TESTER_EMAIL, password: TESTER_PASSWORD })
      .then(({ body }) => {
        token = body.token;
      });

    // login with admin user for creating organization
    await request(app)
      .post(`/${process.env.API_PREFIX}/v1/auth/admin/email/login`)
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .then(({ body }) => {
        tokenAdmin = body.token;
        userAdminId = body.user.id;
      });

    // creating an organization
    await request(app)
      .post(`/${process.env.API_PREFIX}/v1/organization`)
      .auth(tokenAdmin, {
        type: "bearer",
      })
      .send({ ...organizationData, manager: userAdminId })
      .then(({ body }) => {
        organizationId = body.id;
      });

    // creating an cooperate
    await request(app)
      .post(`/${process.env.API_PREFIX}/v1/cooperateds`)
      .send({ ...FactoryCooperated(), organization: organizationId, document: generateCPFNumbers() })
      .auth(tokenAdmin, {
        type: "bearer",
      })
      .then(({ body }) => {
        createdCooperatedId = body.id;
      });
  });

  describe("creating", () => {
    it("New cooperated entity", async () => {
      const mockCooperated = { ...FactoryCooperated(), organization: organizationId, document: generateCPFNumbers() };

      await request(app)
        .post(`/${process.env.API_PREFIX}/v1/cooperateds`)
        .auth(tokenAdmin, {
          type: "bearer",
        })
        .send(mockCooperated)
        .expect(HttpStatus.CREATED);
    });
    describe("(error)", () => {
      it("New cooperated entity with document already inserted", async () => {
        const firstDocument = generateCPFNumbers();
        await request(app)
          .post(`/${process.env.API_PREFIX}/v1/cooperateds`)
          .send({ ...FactoryCooperated(), organization: organizationId, document: firstDocument })
          .auth(tokenAdmin, {
            type: "bearer",
          })
          .expect(HttpStatus.CREATED);

        const mockCooperated = { ...FactoryCooperated(), organization: organizationId, document: firstDocument };

        const secondOne = await request(app)
          .post(`/${process.env.API_PREFIX}/v1/cooperateds`)
          .auth(tokenAdmin, {
            type: "bearer",
          })
          .send(mockCooperated)
          .expect(HttpStatus.UNPROCESSABLE_ENTITY);

        expect(secondOne.body.errors.document).toBe("Document already exists");
      });

      it("New cooperated entity with organization not found", async () => {
        const response = await request(app)
          .post(`/${process.env.API_PREFIX}/v1/cooperateds`)
          .send({ ...FactoryCooperated(), organization: 3232, document: generateCPFNumbers() })
          .auth(tokenAdmin, {
            type: "bearer",
          })
          .expect(HttpStatus.UNPROCESSABLE_ENTITY);

        expect(response.body.message).toBe("organization of provided organization is not found");
      });
    });
  });

  it("Retrieve list of cooperated entities", async () => {
    await request(app)
      .get(`/${process.env.API_PREFIX}/v1/cooperateds/list`)
      .auth(token, {
        type: "bearer",
      })
      .expect(HttpStatus.OK);
  });

  it("Retrieve a single cooperated entity by ID", async () => {
    const cooperatedWithNormalUser = await request(app)
      .post(`/${process.env.API_PREFIX}/v1/cooperateds`)
      .send({
        ...cooperatedData,
        organization: organizationId,
      })
      .auth(tokenAdmin, {
        type: "bearer",
      });

    await request(app)
      .get(`/${process.env.API_PREFIX}/v1/cooperateds/${cooperatedWithNormalUser.body.id}`)
      .auth(token, {
        type: "bearer",
      })
      .expect(HttpStatus.OK);
  });

  it.only("Update a cooperated entity", async () => {
    const updatedCooperatedData: Partial<CooperatedEntity> = {};

    await request(app)
      .patch(`/${process.env.API_PREFIX}/v1/cooperateds/${createdCooperatedId}`)
      .auth(token, {
        type: "bearer",
      })
      .send(updatedCooperatedData)
      .expect(HttpStatus.OK);
  });

  it("Delete a cooperated entity", async () => {
    await request(app)
      .delete(`/${process.env.API_PREFIX}/v1/cooperateds/${createdCooperatedId}`)
      .auth(token, {
        type: "bearer",
      })
      .expect(HttpStatus.NO_CONTENT);
  });

  describe("bulk", () => {
    it("Bulk insert 600 cooperated entities", async () => {
      const testBulkData = Array.from({ length: 600 }, (_, index) => ({
        email: `bulk_email_${index}-${Date.now()}@example.com`,
        firstName: `First_${index}`,
        lastName: `Last_${index}`,
        phone: `123456789${index}`,
        document: `52427318000`,
      }));

      let adminToken: string;
      const res = await request(app).post(`/${process.env.API_PREFIX}/v1/auth/admin/email/login`).send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

      adminToken = res.body.token;

      await request(app)
        .post(`/${process.env.API_PREFIX}/v1/cooperateds/bulk`)
        .auth(adminToken, {
          type: "bearer",
        })
        .send(testBulkData)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          expect(body.success).toBeTruthy();
        });
    });

    it("Should return 403 when trying to use non admin user", async () => {
      const testBulkData = Array.from({ length: 600 }, (_, index) => ({
        email: `bulk_email_${index}-${Date.now()}@example.com`,
        firstName: `First_${index}`,
        lastName: `Last_${index}`,
        phone: `123456789${index}`,
        document: `${index}`,
      }));

      await request(app)
        .post(`/${process.env.API_PREFIX}/v1/cooperateds/bulk`)
        .auth(token, {
          type: "bearer",
        })
        .send(testBulkData)
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});
