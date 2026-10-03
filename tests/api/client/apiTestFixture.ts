// tests/api/client/apiTestFixture.ts
import { test as base, APIRequestContext, request } from '@playwright/test';
import { z } from 'zod';

export const CandidatePipelineSchema = z.object({
  id: z.string().uuid().or(z.string()),
  studentId: z.string(),
  companyId: z.string(),
  currentStage: z.enum(['Applied', 'Assigned', 'Aptitude', 'Technical', 'HR', 'Selected', 'Rejected', 'Offer Given', 'Joined']),
  status: z.enum(['Active', 'Progressed', 'Disqualified', 'In-Progress', 'Qualified']),
  updatedAt: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CandidatePipeline = z.infer<typeof CandidatePipelineSchema>;

export type AuthRole = 'principal' | 'hod' | 'student' | 'coordinator';

export interface CustomApiFixtures {
  authenticatedApi: (role: AuthRole) => Promise<APIRequestContext>;
  pollAsyncJob: <T>(
    endpoint: string,
    validator: (data: T) => boolean,
    timeoutMs?: number,
    intervalMs?: number
  ) => Promise<T>;
}

export const test = base.extend<CustomApiFixtures>({
  authenticatedApi: async ({ playwright }: { playwright: any }, use: (fn: (role: AuthRole) => Promise<APIRequestContext>) => Promise<void>) => {
    const contexts: Map<AuthRole, APIRequestContext> = new Map();

    const getContextForRole = async (role: AuthRole): Promise<APIRequestContext> => {
      if (contexts.has(role)) return contexts.get(role)!;

      const tokenPayload = {
        sub: `usr-${role}-001`,
        role: role,
        department: role === 'hod' ? 'Computer Applications' : undefined,
      };

      const ctx = await playwright.request.newContext({
        baseURL: process.env.API_BASE_URL || 'http://localhost:8000',
        extraHTTPHeaders: {
          Authorization: `Bearer ${generateTestJwt(tokenPayload)}`,
          'Content-Type': 'application/json',
          'X-Request-Source': 'automated-qa-suite',
        },
      });

      contexts.set(role, ctx);
      return ctx;
    };

    await use(getContextForRole);

    for (const ctx of contexts.values()) {
      await ctx.dispose();
    }
  },

  pollAsyncJob: async (_: any, use: (fn: <T>(endpoint: string, validator: (data: T) => boolean, timeoutMs?: number, intervalMs?: number) => Promise<T>) => Promise<void>) => {
    const poll = async <T>(
      endpoint: string,
      validator: (data: T) => boolean,
      timeoutMs = 15000,
      intervalMs = 500
    ): Promise<T> => {
      const startTime = Date.now();
      const client = await request.newContext();

      while (Date.now() - startTime < timeoutMs) {
        const response = await client.get(endpoint);
        if (response.ok()) {
          const body: T = await response.json();
          if (validator(body)) return body;
        }
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
      throw new Error(`Asynchronous job polling timed out after ${timeoutMs}ms for ${endpoint}`);
    };

    await use(poll);
  },
});

function generateTestJwt(payload: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}
