$(document).ready(function() {
    
    //Bootstrap Switches
    $("[name='en']").bootstrapSwitch({
    onText: 'ON',
    offText: 'OFF',
    size: 'mini',
    onColor: 'success'
    //offColor: 'danger'
    });

    $("[name='hi-low']").bootstrapSwitch({
    onText: 'HIGH',
    offText: 'LOW',
    size: 'mini',
    onColor: 'success'
    });

    $("[name='dither-en']").bootstrapSwitch({
    onText: 'ON',
    offText: 'OFF',
    size: 'mini',
    onColor: 'success'
    });

    $("[name='dither-mixer-en']").bootstrapSwitch({
    onText: 'ON',
    offText: 'OFF',
    size: 'mini',
    onColor: 'success'
    });
    
    $("[name='vita-en']").bootstrapSwitch({
    onText: 'ON',
    offText: 'OFF',
    size: 'mini',
    onColor: 'success'
    });

    $("[name='lut-en']").bootstrapSwitch({
    onText: 'ON',
    offText: 'OFF',
    size: 'mini',
    onColor: 'success'
    });

    $("[name='sma-dir']").bootstrapSwitch({
    onText: 'IN',
    offText: 'OUT',
    size: 'mini',
    onColor: 'success'
    });

    $("[name='sma-mode']").bootstrapSwitch({
    onText: 'EDGE',
    offText: 'LEVEL',
    size: 'mini',
    onColor: 'success'
    });

    $("[name='sma-pol']").bootstrapSwitch({
    onText: '+VE',
    offText: '-VE',
    size: 'mini',
    onColor: 'success'
    });

    $("[name='trig-sel-sma']").bootstrapSwitch({
    onText: 'ON',
    offText: 'OFF',
    size: 'mini',
    onColor: 'success'
    });
   
});

//Socket.io connection
var socket = io.connect();

//Current Channel and Board/Page Initialization
var cur_path = 'a';
var cur_chan = 'a';
var cur_board = 'tx';
var cur_root = 'tx_a';
var pathname = window.location.pathname;

//Array with ordered channel names corresponding to their channel number for system control
var channels = ['tx_a','tx_e','tx_i',"tx_m","tx_b","tx_f","tx_j","tx_n","tx_c","tx_g","tx_k","tx_o","tx_d","tx_h","tx_l","tx_p"];

//Variables to hold the value of the low and high power channels
var channelSelector = 0;

//Switch channel views
//This function will load the current states of the channel onto the page
$("#chan_a,#chan_b,#chan_c,#chan_d,#chan_e,#chan_f,#chan_g,#chan_h").click(function() {
   
    /////////////////////////////////////////****USER INTERFACE ACTIONS****///////////////////////////////////////
    $("#chan_en").bootstrapSwitch('readonly', true);                                                            //
    $(this).parent().parent().children().removeClass('active');                                                 //
    $(this).parent().attr('class', 'active');                                                                   //
                                                                                                                //
    //alert the user to select either hdr,low power or high power to operate on                                 //
    document.getElementById("chan_alert").style.visibility = "visible";                                         //
    document.getElementById("chan_alert2").style.visibility = "visible";                                        //
                                                                                                                //
    //deactivate the hdr channel                                                                                //
    $("#chan_hdr").parent().attr('class','inactive');                                                           //
    disableHdrElements(true);                                                                                   //
    document.getElementById("hdr_img").style.opacity = 0.2;                                                     //
                                                                                                                //
    //diable lp and hp elements                                                                                 //
    $("#chan_lp").parent().attr('class','inactive');                                                            //
    $("#chan_hp").parent().attr('class','inactive');                                                            //
    disableElements(true);                                                                                      //
    document.getElementById("tx_chain").style.opacity = 0.2;                                                    //
    document.getElementById("tx_dsp_chain").style.opacity = 0.2;                                                //
                                                                                                                //
    //disable board and trigger elements                                                                        //
    disableBoardTriggElements(true);                                                                            //
                                                                                                                //
    // update the channel path                                                                                  //
    cur_path = $(this).attr('id').replace('chan_','');                                                          //
    //                                                                                                          //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //look through all of the possible channel locations with their corresponding roots 
    if (cur_path == 'a') {
         cur_root = 'tx_a';
         cur_chan = 'a';
         hdr_chan = 'a';
    } else if (cur_path == 'b') {
         cur_root = 'tx_c';
         cur_chan = 'c';
         hdr_chan = 'b';
    } else if (cur_path == 'c') {
         cur_root = 'tx_e';
         cur_chan = 'e';
         hdr_chan = 'c';
    } else if (cur_path == 'd') {
         cur_root = 'tx_g';
         cur_chan = 'g';
         hdr_chan = 'd';
    } else if (cur_path == 'e') {
         cur_root = 'tx_i';
         cur_chan = 'i';
         hdr_chan = 'e';
    } else if (cur_path == 'f') {
         cur_root = 'tx_k';
         cur_chan = 'k';
         hdr_chan = 'f';
    } else if (cur_path == 'g') {
         cur_root = 'tx_m';
         cur_chan = 'm';
         hdr_chan = 'g';
    } else if (cur_path == 'h') {
         cur_root = 'tx_o';
         cur_chan = 'o';
         hdr_chan = 'h';
    }
    
});

//Low Power Channel 
$("#chan_lp").click(function() {
    
    /////////////////////////////////////////****USER INTERFACE ACTIONS****///////////////////////////////////////
                                                                                                                //
    ////high power isolation is on which disables the low power functionality                                     //
    //if ($('#hdr_iso').bootstrapSwitch('state')) {                                                               //
    //     disableElements(true);                                                                                 //
    //}                                                                                                           //
    //else {                                                                                                      //
    //                                                                                                            //
         $("#chan_en").bootstrapSwitch('readonly', false);                                                      //
         //deactivate the hdr channel                                                                           //
         $("#chan_hdr").parent().attr('class','inactive');                                                      //
         disableHdrElements(true);                                                                              //
         document.getElementById("hdr_img").style.opacity = 0.2;                                                //
                                                                                                                //
         //hide the alert to choose a channel                                                                   //
         document.getElementById("chan_alert2").style.visibility = "hidden";                                    //
         document.getElementById("chan_alert").style.visibility = "visible";                                    //
                                                                                                                //
         $(this).parent().parent().children().removeClass('active');                                            //
         $(this).parent().attr('class', 'active');                                                              //
                                                                                                                //
         //enable lp elements                                                                                   //
         disableElements(false);                                                                                //
         document.getElementById("tx_chain").style.opacity = 1;                                                 //
         document.getElementById("tx_dsp_chain").style.opacity = 1;                                             //
                                                                                                                //
         //enable board and trigger elements                                                                    //
         disableBoardTriggElements(false);                                                                      //
         disableHdrElements(true);                                                                              //
         //                                                                                                     //
         /////////////////////////////////////////////////////////////////////////////////////////////////////////
         
         //look through all of the possible channel locations with their corresponding roots 
         if (cur_path == 'a') {
                 cur_root = 'tx_a';
                 cur_chan = 'a';
         } else if (cur_path == 'b') {
                 cur_root = 'tx_c';
                 cur_chan = 'c';
         } else if (cur_path == 'c') {
                 cur_root = 'tx_e';
                 cur_chan = 'e';
         } else if (cur_path == 'd') {
                 cur_root = 'tx_g';
                 cur_chan = 'g';
         } else if (cur_path == 'e') {
                 cur_root = 'tx_i';
                 cur_chan = 'i';
         } else if (cur_path == 'f') {
                 cur_root = 'tx_k';
                 cur_chan = 'k';
         } else if (cur_path == 'g') {
                 cur_root = 'tx_m';
                 cur_chan = 'm';
         } else if (cur_path == 'h') {
                 cur_root = 'tx_o';
                 cur_chan = 'o';
         }
         
         load_tx();
    //}
    
});

//High Power Channel
$("#chan_hp").click(function() {
    
    /////////////////////////////////////////****USER INTERFACE ACTIONS****///////////////////////////////////////////
                                                                                                                    //
    //high power isolation is on which disables the low power functionality                                         //
    if (!$('#hdr_iso').bootstrapSwitch('state')) {                                                                  //
         disableElements(true);                                                                                     //
    }                                                                                                               //
    //                                                                                                              //
    else {                                                                                                          //
                                                                                                                    //
                                                                                                                    //
        $("#chan_en").bootstrapSwitch('readonly', false);                                                           //
        //deactivate the hdr channel                                                                                //
        $("#chan_hdr").parent().attr('class','inactive');                                                           //
        disableHdrElements(true);                                                                                   //
        document.getElementById("hdr_img").style.opacity = 0.2;                                                     //
                                                                                                                    //
        //enable hp elements                                                                                        //
        disableElements(false);                                                                                     //
        document.getElementById("tx_chain").style.opacity = 1;                                                      //
        document.getElementById("tx_dsp_chain").style.opacity = 1;                                                  //
                                                                                                                    //
        //hide the alert to choose a channel                                                                        //
        document.getElementById("chan_alert2").style.visibility = "hidden";                                         //
        document.getElementById("chan_alert").style.visibility = "visible";                                         //
                                                                                                                    //
        $(this).parent().parent().children().removeClass('active');                                                 //
        $(this).parent().attr('class', 'active');                                                                   //
                                                                                                                    //
        //enable board and trigger elements                                                                         //
        disableBoardTriggElements(false);                                                                           //
        disableHdrElements(true);                                                                                   //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        //Look through all of the possible channel locations with their corresponding roots 
        if (cur_path == 'a') {
            cur_root = 'tx_b';
            cur_chan = 'b';
        } else if (cur_path == 'b') {
            cur_root = 'tx_d';
            cur_chan = 'd';
        } else if (cur_path == 'c') {
            cur_root = 'tx_f';
            cur_chan = 'f';
        } else if (cur_path == 'd') {
            cur_root = 'tx_h';
            cur_chan = 'h';
        } else if (cur_path == 'e') {
            cur_root = 'tx_j';
            cur_chan = 'j';
        } else if (cur_path == 'f') {
            cur_root = 'tx_l';
            cur_chan = 'l';
        } else if (cur_path == 'g') {
            cur_root = 'tx_n';
            cur_chan = 'n';
        } else if (cur_path == 'h') {
            cur_root = 'tx_p';
            cur_chan = 'p';
        }
    
        load_tx();
    }
});

 //HDR (High Dynamic Range) Channel 
