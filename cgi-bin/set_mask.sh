#!bin/bash
VALUE=$(cat)
echo -ne "\n"
echo "Changing netmask: $VALUE"
sed -i "0,/^.*\bnetmask\b.*$/s//$VALUE/" ../../../etc/network/interfaces
