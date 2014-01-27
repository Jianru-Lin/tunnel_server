init();
run();

function run() {
	var config_filename = undefined;

	// 参数中应当指明配置文件位置
	process.argv.forEach(function(a) {
		if (/^--conf=/i.test(a)) {
			config_filename = /^--conf=([^$]*)$/i.exec(a)[1];
		};
	});

	// 如果用户忘了指明 conf 参数，则做出提示然后退出
	if (!config_filename) {
		console.log('specify config file name with "--conf=" please');
		return false;
	}

	// 加载配置文件
	if (!load_config(config_filename)) {
		return;
	}

	var type = get_config_value('type');

	if (type === 'cipher') {
		start_server({
			connection: on_cipher_connection,
			error: on_error
		});		
	} else {
		start_server({
			connection: on_decipher_connection,
			error: on_error
		});
	}

	function on_cipher_connection(socket) {
		create_cipher_tunnel(socket);
	}

	function on_decipher_connection(socket) {
		create_decipher_tunnel(socket);
	}

	function on_error(err) {
		console.log(err.toString());
	}
}

function init() {
	var fs = require('fs');
	var path = require('path');
	var fileList = fs.readdirSync(__dirname);

	// 非 .js 结尾的不要加载
	// init.js 和 run.js 也不要加载
	fileList = fileList.filter(function(file) {
		if (!/\.js$/i.test(file)) {
			//console.log('not js file: ' + file);
			return false;
		} else if (/^run\.js$/i.test(file)) {
			return false;
		} else {
			return true;
		}
	});

	fileList.forEach(function(file) {
		var m = require('./' + file);
		if (m.name) {
			global[m.name] = m;
			//console.log('success: ' + file);
		} else {
			console.log('init failure: ' + file);
		}
	});	
}