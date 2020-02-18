'use strict';

const doh = require('dohjs');

// create a new query message for example.com
const msg = doh.makeQuery('example.com', 'TXT');

// print out query message
console.log(msg);
// -> { type: 'query',
// ->  id: 54563,
// ->  flags: 256,
// ->  questions: [ { type: 'TXT', name: 'example.com' } ] }

