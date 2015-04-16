#!/bin/bash
# This file sets the frequency synthesizer,
# reads the actual frequency that was set,
# and updates the xml
#PARAM=board.channel(UpperCase).frequency
PARAM=$(cat)
echo -ne "\n"
#echo $PARAM
set -- ${PARAM//./ }
board=$1
ch=$2
freq=$3

# Send MCU command
if [ "$board" == "rx" ]
then
        cmd="uart-app-fwd \"fwd -b 0 -m 'rf -c "${ch,}" -f "${freq}"'\""
elif [ "$board" == "tx" ]
then
        cmd="uart-app-fwd \"fwd -b 1 -m 'rf -c "${ch,}" -f "${freq}"'\""
fi
# cmd="./dummy.sh"

# Parsing the result to get the real frequency
result=$(eval "$cmd")
set -- ${result// / }
ofreq=$5
nvco=$7
real_freq=$(awk "BEGIN {printf \"%.4f\n\","$ofreq"/"$nvco"/1000 }")
#echo $real_freq

# Updating the XML with the real frequency
perl xmlprsr.pl "$board" "HMC_CH$ch" "freq" "$real_freq"

# Echo back to website
echo "rfsynth_set_freq($freq)"
echo "Actual frequency output: $real_freq"
