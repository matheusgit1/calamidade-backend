import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { Cooperated } from '../../src/modules/cooperated/entities/cooperated.entity';
import { APP_URL, TESTER_EMAIL, TESTER_PASSWORD } from '../utils/constants';

describe('CooperatedController (e2e)', () => {
  let createdCooperatedId: number;

  const app = APP_URL;

  it('Create new cooperated entity', async () => {
    const cooperatedData: Partial<Cooperated> = {
      email: 'fakeemail@gmail.com',
      firstName: 'Morgan',
      lastName: 'Stark',
      phone: '+551677777777',
    };

    const token = await request(app)
      .post('/api/v1/auth/email/login')
      .send({ email: TESTER_EMAIL, password: TESTER_PASSWORD })
      .then(({ body }) => body.token);

    const response = await request(app)
      .post('/api/v1/cooperated')
      .auth(token, {
        type: 'bearer',
      })
      .send(cooperatedData)
      .expect(HttpStatus.CREATED);

    createdCooperatedId = response.body.id;
  });

  it('Retrieve list of cooperated entities', async () => {
    const token = await request(app)
      .post('/api/v1/auth/email/login')
      .send({ email: TESTER_EMAIL, password: TESTER_PASSWORD })
      .then(({ body }) => body.token);

    await request(app)
      .get('/api/v1/cooperated/list')
      .auth(token, {
        type: 'bearer',
      })
      .expect(HttpStatus.OK);
  });

  it('Retrieve a single cooperated entity by ID', async () => {
    const token = await request(app)
      .post('/api/v1/auth/email/login')
      .send({ email: TESTER_EMAIL, password: TESTER_PASSWORD })
      .then(({ body }) => body.token);

    await request(app)
      .get(`/api/v1/cooperated/${createdCooperatedId}`)
      .auth(token, {
        type: 'bearer',
      })
      .expect(HttpStatus.OK);
  });

  it.skip('Update a cooperated entity', async () => {
    const updatedCooperatedData: Partial<Cooperated> = {};

    await request(app)
      .patch(`/api/v1/cooperated/${createdCooperatedId}`)
      .send(updatedCooperatedData)
      .expect(HttpStatus.OK);
  });

  it.skip('Delete a cooperated entity', async () => {
    await request(app)
      .delete(`/api/v1/cooperated/${createdCooperatedId}`)
      .expect(HttpStatus.NO_CONTENT);
  });
});
