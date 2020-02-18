
## Classes

Name | Description
------ | -----------
[MethodNotAllowedError] | Custom error class to be thrown when someone tries to send a DoH requestwith a request method other than "GET" or "POST"
[DohResolver] | A super lame DNS over HTTPS stub resolver

## Constants

Name | Description
------ | -----------
[ALLOWED_REQUEST_METHODS] | Allowed request methods for sending DNS over HTTPS requests.<br>Allowed method are "GET" and "POST"

## Functions

Name | Description
------ | -----------
[isMethodAllowed(method)] | Check if a request method is allowed
[makeQuery(qname, qtype)] | Make a DNS query message of type [dnsPacket] (see [dns-packet]. Use this before calling [sendDohMsg]<br>The recursion desired flag will be set, and the ID in the header will be set to a random number.
[sendDohMsg(packet, url, method)] | Send a DNS message over HTTPS to `url` using the given request method


## MethodNotAllowedError

Custom error class to be thrown when someone tries to send a DoH request
with a request method other than "GET" or "POST"

**Kind**: global class  

## DohResolver

A super lame DNS over HTTPS stub resolver

**Kind**: global class  

* [DohResolver]
    * [new DohResolver(nameserver_url)]
    * [.query(qname, qtype, method)]


### new DohResolver(nameserver_url)

Creates a new DoH resolver


| Param | Type | Description |
| --- | --- | --- |
| nameserver_url | `string` | The URL we're going to be sending DNS requests to |

**Example**  
```js
// import the required stuff
const {DohResolver} = require('dohjs');

// create your resolver
const resolver = new DohResolver('https://dns.google/dns-query')

// lookup the A records for example.com
// print out the answer data
resolver.query('example.com', 'A')
  .then(response => {
    response.answer.forEach(ans => console.log(ans.data));
  })
  .catch(err => console.error(err));
```

### dohResolver.query(qname, qtype, method)

Perform a DNS lookup for the given query name and type.

**Kind**: instance method of [`DohResolver`]  
**Returns**: `Promise.<dnsPacket>` - The DNS response received  
**Throws**:

- [`MethodNotAllowedError`] If the method is not allowed (i.e. if it's not "GET" or "POST"), a MethodNotAllowedError will be thrown.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| qname | `string` |  | the domain name to query for (e.g. example.com) |
| qtype | `string` | `'A'` | the type of record we're looking for (e.g. A, AAAA, TXT, MX) |
| method | `string` | `'POST'` | Must be either "GET" or "POST" |


## ALLOWED_REQUEST_METHODS

Allowed request methods for sending DNS over HTTPS requests.
<br>
Allowed method are "GET" and "POST"

**Kind**: global constant  

## isMethodAllowed(method)

Check if a request method is allowed

**Kind**: global function  
**Returns**: `boolean` - If `method` is "GET" or "POST", return true; return false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| method | `string` | the request method to test |


## makeQuery(qname, qtype)

Make a DNS query message of type [dnsPacket] (see [dns-packet]. Use this before calling [sendDohMsg]
<br>
The recursion desired flag will be set, and the ID in the header will be set to a random number.

**Kind**: global function  
**Returns**: `dnsPacket` - The DNS query message  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| qname | `string` |  | the domain name to put in the query message (e.g. example.com) |
| qtype | `string` | `'A'` | the query type to put in the query message (e.g. A, AAAA, DS, DNSKEY) |

**Example**  
```js
// imports
const {makeQuery} = require('dohjs');

// create a query message
const msg = makeQuery('example.com', 'TXT');

// print it out to the console
console.log(msg);
// -> { type: 'query',
// ->  id: 54563,
// ->  flags: 256,
// ->  questions: [ { type: 'TXT', name: 'example.com' } ] }
```

## sendDohMsg(packet, url, method)

Send a DNS message over HTTPS to `url` using the given request method

**Kind**: global function  
**Returns**: `Promise.<dnsPacket>` - the response (if we got any)  

| Param | Type | Description |
| --- | --- | --- |
| packet | `dnsPacket` | the DNS message to send |
| url | `string` | the url to send the DNS message to |
| method | `string` | the request method to use ("GET" or "POST") |

**Example**  
```js
// imports
const {makeQuery, sendDohMsg} = require('dohjs');

const url = 'https://cloudflare-dns.com/dns-query';
const method = 'GET';

// create a query message
let msg = makeQuery('example.com', 'TXT');

// send it and print out the response to the console
sendDohMsg(msg, url, method)
  .then(response => response.answers.forEach(ans => console.log(ans.data.toString())))
  .catch(console.error);
```
<!-- LINKS -->

[MethodNotAllowedError]:#methodnotallowederror
[DohResolver]:#dohresolver
[ALLOWED_REQUEST_METHODS]:#allowed_request_methods
[dnsPacket]:dnsPacket
[dns-packet]:https://github.com/mafintosh/dns-packet)
[sendDohMsg]:#sendDohMsg
[`DohResolver`]:#new-dohresolvernameserver_url
[`MethodNotAllowedError`]:#methodnotallowederror
[isMethodAllowed(method)]:#ismethodallowedmethod
[makeQuery(qname, qtype)]:#makequeryqname-qtype
[sendDohMsg(packet, url, method)]:#senddohmsgpacket-url-method
[new DohResolver(nameserver_url)]:#new-dohresolvernameserver_url
[.query(qname, qtype, method)]:#dohresolverqueryqname-qtype-method