$("#chan_hdr").click(function() {
   
    /////////////////////////////////////////****USER INTERFACE ACTIONS****/////////////////////////////////////// 
    $("#chan_en").bootstrapSwitch('readonly', false);                                                           //
    $("#chan_lp").parent().attr('class','inactive');                                                            //
    $("#chan_hp").parent().attr('class','inactive');                                                            //
                                                                                                                //
    //enable the hdr elements                                                                                   //
    disableHdrElements(false);                                                                                  //
    document.getElementById("hdr_img").style.opacity = 1;                                                       //
                                                                                                                //
    //disable lp and hp channel elements                                                                        //
    disableElements(true);                                                                                      //
    document.getElementById("tx_chain").style.opacity = 0.2;                                                    //
    document.getElementById("tx_dsp_chain").style.opacity = 0.2;                                                //
                                                                                                                //
    document.getElementById("chan_alert").style.visibility = "hidden";                                          //
    document.getElementById("chan_alert2").style.visibility = "visible";                                        //
    $(this).parent().parent().children().removeClass('active');                                                 //
    $(this).parent().attr('class', 'active');                                                                   //
                                                                                                                //
    //enable board and trigger elements                                                                         //
    disableBoardTriggElements(false);                                                                           //
                                                                                                                //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //Update root and channel properties 
    cur_root = 'tx_' + cur_path;
    cur_chan = hdr_chan;
    
});

//Switches for the HDR channel
$("#sw_ovr").on('switchChange.bootstrapSwitch', function(event, state) {
    socket.emit('prop_wr', {file: 'gpio/hdr/override_en', message: state ? 'true' : 'false' });
});

$("#hdr_pwr").on('switchChange.bootstrapSwitch', function(event, state) {
    socket.emit('prop_wr', {file: 'gpio/hdr/' + hdr_chan + '/pwr_en', message: state ? 'true' : 'false' });
});

//high power enable
$("#hdr_iso").on('switchChange.bootstrapSwitch', function(event, state) {
    
    if (cur_path == 'a') {
            cur_root = 'tx_b';
            cur_chan = 'b';
    } else if (cur_path == 'b') {
        cur_root = 'tx_d';
        cur_chan = 'd';
    } else if (cur_path == 'c') {
        cur_root = 'tx_f';
        cur_chan = 'f';
    } else if (cur_path == 'd') {
        cur_root = 'tx_h';
        cur_chan = 'h';
    } else if (cur_path == 'e') {
        cur_root = 'tx_j';
        cur_chan = 'j';
    } else if (cur_path == 'f') {
        cur_root = 'tx_l';
        cur_chan = 'l';
    } else if (cur_path == 'g') {
        cur_root = 'tx_n';
        cur_chan = 'n';
    } else if (cur_path == 'h') {
        cur_root = 'tx_p';
        cur_chan = 'p';
    }

    //Turns on/off the channel based on root
    for (var i = 0; i<channels.length; i++) {
            if (channels[i] == cur_root)
                channelSelector = i;
    }
    //DEBUG ONLY
    //socket.emit('prop_wr', {file:  '/pwr', message: state ? ('rfe_control ' + channelSelector + ' on | tee /usr/bin') : ('rfe_control ' + channelSelector + ' off | tee /usr/bin') });
    socket.emit('prop_wr', {file: 'gpio/hdr/' + hdr_chan + '/high_pwr_en', message: state ? 'true' : 'false' });
    socket.emit('systctl', { message: state ? ('rfe_control ' + (channelSelector) + ' on | tee /usr/bin') : ('rfe_control ' + (channelSelector) + ' off | tee /usr/bin') });
   
});

//Enable and disable channels
$("#chan_en").on('switchChange.bootstrapSwitch', function(event, state) {
   
    //Initializes the channel at the low power stage
    if (cur_chan == hdr_chan) {
     
        if (cur_path == 'a') {
                cur_root = 'tx_a';
                cur_chan = 'a';
        } else if (cur_path == 'b') {
                cur_root = 'tx_c';
                cur_chan = 'c';
        } else if (cur_path == 'c') {
                cur_root = 'tx_e';
                cur_chan = 'e';
        } else if (cur_path == 'd') {
                cur_root = 'tx_g';
                cur_chan = 'g';
        } else if (cur_path == 'e') {
                cur_root = 'tx_i';
                cur_chan = 'i';
        } else if (cur_path == 'f') {
                cur_root = 'tx_k';
                cur_chan = 'k';
        } else if (cur_path == 'g') {
                cur_root = 'tx_m';
                cur_chan = 'm';
        } else if (cur_path == 'h') {
                cur_root = 'tx_o';
                cur_chan = 'o';
        }
        
    }
    
    //Turns on/off the channel based on root
    for (var i = 0; i<channels.length; i++) {
            if (channels[i] == cur_root)
                channelSelector = i;
    }
    //DEBUG ONLY
    //socket.emit('prop_wr', {file:  '/pwr', message: state ? ('rfe_control ' + channelSelector + ' on | tee /usr/bin') : ('rfe_control ' + channelSelector + ' off | tee /usr/bin') });
    socket.emit('prop_wr', {file: 'gpio/hdr/' + hdr_chan + '/pwr_en', message: state ? 'true' : 'false' });
    socket.emit('systctl', { message: state ? ('rfe_control ' + (channelSelector) + ' on | tee /usr/bin') : ('rfe_control ' + (channelSelector) + ' off | tee /usr/bin') });
    
    if ($('#hdr_iso').bootstrapSwitch('state')) {
        socket.emit('prop_wr', {file: 'gpio/hdr/' + hdr_chan + '/high_pwr_en', message: state ? 'true' : 'false' });
        socket.emit('systctl', { message: state ? ('rfe_control ' + (channelSelector+4) + ' on | tee /usr/bin') : ('rfe_control ' + (channelSelector+4) + ' off | tee /usr/bin') });
    }
    
    //Old code from Crimson that intiializes the tx board and activates its controls
    var is_rx = cur_root.indexOf('rx') > -1;
    if (is_rx) {
       socket.emit('prop_wr', { file: cur_root + '/stream', message: state ? '1' : '0' });
    }
    
    // if turn on, overwrite with the current settings
    if (state) {
       $("#loadingModal").modal('show');
       setTimeout(function() {         
          if (is_rx) {
             write_rx();
             activateControls_rx(true);
          } else {
             write_tx();
             activateControls_tx(true);
          }
          $("#loadingModal").modal('hide');
       }, 500);
    } 
    else {
       if (is_rx)  activateControls_rx(false);
       else        activateControls_tx(false);
    }
    
});

// En/disable DHCP
$("#dhcp_en").on('switchChange.bootstrapSwitch', function(event, state) {
   socket.emit('prop_wr', { file: 'fpga/link/net/dhcp_en', message: state ? '1' : '0' });
   $("#mgmt_ip").prop('disabled', state);
});

// led
$("#led").click(function() {
    socket.emit('prop_wr', { file: cur_root + '/board/led', message: '5' });
});

// Reset buttons
$("#reset_fpga").click(function() {
   socket.emit('prop_wr', { file: 'fpga/board/restreq', message: '1' });
});

// Send uart command
$("#send_uart_cmd").click(function() {
   var cmd = $("#uart_cmd").val();
   if (cmd) {
      socket.emit('raw_cmd', { message: "echo '" + cmd + "' | mcu" });
   }
});

// pressing enter on uart command redirects a click
$("#uart_cmd").keypress(function(event) {
   if (event.keyCode == 13)
      $("#send_uart_cmd").click();
});

// jesd sync
$("#jesdsync").click( function() {
   socket.emit('prop_wr', { file: 'fpga/board/jesd_sync', message: '1' });
});

// board version
$("#version").click( function() {
   if (cur_board == 'time')
      socket.emit('raw_cmd', { message: "echo 'board -v' | m -f s" });
   else if (cur_board == 'fpga')
      socket.emit('raw_cmd', { message: "echo 'board -v' | mcu" });
   else if (cur_board == 'tx')
      socket.emit('raw_cmd', { message: "echo 'board -v' | mcu -f t" });
   else if (cur_board == 'rx')
      socket.emit('raw_cmd', { message: "echo 'board -v' | mcu -f r" });
});

// board temperature
$("#temperature").click(function() {
   if (cur_board == 'time')
      socket.emit('raw_cmd', { message: "echo 'board -t' | mcu -f s" });
   else if (cur_board == 'fpga')
      socket.emit('raw_cmd', { message: "echo 'board -t' | mcu" });
   else if (cur_board == 'tx')
      socket.emit('raw_cmd', { message: "echo 'board -c 15 -t' | mcu -f t" });
   else if (cur_board == 'rx')
      socket.emit('raw_cmd', { message: "echo 'board -c 15 -u' | mcu -f r" });
});

// board Diagnostic
$("#diagnostic").click(function() {
   if (cur_board == 'time')
      socket.emit('raw_cmd', { message: "echo 'board -e' | mcu -f s" });
   else if (cur_board == 'fpga')
      socket.emit('raw_cmd', { message: "echo 'board -e' | mcu" });
   else if (cur_board == 'tx')
      socket.emit('raw_cmd', { message: "echo 'board -e' | mcu -f t" });
   else if (cur_board == 'rx')
      socket.emit('raw_cmd', { message: "echo 'board -e' | mcu -f r" });
});

// system reset
$("#reset_system").click(function() {
   socket.emit('prop_wr', { file: 'fpga/board/sys_rstreq', message: '1' });
});

// board channel features
$("#chan_init,#chan_demo,#chan_mute,#chan_reset").click(function() {
   $("#adminModal").modal('show');
});

// board test routines
$("[id$=_test]").click( function() {
   $("#adminModal").modal('show');
});

// board dump routines
$("#hmc_dump").click(function() {
   socket.emit('raw_cmd', { message: "echo 'dump -f' | mcu -f s" });
});

