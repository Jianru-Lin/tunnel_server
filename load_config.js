exports = module.exports = load_config;

var fs = require('fs');

function load_config(filename) {

	var conf = JSON.parse(fs.readFileSync(filename, {encoding: 'utf8'}));

	var type = conf.type;
	var key = conf.key;
	var addr = conf.addr;
	var port = conf.port;
	var server_addr = conf.server_addr;
	var server_port = conf.server_port;

	if (!type) {
		console.log('ERROR type is empty');
		return false;
	}

	if (!key) {
		console.log('ERROR key is empty');
		return false;
	}

	if (!addr) {
		console.log('ERROR addr is empty');
		return false;
	}

	if (!port) {
		console.log('ERROR port is empty');
		return false;
	}

	if (!server_addr) {
		console.log('ERROR server_addr is empty');
		return false;
	}

	if (!server_port) {
		console.log('ERROR server_port is empty');
		return false;
	}

	// 将配置信息保存到全局变量里
	global.tunnel_server_config = {
		type: type,
		key: key,
		addr: addr,
		port: port,
		server_addr: server_addr,
		server_port: server_port
	};

	// 显示一下配置信息
	console.log('[config]')
	console.log('type=' + type);
	console.log('key=' + key);
	console.log('addr=' + addr);
	console.log('port=' + port);
	console.log('server_addr=' + server_addr);
	console.log('server_port=' + server_port);

	// 成功了
	return true;
}