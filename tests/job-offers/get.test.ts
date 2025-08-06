import supertest from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { JobOffer } from '../../src/models/JobOffer';
import { setupOffers, setupOffersWithUpdatedAt } from '../helpers/context';
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
    expect(res.body.page).toBe(1);
    expect(res.body.total).toBe(1);
    expect(res.body.totalPages).toBe(1);
    expect(res.body.results).toEqual(
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
    await setupOffers(10);

    // REQUEST
    const res = await supertest(app.server).get('/job-offers?page=2');

    // ASSERTS
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      total: 10,
      page: 2,
      totalPages: 1,
      results: [],
    });
  });

  it('Returns empty array initially', async () => {
    // REQUEST
    const res = await supertest(app.server).get('/job-offers');

    // ASSERTS
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      total: 0,
      page: 1,
      totalPages: 0,
      results: [],
    });
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
    await setupOffers(2);

    // REQUEST
    const res = await supertest(app.server).get('/job-offers?limit=1');

    // ASSERTS
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBe(2);
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results.length).toBe(1);
  });

  it('Should return only one job offer when limit=1 and page=2', async () => {
    // CONTEXT
    await setupOffers(2);

    // REQUEST
    const res = await supertest(app.server).get('/job-offers?limit=1&page=2');

    // ASSERTS
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.page).toBe(2);
    expect(res.body.totalPages).toBe(2);
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results.length).toBe(1);
  });

  it('Should return job offers sorted in descending order by updatedAt', async () => {
    // CONTEXT
    await setupOffersWithUpdatedAt();

    // REQUEST
    const res = await supertest(app.server).get('/job-offers?sort=desc');

    // ASSERTS
    const [firstUpdatedAt, secondUpdatedAt] = [
      res.body.results[0].updatedAt,
      res.body.results[1].updatedAt,
    ];
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBe(1);
    expect(new Date(firstUpdatedAt).getTime() > new Date(secondUpdatedAt).getTime()).toBe(true);
  });

  it('Should return job offers sorted in ascending order by updatedAt', async () => {
    // CONTEXT
    await setupOffersWithUpdatedAt();

    // REQUEST
    const res = await supertest(app.server).get('/job-offers?sort=asc');

    // ASSERTS
    const [firstUpdatedAt, secondUpdatedAt] = [
      res.body.results[0].updatedAt,
      res.body.results[1].updatedAt,
    ];
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBe(1);
    expect(new Date(firstUpdatedAt).getTime() < new Date(secondUpdatedAt).getTime()).toBe(true);
  });

  it('Should return filtered job offer by employer', async () => {
    // CONTEXT
    const newEmployer = 'Test Employer 1';

    await JobOffer.insertMany([
      { ...jobOfferSchemaTest },
      { ...jobOfferSchemaTest, employer: newEmployer },
    ]);

    const expectedOffer = await JobOffer.findOne({ employer: newEmployer });

    // REQUEST
    const res = await supertest(app.server).get('/job-offers?employer=Test Employer 1');

    // ASSERTS
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBe(1);
    expect(res.body.results).toEqual([
      expect.objectContaining({
        _id: expectedOffer?._id.toString(),
        titleJob: expectedOffer?.titleJob,
        employer: expectedOffer?.employer,
        linkProfileEmployer: expectedOffer?.linkProfileEmployer,
        location: expectedOffer?.location,
        howLongAgo: expectedOffer?.howLongAgo,
        recruiter: expectedOffer?.recruiter,
        profileRecruiter: expectedOffer?.profileRecruiter,
        descriptionOffer: expectedOffer?.descriptionOffer,
        linkOffer: expectedOffer?.linkOffer,
        createdAt: expectedOffer?.createdAt.toISOString(),
        updatedAt: expectedOffer?.updatedAt.toISOString(),
        __v: expectedOffer?.__v,
      }),
    ]);
  });

  it('Should return when no job offers match the employer filter', async () => {
    // CONTEXT
    await setupOffers(1);

    // REQUEST
    const res = await supertest(app.server).get('/job-offers?employer=unexisting');

    // ASSERTS
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(0);
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBe(0);
    expect(res.body.results).toEqual([]);
  });

  it('Should return filtered job offer by title job', async () => {
    // CONTEXT
    const newTitleJob = 'Test Title Job 1';

    await JobOffer.insertMany([
      { ...jobOfferSchemaTest },
      { ...jobOfferSchemaTest, titleJob: newTitleJob },
    ]);

    const expectedOffer = await JobOffer.findOne({ titleJob: newTitleJob });

    // REQUEST
    const res = await supertest(app.server).get('/job-offers?titleJob=Test Title Job 1');

    // ASSERTS
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBe(1);
    expect(res.body.results).toEqual([
      expect.objectContaining({
        _id: expectedOffer?._id.toString(),
        titleJob: expectedOffer?.titleJob,
        employer: expectedOffer?.employer,
        linkProfileEmployer: expectedOffer?.linkProfileEmployer,
        location: expectedOffer?.location,
        howLongAgo: expectedOffer?.howLongAgo,
        recruiter: expectedOffer?.recruiter,
        profileRecruiter: expectedOffer?.profileRecruiter,
        descriptionOffer: expectedOffer?.descriptionOffer,
        linkOffer: expectedOffer?.linkOffer,
        createdAt: expectedOffer?.createdAt.toISOString(),
        updatedAt: expectedOffer?.updatedAt.toISOString(),
        __v: expectedOffer?.__v,
      }),
    ]);
  });

  it('Should return when no job offers match the title job filter', async () => {
    // CONTEXT
    await setupOffers(1);

    // REQUEST
    const res = await supertest(app.server).get('/job-offers?titleJob=unexisting');

    // ASSERTS
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(0);
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBe(0);
    expect(res.body.results).toEqual([]);
  });
});