$("#lmk_dump").click(function() {
   socket.emit('raw_cmd', { message: "echo 'dump -c' | mcu -f s" });
});

$("#dac_dump").click(function() {
   socket.emit('raw_cmd', { message: "echo 'dump -c " + cur_chan + " -d' | mcu -f t" });
});

//////////////////////////////////REMOVED FOR TATE AND TATE HDR VERSION///////////////////////////////////////////
//                                                                                                              //
//$("#dac_dither_enable").on('switchChange.bootstrapSwitch', function(event, state) {                           //
//   socket.emit('prop_wr', { file: cur_root + '/rf/dac/dither_en', message: ( state ? '1' : '0' ) });          //
//   $('#dac_dither_mixer_enable').bootstrapSwitch('readonly', !state);                                         //
//   $("#dac_dither_amplitude_select").prop('disabled', !state);                                                //
//   socket.emit('prop_rd', { file: cur_root + '/rf/dac/dither_sra_sel', debug: true });                        //
//});                                                                                                           //
//$("#dac_dither_mixer_enable").on('switchChange.bootstrapSwitch', function(event, state) {                     //
//   socket.emit('prop_wr', { file: cur_root + '/rf/dac/dither_mixer_en', message: ( state ? '1' : '0' ) });    //
//});                                                                                                           //
//                                                                                                              //
//$("#dac_dither_amplitude_select").change(function() {                                                         //
//   $("#dac_dither_amplitude_display").text('+' + ($(this).val()) + ' dB');                                    //
//   socket.emit('prop_wr', { file: cur_root + '/rf/dac/dither_sra_sel', message: $(this).val() });             //
//});                                                                                                           //
//                                                                                                              //
//$("#gpiox_dump").click(function() {                                                                           //
//   if (cur_board == 'tx')                                                                                     //
//      socket.emit('raw_cmd', { message: "echo 'dump -c " + cur_chan + " -g' | mcu -f t" });                   //
//   else if (cur_board == 'rx')                                                                                //
//      socket.emit('raw_cmd', { message: "echo 'dump -c " + cur_chan + " -g' | mcu -f r" });                   //
//});                                                                                                           //
//                                                                                                              //
//// i-bias                                                                                                     //
//$("#ibias_range").change(function(){                                                                          //
//   $("#ibias_display").text('I: ' + $(this).val() + ' mV');                                                   //
//   socket.emit('prop_wr', { file: cur_root + '/rf/freq/i_bias', message: ($(this).val()/100) });              //
//});                                                                                                           //
//                                                                                                              //
//// q-bias                                                                                                     //
//$("#qbias_range").change(function(){                                                                          //
//   $("#qbias_display").text('Q: ' + $(this).val() + ' mV');                                                   //
//   socket.emit('prop_wr', { file: cur_root + '/rf/freq/q_bias', message: ($(this).val()/100) });              //
//});                                                                                                           //
//                                                                                                              //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$("#vita_enable").on('switchChange.bootstrapSwitch', function(event, state) {
   socket.emit('prop_wr', { file: cur_root + '/link/vita_en', message: ( state ? '1' : '0' ) });
});

$("#lut_enable").click(function() {
   socket.emit('systctl', { message: "rm -rf | tee /var/cyan/calibration-data/" });
   socket.emit('systctl', { message: "echo 1 | tee /var/cyan/state/{t,r}x/{a,b,c,d}/rf/freq/lut_en" });
});

$("#lut_switch").on('switchChange.bootstrapSwitch', function(event, state) {
   socket.emit('prop_wr', { file: cur_root + '/rf/freq/lut_en', message: ( state ? '1' : '0' ) }); //regenerate files through enabling LUT
});

$("#adc_dump").click(function() {
   socket.emit('raw_cmd', { message: "echo 'dump -c " + cur_chan + " -a' | mcu -f r" });
});

$("#adrf_dump").click(function() {
   socket.emit('raw_cmd', { message: "echo 'dump -c " + cur_chan + " -v' | mcu -f r" });
});

// program board
$("#program_start").click(function() {
   var option = $( "#program_board option:selected" ).val();
   //console.log( $('#program_hexfile').prop('files')[0]);
   //socket.emit('hexfile', { board: option, buf: $('#program_hexfile').prop('files')[0] });
});

// gain
$("#gain_range").change(function() {
   $("#gain_display").text('+' + ($(this).val() / 4) + ' dB');
   socket.emit('prop_wr', { file: cur_root + '/rf/gain/val', message: $(this).val() });
});

// atten
$("#atten_range").change(function() {
   $("#atten_display").text('-' + ($(this).val() / 4) + ' dB');
   socket.emit('prop_wr', { file: cur_root + '/rf/atten/val', message: $(this).val() });
});

// hdr atten
$("#hdr_atten_range").change(function() {
    
    //display the selected numerical value
    $("#hdr_atten_display").text('-' + ($(this).val()) + ' dB');
    
    //assign variable for attenuation value
    var value = $(this).val();
    
    ////////////////////////////////////////////////////////DEBUG///////////////////////////////////////////////////////////
    //The line below will output the input value for verification, chande message: to different variables for debugging   //
    //socket.emit('prop_wr', { file: 'gpio/hdr/' + hdr_chan + '/rf/atten/val', message: $(this).val() });                 //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //variables for determining binary value and variable for binary column holder
    var calculatedVal = 0;
    var multiplier = 64;
    
    //array with each of the 7 bits in the order of writing 
    var hdrAtten = ['atten64','atten32','atten16','atten8','atten4','atten2','atten1'];
    
    //loop through to determine '1' or '0' for each bit (7 bits)
    for( var x = 0; x <7; x++) {
        //if the entered attenuation is equal to the multiplier then the bit will be assigned 1
        if (value == multiplier) {
            
           socket.emit('prop_wr', { file: 'gpio/hdr/' + hdr_chan + '/' + hdrAtten[x], message: '1' });
           calculatedVal = 0; 
           value = 0;
           
        }
        
        //if the entered value does not equal the multiplier check the following conditions
        else if (value != multiplier) {
           
           //determine if the value fits within the multiplier  
           calculatedVal = value - multiplier;
    
           //if the calculated value equals the multiplier then assign a '1'
           if (calculatedVal == multiplier) {
                   socket.emit('prop_wr', { file: 'gpio/hdr/' + hdr_chan + '/' + hdrAtten[x], message: '1' });
                   value = 0;
           }
           
           //if the calculated value is greater than 0 then it fits within this multiplier and there is a remainder
           else if(calculatedVal > 0) {
                   socket.emit('prop_wr', { file: 'gpio/hdr/' + hdr_chan + '/' + hdrAtten[x], message: '1' });
                   value = calculatedVal;
           }
           
           //if the calculated value is less than 0 then it does not fit this multiplier and a 0 is assigned
           else if (calculatedVal <0) {
                   socket.emit('prop_wr', { file: 'gpio/hdr/' + hdr_chan + '/' + hdrAtten[x], message: '0' });
                   calculatedVal = value;
           }
           
        }//end else if
        
        //decrement the multiplier by a factor of 2
        multiplier = multiplier / 2;
        
    }//end loop
   
});

// sample rate
$("#sr_set").click(function(){
   socket.emit('prop_wr', { file: cur_root + '/dsp/rate', message: $("#sr").val()});

   // read the actual values for the sample rate
   setTimeout(function() {
      socket.emit('raw_cmd', { message: "mem rr " + cur_board + cur_chan + "1" });
      socket.emit('raw_cmd', { message: "mem rr " + cur_board + cur_chan + "4" });
   }, 500);
});

// rf band
$("#rf_band").on('switchChange.bootstrapSwitch', function(event, state) {
   socket.emit('prop_wr', { file: cur_root + '/rf/freq/band', message: state ? '1' : '0' });
   if ( state ) {
	   // if RX, enable DSA slider
	   if (pathname.indexOf('rx') > -1) {
		   $("#atten_range").prop('disabled', !state);
		   $('#pa_en').bootstrapSwitch('readonly', !state);
		   
		   // Force Attenuation Setting to MAX
		   $("#atten_range").val(127);
		   $("#atten_range").change();
		   
	   } else if (pathname.indexOf('tx') > -1) {
		   // Force Gain Setting to MIN
		   $("#gain_range").val(0);
		   $("#gain_range").change();
	   }
	   
	   $("#synth_freq").prop('disabled', !state);
	   $("#synth_freq_set").prop('disabled', !state);
	   
      setTimeout(function(){ $("#synth_freq_set").click(); }, 900);
   } else {
	   // if RX, disable DSA slider
	   if (pathname.indexOf('rx') > -1) {
		   $("#atten_range").prop('disabled', !state);
		   $('#pa_en').bootstrapSwitch('readonly', !state);
		   
		   // Force Attenuation Setting to MAX
		   $("#atten_range").val(127);
		   $("#atten_range").change();
		   
	   } else if (pathname.indexOf('tx') > -1) {
		   // Force Gain Setting to MIN
		   $("#gain_range").val(0);
		   $("#gain_range").change();
	   }
	   
	   $("#synth_freq").prop('disabled', !state);
	   $("#synth_freq_set").prop('disabled', !state);
   }
});

// pa bypass
$("#pa_en").on('switchChange.bootstrapSwitch', function(event, state) {
   socket.emit('prop_wr', { file: cur_root + '/rf/freq/lna', message: state ? '0' : '1' });
});

// dsp signed data
$("#signed").on('switchChange.bootstrapSwitch', function(event, state) {
   socket.emit('prop_wr', { file: cur_root + '/dsp/signed', message: state ? '1' : '0' });
});

// reference clock
$("#ext_ref").on('switchChange.bootstrapSwitch', function(event, state) {
   socket.emit('prop_wr', { file: cur_root + '/source/ref', message: state ? 'external' : 'internal' });
});

// Enable DevClock Output
$("#out_devclk_en").on('switchChange.bootstrapSwitch', function(event, state) {
   socket.emit('prop_wr', { file: cur_root + '/source/devclk', message: state ? 'external' : 'internal' });
});

// Enable PLL Output
$("#out_pll_en").on('switchChange.bootstrapSwitch', function(event, state) {
   socket.emit('prop_wr', { file: cur_root + '/source/pll', message: state ? 'external' : 'internal' });
});

