const EMBEDDED_EVENT_NAMES = [
  'upload_start',
  'process_success',
  'download_success',
] as const;

export type EmbeddedAnalyticsEventName = (typeof EMBEDDED_EVENT_NAMES)[number];

type EmbeddedEventFacts = {
  file_count?: number;
  output_under_target?: boolean;
  [key: string]: unknown;
};

export function buildEmbeddedAnalyticsMessage(
  eventName: EmbeddedAnalyticsEventName,
  facts: EmbeddedEventFacts = {}
) {
  if (!EMBEDDED_EVENT_NAMES.includes(eventName)) {
    throw new Error(`Unsupported embedded analytics event: ${eventName}`);
  }

  const message: Record<string, unknown> = {
    source: 'smart-tool-matrix-embed',
    version: 1,
    event_name: eventName,
  };
  if (Number.isInteger(facts.file_count) && Number(facts.file_count) > 0) {
    message.file_count = Math.min(Number(facts.file_count), 50);
  }
  if (typeof facts.output_under_target === 'boolean') {
    message.output_under_target = facts.output_under_target;
  }
  return message;
}

export function postEmbeddedAnalyticsEvent(
  eventName: EmbeddedAnalyticsEventName,
  facts: EmbeddedEventFacts = {}
) {
  const query = new URLSearchParams(window.location.search);
  if (query.get('embedded') !== '1' || window.parent === window) return;
  window.parent.postMessage(
    buildEmbeddedAnalyticsMessage(eventName, facts),
    window.location.origin
  );
}
