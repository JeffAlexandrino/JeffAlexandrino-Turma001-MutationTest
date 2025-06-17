import http from 'k6/http';
import { sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const getDuration = new Trend('get_duration');
const successRate = new Rate('success_rate');

export let options = {
  stages: [
    { duration: '1m30s', target: 10 },
    { duration: '1m30s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '1m', target: 300 }
  ],
  thresholds: {
    http_req_duration: ['p(95)<5700'],
    http_req_failed: ['rate<0.12']
  }
};

export default function () {
  const res = http.get(
    'https://en.wikipedia.org/api/rest_v1/page/random/summary',
    {
      headers: {
        'User-Agent': 'k6-loadtest-agent/1.0',
        Accept: 'application/json'
      }
    }
  );

  getDuration.add(res.timings.duration);
  successRate.add(res.status === 200);

  sleep(1);
}
