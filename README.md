# dohjs.org Web Interface
This branch is for the DoHjs web interface hosted on [dohjs.org](https://dohjs.org)

This website utilizes the DoHjs package via the CDN method. 
Thus, it can server as an example implementation of the DoHjs package.

### CORS Proxy
To handle CORS issues, DoHjs employs a CORS proxy. 
The code for this proxy is in [cors_proxy.js](cors_proxy.js).
The proxy is run as a Cloudflare Worker under the free-tier.

TODO: explain CORS and why we need a proxy