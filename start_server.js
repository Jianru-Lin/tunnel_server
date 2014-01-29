exports = module.exports = start_server;

// [模块]
var net = require('net');

// [变量]
var server;

// [函数]
function start_server(event_hook) {
	server = net.createServer();
	
	server.on('connection', function(socket) {
		if (!event_hook.connection) return;
		event_hook.connection(socket);
	});
	
	server.on('error', function(err) {
		if (!event_hook.error) return;
		event_hook.error(err);
	});

	server.listen(get_config_value('port'), get_config_value('addr'));
}