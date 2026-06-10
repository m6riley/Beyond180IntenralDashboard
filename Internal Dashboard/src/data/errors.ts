export class DataLayerError extends Error {
  readonly code: string;
  readonly details?: string;
  readonly hint?: string;

  constructor(
    message: string,
    options?: {
      code?: string;
      details?: string;
      hint?: string;
      cause?: unknown;
    },
  ) {
    super(message, { cause: options?.cause });
    this.name = 'DataLayerError';
    this.code = options?.code ?? 'UNKNOWN';
    this.details = options?.details;
    this.hint = options?.hint;
  }
}

export function toDataLayerError(error: unknown): DataLayerError {
  if (error instanceof DataLayerError) {
    return error;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    const pgError = error as {
      message: string;
      code?: string;
      details?: string;
      hint?: string;
    };

    return new DataLayerError(pgError.message, {
      code: pgError.code,
      details: pgError.details,
      hint: pgError.hint,
      cause: error,
    });
  }

  return new DataLayerError('An unexpected data layer error occurred', {
    cause: error,
  });
}
