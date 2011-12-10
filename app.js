var app = require('http').createServer(handler)
	, io = require('socket.io').listen(app)
	, fs = require('fs')

app.listen(8000);

function handler (req, res) {
	fs.readFile(__dirname + '/client/index.html',
	function (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		}

		res.writeHead(200);
		res.end(data);
	});
}

require('./server/client');
chat = require('./server/chat');
channel = chat.channels.setup();

io.sockets.on('connection', function (socket) {
	client = new Client(socket);

	socket.on('message', function (data) {
		if ( !( data instanceof Object ) ) {
			socket.disconnect();
		}

		if ( null != data.nick ) {
			// Need to check if the nick is taken here
			client.nick = data.nick;
			return;
		}

		if ( !client.nick ) {
			socket.emit('message', { type: 'error', msg: 'You must first set a nick.' })
			return;
		}

		if ( null != data.join ) {
			if ( !chat.channels.is_part_of( data.join, client.nick ) ) {
				client.join( data.join );
				io.sockets.emit('message', { msg: client.nick + ' joined ' + data.join})
			}

			return;
		}

		if ( null != data.say && data.say ) {
			if ( !data.channel ) {
				socket.emit('message', { type: 'error', msg: 'I need a channel to say stuff on.' })
				return;
			}

			if ( !client.channels[data.channel] ) {
				socket.emit('message', { type: 'error', msg: 'You are not part of this channel.' })
				return;
			}

			// Store the message

			// Loop through users that are on this channel and send message to them
			io.sockets.emit('message', { channel: data.channel, msg: data.say })

			// May want to send feedback to the sender that message was delivered
		}

		// chat.handler_request( data );
	});

	socket.on('disconnect', function () {
		io.sockets.emit('user disconnected');
	});
});