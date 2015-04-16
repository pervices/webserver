#!bin/bash
VALUE=$(cat)
echo -ne "\n"
echo "Changing gateway: $VALUE"
sed -i "0,/^.*\bgateway\b.*$/s//$VALUE/" ../../../etc/network/interfaces
