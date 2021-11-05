import request from 'supertest';
import app from '../server_test';
import http from 'http';
import { expect, jest } from '@jest/globals';

function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('wait 0.1 sec.');
      const user = {
        id: id,
        name: 'User' + id,
        email: id + '@test.com',
      };
      resolve(user);
    }, 100);
  });
}
test.skip('fetch a user', async () => {
  const user = await fetchUser(1);
  expect(user).toEqual({
    id: 1,
    name: 'User1',
    email: '1@test.com',
  });
});

describe('Test /hello', () => {
  it.skip('should return world!', (done) => {
    request(app)
      .get('/hello')
      .then((response) => {
        expect(response.text).toBe('hello');
        done();
      });
  });
  it.skip('Kakao_Auth', (done) => {
    const url = '/kakao_auth?token=WNw4dyPdDK9gDjB5X71qnObV4j9F5ED00UJqlwopcSEAAAF7JAaNoQ';
    request(app)
      .get(url)
      .then((response) => {
        expect(response).toHaveProperty('body.id');
        done();
      });
  });
  it.skip('facebook_Auth', (done) => {});
});
