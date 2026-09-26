import assert from 'node:assert/strict';
import test from 'node:test';
import { runProcess } from '@nexus-brain/execution/executor';

test('execution package captures command output and exit classification', async () => {
  const result = await runProcess({ command: process.execPath, args: ['-e', "process.stdout.write('ok')"], job_class: 'TINY' });
  assert.equal(result.classification, 'SUCCESS');
  assert.equal(result.stdout, 'ok');
});
