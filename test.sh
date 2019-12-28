#!/usr/bin/env bash

doh_bin="./bin/doh.js"
doh_test() {
	output=$("$doh_bin" $@ 2>&1)
	exit_code="$?"
	if [ "$exit_code" -eq 0 ]; then
		echo "Command \"$doh_bin $@\" PASSED"
	else
		echo -e "Command \"$doh_bin $@\" FAILED"
		echo -e "OUTPUT:\n$output" >&2
		exit "$exit_code"
	fi
}
doh_test -h
doh_test --help
doh_test --version
doh_test https://dns.google/dns-query -m GET
doh_test https://dns.google/dns-query
doh_test https://cloudflare-dns.com/dns-query -t AAAA
doh_test https://cloudflare-dns.com/dns-query -q example.net -t TXT -m GET
doh_test https://dns.quad9.net/dns-query
doh_test https://dns.quad9.net/dns-query -m GET -q com -t NS
doh_test https://dns.google/dns-query -m POST --ecs 1.2.3.4/24 -q google.com -t AAAA
doh_test https://cloudflare-dns.com/dns-query -m POST --subnet ::/56 -q cloudflare.com -t A
