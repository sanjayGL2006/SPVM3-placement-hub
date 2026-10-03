// tests/api/pipeline/stageProgression.spec.ts
import { test, CandidatePipelineSchema } from '../client/apiTestFixture';
import { expect } from '@playwright/test';

test.describe('API: Candidate Pipeline & RBAC Security Matrix', () => {
  test('HOD can transition candidate stage and response matches OpenAPI Contract', async ({ authenticatedApi, pollAsyncJob }) => {
    const hodClient = await authenticatedApi('hod');

    const updateResponse = await hodClient.put('/api/v1/pipeline/cand-9812/stage', {
      data: {
        stage: 'Technical',
        status: 'Progressed',
        packageLPA: 12.5,
        note: 'Cleared Aptitude with 94 percentile',
      },
    });

    expect(updateResponse.status()).toBe(200);
    const json = await updateResponse.json();

    // Strict schema verification
    const parsed = CandidatePipelineSchema.safeParse(json);
    expect(parsed.success).toBe(true);
    if (!parsed.success) throw new Error(JSON.stringify(parsed.error.format()));

    expect(parsed.data.currentStage).toBe('Technical');

    // Verify eventual consistency / async ledger indexing
    const indexedRecord = await pollAsyncJob<{ status: string }>(
      `/api/v1/pipeline/cand-9812/audit`,
      (data) => data.status === 'INDEXED'
    );
    expect(indexedRecord.status).toBe('INDEXED');
  });

  test('Security Boundary: Student role is forbidden from mutating candidate stage (403 IDOR)', async ({ authenticatedApi }) => {
    const studentClient = await authenticatedApi('student');

    const forbiddenResponse = await studentClient.put('/api/v1/pipeline/cand-9812/stage', {
      data: { stage: 'Selected', status: 'Progressed' },
    });

    expect(forbiddenResponse.status()).toBe(403);
    const errorBody = await forbiddenResponse.json();
    expect(errorBody.detail).toMatch(/Insufficient role permissions/i);
  });
});
