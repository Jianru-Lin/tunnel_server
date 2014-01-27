exports = module.exports = get_config_value;

function get_config_value(name) {
	if (global.tunnel_server_config) {
		return global.tunnel_server_config[name];
	} else {
		return undefined;
	}
}