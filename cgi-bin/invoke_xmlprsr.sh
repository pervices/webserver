#!/bin/bash
PARAM=$(cat)
echo -ne "\n"
set -- ${PARAM//,/ }
perl xmlprsr.pl "$1" "$2" "$3" "$4"