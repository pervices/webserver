#!bin/bash
VALUE=$(cat)
echo -ne "\n"
echo "Setting DHCP $VALUE"
DHCP=$(grep -n "iface eth0 inet dhcp" ../../../etc/network/interfaces | cut -d : -f 1)
START=$(grep -n "iface eth0 inet static" ../../../etc/network/interfaces | cut -d : -f 1)
END=$(grep -m 1 -n "gateway" ../../../etc/network/interfaces | cut -d : -f 1)
if [[ $VALUE == *on* ]]
then
	sed -i "${DHCP} s/^#*//" ../../../etc/network/interfaces
	sed -i "${START},${END} s/^#*/#/" ../../../etc/network/interfaces
	#sed -n "${DHCP},${END}p" ../../../etc/network/interfaces
else
	sed -i "$DHCP s/^#*/#/" ../../../etc/network/interfaces
	sed -i "${START},${END} s/^#*//" ../../../etc/network/interfaces
	#sed -n "${DHCP},${END}p" ../../../etc/network/interfaces
fi