// Enable SysRef Output
$("#out_sysref_en").on('switchChange.bootstrapSwitch', function(event, state) {
   socket.emit('prop_wr', { file: cur_root + '/source/sync', message: state ? 'external' : 'internal' });
});

// Enable VCO Output
$("#out_vco_en").on('switchChange.bootstrapSwitch', function(event, state) {
   socket.emit('prop_wr', { file: cur_root + '/source/vco', message: state ? 'external' : 'internal' });
});

// frequency of synthesizer
$("#synth_freq_set").click( function() {
	var reqfreq = $("#synth_freq").val();
   if (!reqfreq) return;
   
   // Frequency Setting less than 53MHz is considered invalid 
   if ((reqfreq < 53000000) && (reqfreq > 0)) {		// Setting to 0 is a valid command to mute PLL
	   $("#synth_error_display").show();
   } else {
	   $("#synth_error_display").hide();
   }
   
   socket.emit('prop_wr', { file: cur_root + '/rf/freq/val', message: $("#synth_freq").val() });
   setTimeout( function() {
      socket.emit('prop_rd', { file: cur_root + '/rf/freq/val', debug: true});
   }, 1000);
});

// phase increment
$("#dsp_nco_set").click( function() {
   if (!$("#dsp_nco").val()) return;
   socket.emit('prop_wr', { file: cur_root + '/dsp/nco_adj', message: $("#dsp_nco").val() });
   setTimeout( function() {
	   socket.emit('prop_rd', { file: cur_root + '/dsp/nco_adj', debug: true });
   }, 1000);
});

// dsp reset
$("#dsp_reset").click( function() {
   socket.emit('prop_wr', { file: cur_root + '/dsp/rstreq', message: '1' });
});

// loopback
$("#loopback").on('switchChange.bootstrapSwitch', function(event, state) {
   socket.emit('prop_wr', { file: cur_root + '/dsp/loopback', message: state ? '1' : '0' });
});

// link settings
$("#link_set").click( function() {
   socket.emit('prop_wr', { file: cur_root + '/link/port',     message: $("#port").val() });
   if (cur_board == 'rx') {
      socket.emit('prop_wr', { file: cur_root + '/link/ip_dest',  message: $("#ip").val() });
      socket.emit('prop_wr', { file: cur_root + '/link/mac_dest', message: $("#mac").val() });
   }
});

// sfp settings
$("#sfpa_set").click( function() {
   socket.emit('prop_wr', { file: 'fpga/link/sfpa/ip_addr', message: $("#sfpa_ip").val() });
   socket.emit('prop_wr', { file: 'fpga/link/sfpa/mac_addr', message: $("#sfpa_mac").val() });
   socket.emit('prop_wr', { file: 'fpga/link/sfpa/pay_len', message: $("#sfpa_paylen").val() });
});

$("#sfpb_set").click( function() {
   socket.emit('prop_wr', { file: 'fpga/link/sfpb/ip_addr', message: $("#sfpb_ip").val() });
   socket.emit('prop_wr', { file: 'fpga/link/sfpb/mac_addr', message: $("#sfpb_mac").val() });
   socket.emit('prop_wr', { file: 'fpga/link/sfpb/pay_len', message: $("#sfpb_paylen").val() });
});

//go to the load clock function
$("#refreshClock").click( function() {
    load_clock(true);
});

$("#mgmt_set").click( function() {
   socket.emit('prop_wr', { file: 'fpga/link/net/hostname', message: $("#hostname").val() });
   //if (!$('#dhcp_en').bootstrapSwitch('state'))
   socket.emit('prop_wr', { file: 'fpga/link/net/ip_addr', message: $("#mgmt_ip").val() });
});

// dac nco
$("#dac_nco_set").click( function() {
   if (!$("#dac_nco").val()) return;
   socket.emit('prop_wr', { file: cur_root + '/rf/dac/nco', message: $("#dac_nco").val() });
   setTimeout( function() {
	   socket.emit('prop_rd', { file: cur_root + '/rf/dac/nco', debug: true });
   }, 1000);
});

// hexfile
$("#program_hexfile").change( function() {
   if( $("#program_hexfile").val())
      $("#program_start").removeClass('disabled');
});

$("#edge_backoff").click(function() {
   var val = $("#edge_backoff").val();
   if (val) {
         val = parseInt( val );
         val = val < 0 ? -val : val;
      socket.emit('prop_wr', { file: cur_root + '/trigger/edge_backoff', message: val });
   }
});

$("#edge_samples").click(function() {
   var val = $("#edge_samples").val();
   if (val) {
         val = parseInt( val );
         val = val < 0 ? -val : val;
      socket.emit('prop_wr', { file: cur_root + '/trigger/edge_sample_num', message: val });
   }
});

$("#sma_dir").on('switchChange.bootstrapSwitch', function(event, state) {
   socket.emit('prop_wr', { file: 'fpga/trigger/sma_dir', message: state ? 'in' : 'out' });
});
$("#sma_pol").on('switchChange.bootstrapSwitch', function(event, state) {
   socket.emit('prop_wr', { file: 'fpga/trigger/sma_pol', message: state ? 'positive' : 'negative' });
});
$("#sma_mode").on('switchChange.bootstrapSwitch', function(event, state) {
   socket.emit('prop_wr', { file: cur_root + '/trigger/sma_mode', message: state ? 'edge' : 'level' });
});

$("#trig_sel_sma").on('switchChange.bootstrapSwitch', function(event, state) {
   var trig_sel_sma = ( state ? 1 : 0 ) << 0;
   var trig_sel = trig_sel_sma;
   socket.emit('prop_wr', { file: cur_root + '/trigger/trig_sel', message: '' + trig_sel });
});

/////////////////////////////////////////////////////////////////////
// Pressing ENTER on Textboxes activates their button press events //
/////////////////////////////////////////////////////////////////////

$("#synth_freq").keyup(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#synth_freq_set").click();
	}
});

$("#dac_nco").keyup(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#dac_nco_set").click();
	}
});

$("#dsp_nco").keyup(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#dsp_nco_set").click();
	}
});

$("#sr").keyup(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#sr_set").click();
	}
});

$("#ip").keyup(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#link_set").click();
	}
});

$("#mac").keyup(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#link_set").click();
	}
});

$("#port").keyup(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#link_set").click();
	}
});

$("#hostname").keyup(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#mgmt_set").click();
	}
});

$("#mgmt_ip").keyup(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#mgmt_set").click();
	}
});

$("#sfpa_ip").keyup(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#sfpa_set").click();
	}
});

$("#sfpa_mac").keyup(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#sfpa_set").click();
	}
});

$("#sfpa_paylen").keyup(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#sfpa_set").click();
	}
});

$("#sfpb_ip").keyup(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#sfpb_set").click();
	}
});

$("#sfpb_mac").keyup(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#sfpb_set").click();
	}
});

$("#sfpb_paylen").keyup(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#sfpb_set").click();
	}
});

$("#uart_cmd").keyup(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		$("#send_uart_cmd").click();
	}
});

$("#edge_backoff").keyup(function(e) {
       if (e.keyCode == 13) {
               e.preventDefault();
               $("#edge_backoff").click();
       }
});

$("#edge_samples").keyup(function(e) {
       if (e.keyCode == 13) {
               e.preventDefault();
               $("#edge_samples").click();
       }
});


// receive console from server
socket.on('raw_reply', function (data) {
   // if reading back the sample rate
   if (data.cmd == ("mem rr " + cur_board + cur_chan + "1")) {
      var val = parseInt(data.message) + 1;
      $("#sr_div_display").text("1/" + val);
      if ($("#sr_resamp_display").text() != "") {
	  $("#sr_display").text((325000000 * 4 / 5 / val));
      } else {
	$("#sr_display").text((325000000 / val));
      }
      return;
   }

   if (data.cmd == ("mem rr " + cur_board + cur_chan + "4")) {
       var val = parseInt(data.message.substring(0, data.message.length-1));
       var div = $("#sr_div_display").text();
       div = div.substring(2, div.length);
       if (val >= 0x8000) {
	   $("#sr_resamp_display").text("4/5 * ");
	   $("#sr_display").text((325000000 * 4 / 5 / parseInt(div)));
       } else {
	   $("#sr_resamp_display").text("");
	   $("#sr_display").text((325000000 / parseInt(div)));
       }
       return;
   }

   //console.log("Raw reply: " + data.message);
   if ($("#chist")) {
      $("#chist").val( $("#chist").val() + data.cmd + "\n");
      $("#chist").change();
   }

   if ($("#cout")) {
      if (data.message[data.message.length-2] == '>')
         $("#cout" ).val( $("#cout" ).val() + "\n" + data.message.substring(0, data.message.length-3));
      else
         $("#cout" ).val( $("#cout" ).val() + "\n" + data.message.substring(0, data.message.length-1));
      $("#cout").change();
   }
});

// auto scroll-bar
$('#cout,#chist').change(function() {
   $(this).scrollTop($(this)[0].scrollHeight);
});

// receive debug msg from server
socket.on('prop_wr_ret', function (data) {
   //console.log(data.message);
   $("#cout" ).val( $("#cout" ).val() + "\n" + data.message);
   $("#cout").change();
});

