#!bin/bash
VALUE=$(cat)
grep -m 1 -n "$VALUE" ../../../etc/network/interfaces | sed -n -e "s/^.*$VALUE //p"
//sed -n "/$VALUE/ {p;q;}" ../../../etc/network/interfaces | awk '{print $2}'
