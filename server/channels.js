Channels = (function() {
	function Channels(socket) {
		this.channels = [];
	}

	Channels.prototype.get_channels = function() {
		return this.channels;
	};

	Channels.prototype.join = function(channel, user) {
		if ( !this.channels[channel] ) {
			this.channels[channel] = [];
		}

		return this.channels[channel][user] = true;
	};

	Channels.prototype.is_part_of = function(channel, user) {
		return this.channels[channel][user];
	};

	Channels.prototype.part = function(channel, user) {
		if ( !this.channels[channel][user] ) {
			return true;
		}

		return delete this.channels[channel][user];
	};

	return Channels;
})();

exports.setup = function()
{
	return new Channels;
}