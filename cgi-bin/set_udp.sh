#!/bin/bash
#PARAM=reg_name.udp_port
#example: PARAM=rxa8.31337
#output: mem rw rxa8 00007a69

PARAM=$(cat)
echo -ne "\n"
set -- ${PARAM//./ }
reg_name=$1
regd=$2

if [ "$regd" -gt 65535 ] 
then
	echo "error: Invalid port..."
else
	regx=$(printf "%08x\n" $regd)
	mem rw "$reg_name" "$regx"
	echo "mem rw" "$reg_name" "$regx"
fi