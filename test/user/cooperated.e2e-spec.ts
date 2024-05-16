import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { Cooperated } from '../../src/modules/cooperated/entities/cooperated.entity';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  APP_URL,
  TESTER_EMAIL,
  TESTER_PASSWORD,
} from '../utils/constants';

describe('CooperatedController (e2e)', () => {
  let createdCooperatedId: number;
  let token: string;

  const app = APP_URL;

  const cooperatedData: Partial<Cooperated> = {
    email: `fakeemail2${Date.now()}@gmail.com`,
    firstName: 'Morgan',
    lastName: 'Stark',
    phone: '+551677777777',
    document: '95144199011',
  };

  beforeAll(async () => {
    await request(app)
      .post(`/${process.env.API_PREFIX}/v1/auth/email/login`)
      .send({ email: TESTER_EMAIL, password: TESTER_PASSWORD })
      .then(({ body }) => {
        token = body.token;
      });

    await request(app)
      .post(`/${process.env.API_PREFIX}/v1/cooperateds`)
      .send(cooperatedData)
      .auth(token, {
        type: 'bearer',
      })
      .then(({ body }) => {
        createdCooperatedId = body.id;
      });
  });

  it('Create new cooperated entity', async () => {
    await request(app)
      .post(`/${process.env.API_PREFIX}/v1/cooperateds`)
      .auth(token, {
        type: 'bearer',
      })
      .send({ ...cooperatedData, email: `fakeemail2${Date.now()}-2@gmail.com` })
      .expect(HttpStatus.CREATED);
  });

  it('Retrieve list of cooperated entities', async () => {
    await request(app)
      .get(`/${process.env.API_PREFIX}/v1/cooperateds/list`)
      .auth(token, {
        type: 'bearer',
      })
      .expect(HttpStatus.OK);
  });

  it('Retrieve a single cooperated entity by ID', async () => {
    await request(app)
      .get(`/${process.env.API_PREFIX}/v1/cooperateds/${createdCooperatedId}`)
      .auth(token, {
        type: 'bearer',
      })
      .expect(HttpStatus.OK);
  });

  it('Update a cooperated entity', async () => {
    const updatedCooperatedData: Partial<Cooperated> = {};

    await request(app)
      .patch(`/${process.env.API_PREFIX}/v1/cooperateds/${createdCooperatedId}`)
      .auth(token, {
        type: 'bearer',
      })
      .send(updatedCooperatedData)
      .expect(HttpStatus.OK);
  });

  it('Delete a cooperated entity', async () => {
    await request(app)
      .delete(`/${process.env.API_PREFIX}/v1/cooperateds/${createdCooperatedId}`)
      .auth(token, {
        type: 'bearer',
      })
      .expect(HttpStatus.NO_CONTENT);
  });

  it('Bulk insert 600 cooperated entities', async () => {
    const testBulkData = Array.from({ length: 600 }, (_, index) => ({
      email: `bulk_email_${index}-${Date.now()}@example.com`,
      firstName: `First_${index}`,
      lastName: `Last_${index}`,
      phone: `123456789${index}`,
      document: `52427318000`,
    }));

    let adminToken: string;
    const res = await request(app)
      .post(`/${process.env.API_PREFIX}/v1/auth/admin/email/login`)
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

    adminToken = res.body.token;

    await request(app)
      .post(`/${process.env.API_PREFIX}/v1/cooperateds/bulk`)
      .auth(adminToken, {
        type: 'bearer',
      })
      .send(testBulkData)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.success).toBeTruthy();
      });
  });

  it('Should return 403 when trying to use non admin user', async () => {
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
        type: 'bearer',
      })
      .send(testBulkData)
      .expect(HttpStatus.FORBIDDEN);
  });
});
