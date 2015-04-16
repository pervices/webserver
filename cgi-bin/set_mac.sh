#!/bin/bash
#PARAM=reg_name_u.reg_name_l.aabbccbbaabb

PARAM=$(cat)
echo -ne "\n"
set -- ${PARAM//./ }
reg_name_u=$1
reg_name_l=$2
mac=$3
mac_u=${mac:0:4}
mac_l=${mac:4:8}

mem rw "$reg_name_u" "0000$mac_u"
mem rw "$reg_name_l" "$mac_l"

echo "mem rw" "$reg_name_u" "0000$mac_u"
echo "mem rw" "$reg_name_l" "$mac_l"