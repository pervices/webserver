#!bin/bash
VALUE=$(cat)
echo -ne "\n"
//echo "Sent: " $VALUE
//i2cuart "$VALUE"
uart-app "$VALUE"
