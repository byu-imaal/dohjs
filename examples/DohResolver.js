'use strict';

const {DohResolver} = require('dohjs');

// create your resolver
const resolver = new DohResolver('https://dns.google/dns-query');

// lookup the A records for example.com
resolver.query('example.com', 'A')
  .then(response => {
    response.answers.forEach(ans => console.log(ans.data));
  })
  .catch(err => console.error(err));
