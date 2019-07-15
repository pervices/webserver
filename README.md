Developer Notes: LOCAL Developement and Important Guidlines
Date: June 14 2019 

LOCAL:

When you are using the code for local development update the Socket.io to version 2.0.3
Use the command $ npm install socket.io to download latest version 
This will ensure you can traverse the different tabs while testing the code locally. 

DO NOT push any changes appearing on node_modules in the git repo.

CHANNEL UPDATES: SETTING THE NUMBER OF RX OR TX CHANNELS

Previously, the code would require each channel to have its own object and just be copy pasted. I changed
this to a loop based process in the rx.jade and tx.jade files. Below is the code that makes 8 TX channels as this code is in tx.jade.

*******************************************************************************************
each channel in ["chan_a","chan_b","chan_c","chan_d","chan_e","chan_f","chan_g","chan_h"]
        li
            a(id="#{channel}") Channel #{channel.replace("chan_","").toUpperCase()}
*******************************************************************************************

All this code does is make 8 channel tabs display. You can name them in the array list, just put the channels you want in this list in either the rx or tx jade file. The line below makes a unique 
jquery tag for each channel. These are then referenced in cyan.js or crimson.js, the main js file which contains all the
web elements. 

An array declared in cyan.js or crimson.js will determine the order of channels. Order the channels as per the numeric convention. For a basic cyan with 16 channels:

**********************************************************************************************************************************
//array with ordered channel names corresponding to their channel number for system control
var channels = ['tx_a','tx_e','rx_a',"rx_e","tx_b","tx_f","rx_b","rx_f","tx_c","tx_g","rx_c","rx_g","tx_d","tx_h","rx_d","rx_h"];
**********************************************************************************************************************************

When each channel tab is clicked the corresponding file path will be as per the channel name in this array. The channel selection will see if the user is on the tx or rx 
page and read/write to the correct directories based on this. 






