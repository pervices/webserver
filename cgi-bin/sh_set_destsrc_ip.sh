#!/bin/bash
PARAM=$1
echo -ne "\n"
set -- ${PARAM//./ }
reg_name=$1
new_regx=$(printf "%02x%02x%02x%02x\n" $2 $3 $4 $5)
mem rw "$reg_name" "$new_regx"
echo "mem rw" "$reg_name" "$new_regx"