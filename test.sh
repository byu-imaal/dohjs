#!/usr/bin/env bash

# run integrated tests
jest

# test command line tool
echo -e "\nRunning command line tests...\n"

doh_bin="./bin/doh.js"
doh_test() {
	printf "Running \"$doh_bin $*\"..."
	output=$("$doh_bin" $@ 2>&1)
	exit_code="$?"
	if [ "$exit_code" -eq 0 ]; then
		printf "PASSED ✔️\n"
	else
		echo -e "FAILED"
		echo -e "OUTPUT:\n$output"
		exit "$exit_code"
	fi
}
doh_test -h
doh_test --help
doh_test --version
doh_test https://dns.google/dns-query -m GET
doh_test https://dns.google/dns-query
doh_test https://cloudflare-dns.com/dns-query dohjs.org AAAA
doh_test https://cloudflare-dns.com/dns-query example.net TXT -m GET
doh_test https://dns.google/dns-query google.com AAAA -m POST +subnet 1.2.3.4/24
doh_test https://cloudflare-dns.com/dns-query cloudflare.com -m POST +subnet ::/56
doh_test https://cloudflare-dns.com/dns-query dohjs.org TXT -s -d
doh_test https://cloudflare-dns.com/dns-query dohjs.org TXT +edns 12:0000
doh_test https://cloudflare-dns.com/dns-query dohjs.org TXT +edns 12:0000 +edns 10:0011223344556677

echo "Command line tests passed"
echo "All tests passed"
