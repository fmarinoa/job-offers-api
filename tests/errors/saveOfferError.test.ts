import { StatusCodes } from 'http-status-codes';
import { describe, expect, it } from 'vitest';

import { SaveOfferError } from '../../src/helpers/errors';

describe('SaveOfferError', () => {
  it('should correctly create an instance with the given value', () => {
    const input = { foo: 'bar' };
    const error = new SaveOfferError(input);

    expect(error).toBeInstanceOf(SaveOfferError);
    expect(error.message).toBe('Failed to retrieve save a job offer');
    expect(error.code).toBe('ERROR_ATTEMPT_SAVE_ERROR');
    expect(error.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(error.details).toEqual([JSON.stringify(input)]);
  });

  it('should be throwable and catchable as an error', () => {
    const input = { id: 123 };

    try {
      throw new SaveOfferError(input);
    } catch (err) {
      expect(err).toBeInstanceOf(SaveOfferError);
      // @ts-expect-error for testing
      expect(err.message).toBe('Failed to retrieve save a job offer');
      expect((err as SaveOfferError).details).toEqual([JSON.stringify(input)]);
    }
  });
});
