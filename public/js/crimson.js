$(document).ready(function() {
   // bootstrap switches
   $("[name='en']").bootstrapSwitch({
      onText: 'ON',
      offText: 'OFF',
      size: 'mini',
      onColor: 'success'
      //offColor: 'danger'
   });

   $("[name='band']").bootstrapSwitch({
      onText: ' High ',
      offText: ' Low ',
      size: 'small',
      onColor:  'default',
      offColor: 'default'
   });

});

// socket.io connection
var socket = io.connect();

// current channel and board/page
var current_chan = 'a';
var pathname = window.location.pathname;

// Switch channel views
// This function will load the current states of the channel onto the page
$("#chan_a,#chan_b,#chan_c,#chan_d").click(function() {
   $(this).parent().parent().children().removeClass('active');
   $(this).parent().attr('class', 'active');

   // update the channel
   var chan = $(this).attr('id');
   if     (chan == 'chan_a') current_chan = 'a';
   else if(chan == 'chan_b') current_chan = 'b';
   else if(chan == 'chan_c') current_chan = 'c';
   else if(chan == 'chan_d') current_chan = 'd';

   // load the channel state
   if      (pathname.indexOf('rx') > -1) load_rx(current_chan);
   else if (pathname.indexOf('tx') > -1) load_tx(current_chan);
});

// En/disable channel
// This function will enable the channel
$("#chan_en,#chan_en").on('switchChange.bootstrapSwitch', function(event, state) {
   // enable the channels
});

// En/disable DHCP
// This function will enable the DHCP
$("#dhcp_en").on('switchChange.bootstrapSwitch', function(event, state) {
   socket.emit('prop_wr', { file: 'fpga/link/net/dhcp_en', message: state ? '1' : '0' });
   $("#mgmt_ip").prop('disabled', state);
});

// LED buttons
$("#tx_led").click(function() {
   socket.emit('prop_wr', { file: 'tx_a/rf/board/led', message: '5' });
});
$("#rx_led").click(function() {
   socket.emit('prop_wr', { file: 'rx_a/rf/board/led', message: '5' });
});
$("#clock_led").click(function() {
   socket.emit('prop_wr', { file: 'time/board/led',    message: '5' });
});
$("#dig_led").click(function() {
   socket.emit('prop_wr', { file: 'fpga/board/led',    message: '5' });
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

$("#uart_cmd").keypress(function(event) {
   if (event.keyCode == 13)
      $("#send_uart_cmd").click();
});

// program board
$("#program_start").click(function() {
   var option = $( "#program_board option:selected" ).val();
   socket.emit('raw_cmd', { message: "/home/root/pv_mcu/flash.sh " + option});
});

// Loopback mode
$("#opmode_normal,#opmode_loopback").click(function() {
   if($('#opmode_normal').is(':checked'))
      socket.emit('prop_wr', { file: 'fpga/link/loopback', message: '0' });
   else
      socket.emit('prop_wr', { file: 'fpga/link/loopback', message: '1' });
});

// receive console from server
socket.on('raw_reply', function (data) {
   console.log("Raw reply: " + data.message);
   $("#uart_hist").val( $("#uart_hist").val() + data.cmd + "\n");
   $("#uart_out" ).val(data.message);
});

// receive data from server
socket.on('prop_ret', function (data) {
   console.log("Returned from file " + data.file + ": " + data);
   // Lookup table for return data
   if (data.file == 'fpga/link/sfpa/ip_addr')
      $('#sfpa_ip').val(data.message);
   else if (data.file == 'fpga/link/sfpa/mac_addr')
      $('#sfpa_mac').val(data.message);
   else if (data.file == 'fpga/link/sfpb/ip_addr')
      $('#sfpb_ip').val(data.message);
   else if (data.file == 'fpga/link/sfpb/mac_addr')
      $('#sfpb_mac').val(data.message);
   else if (data.file == 'fpga/link/loopback')
      $('input:radio[name=op_mode]')[parseInt(data.message)].checked = true;
   else if (data.file == 'fpga/link/net/dhcp_en')
      $('#dhcp_en').bootstrapSwitch('state', parseInt(data.message) != 0)
   else if (data.file == 'fpga/link/net/hostname')
      $('#hostname').val(data.message);
   else if (data.file == 'fpga/link/net/ip_addr')
      $('#mgmt_ip').val(data.message);
});

// Loading config data
function load_config () {
   socket.emit('prop_rd', { file: 'fpga/link/sfpa/ip_addr' });
   socket.emit('prop_rd', { file: 'fpga/link/sfpa/mac_addr'});
   socket.emit('prop_rd', { file: 'fpga/link/sfpb/ip_addr' });
   socket.emit('prop_rd', { file: 'fpga/link/sfpb/mac_addr'});
   socket.emit('prop_rd', { file: 'fpga/link/loopback'});
   socket.emit('prop_rd', { file: 'fpga/link/net/dhcp_en'});
   socket.emit('prop_rd', { file: 'fpga/link/net/hostname'});
   socket.emit('prop_rd', { file: 'fpga/link/net/ip_addr'});
}

function load_clock () {

}

function load_debug () {

}

function load_rx (channel) {

}

function load_tx (channel) {

}


// determine which page is currently loaded
window.onload = function() {
   if (pathname.indexOf('config') > -1)
      load_config();
   else if (pathname.indexOf('clock') > -1)
      load_clock();
   else if (pathname.indexOf('debug') > -1)
      load_debug();
   else if (pathname.indexOf('rx') > -1)
      load_rx(current_chan);
   else if (pathname.indexOf('tx') > -1)
      load_tx(current_chan);
}