// receive data from server
socket.on('prop_ret', function (data) {
   var channel = cur_chan;

   var debug_msg = "Read from " + data.file + ": " + data.message;
   var clock_msg = debug_msg;
   //console.log(debug_msg);
   if (data.debug) {
      $("#cout" ).val( $("#cout" ).val() + "\n" + debug_msg);
      $("#cout").change();
   }

   // Lookup table for return data
   if (data.file == 'fpga/link/sfpa/ip_addr') {
      $('#sfpa_ip').val(data.message);
   } else if (data.file == 'fpga/link/sfpa/mac_addr') {
      $('#sfpa_mac').val(data.message);
   } else if (data.file == 'fpga/link/sfpa/pay_len') {
      $('#sfpa_paylen').val(data.message);
   } else if (data.file == 'fpga/link/sfpb/ip_addr') {
      $('#sfpb_ip').val(data.message);
   } else if (data.file == 'fpga/link/sfpb/mac_addr') {
      $('#sfpb_mac').val(data.message);
   } else if (data.file == 'fpga/link/sfpb/pay_len') {
      $('#sfpb_paylen').val(data.message);
   } else if (data.file == 'fpga/link/net/dhcp_en') {
      $('#dhcp_en').bootstrapSwitch('state', parseInt(data.message) != 0, true);
   } else if (data.file == 'fpga/link/net/hostname') {
      $('#hostname').val(data.message);
   } else if (data.file == 'fpga/link/net/ip_addr') {
      $('#mgmt_ip').val(data.message);
   } else if (data.file == cur_root + '/pwr') {
      $('#chan_en').bootstrapSwitch('state', parseInt(data.message) != 0, true);
      var is_rx = cur_root.indexOf('rx') > -1;

      if (parseInt(data.message) != 0) {
         if (is_rx) activateControls_rx(true);
         else  activateControls_tx(true);
      } else {
         if (is_rx) activateControls_rx(false);
         else  activateControls_tx(false);
      }
   } else if (data.file == cur_root + '/rf/freq/val') {
      $('#synth_freq').val(data.message);
      var synth_freq_en = $('#chan_en').bootstrapSwitch('state') && $('#rf_band').bootstrapSwitch('state');
      $("#synth_freq").prop('disabled', !synth_freq_en);
      $("#synth_freq_set").prop('disabled', !synth_freq_en);
   } else if (data.file == cur_root + '/rf/freq/lna') {
      $('#pa_en').bootstrapSwitch('readonly', false);
      $('#pa_en').bootstrapSwitch('state', parseInt(data.message) == 0, true);
      $('#pa_en').bootstrapSwitch('readonly', !($('#rf_band').bootstrapSwitch('state') && $('#chan_en').bootstrapSwitch('state')));
   } else if (data.file == cur_root + '/rf/gain/val') {
      $('#gain_range').val(parseInt(data.message));
      $("#gain_display").text('+' + (parseInt(data.message) / 4) + ' dB');
   } else if (data.file == cur_root + '/rf/atten/val') {
      $('#atten_range').val(parseInt(data.message));
      $('#atten_display').text('-' + (parseInt(data.message) / 4) + ' dB');
      $("#atten_range").prop('disabled', !($('#rf_band').bootstrapSwitch('state') && $('#chan_en').bootstrapSwitch('state')));
   } else if (data.file == '/gpio/hdr/' + hdr_chan + '/atten64') {
      $('#hdr_atten_range').val(parseInt(data.message));
      $('#hdr_atten_display').text('-' + (parseInt(data.message)) + ' dB');
      $("#hdr_atten_range").prop('disabled', !($('#chan_en').bootstrapSwitch('state')));
   } else if (data.file == '/gpio/hdr/' + hdr_chan + '/atten32') {
      $('#hdr_atten_range').val(parseInt(data.message));
      $('#hdr_atten_display').text('-' + (parseInt(data.message)) + ' dB');
      $("#hdr_atten_range").prop('disabled', !($('#chan_en').bootstrapSwitch('state')));
   } else if (data.file == '/gpio/hdr/' + hdr_chan + '/atten16') {
      $('#hdr_atten_range').val(parseInt(data.message));
      $('#hdr_atten_display').text('-' + (parseInt(data.message)) + ' dB');
      $("#hdr_atten_range").prop('disabled', !($('#chan_en').bootstrapSwitch('state')));
   } else if (data.file == '/gpio/hdr/' + hdr_chan + '/atten8') {
      $('#hdr_atten_range').val(parseInt(data.message));
      $('#hdr_atten_display').text('-' + (parseInt(data.message)) + ' dB');
      $("#hdr_atten_range").prop('disabled', !($('#chan_en').bootstrapSwitch('state')));
   } else if (data.file == '/gpio/hdr/' + hdr_chan + '/atten4') {
      $('#hdr_atten_range').val(parseInt(data.message));
      $('#hdr_atten_display').text('-' + (parseInt(data.message)) + ' dB');
      $("#hdr_atten_range").prop('disabled', !($('#chan_en').bootstrapSwitch('state')));
   } else if (data.file == '/gpio/hdr/' + hdr_chan + '/atten2') {
      $('#hdr_atten_range').val(parseInt(data.message));
      $('#hdr_atten_display').text('-' + (parseInt(data.message)) + ' dB');
      $("#hdr_atten_range").prop('disabled', !($('#chan_en').bootstrapSwitch('state')));
   } else if (data.file == '/gpio/hdr/' + hdr_chan + '/atten1') {
      $('#hdr_atten_range').val(parseInt(data.message));
      $('#hdr_atten_display').text('-' + (parseInt(data.message)) + ' dB');
      $("#hdr_atten_range").prop('disabled', !($('#chan_en').bootstrapSwitch('state')));
   } else if (data.file == cur_root + '/rf/freq/band') {
      $('#rf_band').bootstrapSwitch('readonly', false);
      $('#rf_band').bootstrapSwitch('state', parseInt(data.message) != 0, true);
      $('#rf_band').bootstrapSwitch('readonly', !($('#chan_en').bootstrapSwitch('state')));
   } else if (data.file == cur_root + '/dsp/signed') {
      $('#signed').bootstrapSwitch('state', parseInt(data.message) != 0, true);
   } else if (data.file == cur_root + '/dsp/nco_adj') {
      $('#dsp_nco').val(data.message);
   } else if (data.file == cur_root + '/link/port') {
      $('#port').val(data.message);
   } else if (data.file == cur_root + '/link/ip_dest') {
      $('#ip').val(data.message);
   } else if (data.file == cur_root + '/link/mac_dest') {
      $('#mac').val(data.message);
   } else if (data.file == cur_root + '/dsp/rate') {
      $('#sr').val(data.message);

      // read the actual values for the sample rate
      setTimeout(function() {
         socket.emit('raw_cmd', { message: "mem rr " + cur_board + cur_chan + "1" });
	 socket.emit('raw_cmd', { message: "mem rr " + cur_board + cur_chan + "4" });
      }, 500);
   } else if (data.file == cur_root + '/rf/dac/nco') {
      $('#dac_nco').val(data.message);
   } else if (data.file == cur_root + '/dsp/loopback') {
      $('#loopback').bootstrapSwitch('state', parseInt(data.message) != 0, true);
   } else if (data.file == cur_root + '/link/vita_en') {
      $('#vita_enable').bootstrapSwitch('state', parseInt(data.message) != 0, true);
   } else if (data.file == cur_root + '/rf/freq/lut_en') {
      $('#lut_switch').bootstrapSwitch('state', parseInt(data.message) != 0, true);
   } else if (data.file == cur_root + '/source/ref') {
      $('#ext_ref').bootstrapSwitch('state', data.message.indexOf('external') > -1, true);
   } else if (data.file == 'fpga/trigger/sma_dir') {
      $('#sma_dir').bootstrapSwitch('state', 'in' == data.message, true);
   } else if (data.file == cur_root + '/trigger/sma_mode') {
      $('#sma_mode').bootstrapSwitch('state', 'edge' == data.message, true);
   } else if (data.file == 'fpga/trigger/sma_pol') {
      $('#sma_pol').bootstrapSwitch('state', 'positive' == data.message, true);
   } else if (data.file == cur_root + '/trigger/edge_backoff') {
      $('#edge_backoff').val( parseInt( data.message ) );
   } else if (data.file == cur_root + '/trigger/edge_sample_num') {
      $('#edge_samples').val( parseInt( data.message ) );
   } else if (data.file == cur_root + '/trigger/trig_sel') {
      var trig_sel = parseInt(data.message);
      var trig_sel_sma = 1 == ( (trig_sel >> 0) & 1 );
      $('#trig_sel_sma').bootstrapSwitch('state', trig_sel_sma, true);
      
   } 
   
   /***********************************LMK_LOCKDETECT***************************************************/
   //////////////////////////////////////////////////////////////////////////////////////////////////////
   //////////////////////////////////////////////////////////////////////////////////////////////////////
   else if (data.file == cur_root + '/status/lmk_lockdetect_jesd0_pll1') {                            //  
                                                                                                      //  
       if(clock_msg.includes("PLL1 Locked")) {                                                        //  
        document.getElementById("jesd1_pll1_ok").style.visibility = "visible";                        //  
        document.getElementById("jesd1_pll1_no").style.visibility = "hidden";                         //  
        clock_msg = "";                                                                               //  
      }                                                                                               //  
      else if(clock_msg.includes("PLL1 Unlocked")) {                                                  //  
        document.getElementById("jesd1_pll1_ok").style.visibility = "hidden";                         //  
        document.getElementById("jesd1_pll1_no").style.visibility = "visible";                        //  
        clock_msg = "";                                                                               //  
      }                                                                                               //  
                                                                                                      //  
   } else if (data.file == cur_root + '/status/lmk_lockdetect_jesd0_pll2') {                          //  
       if(debug_msg.includes("PLL2 Locked")) {                                                        //  
         document.getElementById("jesd1_pll2_ok").style.visibility = "visible";                       //  
         document.getElementById("jesd1_pll2_no").style.visibility = "hidden";                        //  
         clock_msg = "";                                                                              //  
       }                                                                                              //  
       else if(debug_msg.includes("PLL2 Unlocked")) {                                                 //  
         document.getElementById("jesd1_pll2_ok").style.visibility = "hidden";                        //  
         document.getElementById("jesd1_pll2_no").style.visibility = "visible";                       //  
         clock_msg = "";                                                                              //  
       }                                                                                              //  
                                                                                                      //  
   } else if (data.file == cur_root + '/status/lmk_lockdetect_jesd1_pll1') {                          //  
       if(debug_msg.includes("PLL1 Locked")) {                                                        //
         document.getElementById("jesd2_pll1_ok").style.visibility = "visible";                       //
         document.getElementById("jesd2_pll1_no").style.visibility = "hidden";                        //
         clock_msg = "";                                                                              //
       }                                                                                              //
       else if(debug_msg.includes("PLL1 Unlocked")) {                                                 //
         document.getElementById("jesd2_pll1_ok").style.visibility = "hidden";                        //
         document.getElementById("jesd2_pll1_no").style.visibility = "visible";                       //
         clock_msg = "";                                                                              //
       }                                                                                              //
                                                                                                      //
   } else if (data.file == cur_root + '/status/lmk_lockdetect_jesd1_pll2') {                          //
       if(clock_msg.includes("PLL2 Locked")) {                                                        //
         document.getElementById("jesd2_pll2_ok").style.visibility = "visible";                       //
         document.getElementById("jesd2_pll2_no").style.visibility = "hidden";                        //
         clock_msg = "";                                                                              //
       }                                                                                              //
       else if(clock_msg.includes("PLL2 Unlocked")) {                                                 //
         document.getElementById("jesd2_pll2_ok").style.visibility = "hidden";                        //
         document.getElementById("jesd2_pll2_no").style.visibility = "visible";                       //
         clock_msg = "";                                                                              //
       }                                                                                              //
                                                                                                      //
   } else if (data.file == cur_root + '/status/lmk_lockdetect_jesd2_pll1') {                          //
       if(debug_msg.includes("PLL1 Locked")) {                                                        //
         document.getElementById("jesd3_pll1_ok").style.visibility = "visible";                       //
         document.getElementById("jesd3_pll1_no").style.visibility = "hidden";                        //
         clock_msg = "";                                                                              //
       }                                                                                              //
       else if(debug_msg.includes("PLL1 Unlocked")) {                                                 //
         document.getElementById("jesd3_pll1_ok").style.visibility = "hidden";                        //
         document.getElementById("jesd3_pll1_no").style.visibility = "visible";                       //
         clock_msg = "";                                                                              //  
       }                                                                                              //  
                                                                                                      //  
   } else if (data.file == cur_root + '/status/lmk_lockdetect_jesd2_pll2') {                          //  
       if(debug_msg.includes("PLL2 Locked")) {                                                        //
         document.getElementById("jesd3_pll2_ok").style.visibility = "visible";                       //
         document.getElementById("jesd3_pll2_no").style.visibility = "hidden";                        //
         clock_msg = "";                                                                              //  
       }                                                                                              //  
       else if(debug_msg.includes("PLL2 Unlocked")) {                                                 //
         document.getElementById("jesd3_pll2_ok").style.visibility = "hidden";                        //
         document.getElementById("jesd3_pll2_no").style.visibility = "visible";                       //
         clock_msg = "";                                                                              //  
       }                                                                                              //  
   } else if (data.file == cur_root + '/status/lmk_lockdetect_pll0_pll1') {                           //  
       if(debug_msg.includes("PLL1 Locked")) {                                                        //
         document.getElementById("pll1_pll1_ok").style.visibility = "visible";                        //
         document.getElementById("pll1_pll1_no").style.visibility = "hidden";                         //
         clock_msg = "";                                                                              //  
       }                                                                                              //  
       else if(debug_msg.includes("PLL1 Unlocked")) {                                                 //
         document.getElementById("pll1_pll1_ok").style.visibility = "hidden";                         //
         document.getElementById("pll1_pll1_no").style.visibility = "visible";                        //
         clock_msg = "";                                                                              //  
       }                                                                                              //  
   } else if (data.file == cur_root + '/status/lmk_lockdetect_pll0_pll2') {                           //  
       if(debug_msg.includes("PLL2 Locked")) {                                                        //
         document.getElementById("pll1_pll2_ok").style.visibility = "visible"                         //
         document.getElementById("pll1_pll2_no").style.visibility = "hidden";                         //
         clock_msg = "";                                                                              //  
       }                                                                                              //  
       else if(debug_msg.includes("PLL2 Unlocked")) {                                                 //
         document.getElementById("pll1_pll2_ok").style.visibility = "hidden";                         //
         document.getElementById("pll1_pll2_no").style.visibility = "visible"                         //
         clock_msg = "";                                                                              //  
       }                                                                                              //  
   } else if (data.file == cur_root + '/status/lmk_lockdetect_pll1_pll1') {                           //  
       if(debug_msg.includes("PLL1 Locked")) {                                                        //
         document.getElementById("pll2_pll1_ok").style.visibility = "visible";                        //
         document.getElementById("pll2_pll1_no").style.visibility = "hidden";                         //
         clock_msg = "";                                                                              //  
       }                                                                                              //  
       else if(debug_msg.includes("PLL1 Unlocked")) {                                                 //
         document.getElementById("pll2_pll1_ok").style.visibility = "hidden";                         //
         document.getElementById("pll2_pll1_no").style.visibility = "visible";                        //
         clock_msg = "";                                                                              //  
       }                                                                                              //  
   } else if (data.file == cur_root + '/status/lmk_lockdetect_pll1_pll2') {                           //  
       if(debug_msg.includes("PLL2 Locked")) {                                                        //
         document.getElementById("pll2_pll2_ok").style.visibility = "visible"                         //
         document.getElementById("pll2_pll2_no").style.visibility = "hidden";                         //
         clock_msg = "";                                                                              //  
       }                                                                                              //  
       else if(debug_msg.includes("PLL2 Unlocked")) {                                                 //
         document.getElementById("pll2_pll2_ok").style.visibility = "hidden";                         //
         document.getElementById("pll2_pll2_no").style.visibility = "visible"                         //
         clock_msg = "";                                                                              //  
       }                                                                                              //  
   }                                                                                                  //  
   /////////////////////////////////////////////////////////////////////////////////////////////////////
   /////////////////////////////////////////////////////////////////////////////////////////////////////
   
   
   /***********************************LMK_LOSS OF LOCK************************************************/
   /////////////////////////////////////////////////////////////////////////////////////////////////////
   /////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
   else if (data.file == cur_root + '/status/lmk_lossoflock_jesd0_pll1') {                            //  
                                                                                                      //  
       if(clock_msg.includes("PLL1 Synchronous Lock")) {                                              //
                                                                                                      //
        document.getElementById("lol_jesd1_pll1_ok").style.visibility = "visible";                    //      
        document.getElementById("lol_jesd1_pll1_no").style.visibility = "hidden";                     //      
        clock_msg = "";                                                                               //  
      }                                                                                               //  
      else if(clock_msg.includes("PLL1 Interupted Lock")) {                                           //         
        document.getElementById("lol_jesd1_pll1_ok").style.visibility = "hidden";                     //      
        document.getElementById("lol_jesd1_pll1_no").style.visibility = "visible";                    //      
        clock_msg = "";                                                                               //  
      }                                                                                               //  
                                                                                                      //  
   } else if (data.file == cur_root + '/status/lmk_lossoflock_jesd0_pll2') {                          //  
       if(debug_msg.includes("PLL2 Synchronous Lock")) {                                              //            
         document.getElementById("lol_jesd1_pll2_ok").style.visibility = "visible";                   //      
         document.getElementById("lol_jesd1_pll2_no").style.visibility = "hidden";                    //      
         clock_msg = "";                                                                              //  
       }                                                                                              //  
       else if(debug_msg.includes("PLL2 Interupted Lock")) {                                          //         
         document.getElementById("lol_jesd1_pll2_ok").style.visibility = "hidden";                    //      
         document.getElementById("lol_jesd1_pll2_no").style.visibility = "visible";                   //      
         clock_msg = "";                                                                              //  
       }                                                                                              //  
                                                                                                      //  
   } else if (data.file == cur_root + '/status/lmk_lossoflock_jesd1_pll1') {                          //  
       if(debug_msg.includes("PLL1 Synchronous Lock")) {                                              //          
         document.getElementById("lol_jesd2_pll1_ok").style.visibility = "visible";                   //    
         document.getElementById("lol_jesd2_pll1_no").style.visibility = "hidden";                    //    
         clock_msg = "";                                                                              //
       }                                                                                              //
       else if(debug_msg.includes("PLL1 Interupted Lock")) {                                          //       
         document.getElementById("lol_jesd2_pll1_ok").style.visibility = "hidden";                    //    
         document.getElementById("lol_jesd2_pll1_no").style.visibility = "visible";                   //    
         clock_msg = "";                                                                              //
       }                                                                                              //
                                                                                                      //
   } else if (data.file == cur_root + '/status/lmk_lossoflock_jesd1_pll2') {                          //
       if(clock_msg.includes("PLL2 Synchronous Lock")) {                                              //          
         document.getElementById("lol_jesd2_pll2_ok").style.visibility = "visible";                   //    
         document.getElementById("lol_jesd2_pll2_no").style.visibility = "hidden";                    //    
         clock_msg = "";                                                                              //
       }                                                                                              //
       else if(clock_msg.includes("PLL2 Interupted Lock")) {                                          //       
         document.getElementById("lol_jesd2_pll2_ok").style.visibility = "hidden";                    //
         document.getElementById("lol_jesd2_pll2_no").style.visibility = "visible";                   //
         clock_msg = "";                                                                              //
       }                                                                                              //
                                                                                                      //
   } else if (data.file == cur_root + '/status/lmk_lossoflock_jesd2_pll1') {                          //
       if(debug_msg.includes("PLL1 Synchronous Lock")) {                                              //
         document.getElementById("lol_jesd3_pll1_ok").style.visibility = "visible";                   //
         document.getElementById("lol_jesd3_pll1_no").style.visibility = "hidden";                    //
         clock_msg = "";                                                                              //
       }                                                                                              //
       else if(debug_msg.includes("PLL1 Interupted Lock")) {                                          //
         document.getElementById("lol_jesd3_pll1_ok").style.visibility = "hidden";                    //
         document.getElementById("lol_jesd3_pll1_no").style.visibility = "visible";                   //   
         clock_msg = "";                                                                              //  
       }                                                                                              //  
                                                                                                      //  
   } else if (data.file == cur_root + '/status/lmk_lossoflock_jesd2_pll2') {                          //  
       if(debug_msg.includes("PLL2 Synchronous Lock")) {                                              //  
         document.getElementById("lol_jesd3_pll2_ok").style.visibility = "visible";                   //   
         document.getElementById("lol_jesd3_pll2_no").style.visibility = "hidden";                    //   
         clock_msg = "";                                                                              //  
       }                                                                                              //  
       else if(debug_msg.includes("PLL2 Interupted Lock")) {                                          //  
         document.getElementById("lol_jesd3_pll2_ok").style.visibility = "hidden";                    //   
         document.getElementById("lol_jesd3_pll2_no").style.visibility = "visible";                   //   
         clock_msg = "";                                                                              //  
       }                                                                                              //  
   } else if (data.file == cur_root + '/status/lmk_lossoflock_pll0_pll1') {                           //  
       if(debug_msg.includes("PLL1 Synchronous Lock")) {                                              //  
         document.getElementById("lol_pll1_pll1_ok").style.visibility = "visible";                    //   
         document.getElementById("lol_pll1_pll1_no").style.visibility = "hidden";                     //   
         clock_msg = "";                                                                              //  
       }                                                                                              //  
       else if(debug_msg.includes("PLL1 Interupted Lock")) {                                          //  
         document.getElementById("lol_pll1_pll1_ok").style.visibility = "hidden";                     //   
         document.getElementById("lol_pll1_pll1_no").style.visibility = "visible";                    //   
         clock_msg = "";                                                                              //  
       }                                                                                              //  
   } else if (data.file == cur_root + '/status/lmk_lossoflock_pll0_pll2') {                           //  
       if(debug_msg.includes("PLL2 Synchronous Lock")) {                                              //  
         document.getElementById("lol_pll1_pll2_ok").style.visibility = "visible"                     //   
         document.getElementById("lol_pll1_pll2_no").style.visibility = "hidden";                     //   
         clock_msg = "";                                                                              //  
       }                                                                                              //  
       else if(debug_msg.includes("PLL2 Interupted Lock")) {                                          //  
         document.getElementById("lol_pll1_pll2_ok").style.visibility = "hidden";                     //   
         document.getElementById("lol_pll1_pll2_no").style.visibility = "visible"                     //   
         clock_msg = "";                                                                              //  
       }                                                                                              //  
   } else if (data.file == cur_root + '/status/lmk_lossoflock_pll1_pll1') {                           //  
       if(debug_msg.includes("PLL1 Synchronous Lock")) {                                              //  
         document.getElementById("lol_pll2_pll1_ok").style.visibility = "visible";                    //   
         document.getElementById("lol_pll2_pll1_no").style.visibility = "hidden";                     //   
         clock_msg = "";                                                                              //  
       }                                                                                              //  
       else if(debug_msg.includes("PLL1 Interupted Lock")) {                                          //  
         document.getElementById("lol_pll2_pll1_ok").style.visibility = "hidden";                     //   
         document.getElementById("lol_pll2_pll1_no").style.visibility = "visible";                    //   
         clock_msg = "";                                                                              //  
       }                                                                                              //  
   } else if (data.file == cur_root + '/status/lmk_lossoflock_pll1_pll2') {                           //  
       if(debug_msg.includes("PLL2 Synchronous Lock")) {                                              //  
         document.getElementById("lol_pll2_pll2_ok").style.visibility = "visible"                     //   
         document.getElementById("lol_pll2_pll2_no").style.visibility = "hidden";                     //   
         clock_msg = "";                                                                              //  
       }                                                                                              //  
       else if(debug_msg.includes("PLL2 Interupted Lock")) {                                          //  
         document.getElementById("lol_pll2_pll2_ok").style.visibility = "hidden";                     //   
         document.getElementById("lol_pll2_pll2_no").style.visibility = "visible"                     //   
         clock_msg = "";                                                                              //  
       }                                                                                              //  
   }                                                                                                  //  
   /////////////////////////////////////////////////////////////////////////////////////////////////////
   /////////////////////////////////////////////////////////////////////////////////////////////////////
   
   
   
   
   else if (data.file == '/gpio/hdr/' + hdr_chan + '/pwr_en') {
      $('#hdr_pwr').bootstrapSwitch('state', parseInt(data.message) != 0, true);
   } else if (data.file == '/gpio/override_en') {
      $('#sw_ovr').bootstrapSwitch('state', parseInt(data.message) != 0, true);
   } 
   
});

