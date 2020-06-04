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

test('sendDohMsg() works (and the example.com zone still has an A record)', () => {
  let msg = makeQuery('example.com', 'A');
  sendDohMsg(msg, 'https://1.1.1.1/dns-query', 'GET')
    .then(response => {
      expect(response).toHaveProperty('answers');
    })
    .catch(err => {
      throw err;
    });
});

test('DohResolver should be created', () => {
  expect(new DohResolver("https://example.com/dns-query")).toBeTruthy()
});

test('DohResolver should have assigned nameserver url', () => {
  expect(new DohResolver("https://example.com/dns-query").nameserver_url).toEqual("https://example.com/dns-query")
});

test('PUT is not a valid request method', () => {
  expect(isMethodAllowed('PUT')).toBeFalsy()
});

test('Resolving with invalid methods causes error', () => {
  const resolver = new DohResolver("https://dns.google/dns-query");
  resolver.query('example.com', 'A', 'PUT')
    .then(console.log)
    .catch(err => {
      expect(err).toBeInstanceOf(MethodNotAllowedError);
    });
});

test('DohResolver.query() for example.com TXT contains answers', () => {
  const resolver = new DohResolver("https://dns.google/dns-query");
  resolver.query('example.com', 'TXT')
    .then(response => {
      expect(response).toHaveProperty('answers')
    })
    .catch(err => {
      throw err;
    });
});

test('timeout works properly (and cloudflare doesn\'t respond within 1 millisecond)', () => {
  let msg = makeQuery('example.com');
  sendDohMsg(msg, 'https://1.1.1.1/dns-query', 'GET', null, 1)
    .then(ans => {
      throw Error("Test should have failed");
    })
    .catch(err => {
      expect(err).toMatch(/.*timed out.*/);
    });
});

test('dnsPacket is exposed in dohjs', () => {
  expect(dnsPacket).toBeTruthy();
  expect(dnsPacket).toHaveProperty('DNSSEC_OK');
});
