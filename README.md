# dohjs.org Web Interface
This branch is for the DoHjs web interface hosted on [dohjs.org](https://dohjs.org)

This site can serve as an example use of Dohjs.

# Contributing

Pull requests are welcome on this branch as well! If you see something you'd like added or changed, open an issue or a pull request.

### Generate HTML list of DoH providers

To generate the dropdown menu list of open DoH resolvers, run the following commands:

```bash
wget https://gist.githubusercontent.com/kimbo/dd65d539970e3a28a10628f15398247b/raw/b64b414987126fe06e78f34f5780f88707b8df16/scrape-doh-providers.py
chmod +x scrape-doh-providers.py
./scrape-doh-providers.py '"<button type=\"button\" class=\"dropdown-item\" data-dohurl=\"{}\">{} ({})</button>".format(o["url"], o["name"], o["url"])' > tmp.html
```

Then copy/paste the contents of tmp.html into the appropriate place in index.html.
