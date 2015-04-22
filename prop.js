var fs = require('fs');
var state_dir = '/home/root/state/';

module.exports = function(io) {
   io.sockets.on('connection', function (socket) {
      // Handle property reads
      socket.on('prop_rd', function (data) {
         var file = data.file;

         // read the data from fs
         fs.readFile( state_dir + data.file, 'utf8', function(err, data){
            if (err) throw err;

            // send the data back to the client
            io.sockets.emit('prop_ret', {file: file, message: data});
         }); 
      });

      // Handle property updates
      socket.on('prop_wr', function (data) {
         // write to file
         fs.writeFile( state_dir + data.file, data.message , function(err, fd){
            if (err) throw err;
         });
         console.log('Wrote to ' + data.file + ': ' + data.message);
      });
   });
}
