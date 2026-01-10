import { samples } from "../data/mockData";

export interface FetchSamplesResponse {
  samples: typeof samples;
  total: number;
  hasMore: boolean;
}

/**
 * Simulates a paginated API request to a Python backend.
 */
export const SampleService = {
  async getSamples(
    limit: number,
    offset: number
  ): Promise<FetchSamplesResponse> {
    // 1. Simulate network latency (200ms - 600ms)
    /*
    const delay = Math.random() * 400 + 200;
    await new Promise((resolve) => setTimeout(resolve, delay));
    */

    // 2. Paginate the local mock data
    const slice = samples.slice(offset, offset + limit);

    return {
      samples: slice,
      total: samples.length,
      hasMore: offset + limit < samples.length,
    };
  },
};