/////////////////////////////////////////////////OLD CODE///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
    //   } else if (data.file == cur_root + '/source/devclk') {                                       //
//      $('#out_devclk_en').bootstrapSwitch('state', data.message.indexOf('external') > -1, true);    //
//   } else if (data.file == cur_root + '/source/pll') {                                              //
//      $('#out_pll_en').bootstrapSwitch('state', data.message.indexOf('external') > -1, true);       //
//   } else if (data.file == cur_root + '/source/sync') {                                             //
//      $('#out_sysref_en').bootstrapSwitch('state', data.message.indexOf('external') > -1, true);    //
//   } else if (data.file == cur_root + '/source/vco') {                                              //
//      $('#out_vco_en').bootstrapSwitch('state', data.message.indexOf('external') > -1, true);       //
//   }                                                                                                //
                                                                                                      //
//  });                                                                                               //
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

// en/disable the configurations
function activateControls_rx(state) {
   $('#rf_band').bootstrapSwitch('readonly', !state);
   $('#pa_en').bootstrapSwitch('readonly', !(state && $('#rf_band').bootstrapSwitch('state')));
   $("#synth_freq").prop('disabled', !(state && $('#rf_band').bootstrapSwitch('state')));
   $("#synth_freq_set").prop('disabled', !(state && $('#rf_band').bootstrapSwitch('state')));
   $("#gain_range").prop('disabled', !state);
   $("#atten_range").prop('disabled', !(state && $('#rf_band').bootstrapSwitch('state')));
   $("#dsp_reset").prop('disabled', !state);
   //$('#signed').bootstrapSwitch('readonly', !state);
   $("#dsp_nco").prop('disabled', !state);
   $("#dsp_nco_set").prop('disabled', !state);
   $("#sr").prop('disabled', !state);
   $("#sr_set").prop('disabled', !state);
   $("#ip").prop('disabled', !state);
   $("#link_set").prop('disabled', !state);
   $("#mac").prop('disabled', !state);
   $("#port").prop('disabled', !state);
}

