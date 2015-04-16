#!/bin/bash
PARAM=$(cat)
echo -ne "\n"
set -- ${PARAM//,/ }
brd=$1
ch=$2
chan=$(printf \\$(printf "%o" $ch))
mode=$3

# Rx Board
if [ "$brd" == "rx" ]
then
		
		# Disabling Chain
		if [ "$mode" == "0" ]
		then

				# Mute channel
				cmd="uart-app-fwd \"fwd -b 0 -m 'board -c "${ch,}" -m'\"" 
				eval "$cmd"
				
				# Reset DSP FPGA registers for current channel
				echo -e "\nReset DSP FPGA registers..."
				sh sh_reg_write.sh "rx"${ch,}"0.00000000.00000000"
				sh sh_reg_write.sh "rx"${ch,}"1.00000000.000000ff"
				
				# Update XML - disable channel
				perl xmlprsr.pl "$brd" "CHAN_EN$ch" "pwr" "OFF"
				
				# Reset radio settings
				perl xmlprsr.pl "$brd" "ADC16DX370_CH$ch" "pwr" "ON"
				perl xmlprsr.pl "$brd" "ADC16DX370_CH$ch" "jesd" "EN"
				perl xmlprsr.pl "$brd" "VARACTOR_CH$ch" "pwr" "ON"
				perl xmlprsr.pl "$brd" "VARACTOR_CH$ch" "delay" "0.5"
				perl xmlprsr.pl "$brd" "ADRF6518_CH$ch" "pwr" "ON"
				perl xmlprsr.pl "$brd" "ADRF6518_CH$ch" "gn1" "1"
				perl xmlprsr.pl "$brd" "ADRF6518_CH$ch" "gn2" "3"
				perl xmlprsr.pl "$brd" "ADRF6518_CH$ch" "gn3" "1"
				perl xmlprsr.pl "$brd" "ADRF6518_CH$ch" "at1" "8"
				perl xmlprsr.pl "$brd" "ADRF6518_CH$ch" "at2" "8"
				perl xmlprsr.pl "$brd" "ADRF6518_CH$ch" "at3" "8"
				perl xmlprsr.pl "$brd" "ADRF6518_CH$ch" "pgn" "0"
				perl xmlprsr.pl "$brd" "ADRF6518_CH$ch" "fbypass" "OFF"
				perl xmlprsr.pl "$brd" "ADRF6518_CH$ch" "freq" "63"
				perl xmlprsr.pl "$brd" "HMC_CH$ch" "pwr" "ON"
				perl xmlprsr.pl "$brd" "HMC_CH$ch" "freq" "465000"
				perl xmlprsr.pl "$brd" "BAND_SW_CH$ch" "band" "HIGH"
				perl xmlprsr.pl "$brd" "LNA_SW_CH$ch" "lna" "OFF"
				
				# Reset DSP settings and set 'rst_dsp' HIGH
				perl xmlprsr.pl "$brd" "DEC_FACT$ch" "value" "256"
				if [ "$ch" == "A" ] || [ "$ch" == "C" ]
				then
					perl xmlprsr.pl "$brd" "DEST_PORT$ch" "port" "SFPA"
					sh sh_reg_write.sh "rx"${ch,}"4.00000000.00000002"
				else 
					perl xmlprsr.pl "$brd" "DEST_PORT$ch" "port" "SFPB"
					sh sh_reg_write.sh "rx"${ch,}"4.00000000.00000202"
				fi
				perl xmlprsr.pl "$brd" "SIGNED$ch" "sign" "SIGNED"
				perl xmlprsr.pl "$brd" "FREQ_ADJ$ch" "dir" "+"
				perl xmlprsr.pl "$brd" "FREQ_ADJ$ch" "value" "0"
				perl xmlprsr.pl "$brd" "SAMPLE_RATE$ch" "value" "1.258850"
		
		# Enabling Chain
		elif [ "$mode" == "1" ]
		then
		
				# Set current RX board to demo mode
				echo -e "\nSet RX_$ch to demo mode..."
				cmd="uart-app-fwd \"fwd -b 0 -m 'board -c "${ch,}" -d'\"" 
				eval "$cmd"
				
				cmd="uart-app-fwd \"fwd -b 0 -m 'board -c "${ch,}" -d'\"" 
				eval "$cmd"
				
				# Save current state of the board
				echo -e "\nSaving current board state..."
				rx_state=()
				state=$(perl xmlprsr.pl "rx" "-" "-" "-" "getstate")
				set -- ${state//,/ }
				rx_state[0]=$1
				rx_state[1]=$2
				rx_state[2]=$3
				rx_state[3]=$4
# 				echo -e "${rx_state[0]},${rx_state[1]},${rx_state[2]},${rx_state[3]}\n"
				
				tx_state=()
				state=$(perl xmlprsr.pl "tx" "-" "-" "-" "getstate")
				set -- ${state//,/ }
				tx_state[0]=$1
				tx_state[1]=$2
				tx_state[2]=$3
				tx_state[3]=$4
# 				echo -e "${tx_state[0]},${tx_state[1]},${tx_state[2]},${tx_state[3]}\n"
				
				# Set all active ADCs to demo mode
				CHANNEL=(a b c d)
				echo -e "\nSetting active ADC's to demo mode..."
				#cmd="uart-app-fwd \"fwd -b 0 -m 'power -c "${ch,}" -a 1'\"" 
				#eval "$cmd"
				for i in {0..3}
				do
						if [ "${rx_state[$i]}" == "1" ]
						then
								cmd="uart-app-fwd \"fwd -b 0 -m 'power -c "${CHANNEL[$i]}" -a 1'\"" 
								eval "$cmd"
						fi
				done
				
				# Disable all RX JESD lanes by writing for FPGA register
				echo -e "\nDisable all JESD lanes..."
				sh sh_reg_write.sh "rxa4.fffffeff.00000000"
				sh sh_reg_write.sh "rxb4.fffffeff.00000000"
				sh sh_reg_write.sh "rxc4.fffffeff.00000000"
				sh sh_reg_write.sh "rxd4.fffffeff.00000000"
				
				# Disable all TX JESD lanes by writing for FPGA register
				sh sh_reg_write.sh "txa4.fffffeff.00000000"
				sh sh_reg_write.sh "txb4.fffffeff.00000000"
				sh sh_reg_write.sh "txc4.fffffeff.00000000"
				sh sh_reg_write.sh "txd4.fffffeff.00000000"

				# Set all active DACs to demo mode
				echo -e "\nSetting all active DAC's to demo mode..."
				for i in {0..3}
				do
						if [ "${tx_state[$i]}" == "1" ]
						then
								cmd="uart-app-fwd \"fwd -b 1 -m 'power -c "${CHANNEL[$i]}" -d 1'\"" 
								eval "$cmd"
						fi
				done
				
				# Send the SYNC pulse from the LMK
				echo -e "\nSend SYSREF..."
				cmd="uart-app 'fpga -o'"
				eval "$cmd"
				
				# Re-enable RX/TX JESD lanes and channels
				echo -e "\nRe-enable JESD lanes..."
				for i in {0..3}
				do
						if [ "${rx_state[$i]}" == "1" ]
						then
								sh sh_reg_write.sh "rx"${CHANNEL[$i]}"4.fffffeff.00000100"
						fi
						
						if [ "${tx_state[$i]}" == "1" ]
						then
								sh sh_reg_write.sh "tx"${CHANNEL[$i]}"4.fffffeff.00000100"
						fi
				done
				
				# Update XML - enable channel and set 'rst_dsp' LOW
				perl xmlprsr.pl "$brd" "CHAN_EN$ch" "pwr" "ON"
				echo -e "\nEnable JESD for channel $ch..."
				sh sh_reg_write.sh "rx"${ch,}"4.fffffefd.00000100"
				
		fi

# Tx Board
elif [ "$brd" == "tx" ]
then
		
		# Disabling Chain
		if [ "$mode" == "0" ]
		then
				# Set current TX to mute mode...
				echo -e "\nSet TX_$ch to mute mode..."
				cmd="uart-app-fwd \"fwd -b 1 -m 'board -c "${ch,}" -m'\"" 
				eval "$cmd"

				# Reset DSP FPGA registers for current channel
				echo -e "\nReset DSP FPGA registers..."
				sh sh_reg_write.sh "tx"${ch,}"0.00000000.00000000"
				sh sh_reg_write.sh "tx"${ch,}"1.00000000.000000ff"
				
				# Update XML - disable channel
				perl xmlprsr.pl "$brd" "CHAN_EN$ch" "pwr" "OFF"
				
				# Reset radio settings for current channel
				perl xmlprsr.pl "$brd" "DAC38J84_CH$ch" "pwr" "ON"
				perl xmlprsr.pl "$brd" "DAC38J84_CH$ch" "pwr" "ON"
				perl xmlprsr.pl "$brd" "DAC38J84_CH$ch" "chan" "A"
				perl xmlprsr.pl "$brd" "DAC38J84_CH$ch" "nco_freq" "0"
				perl xmlprsr.pl "$brd" "DAC38J84_CH$ch" "pap" "true"
				perl xmlprsr.pl "$brd" "IQ_BIASI$ch" "mv" "17"
				perl xmlprsr.pl "$brd" "IQ_BIASQ$ch" "mv" "17"
				perl xmlprsr.pl "$brd" "RFSA_H_CH$ch" "pwr" "ON"
				perl xmlprsr.pl "$brd" "RFSA_H_CH$ch" "atten" "14"
				perl xmlprsr.pl "$brd" "RFSA_L_CH$ch" "pwr" "ON"
				perl xmlprsr.pl "$brd" "RFSA_L_CH$ch" "atten" "14"
				perl xmlprsr.pl "$brd" "BAND_SW_CH$ch" "band" "HIGH"
				perl xmlprsr.pl "$brd" "HMC_CH$ch" "pwr" "ON"
				perl xmlprsr.pl "$brd" "HMC_CH$ch" "freq" "465000"
				
				# Reset DSP settings for current channel and set 'rst_dsp' HIGH
				perl xmlprsr.pl "$brd" "INT_FACT$ch" "value" "256"
				if [ "$ch" == "A" ] || [ "$ch" == "C" ]
				then
					perl xmlprsr.pl "$brd" "SRC_PORT$ch" "port" "SFPA"
					sh sh_reg_write.sh "tx"${ch,}"4.00000000.00000002"
				else 
					perl xmlprsr.pl "$brd" "SRC_PORT$ch" "port" "SFPB"
					sh sh_reg_write.sh "tx"${ch,}"4.00000000.00000202"
				fi
				perl xmlprsr.pl "$brd" "FREQ_ADJ$ch" "dir" "+"
				perl xmlprsr.pl "$brd" "FREQ_ADJ$ch" "value" "0"
				perl xmlprsr.pl "$brd" "SAMPLE_RATE$ch" "value" "1.258850"
		
		
		# Enabling Chain
		elif [ "$mode" == "1" ]
		then
				# Set current TX to demo mode
				echo -e "\nSet TX_$ch to demo mode..."
				cmd="uart-app-fwd \"fwd -b 1 -m 'board -c "${ch,}" -d'\"" 
				eval "$cmd"
				
				cmd="uart-app-fwd \"fwd -b 1 -m 'board -c "${ch,}" -d'\"" 
				eval "$cmd"
				
				# Save current state of the board
				echo -e "\nSaving current board state..."
				rx_state=()
				state=$(perl xmlprsr.pl "rx" "-" "-" "-" "getstate")
				set -- ${state//,/ }
				rx_state[0]=$1
				rx_state[1]=$2
				rx_state[2]=$3
				rx_state[3]=$4
# 				echo -e "${rx_state[0]},${rx_state[1]},${rx_state[2]},${rx_state[3]}\n"
				
				tx_state=()
				state=$(perl xmlprsr.pl "tx" "-" "-" "-" "getstate")
				set -- ${state//,/ }
				tx_state[0]=$1
				tx_state[1]=$2
				tx_state[2]=$3
				tx_state[3]=$4
# 				echo -e "${tx_state[0]},${tx_state[1]},${tx_state[2]},${tx_state[3]}\n"
				
				# Set all active ADCs to demo mode
				CHANNEL=(a b c d)
				echo -e "\nSetting active ADC's to demo mode..."
				#cmd="uart-app-fwd \"fwd -b 0 -m 'power -c "${ch,}" -a 1'\"" 
				#eval "$cmd"
				for i in {0..3}
				do
						if [ "${rx_state[$i]}" == "1" ]
						then
								cmd="uart-app-fwd \"fwd -b 0 -m 'power -c "${CHANNEL[$i]}" -a 1'\"" 
								eval "$cmd"
						fi
				done
				
				# Disable all RX JESD lanes by writing for FPGA register
				echo -e "\nDisable all JESD lanes..."
				sh sh_reg_write.sh "rxa4.fffffeff.00000000"
				sh sh_reg_write.sh "rxb4.fffffeff.00000000"
				sh sh_reg_write.sh "rxc4.fffffeff.00000000"
				sh sh_reg_write.sh "rxd4.fffffeff.00000000"
				
				# Disable all TX JESD lanes by writing for FPGA register
				sh sh_reg_write.sh "txa4.fffffeff.00000000"
				sh sh_reg_write.sh "txb4.fffffeff.00000000"
				sh sh_reg_write.sh "txc4.fffffeff.00000000"
				sh sh_reg_write.sh "txd4.fffffeff.00000000"
				
				# Set all active DACs to demo mode
				echo -e "\nSetting all active DAC's to demo mode..."
				for i in {0..3}
				do
						if [ "${tx_state[$i]}" == "1" ]
						then
								cmd="uart-app-fwd \"fwd -b 1 -m 'power -c "${CHANNEL[$i]}" -d 1'\"" 
								eval "$cmd"
						fi
				done
				
				# Send the SYNC pulse from the LMK
				echo -e "\nSend SYSREF..."
				cmd="uart-app \"fpga -o\""
				eval "$cmd"
				
				# Re-enable RX/TX JESD lanes and channels
				echo -e "\nRe-enable JESD channels..."
				for i in {0..3}
				do
						if [ "${rx_state[$i]}" == "1" ]
						then
								sh sh_reg_write.sh "rx"${CHANNEL[$i]}"4.fffffeff.00000100"
						fi
						
						if [ "${tx_state[$i]}" == "1" ]
						then
								sh sh_reg_write.sh "tx"${CHANNEL[$i]}"4.fffffeff.00000100"
						fi
				done
				
				# Update XML - enable channel and set 'rst_dsp' LOW
				perl xmlprsr.pl "$brd" "CHAN_EN$ch" "pwr" "ON"
				echo -e "\nEnable JESD for channel $ch..."
				sh sh_reg_write.sh "tx"${ch,}"4.fffffefd.00000100"
		fi
fi