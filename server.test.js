const request = require('supertest');
const app = require('./app.js');

describe('main routes', () => {
  test('the home route data', async () => {
    return request(app)
      .get('/')
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual('hello');
      });
  });
});
