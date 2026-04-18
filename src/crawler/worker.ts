/// <reference lib="webworker" />
import type { Zone, WorkerTask, WorkerResult, ZoneResult } from '../types.ts';
import { ingestContext } from '../ingest/context.ts';

self.onmessage = async (event: MessageEvent<WorkerTask>) => {
  const result = await dispatch(event.data);
  self.postMessage(result);
};

async function dispatch(task: WorkerTask): Promise<WorkerResult> {
  if (task.kind === 'context') {
    return ingestContext(task.id, task.root, task.files);
  }
  return scanZone(task.zone, task.anchors);
}

async function scanZone(
  zone: Zone,
  anchors: Record<string, unknown>,
): Promise<ZoneResult> {
  throw new Error('TODO: read manifests, scan file patterns, extract techs + tree fragment + DNA');
}
