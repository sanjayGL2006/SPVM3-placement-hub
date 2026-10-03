// performance/scenarios/placementLoadTest.js
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('http_custom_errors');
const dashboardDuration = new Trend('dashboard_load_time_ms', true);
const bulkAssignDuration = new Trend('bulk_assign_duration_ms', true);

export const options = {
  scenarios: {
    // 1. Ramp-up & Soak (Average Load)
    average_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },  // Ramp up
        { duration: '3m', target: 50 },  // Steady state soak
        { duration: '30s', target: 0 },  // Ramp down
      ],
      gracefulRampDown: '30s',
      tags: { test_type: 'soak' },
    },
    // 2. Spike Scenario: Instantaneous registration burst
    spike_traffic: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 400,
      stages: [
        { duration: '30s', target: 20 },
        { duration: '15s', target: 250 }, // Instant spike
        { duration: '1m', target: 250 },  // Hold spike
        { duration: '30s', target: 10 },  // Recovery
      ],
      startTime: '5m',
      tags: { test_type: 'spike' },
    },
  },
  thresholds: {
    'http_req_duration{expected_response:true}': ['p(95)<300', 'p(99)<700'],
    'http_custom_errors': ['rate<0.01'],
    'bulk_assign_duration_ms': ['p(95)<450'],
  },
};

const BASE_URL = __ENV.API_TARGET_URL || 'https://staging-api.placementhub.internal';

export function setup() {
  // Pre-generate auth tokens
  const res = http.post(`${BASE_URL}/api/v1/auth/token`, JSON.stringify({
    username: 'admin.loadtest@college.edu',
    password: __ENV.LOADTEST_PASSWORD || 'SecretLoadPass2026!',
  }), { headers: { 'Content-Type': 'application/json' } });

  return { token: res.json('access_token') };
}

export default function (data) {
  const headers = {
    Authorization: `Bearer ${data.token}`,
    'Content-Type': 'application/json',
  };

  group('Executive Dashboard Query', () => {
    const res = http.get(`${BASE_URL}/api/v1/analytics/dashboard-summary?academicYear=2025-26`, { headers });
    
    const passed = check(res, {
      'status is 200': (r) => r.status === 200,
      'has KPI aggregates': (r) => r.json('totalStudentsPlaced') !== undefined,
    });

    errorRate.add(!passed);
    dashboardDuration.add(res.timings.duration);
  });

  sleep(Math.random() * 2 + 1); // 1-3s think time

  group('Batch Candidate Assignment', () => {
    const payload = JSON.stringify({
      companyId: 'CMP-008',
      driveId: 'DRV-2026-05',
      studentIds: ['STU-2026-001', 'STU-2026-002', 'STU-2026-003'],
      initialStage: 'Aptitude',
    });

    const res = http.post(`${BASE_URL}/api/v1/pipeline/bulk-assign`, payload, { headers });
    
    const passed = check(res, {
      'bulk assign succeeded (200/201)': (r) => r.status === 200 || r.status === 201,
      'assigned count matches': (r) => r.json('assignedCount') === 3,
    });

    errorRate.add(!passed);
    bulkAssignDuration.add(res.timings.duration);
  });

  sleep(1);
}
