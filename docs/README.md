## Classes

<dl>
<dt><a href="#MethodNotAllowedError">MethodNotAllowedError</a></dt>
<dd><p>Custom error class to be thrown when someone tries to send a DoH request
with a request method other than &quot;GET&quot; or &quot;POST&quot;</p>
</dd>
<dt><a href="#DohResolver">DohResolver</a></dt>
<dd><p>A super lame DNS over HTTPS stub resolver</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#ALLOWED_REQUEST_METHODS">ALLOWED_REQUEST_METHODS</a> : <code>array</code></dt>
<dd><p>Allowed request methods for sending DNS over HTTPS requests.
<br>
Allowed method are &quot;GET&quot; and &quot;POST&quot;</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#isMethodAllowed">isMethodAllowed(method)</a> ⇒ <code>boolean</code></dt>
<dd><p>Check if a request method is allowed</p>
</dd>
<dt><a href="#makeQuery">makeQuery(qname, qtype)</a> ⇒ <code>object</code></dt>
<dd><p>Make a DNS query message of type <a href="object">object</a> (see <a href="https://github.com/mafintosh/dns-packet">dns-packet</a>). Use this before calling <a href="#sendDohMsg">sendDohMsg</a>
<br>
The recursion desired flag will be set, and the ID in the header will be set to zero, per the RFC (<a href="https://tools.ietf.org/html/rfc8484#section-4.1">section 4.1</a>).</p>
</dd>
<dt><a href="#sendDohMsg">sendDohMsg(packet, url, method, headers)</a> ⇒ <code>Promise.&lt;object&gt;</code></dt>
<dd><p>Send a DNS message over HTTPS to <code>url</code> using the given request method</p>
</dd>
</dl>

<a name="MethodNotAllowedError"></a>

## MethodNotAllowedError
Custom error class to be thrown when someone tries to send a DoH request
with a request method other than "GET" or "POST"

**Kind**: global class  
<a name="DohResolver"></a>

## DohResolver
A super lame DNS over HTTPS stub resolver

**Kind**: global class  

* [DohResolver](#DohResolver)
    * [new DohResolver(nameserver_url)](#new_DohResolver_new)
    * [.query(qname, qtype, method, headers)](#DohResolver+query) ⇒ <code>Promise.&lt;object&gt;</code>

<a name="new_DohResolver_new"></a>

### new DohResolver(nameserver_url)
Creates a new DoH resolver


| Param | Type | Description |
| --- | --- | --- |
| nameserver_url | <code>string</code> | The URL we're going to be sending DNS requests to |

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
<a name="DohResolver+query"></a>

### dohResolver.query(qname, qtype, method, headers) ⇒ <code>Promise.&lt;object&gt;</code>
Perform a DNS lookup for the given query name and type.

**Kind**: instance method of [<code>DohResolver</code>](#DohResolver)  
**Returns**: <code>Promise.&lt;object&gt;</code> - The DNS response received  
**Throws**:

- [<code>MethodNotAllowedError</code>](#MethodNotAllowedError) If the method is not allowed (i.e. if it's not "GET" or "POST"), a MethodNotAllowedError will be thrown.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| qname | <code>string</code> |  | the domain name to query for (e.g. example.com) |
| qtype | <code>string</code> | <code>&quot;A&quot;</code> | the type of record we're looking for (e.g. A, AAAA, TXT, MX) |
| method | <code>string</code> | <code>&quot;POST&quot;</code> | Must be either "GET" or "POST" |
| headers | <code>object</code> | <code></code> | define HTTP headers to use in the DNS query <br> <b><i>IMPORTANT: If you don't provide the "Accept: application/dns-message" header, you probably won't get the response you're hoping for. See [RFC 8484 examples](https://tools.ietf.org/html/rfc8484#section-4.1.1) for examples of HTTPS headers for both GET and POST requests.</i></b> |

<a name="ALLOWED_REQUEST_METHODS"></a>

## ALLOWED\_REQUEST\_METHODS : <code>array</code>
Allowed request methods for sending DNS over HTTPS requests.
<br>
Allowed method are "GET" and "POST"

**Kind**: global constant  
<a name="isMethodAllowed"></a>

## isMethodAllowed(method) ⇒ <code>boolean</code>
Check if a request method is allowed

**Kind**: global function  
**Returns**: <code>boolean</code> - If `method` is "GET" or "POST", return true; return false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | the request method to test |

<a name="makeQuery"></a>

## makeQuery(qname, qtype) ⇒ <code>object</code>
Make a DNS query message of type [object](object) (see [dns-packet](https://github.com/mafintosh/dns-packet)). Use this before calling [sendDohMsg](#sendDohMsg)
<br>
The recursion desired flag will be set, and the ID in the header will be set to zero, per the RFC ([section 4.1](https://tools.ietf.org/html/rfc8484#section-4.1)).

**Kind**: global function  
**Returns**: <code>object</code> - The DNS query message  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| qname | <code>string</code> |  | the domain name to put in the query message (e.g. example.com) |
| qtype | <code>string</code> | <code>&quot;A&quot;</code> | the query type to put in the query message (e.g. A, AAAA, DS, DNSKEY) |

**Example**  
```js
// imports
const {makeQuery} = require('dohjs');

// create a query message
const msg = makeQuery('example.com', 'TXT');

// print it out to the console
console.log(msg);
// -> { type: 'query',
// ->  id: 0,
// ->  flags: 256,
// ->  questions: [ { type: 'TXT', name: 'example.com' } ] }
```
<a name="sendDohMsg"></a>

## sendDohMsg(packet, url, method, headers) ⇒ <code>Promise.&lt;object&gt;</code>
Send a DNS message over HTTPS to `url` using the given request method

**Kind**: global function  
**Returns**: <code>Promise.&lt;object&gt;</code> - the response (if we got any)  

| Param | Type | Description |
| --- | --- | --- |
| packet | <code>object</code> | the DNS message to send |
| url | <code>string</code> | the url to send the DNS message to |
| method | <code>string</code> | the request method to use ("GET" or "POST") |
| headers | <code>object</code> | headers to send in the DNS request. The default headers for GET requests are |

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