function activateControls_tx(state) {
   $('#rf_band').bootstrapSwitch('readonly', !state);
   $("#synth_freq").prop('disabled', !(state && $('#rf_band').bootstrapSwitch('state')));
   $("#synth_freq_set").prop('disabled', !(state && $('#rf_band').bootstrapSwitch('state')));
   $("#dac_nco").prop('disabled', !state);
   $("#dac_nco_set").prop('disabled', !state);
   $("#gain_range").prop('disabled', !state);
   $("#dsp_reset").prop('disabled', !state);
   $("#dsp_nco").prop('disabled', !state);
   $("#dsp_nco_set").prop('disabled', !state);
   $("#sr").prop('disabled', !state);
   $("#sr_set").prop('disabled', !state);
   $("#link_set").prop('disabled', !state);
   $("#port").prop('disabled', !state);

}

// write the current settings to SDR
function write_rx() {
   socket.emit('prop_wr', { file: cur_root + '/rf/freq/lna'   , message: $('#pa_en').bootstrapSwitch('state') ? '0' : '1'});
   socket.emit('prop_wr', { file: cur_root + '/rf/freq/band'  , message: $('#rf_band').bootstrapSwitch('state') ? '1' : '0'});
   socket.emit('prop_wr', { file: cur_root + '/rf/gain/val'   , message: $('#gain_range').val()});
   socket.emit('prop_wr', { file: cur_root + '/rf/atten/val'  , message: $('#atten_range').val()});
   socket.emit('prop_wr', { file: cur_root + '/rf/freq/val'   , message: $('#synth_freq').val()});
   socket.emit('prop_wr', { file: cur_root + '/dsp/signed'    , message: $('#signed').bootstrapSwitch('state') ? '1' : '0'});
   socket.emit('prop_wr', { file: cur_root + '/dsp/nco_adj'   , message: $('#dsp_nco').val()});
   socket.emit('prop_wr', { file: cur_root + '/dsp/rate'      , message: $('#sr').val()});
   socket.emit('prop_wr', { file: cur_root + '/link/port'     , message: $('#port').val()});
   socket.emit('prop_wr', { file: cur_root + '/link/ip_dest'  , message: $('#ip').val()});
   socket.emit('prop_wr', { file: cur_root + '/link/mac_dest' , message: $('#mac').val()});
   socket.emit('prop_wr', { file: cur_root + '/dsp/loopback'  , message: $('#loopback').bootstrapSwitch('state') ? '1' : '0'});
}

function write_tx() {
   socket.emit('prop_wr', { file: cur_root + '/rf/freq/band'  		    , message: $('#rf_band').bootstrapSwitch('state') ? '1' : '0'});
   socket.emit('prop_wr', { file: cur_root + '/rf/gain/val'   		    , message: $('#gain_range').val()});
   socket.emit('prop_wr', { file: cur_root + '/rf/dac/nco'    		    , message: $('#dac_nco').val()});
   socket.emit('prop_wr', { file: cur_root + '/rf/freq/val'   		    , message: $('#synth_freq').val()});
   socket.emit('prop_wr', { file: cur_root + '/dsp/nco_adj'   		    , message: $('#dsp_nco').val()});
   socket.emit('prop_wr', { file: cur_root + '/dsp/rate'      		    , message: $('#sr').val()});
   socket.emit('prop_wr', { file: cur_root + '/link/port'     		    , message: $('#port').val()});
   socket.emit('prop_wr', { file: cur_root + '/link/vita_en'  		    , message: $('#vita_enable').bootstrapSwitch('state') ? '1' : '0'});

   
   socket.emit('prop_wr', { file: '/gpio/hdr/' + hdr_chan + '/isolation_en'  , message: $('#hdr_iso').bootstrapSwitch('state') ? 'true' : 'false'});
   socket.emit('prop_wr', { file: 'gpio/hdr/' + hdr_chan + '/atten64', message: '1' });
   socket.emit('prop_wr', { file: 'gpio/hdr/' + hdr_chan + '/atten32', message: '0' });
   socket.emit('prop_wr', { file: 'gpio/hdr/' + hdr_chan + '/atten16', message: '0' });
   socket.emit('prop_wr', { file: 'gpio/hdr/' + hdr_chan + '/atten8',  message: '0' });
   socket.emit('prop_wr', { file: 'gpio/hdr/' + hdr_chan + '/atten4',  message: '0' });
   socket.emit('prop_wr', { file: 'gpio/hdr/' + hdr_chan + '/atten2',  message: '0' });
   socket.emit('prop_wr', { file: 'gpio/hdr/' + hdr_chan + '/atten1',  message: '0' });
}

