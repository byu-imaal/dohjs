# dohjs.org Web Interface
This branch is for the DoHjs web interface hosted on [dohjs.org](https://dohjs.org)

This website utilizes the DoHjs package via the CDN method. 
Thus, it can server as an example implementation of the DoHjs package.

### CORS Proxy
To handle CORS issues, DoHjs employs a CORS proxy. 
The code for this proxy is in [cors_proxy.js](cors_proxy.js) and is run as a Cloudflare Worker under the free-tier.
To prevent misuse, the proxy is restricted to origins of `dohjs.org` and `localhost`.

#### What is CORS?
Cross-origin resource sharing (CORS) is the method by which a domain can share its data with another domain.
CORS is not typically an issue when dealing with images, stylesheets, scripts, etc..
However, DoHjs makes `GET` and `POST` requests with uncommon content/headers thus restricting it.

With CORS, your browser sends a special HTTP header specifying the orgin e.g. `Origin: dohsj.org`.
It then checks that the response has a `Access-Control-Allow-Origin` header and that the value is either the origin or wildcard (`*`).
If it does not match or the response does not include that header, the browser drops the response.
(Note that there are also preflight queries sent by the browser to check CORS without sending the actual request.)

#### How does a proxy fix this?
The CORS proxy acts as a wrapper for DoH requests.
Requests first go to the proxy which in turn makes the request to the DoH resolver.
They key is that the proxy modifies the response from the resolver to have `Access-Control-Allow-Origin: *` in the header.
This ensures that the browser doesn't drop the response.

For more details [see this StackOverflow answer](https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe/43881141#43881141).
The proxy code is largely based on a template provided by Cloudflare which can be found [here]( https://developers.cloudflare.com/workers/templates/pages/cors_header_proxy/). 
