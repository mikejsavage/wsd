#! /usr/bin/env node

let listen_port = 12345;
let destination_host = "google.com";
let destination_port = 54321;

process.env[ "NODE_PATH" ] = __dirname;
require( "module" ).Module._initPaths();

let ws = require( "ws" );
let net = require( "net" );

let server = new ws.Server( { port: listen_port } );

server.on( "connection", function( src ) {
	let dest = net.connect( destination_port, destination_host );

	src.on( "close", () => dest.destroy() );
	src.on( "error", () => dest.destroy() );
	dest.on( "close", () => src.close() );
	dest.on( "error", () => src.close() );

	dest.on( "connect", function() {
		src.on( "message", data => dest.write( data, "binary" ) );
		dest.on( "data", data => src.send( data.toString( "binary" ) ) );
	} );
} );
