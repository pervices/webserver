#!bin/bash
sed -n "/iface eth0 inet dhcp/p;" ../../../etc/network/interfaces | cut -c 1
