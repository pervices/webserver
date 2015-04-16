#!bin/bash
MODE=$(cat)
echo -ne "\n"

if [ "$MODE" == "1" ]
then
		# Enabling UHD
		
		# Updating XML file
		perl xmlprsr.pl "dig" "OPR_MODE" "uhd" "ON"
		
		# Start UHD driver
		server &
		
		# Save PID of server
		server_pid=$!
		#echo "Starting server..."
		#echo "SERVER PID: $server_pid"
		perl xmlprsr.pl "dig" "OPR_MODE" "pid" "$server_pid"

else
		# Disabling UHD

		# Grabbing the PID of the server and killing the process
		server_pid=$(perl xmlprsr.pl "dig" "OPR_MODE" "pid" "-" "find")
		
		echo "Killing server..."
		cmd="kill -9 "$server_pid
		eval "$cmd"
		echo "SERVER PID: $server_pid"
		
		# Updating XML file
		perl xmlprsr.pl "dig" "OPR_MODE" "uhd" "OFF"

fi

