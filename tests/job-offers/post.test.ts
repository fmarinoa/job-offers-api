import supertest from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { jobOfferIncompleteSchemaTest, jobOfferSchemaTest } from '../helpers/schemas';
import { getApp } from '../setup';

let app: ReturnType<typeof getApp>;

beforeEach(() => {
  app = getApp();
});

describe('POST /job-offers/save', () => {
  it('Success', async () => {
    // REQUEST
    const res = await supertest(app.server).post('/job-offers/save').send(jobOfferSchemaTest);

    // ASSERTS
    expect(res.statusCode).toBe(201);
    expect(res.body).toStrictEqual({
      message: 'Job offer saved successfully',
      id: expect.any(String),
    });
  });

  it('Missing required field', async () => {
    // REQUEST
    const res = await supertest(app.server)
      .post('/job-offers/save')
      .send(jobOfferIncompleteSchemaTest);

    // ASSERTS
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toEqual([
      '"linkProfileEmployer" is required',
      '"location" is required',
      '"howLongAgo" is required',
      '"descriptionOffer" is required',
      '"linkOffer" is required',
    ]);
  });

  it('Missing job offer data', async () => {
    // REQUEST
    const res = await supertest(app.server).post('/job-offers/save');

    // ASSERTS
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Job offer data is required');
  });

  it('Invalid job offer data', async () => {
    // REQUEST
    const res = await supertest(app.server).post('/job-offers/save').send({});

    // ASSERTS
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toEqual([
      '"titleJob" is required',
      '"employer" is required',
      '"linkProfileEmployer" is required',
      '"location" is required',
      '"howLongAgo" is required',
      '"descriptionOffer" is required',
      '"linkOffer" is required',
    ]);
  });

  it('Invalid job offer data (extra field:id)', async () => {
    // CONTEXT
    const invalidPayload = { ...jobOfferSchemaTest, id: '12345' };

    // REQUEST
    const res = await supertest(app.server).post('/job-offers/save').send(invalidPayload);

    // ASSERTS
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toEqual(['"id" is not allowed']);
  });

  it('Invalid job offer data (descriptionOffer too long)', async () => {
    // CONTEXT
    const invalidPayload = {
      ...jobOfferSchemaTest,
      descriptionOffer: 'a'.repeat(301),
    };

    // REQUEST
    const res = await supertest(app.server).post('/job-offers/save').send(invalidPayload);

    // ASSERTS
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toEqual([
      '"descriptionOffer" length must be less than or equal to 300 characters long',
    ]);
  });
});
