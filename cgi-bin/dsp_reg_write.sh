#!/bin/bash
#PARAM=reg_name.dec_value
#example: PARAM=txa0.256
#output: mem rw txa0 000000ff

PARAM=$(cat)
echo -ne "\n"
set -- ${PARAM//./ }
reg_name=$1
regd=$2
value=$((regd-1))
regx=$(printf "%08x\n" $value)

mem rw "$reg_name" "$regx"
echo "mem rw" "$reg_name" "$regx"