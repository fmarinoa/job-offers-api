import supertest from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { JobOffer } from '../../src/models/JobOffer';
import { jobOfferSchemaTest } from '../helpers/schemas';
import { getApp } from '../setup';

let app: ReturnType<typeof getApp>;

beforeEach(() => {
  app = getApp();
});

describe('GET /job-offers', () => {
  it('Return one job offers', async () => {
    // CONTEXT
    const jobOffer = await JobOffer.create(jobOfferSchemaTest);

    // REQUEST
    const res = await supertest(app.server).get('/job-offers');

    // ASSERTS
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: jobOffer._id.toString(),
          titleJob: jobOffer.titleJob,
          employer: jobOffer.employer,
          linkProfileEmployer: jobOffer.linkProfileEmployer,
          location: jobOffer.location,
          howLongAgo: jobOffer.howLongAgo,
          recruiter: jobOffer.recruiter,
          profileRecruiter: jobOffer.profileRecruiter,
          descriptionOffer: jobOffer.descriptionOffer,
          linkOffer: jobOffer.linkOffer,
          createdAt: jobOffer.createdAt.toISOString(),
          updatedAt: jobOffer.updatedAt.toISOString(),
          __v: jobOffer.__v,
        }),
      ])
    );
  });

  it('Return the second page empty because there are only 10 records', async () => {
    // CONTEXT
    await Promise.all(Array.from({ length: 10 }, () => JobOffer.create(jobOfferSchemaTest)));

    // REQUEST
    const res = await supertest(app.server).get('/job-offers?page=2');

    // ASSERTS
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('No job offers found');
  });

  it('Returns empty array initially', async () => {
    // REQUEST
    const res = await supertest(app.server).get('/job-offers');

    // ASSERTS
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('No job offers found');
  });

  it('Returns error for invalid query parameter', async () => {
    // REQUEST
    const res = await supertest(app.server).get('/job-offers').query({
      a: 'invalid',
    });

    // ASSERTS
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid query parameters');
    expect(res.body.details).toEqual(['"a" is not allowed']);
  });

  it('Returns error for invalid query parameter', async () => {
    // REQUEST
    const res = await supertest(app.server).get('/job-offers').query({
      page: 'test',
    });

    // ASSERTS
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid query parameters');
    expect(res.body.details).toEqual(['"page" must be a number']);
  });
});
