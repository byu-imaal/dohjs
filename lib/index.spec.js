const {makeQuery, DohResolver, sendDohMsg, MethodNotAllowedError, isMethodAllowed, dnsPacket} = require('.');

test('DNS query message should be created', () => {
  expect(makeQuery('example.com')).toBeTruthy();
});

test('DNS query message for example.com should have one question', () => {
  expect(makeQuery('example.com').questions.length).toBe(1);
});

test('DNS query message of type TXT should have question of type TXT', () => {
  expect(makeQuery('example.com', 'TXT').questions[0].type).toBe('TXT');
});

test('DNS query message for example.com matches expected', () => {
  let q = makeQuery('example.com');
  q.id = 0;
  expect(q).toEqual({
    type: 'query',
    id: 0,
    flags: 256,
    questions: [ { type: 'A', name: 'example.com' } ]});
});

 test('sendDohMsg() works (and the example.com zone still has an A record)', async () => {
  let msg = makeQuery('example.com', 'A');
  try {
    let response = await sendDohMsg(msg, 'https://1.1.1.1/dns-query', 'GET');
    expect(response).toHaveProperty('answers');
  } catch(e) {
    throw e;
  }
});

test('DohResolver should be created', () => {
  expect(new DohResolver("https://example.com/dns-query")).toBeTruthy();
});

test('DohResolver should have assigned nameserver url', () => {
  expect(new DohResolver("https://example.com/dns-query").nameserver_url).toEqual("https://example.com/dns-query");
});

test('PUT is not a valid request method', () => {
  expect(isMethodAllowed('PUT')).toBeFalsy();
});

test('Resolving with invalid methods causes error', async () => {
  const resolver = new DohResolver("https://dns.google/dns-query");
  try {
    await resolver.query('example.com', 'A', 'PUT');
  } catch (e) {
    console.log('[INFO] got error:', e);
    expect(e).toBeInstanceOf(MethodNotAllowedError);
    return;
  }
  throw new Error('test succeeded with PUT method, want it to fail with MethodNotAllowedError');
});

test('DohResolver.query() for example.com TXT contains answers', async () => {
  const resolver = new DohResolver("https://dns.google/dns-query");
  try {
    let response = await resolver.query('example.com', 'TXT');
    expect(response).toHaveProperty('answers');
  } catch(err) {
      throw err;
  }
});

test('timeout works properly (and cloudflare doesn\'t respond within 1 millisecond)', async () => {
  let msg = makeQuery('example.org');
  try {
    await sendDohMsg(msg, 'https://1.1.1.1/dns-query', 'GET', null, 1)
  } catch (e) {
      console.log('[INFO] got error:', e);
      expect(e.toString()).toMatch(/.*timed out.*/);
      return;
  }
  throw new Error("sendDohMsg succeeded, wanted it to time out");
});

test('dnsPacket is exposed in dohjs', () => {
  expect(dnsPacket).toBeTruthy();
  expect(dnsPacket).toHaveProperty('DNSSEC_OK');
});
