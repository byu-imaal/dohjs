/*
This code is used to provide a CORS proxy for dohjs.org
The proxy is run as a Free-Tier Cloudflare Worker at https://cors.dohjs.workers.dev
Based heavily on this example - https://developers.cloudflare.com/workers/templates/pages/cors_header_proxy/
 */

// only allow these origin headers
const allowed_origins = [/^(https?:\/\/)?localhost(:\d+)?/, /^(https:\/\/)?dohjs\.org$/];

// We support the GET and POST,  methods from any origin,
// and accept the Content-Type header on requests. These headers must be
// present on all responses to all CORS requests. In practice, this means
// all responses to OPTIONS requests.
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': '*',
};

async function handleRequest(request) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    console.log(url);
    const dohurl = url.pathname.substr(1).replace(/https:\/(?=[^\/])/, 'https://') + url.search;

    // Rewrite request to point to API url. This also makes the request mutable
    // so we can add the correct Origin header to make the API server think
    // that this request isn't cross-site.
    request = new Request(dohurl, request);
    request.headers.set('Origin', new URL(dohurl).origin);
    let response = await fetch(request);
    // Recreate the response so we can modify the headers
    response = new Response(response.body, response);
    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', origin);
    // Append to/Add Vary header so browser will cache response correctly
    response.headers.append('Vary', 'Origin');
    return response
}

function handleOptions(request) {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    if (request.headers.get('Origin') !== null &&
        request.headers.get('Access-Control-Request-Method') !== null &&
        request.headers.get('Access-Control-Request-Headers') !== null) {
        // Handle CORS pre-flight request.
        // If you want to check the requested method + headers
        // you can do that here.
        return new Response(null, {
            headers: corsHeaders,
        })
    }
    else {
        // Handle standard OPTIONS request.
        // If you want to allow other HTTP Methods, you can do that here.
        return new Response(null, {
            headers: {
                Allow: 'GET, POST, OPTIONS',
            },
        })
    }
}

addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const allowed = allowed_origins.some((ao) => origin.match(ao) != null);

    if (url.pathname === '/') {
        event.respondWith(htmlResponse());
    }
    else if (request.method === 'OPTIONS') {
        // Handle CORS preflight requests
        event.respondWith(handleOptions(request));
    }
    else if ((request.method === 'GET' || request.method === 'POST') && allowed) {
        // Handle POST or GET with valid origin
        event.respondWith(handleRequest(request));
    }
    else {
        event.respondWith(new Response(null, {
                status: 405,
                statusText: 'Not Allowed',
            })
        );
    }
});

// BASIC HTML PAGE
async function htmlResponse() {
    const demoPage = `
<!DOCTYPE html>
<html>
<body>
  <p>This is a CORS proxy server for dohjs.org. 
  <a href="https://developers.cloudflare.com/workers/templates/pages/cors_header_proxy/">See here for a similar example</a>
</body>
</html>`;

    return new Response(demoPage, {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
        },
    })
}
