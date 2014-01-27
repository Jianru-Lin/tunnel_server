exports = module.exports = create_cipher_tunnel;

var crypto = require('crypto');

function create_cipher_tunnel(socket) {
	var key = get_config_value('key');
	var cipher = crypto.createCipher('rc4', key);
	var decipher = crypto.createDecipher('rc4', key);
	create_tunnel(socket, cipher, decipher);
}