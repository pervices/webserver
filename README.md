# Developer Notes: LOCAL Development and Important Guidlines
**Date: August 23 2019** 

**LOCAL:**

When you are using the code for local development update the Socket.io to version 2.0.3
Use the command $ npm install socket.io to download latest version 
This will ensure you can traverse the different tabs while testing the code locally. 

**DO NOT push any changes appearing on node_modules in the git repo.**

## CYAN HDR WEBSITE:

**CHANNEL UPDATES: SETTING THE NUMBER OF RX OR TX CHANNELS**

Previously, the code would require each channel to have its own object and just be copy pasted. I changed
this to a loop based process in the **rx.jade and tx.jade files**. Below is the code that makes 8 TX channels as this code is in **tx.jade**.

```
each channel in ["chan_a","chan_b","chan_c","chan_d","chan_e","chan_f","chan_g","chan_h"]
        li
            a(id="#{channel}") Channel #{channel.replace("chan_","").toUpperCase()}
```

All this code does is make 8 channel tabs display. You can name them in the array list, just put the channels you want in this list in either the rx or tx jade file. The line below makes a unique 
jquery tag for each channel. These are then referenced in **cyan.js or crimson.js**, the main js file which contains all the
web elements. 

**CHANGED FOR CRIMSON,CYAN AND CYAN HDR**

An array declared in **cyan.js** will determine the order of channels. Order the channels as per the numeric convention. For a basic cyan with 16 channels:

```
//array with ordered channel names corresponding to their channel number for system control
var channels = ['tx_a','tx_e','rx_a',"rx_e","tx_b","tx_f","rx_b","rx_f","tx_c","tx_g","rx_c","rx_g","tx_d","tx_h","rx_d","rx_h"];
```

When each channel tab is clicked the corresponding file path will be as per the channel name in this array. The channel selection will see if the user is on the tx or rx 
page and read/write to the correct directories based on this.

**ONLY FOR CYAN AND CYAN HDR AS CRIMSON UNIT DOES NOT HAVE NUMBERED CHANNEL ON/OFF FUNCTIONALITY**

NOTE: If there are any issues relating to turning channels on or off. Look for the chan_en and the chan_lp/chan_hp functions and make changes accordingly. The current working process for Cyan HDR turns on both the high power and low power channels using the channel enable button. It also ensures that the high power channel can be isolated using the high power isolation button. In the chan_lp/chan-hp functions the actions that occur when you click on the tab are shown. After understanding what happens when one of these tabs is pressed, changes can be added/removed. 

## WRITING TO FILES THAT ARE NOT IN THE STATE DIRECTORY

The following code was added into **prop.js** in order to allow for commands to be sent to files that are not within the state directory. 

```
socket.on('systctl', function (data) {
   state_dir = ''; //change state directory to send commands to the channel control folder
   exec(data.message, function(err, stdout, stderr) {
      if (err) console.log("CMD error:", stdout,stderr); //throw err;
      io.sockets.emit('raw_reply', {cmd: data.message, message: stdout});
      console.log('Raw cmd: ' + data.message);
   });
});
```

Use this systctl method to write to files before the var/(crimson)(cyan)/state

**Some examples of this method being used are:**

Look up Table Generation:

```
$("#lut_enable").click(function() {
   socket.emit('systctl', { message: "rm -rf | tee /var/cyan/calibration-data/" });
   socket.emit('systctl', { message: "echo 1 | tee /var/cyan/state/{t,r}x/{a,b,c,d}/rf/freq/lut_en" });
});
```

Turning on and off the TX channels on CYAN and CYAN HDR:

```
socket.emit('systctl', { message: state ? ('rfe_control ' + chanNum + ' on | tee /usr/bin') : ('rfe_control ' + chanNum + ' off | tee /usr/bin') });
```

## GENERAL PROGRAMMING NOTES/ WEBSERVER STRUCTURE

To effectively contribute and add/remove web elements follow this structure. 

cyan.js/crimson.js -> the main file that contains all of the web element functions. This file is written in javascript and connects the server.js, prop.js and all jade files together. 

prop.js -> "properties.js" This file contains the main functions used in server.js and crimson.js/cyan.js, it outlines certain properties like writing to files, reading from files, sending commands etc. 

server.js -> the "main method file" this file calls all the other files in this webserver setup and is the "server" to run this web server, this file is executed using the command "node server.js" 

All jade files -> these are the web elements on the actual web page. These are our "html files". Jade is a template engine that converts a simpler programming style into html. There are several jade documents online and jade to html converters online that will help with editing the jade files. when adding any new elements to the webserver, the first step is to play with the jade files and experiment with the output on the browser.

There are seperate servers for three types of units: Cyan, Crimson and Cyan HDR. Based on whatever unit you are working with, use the webserver files associated with that type of unit. They are separated into three folders and labelled within the pv/webserver directory

-> Crimson - 8 Channels in Total
-> Tate - 16 Channels in Total
-> webserver-tate-HDR - 16 Channels in Total

The HDR version that is currently commited is the version with 16 TX channels and 0 RX channels. The documentation above explains how to add new channels whether they are RX or TX on any fo the units.

****************************************************************************************************************************************************














