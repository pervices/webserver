$(document).ready(function() {
   $("[name='en']").bootstrapSwitch({
      onText: 'ON',
      offText: 'OFF',
      size: 'mini',
      onColor: 'success'
      //offColor: 'danger'
   });
});

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