// Loading config data
function load_config (isLoad) {
   socket.emit('prop_rd', { file: 'fpga/link/sfpa/ip_addr'    ,debug: isLoad});
   socket.emit('prop_rd', { file: 'fpga/link/sfpa/mac_addr'   ,debug: isLoad});
   socket.emit('prop_rd', { file: 'fpga/link/sfpa/pay_len'    ,debug: isLoad});
   socket.emit('prop_rd', { file: 'fpga/link/sfpb/ip_addr'    ,debug: isLoad});
   socket.emit('prop_rd', { file: 'fpga/link/sfpb/mac_addr'   ,debug: isLoad});
   socket.emit('prop_rd', { file: 'fpga/link/sfpb/pay_len'    ,debug: isLoad});
   socket.emit('prop_rd', { file: 'fpga/link/net/dhcp_en'     ,debug: isLoad});
   socket.emit('prop_rd', { file: 'fpga/link/net/hostname'    ,debug: isLoad});
   socket.emit('prop_rd', { file: 'fpga/link/net/ip_addr'     ,debug: isLoad});
   socket.emit('prop_rd', { file: 'fpga/trigger/sma_dir'      ,debug: isLoad});
   socket.emit('prop_rd', { file: 'fpga/trigger/sma_pol'      ,debug: isLoad});
}

function load_rx (isLoad) {
   socket.emit('prop_rd', { file: cur_root + '/pwr'           ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/rf/freq/band'  ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/rf/freq/val'   ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/rf/freq/lna'   ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/rf/gain/val'   ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/rf/atten/val'  ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/dsp/signed'    ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/dsp/nco_adj'   ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/dsp/rate'      ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/dsp/loopback'  ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/link/port'     ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/link/ip_dest'  ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/link/mac_dest' ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/trigger/sma_mode'        ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/trigger/trig_sel'        ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/trigger/edge_backoff'    ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/trigger/edge_sample_num' ,debug: isLoad});
   //socket.emit('prop_rd', { file: cur_root + '/rf/freq/lut_en'     	    	,debug: isLoad});
}

function load_tx (isLoad) {
   socket.emit('prop_rd', { file: cur_root + '/pwr'           			,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/rf/freq/band'  			,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/rf/freq/val'   			,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/rf/gain/val'   			,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/rf/dac/nco'    			,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/dsp/nco_adj'   			,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/dsp/rate'      			,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/link/port'     			,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/link/vita_en'     	    ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/trigger/sma_mode'        ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/trigger/trig_sel'        ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/trigger/edge_backoff'    ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/trigger/edge_sample_num' ,debug: isLoad});
   
   //Load hdr data
   socket.emit('prop_rd', { file: 'gpio/hdr/' + hdr_chan + '/atten64'   ,debug: isLoad });
   socket.emit('prop_rd', { file: 'gpio/hdr/' + hdr_chan + '/atten32'   ,debug: isLoad });
   socket.emit('prop_rd', { file: 'gpio/hdr/' + hdr_chan + '/atten16'   ,debug: isLoad });
   socket.emit('prop_rd', { file: 'gpio/hdr/' + hdr_chan + '/atten8'    ,debug: isLoad });
   socket.emit('prop_rd', { file: 'gpio/hdr/' + hdr_chan + '/atten4'    ,debug: isLoad });
   socket.emit('prop_rd', { file: 'gpio/hdr/' + hdr_chan + '/atten2'    ,debug: isLoad });
   socket.emit('prop_rd', { file: 'gpio/hdr/' + hdr_chan + '/atten1'    ,debug: isLoad });
}                                                                      

function load_clock (isLoad) {
   //write to the lockdetect/lossoflock to update the directories 
   socket.emit('prop_wr', { file: cur_root + '/status/lmk_lockdetect' ,message: '0'});
   socket.emit('prop_wr', { file: cur_root + '/status/lmk_lossoflock' ,message: '0'});
   
   //read from lmk_lockdetect
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lockdetect_jesd0_pll1'  ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lockdetect_jesd0_pll2'  ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lockdetect_jesd1_pll1'  ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lockdetect_jesd1_pll2'  ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lockdetect_jesd2_pll1'  ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lockdetect_jesd2_pll2'  ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lockdetect_pll0_pll1'   ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lockdetect_pll0_pll2'   ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lockdetect_pll1_pll1'   ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lockdetect_pll1_pll2'   ,debug: isLoad});
   
   //read from lmk_lossoflock
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lossoflock_jesd0_pll1'  ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lossoflock_jesd0_pll2'  ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lossoflock_jesd1_pll1'  ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lossoflock_jesd1_pll2'  ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lossoflock_jesd2_pll1'  ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lossoflock_jesd2_pll2'  ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lossoflock_pll0_pll1'   ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lossoflock_pll0_pll2'   ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lossoflock_pll1_pll1'   ,debug: isLoad});
   socket.emit('prop_rd', { file: cur_root + '/status/lmk_lossoflock_pll1_pll2'   ,debug: isLoad}); 
}

//hides/shows webpage elements based on 'state' boolean parameter
function disableElements (state) {
    
   $("#chan_en_indiv").bootstrapSwitch('readonly', state);
   $("#rf_band").bootstrapSwitch('readonly', state);
   $("#synth_freq").prop('disabled', state);
   $("#synth_freq_set").prop('disabled', state);
   $("#dac_nco").prop('disabled', state);
   $("#dac_nco_set").prop('disabled', state);
   $('#ibias_range').prop('disabled', state);
   $('#qbias_range').prop('disabled', state);
   $('#gain_range').prop('disabled', state);
   $('#dsp_nco').prop('disabled', state);
   $('#dsp_nco_set').prop('disabled', state);
   $('#dsp_reset').prop('disabled', state);
   $('#sr').prop('disabled', state);
   $('#sr_set').prop('disabled', state);
   $('#port').prop('disabled', state);
   $('#vita_enable').bootstrapSwitch('readonly', state);
    
}

//hides/shows webpage elements based on 'state' boolean parameter
function disableHdrElements (state) {
   
   $("#hdr_atten_range").prop('disabled', state);
   $('#hdr_iso').bootstrapSwitch('readonly', state);
   $('#hdr_pwr').bootstrapSwitch('readonly', state);
   $('#hdr_iso').bootstrapSwitch('readonly', state);
   $('#hdr_chan_en').bootstrapSwitch('readonly', state);
   
}

//hides/shows webpage elements based on 'state' boolean parameter
function disableBoardTriggElements (state) {
 
   $("#sma_mode").bootstrapSwitch('readonly', state);
   $("#trig_sel_sma").bootstrapSwitch('readonly', state);
   $('#jesdsync').prop('disabled', state);
   $('#dac_dump').prop('disabled', state);
   $('#led').prop('disabled', state);
   $('#version').prop('disabled', state);
   $('#temperature').prop('disabled', state);
   $('#diagnostic').prop('disabled', state);
   $('#edge_backoff').prop('disabled', state);
   $('#edge_samples').prop('disabled', state);
    
}

// determine which page is currently loaded
window.onload = function() {
     
   var pathname = window.location.pathname; 

   var loadFunc;
   var refreshFunc;
   
   if (pathname.indexOf('config') > -1) {
      cur_board = 'fpga';
      cur_root = cur_board;
      loadFunc = load_config;
   } else if (pathname.indexOf('clock') > -1) {
      cur_board = 'time';
      cur_root = cur_board;
      loadFunc = load_clock;
   } else if (pathname.indexOf('debug') > -1) {
      cur_board = 'fpga';
      cur_root = cur_board;
      return;
   } else if (pathname.indexOf('rx') > -1) {
      cur_board = 'rx';
      cur_root = cur_board + '_' + cur_chan;
      loadFunc = load_rx;
      
   } else if (pathname.indexOf('tx') > -1) {
   
      $("#chan_en").bootstrapSwitch('readonly', true);
      //alert the user to select either hdr,low power or high power to operate on
      document.getElementById("chan_alert").style.visibility = "visible";
      document.getElementById("chan_alert2").style.visibility = "visible";
      
      //deactivate the hdr channel 
      $("#chan_hdr").parent().attr('class','inactive');
      disableHdrElements(true);
      document.getElementById("hdr_img").style.opacity = 0.2;
      
      //diable lp and hp elements
      $("#chan_lp").parent().attr('class','inactive');
      $("#chan_hp").parent().attr('class','inactive');
      disableElements(true);
      document.getElementById("tx_chain").style.opacity = 0.2;
      document.getElementById("tx_dsp_chain").style.opacity = 0.2;
      
      //disable board and trigger elements
      disableBoardTriggElements(true);
      
      // update the channel path
      cur_path = $(this).attr('id').replace('chan_','');
      
      //look through all of the possible channel locations with their corresponding roots 
      if (cur_path == 'a') {
              cur_root = 'tx_a';
              cur_chan = 'a';
              hdr_chan = 'a';
      } else if (cur_path == 'b') {
              cur_root = 'tx_c';
              cur_chan = 'c';
              hdr_chan = 'b';
      } else if (cur_path == 'c') {
              cur_root = 'tx_e';
              cur_chan = 'e';
              hdr_chan = 'c';
      } else if (cur_path == 'd') {
              cur_root = 'tx_g';
              cur_chan = 'g';
              hdr_chan = 'd';
      } else if (cur_path == 'e') {
              cur_root = 'tx_i';
              cur_chan = 'i';
              hdr_chan = 'e';
      } else if (cur_path == 'f') {
              cur_root = 'tx_k';
              cur_chan = 'k';
              hdr_chan = 'f';
      } else if (cur_path == 'g') {
              cur_root = 'tx_m';
              cur_chan = 'm';
              hdr_chan = 'g';
      } else if (cur_path == 'h') {
              cur_root = 'tx_o';
              cur_chan = 'o';
              hdr_chan = 'h';
      }
   } 
   
   
   else {
      cur_board = 'coverpage';
      cur_root = cur_board;
      return;
   }

   loadFunc(true);
}
