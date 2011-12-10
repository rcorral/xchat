Client = (function() {
	function Client(socket) {
		this.socket = socket;
		this.nick = null;
		this.channels = {};
	}
	Client.prototype.join = function(name) {
		return this.channels[name] = true;
	};
	Client.prototype.part = function(name) {
		return delete this.channels[name];
	};
	return Client;
})();