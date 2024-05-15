import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { Cooperated } from '../../src/modules/cooperated/entities/cooperated.entity';
import { APP_URL, TESTER_EMAIL, TESTER_PASSWORD } from '../utils/constants';

describe('CooperatedController (e2e)', () => {
  let createdCooperatedId: number;
  let token: string;

  const app = APP_URL;

  const cooperatedData: Partial<Cooperated> = {
    email: `fakeemail2${Date.now()}@gmail.com`,
    firstName: 'Morgan',
    lastName: 'Stark',
    phone: '+551677777777',
    document: '222222221',
  };

  beforeAll(async () => {
    await request(app)
      .post('/api/v1/auth/email/login')
      .send({ email: TESTER_EMAIL, password: TESTER_PASSWORD })
      .then(({ body }) => {
        token = body.token;
      });

    await request(app)
      .post('/api/v1/cooperated')
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
      .post('/api/v1/cooperated')
      .auth(token, {
        type: 'bearer',
      })
      .send({ ...cooperatedData, email: `fakeemail2${Date.now()}-2@gmail.com` })
      .expect(HttpStatus.CREATED);
  });

  it('Retrieve list of cooperated entities', async () => {
    await request(app)
      .get('/api/v1/cooperated/list')
      .auth(token, {
        type: 'bearer',
      })
      .expect(HttpStatus.OK);
  });

  it('Retrieve a single cooperated entity by ID', async () => {
    await request(app)
      .get(`/api/v1/cooperated/${createdCooperatedId}`)
      .auth(token, {
        type: 'bearer',
      })
      .expect(HttpStatus.OK);
  });

  it('Update a cooperated entity', async () => {
    const updatedCooperatedData: Partial<Cooperated> = {};

    await request(app)
      .patch(`/api/v1/cooperated/${createdCooperatedId}`)
      .auth(token, {
        type: 'bearer',
      })
      .send(updatedCooperatedData)
      .expect(HttpStatus.OK);
  });

  it('Delete a cooperated entity', async () => {
    await request(app)
      .delete(`/api/v1/cooperated/${createdCooperatedId}`)
      .auth(token, {
        type: 'bearer',
      })
      .expect(HttpStatus.NO_CONTENT);
  });
});
