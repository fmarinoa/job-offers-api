import supertest from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { JobOffer } from '../../src/models/JobOffer';
import { setupOffersWithUpdatedAt } from '../helpers/context';
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

  it('Should return only one job offer when limit=1', async () => {
    // CONTEXT
    await Promise.all(Array.from({ length: 2 }, () => JobOffer.create(jobOfferSchemaTest)));

    // REQUEST
    const res = await supertest(app.server).get('/job-offers?limit=1');

    // ASSERTS
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it('Should return job offers sorted in descending order by updatedAt', async () => {
    // CONTEXT
    await setupOffersWithUpdatedAt();

    // REQUEST
    const res = await supertest(app.server).get('/job-offers?sort=desc');

    // ASSERTS
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    const [firstUpdatedAt, secondUpdatedAt] = [res.body[0].updatedAt, res.body[1].updatedAt];
    expect(new Date(firstUpdatedAt).getTime() > new Date(secondUpdatedAt).getTime()).toBe(true);
  });

  it('Should return job offers sorted in ascending order by updatedAt', async () => {
    // CONTEXT
    await setupOffersWithUpdatedAt();

    // REQUEST
    const res = await supertest(app.server).get('/job-offers?sort=asc');

    // ASSERTS
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    const [firstUpdatedAt, secondUpdatedAt] = [res.body[0].updatedAt, res.body[1].updatedAt];
    expect(new Date(firstUpdatedAt).getTime() < new Date(secondUpdatedAt).getTime()).toBe(true);
  });
});
