#!bin/bash
VALUE=$(cat)
echo -ne "\n"
echo "Changing Hostname to $VALUE"
echo $VALUE > ../../../etc/hostname
