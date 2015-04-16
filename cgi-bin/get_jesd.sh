#!/bin/bash

VALUE=$(cat)
rx_offset=16
tx_offset=24

function bitValue
{
   local value=${1:-0}
   local bit=${2-0}
   local bit_mask=$(( 1 << $bit ))
   echo $(( value & bit_mask ? 1 : 0 ))
}

function isBitSet
{
   return $(( 1 - $(bitValue "$@") ))
}

# displaying the status of System Reset first (bit 6)
bit=$(bitValue $VALUE 6)
if [ "$bit" == "1" ]   
then
	echo -e "System Reset:\tIn progress.."
else
	echo -e "System Reset:\tComplete"
fi

# Then we display the JESD lane statuses
for ((b=0; b<32; b++))
do
   bit=$(bitValue $VALUE $b)
   if [ $b -lt 4 ] 
   then
			if [ "$bit" == "1" ]  
			then
				echo -e "ADC $b aligned:\tY"
			else
				echo -e "ADC $b aligned:\tN"
			fi
	elif [ $b -eq 4 ] 
	then
			if [ "$bit" == "1" ]  
			then
				echo -e "JESD PLL (left)  locked:\tY"
			else
				echo -e "JESD PLL (left)  locked:\tN"
			fi
	elif [ $b -eq 5 ] 
	then
			if [ "$bit" == "1" ]  
			then
				echo -e "JESD PLL (right) locked:\tY"
			else
				echo -e "JESD PLL (right) locked:\tN"
			fi
# 	elif [ $b -eq 6 ] 
# 	then
# 			
	elif [ $b -gt 15 ] && [ $b -lt 24 ]
	then
			rx_num=$(($b-$rx_offset))
			if [ "$bit" == "1" ]  
			then
				echo -e "RX $rx_num ready:\tY"
			else
				echo -e "RX $rx_num ready:\tN"
			fi
	elif [ $b -gt 23 ] && [ $b -lt 32 ]
	then
			tx_num=$(($b-$tx_offset))
			if [ "$bit" == "1" ]  
			then
				echo -e "TX $tx_num ready:\tY"
			else
				echo -e "TX $tx_num ready:\tN"
			fi
	fi
	binary_value=${bit}${binary_value}
done
#echo "Binary value : $binary_value"