$(document).ready(function() {
   $("[name='en']").bootstrapSwitch({
      onText: 'ON',
      offText: 'OFF',
      size: 'mini',
      onColor: 'success'
      //offColor: 'danger'
   });
});

// socket.io connection
var socket = io.connect();

// current channel
var current_chan = 'a';

// Switch channel views
// This function will load the current states of the channel onto the page
$("#txchan_a,#txchan_b,#txchan_c,#txchan_d,#rxchan_a,#rxchan_b,#rxchan_c,#rxchan_d").click(function() {
   $(this).parent().parent().children().removeClass('active');
   $(this).parent().attr('class', 'active');

   // load the channel state
});

// En/disable channel
// This function will enable the channel
$("#txchan_en,#rxchan_en").on('switchChange.bootstrapSwitch', function(event, state) {
   // enable the channels
});

// En/disable DHCP
// This function will enable the DHCP
$("#dhcp_en").on('switchChange.bootstrapSwitch', function(event, state) {
   $("#mgmt_ip"     ).prop('disabled', state);
   $("#mgmt_gateway").prop('disabled', state);
   $("#mgmt_netmask").prop('disabled', state);
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

// Loopback mode
$("#opmode_normal,#opmode_loopback").click(function() {
   if($('#opmode_normal').is(':checked'))
      socket.emit('prop_wr', { file: 'fpga/link/loopback', message: '0' });
   else
      socket.emit('prop_wr', { file: 'fpga/link/loopback', message: '1' });
});

// Loading config data
function load_config () {
   socket.emit('prop_rd', { file: 'fpga/link/sfpa/ip_addr' });
   socket.emit('prop_rd', { file: 'fpga/link/sfpa/mac_addr'});
   socket.emit('prop_rd', { file: 'fpga/link/sfpb/ip_addr' });
   socket.emit('prop_rd', { file: 'fpga/link/sfpb/mac_addr'});
}

// receive data from server
socket.on('prop_ret', function (data) {
   console.log("Returned from file " + data.file + ": " + data);
   if (data.file == 'fpga/link/sfpa/ip_addr')
      $('#sfpa_ip').val(data.message);
   else if (data.file == 'fpga/link/sfpa/mac_addr')
      $('#sfpa_mac').val(data.message);

});

window.onload = function() {
   load_config();
}
