#!bin/bash
VALUE=$(cat)
echo -ne "\n"
echo "Changing IP address: $VALUE"
sed -i "0,/^.*\baddress\b.*$/s//$VALUE/" ../../../etc/network/interfaces
