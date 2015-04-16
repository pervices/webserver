#!/bin/bash
#PARAM=reg_name.mask.value
#example: PARAM=txa0.ffffff0f.00000030
#output: mem rw txa0 f03f

PARAM=$1
echo -ne "\n"
set -- ${PARAM//./ }
reg_name=$1
mask=$(printf "%d\n" 0x$2)
value=$(printf "%d\n" 0x$3)

oldr=$(mem rr $reg_name)
# echo "oldr " "$oldr"
set -- ${oldr//x/ }

old_reg=$(printf "%d\n" 0x$2)
clr_reg=$(printf "%d\n" $(($old_reg & $mask)))
new_reg=$(printf "%d\n" $(($clr_reg | $value)))
new_regx=$(printf "%08x\n" $new_reg)

# echo "old reg: " "$2"
# echo "param: " "$PARAM"
mem rw "$reg_name" "$new_regx"
echo "mem rw" "$reg_name" "$new_regx"