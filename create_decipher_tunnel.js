exports = module.exports = create_decipher_tunnel;

var crypto = require('crypto');

function create_decipher_tunnel(socket) {
	var key = get_config_value('key');
	var cipher = crypto.createCipher('rc4', key);
	var decipher = crypto.createDecipher('rc4', key);
	create_tunnel(socket, decipher, cipher);
}