exports = module.exports = create_tunnel;

// [模块]
var net = require('net');

// [变量]
var tunnel_list = [];

// [函数]
function create_tunnel(socket, forward, backward) {
	var client = socket;
	var server = net.connect(get_config_value('server_port'), get_config_value('server_addr'));

	// 创建隧道对象并记录下来
	var tunnel = new Tunnel(client, server, forward, backward);
	tunnel.status_changed = on_tunnel_status_changed;
	tunnel_list.push(tunnel);

	// 调试输出：显示当前连接数
	console.log('[+] ' + tunnel_list.length + ' (heap:' + heap_used_in_mb() + ')');

	function on_tunnel_status_changed(tunnel) {
		// 不管发生了 end、close、error 事件中的哪一种
		// 删掉 tunnel_list 中对应的 tunnel
		// 这样垃圾回收器会在稍后自动释放掉这个 tunnel 占用的所有资源
		tunnel_list = tunnel_list.filter(function(t) {
			return t !== tunnel;
		});

		// 为了用户体验，如果是 server 发生了 error 事件，在这里直接关闭一下 client 会更好
		if (tunnel.status.server_error) {
			tunnel.client.destroy();
		}

		// 调试输出：显示当前连接数
		console.log('[-] ' + tunnel_list.length + ' (heap:' + heap_used_in_mb() + ')');
	}
}

function heap_used_in_mb() {
	return process.memoryUsage().heapUsed / 1024 / 1024;
}

function Tunnel(client, server, forward, backward) {
	this.client = client;
	this.server = server;
	this.forward = forward;
	this.backward = backward;

	this.status = {
		client_end: undefined,
		client_close: undefined,
		client_error: undefined,

		server_end: undefined,
		server_close: undefined,
		server_error: undefined,

		forward_end: undefined,
		forward_close: undefined,
		forward_error: undefined,

		backward_end: undefined,
		backward_close: undefined,
		backward_error: undefined
	};

	this.status_changed = undefined;


	var self = this;

	// 将各个部分连接起来
	// 这里允许空缺 forward、backward

	if (self.forward) {
		self.client.pipe(self.forward);
		self.forward.pipe(self.server);
	} else {
		self.client.pipe(self.server);
	}

	if (self.backward) {
		self.server.pipe(self.backward);
		self.backward.pipe(self.client);
	} else {
		self.server.pipe(self.client);
	}

	// 监听每个对象的 end、close、error 事件
	watch('client', self.client);
	watch('server', self.server);
	watch('forward', self.forward);
	watch('backward', self.backward);

	function watch(name, target) {
		if (!target) return;

		target.on('error', on_error);
		target.on('end', on_end);
		target.on('close', on_close);

		function on_error(err) {
			self.status[name + '_error'] = err;
			self.status_changed(self);
		}

		function on_end() {
			self.status[name + '_end'] = true;
			self.status_changed(self);
		}

		function on_close() {
			self.status[name + '_close'] = true;
			self.status_changed(self);
		}
	}
}