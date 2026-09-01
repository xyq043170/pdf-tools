import { describe, expect, it } from 'vitest';

import { buildEmbeddedAnalyticsMessage } from '../js/utils/embedded-analytics';

describe('embedded analytics message contract', () => {
  it('reports the allowlisted lifecycle event with bounded facts', () => {
    expect(
      buildEmbeddedAnalyticsMessage('process_success', {
        file_count: 2,
        output_under_target: true,
        filename: 'passport.pdf',
      })
    ).toEqual({
      source: 'smart-tool-matrix-embed',
      version: 1,
      event_name: 'process_success',
      file_count: 2,
      output_under_target: true,
    });
  });

  it('rejects messages outside the embedded funnel vocabulary', () => {
    expect(() =>
      buildEmbeddedAnalyticsMessage('file_contents' as 'upload_start')
    ).toThrow('Unsupported embedded analytics event');
  });
});
