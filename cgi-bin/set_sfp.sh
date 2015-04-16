#!/bin/bash
PARAM=$(cat)
echo -ne "\n"
set -- ${PARAM//,/ }
port=$1
ip=$2
mac=$3
udp=$4

# echo "$PARAM"
if [ "$port" == "a" ] 
then
	echo "Configuring SFP+ Port A..."
	sh sh_set_destsrc_ip.sh "net5.$ip"
	sh sh_set_mac.sh "net11.net12.$mac"
	sh sh_set_udp.sh "net13.$udp"
else
	echo "Configuring SFP+ Port B..."
	sh sh_set_destsrc_ip.sh "net20.$ip"
	sh sh_set_mac.sh "net26.net27.$mac"
	sh sh_set_udp.sh "net28.$udp"
fi

echo -e "\n...done."