# Configuration BeagleBone Black (BBB)
                                                                                             
                                                                                                   
                                                               
██╗ ██████╗ ████████╗███████╗ █████╗ ███╗   ███╗
██║██╔═══██╗╚══██╔══╝██╔════╝██╔══██╗████╗ ████║
██║██║   ██║   ██║   █████╗  ███████║██╔████╔██║
██║██║   ██║   ██║   ██╔══╝  ██╔══██║██║╚██╔╝██║
██║╚██████╔╝   ██║   ███████╗██║  ██║██║ ╚═╝ ██║
╚═╝ ╚═════╝    ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
                                                

###Configuration BeagleBone###

Le produit FallTracker est un package de modules permettant de detecter une chute du porteur et de transmettre via le Cloud les coordonnées des evenement.
_______________
###Getting Started###
Ce ReadMe a pour objectif de presenter les étapes pour avoir un BeagleBone Black avec une mikroBUS CAP et avec un module nRF24LO1+.
Les instructions vous permettront d'avoir une copie conforme d'un module de reception et transmission de donnée via la passerelle BeagleBone. Ce tuto est independant.

_______________
###Prerequis###
BeagleBone Black(Linux 4.4.6) avec une image Debian 8.6
VM Linux avec acces Internet
_______________

###Installing###
Voici la procédure afin d'avoir une deploiement fonctionnelle du module BeagleBone-nRF24:
Notes:


Afin de réaliser la communication entre le Beaglebone et l'Arduino, nous avons choisi une communication à base de nRF via un click nRF24l01 installé sur une platine d'extension MikroBUS.

1 - Flash du BeagleBone Black (avec image Debian fournie)
Sur une carte SD, y déposer l'image de la Debian 8.6, et l'insérer dans le Beaglebone. 
Avant de mettre le Beaglebone sous tension, maintenez le bouton reset sous pression. Mettez sous tension le BBB, tout en conservant une tension sur le bouton BOOT, jusqu'à ce que les 4 LED sois allumées en continue.
Quand cela est fait, vous pouvez retirer la carte SD et appuyer sur le bouton POWER de la Beaglebone.

2 - Nous travaillons sur une VM Ubuntu, elle doit avoir accèsà internet:

3 - Branchement du BeagleBone çà la VM. L'USB doit être reconnu pour la suite des opérations. Si non, redémarrez la VM ou le PC  si necessaire

4 - Au démarrage du Beaglebone, il va créer une interface réseau. De ce fait, nous devons trouver le nom de cette interface, la commande: dmesg | grep rndis

Pour que le beaglebone ait accès à internet créer un script.sh sur la VM Linux :
/*Création des règles pour l’acces internet du BeagleBone*/
/*eth1 correspong à l’interface du beaglebone,à adapter*/
//eth0=interface VM linux internet
iptables -A FORWARD -i eth1 -j ACCEPT //eth1 correspong à l’inte
iptables -A FORWARD -o eth1 -j ACCEPT
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE


/*Activation de l’IP forwarding*/
sysctl -w net.ipv4.ip_forward=1sysctl -p /etc/sysctl.conf



5 - Affectater l'adresse IP 192.168.7.1/30 sur l'interface trouvée
ifconfig eth1 192.168.7.1/30

6 - Connection SSH sur le BeagleBone, les identifiants sont: root, sans mot de passe: ssh -l root 192.168.7.2

7 - Modification des serveurs DNS, si besoin. 

8 - Ajout de la passerelle par défaut (192.168.7.1) :
/sbin/route add default gw 192.168.7.1
9 - Désactivation de l'HDMI ( /boot/uEnv.txt)  
Tapez la commande : cat /sys/devices/platform/bone-capegmr/slots
Si l’HDMI est activer ainsi que l’eMMc

A la dernière ligne du fichie uEnv.txt dans le dossier /boot/:

cape_disable=capemgr.disable_partno=BB-BONELT-HDMI,BB-BONELT-HDMIN,BB- BONE-EMMC-2G
10 - Création et configuration des bus SPI ( /boot/uEnv.txt)  /!\_CMD_/!\
Les bus SPI sont configurés par défaut. Leurs fichiers de configuration se trouvent dans /opt/source/bb-*/    /!\_Chemin à compléter_/!\
Nous allons utiliser le bus SPIDEV1 pour la suite.
Nous devons vérifier la configuration de ses pins. Les valeurs héxadécimales indiquées doivent correspondre avec le pinboard du Beaglebone (à trouver sur internet), vous devez noter également le mode. Vérifiez les 4 pins donnés : SCLK, D0, D1, CS0.
Les deuxièmes valeurs héxadécimales suivantes indiquent le mode choisi : Input/Output, Pull-up/Pull-down et Enable/Disable. Codé sur 8 bits :

Example pour le mode 7:
    0x27 (0100111) Fast, Input, Pull-Down, Enabled and Mux Mode 7
    0x37 (0110111) Fast, Input, Pull-Up, Enabled, Mux Mode 7
    0x07 (0000111) Fast, Output, Pull-down, Enabled, Mux Mode 7
    0x17 (0010111) Fast, Output, Pull-up, Enabled, Mux Mode 7
    0x2F (0101111) Fast, Input, Pull-down, Disabled, Mux Mode 7

Ensuite, nous activons le bus SPI:

	echo BB-SPIDEV1 > /sys/devices/platform/bone_capemgr/slots
	
	Ajout de notre bus SPI au boot du Beaglebone: il faut modifier le fichier /boot/uEnv.txt et y ajouter capemgr.enable_partno=BB-SPIDEV1
	
	Et enfin, ajout du BB-SPIDEV1 dans /etc/default/capemgr à la suite du CAPE=

11 - Vous pouvez redémarrer le BeagleBone afin de prendre en compte les modifications.

12 - Déclarer et activer chaques pins du bus SPI ainsi que le pin CE du Beaglebone, dans notre cas:
echo gpio 60 > /sys/class/gpio/export
et pour le bus SPI:
echo gpio 110 > /sys/class/gpio/export
echo gpio 111 > /sys/class/gpio/export
echo gpio 112 > /sys/class/gpio/export
echo gpio 113 > /sys/class/gpio/export

Et ensuite, configurez la direction des pins. Selon la configuration du bus SPI, disponibles dans le fichier vu précédemment d'extension .dts
Dans notre cas, nous avons deux pins à configurer en out:
/sys/class/gpio/gpio60# echo out > direction
/sys/class/gpio/gpio112# echo out > direction
/sys/class/gpio/gpio113# echo out > direction
13 - git clone du module RF24
git clone https://github.com/nRF24/RF24
14 - Repérage des PIN CE et CS sur le mikroBUS
Trouver la corespondance sur le tableau associatif:
http://www.embedded-things.com/wp-content/uploads/2013/08/P8.png
http://www.embedded-things.com/wp-content/uploads/2013/08/P9.png
Dans notre cas radio (60,10)
15 - Modification du fichier examples_kinux/gettigstarted.cpp avec les PIN
sachant que dans la structure radio

Le premier nombre correspond au numéro du gpio du CE, et le deuxième spécifie le bus SPI.

16 - Exécutez le script gettingstarted afin de tester notre configuration avant de l'avoir compiler:
./gettingstarted


                                                                                                       
