'use strict';

// BASED OFF OF tgstation COMMIT 6fbf68ccfcd28e7b99a1ffdfde24dc49576cb819

const Bluespess = require('bluespess');
const finalhandler = require('finalhandler')
const http = require('http')
const serveStatic = require('serve-static')

console.log("Loading game..");

var server = new Bluespess();
global.server = server; // So the debugger can access it
module.exports.server = server;

server.importModule(require('./player.js'));
server.importModule(require('./code/game/mobs/new_player.js'));
server.importModule(require('./code/game/mobs/living/living.js'));
server.importModule(require('./code/game/mobs/living/carbon/carbon.js'));
server.importModule(require('./code/game/mobs/living/carbon/human/human.js'));
server.importModule(require('./code/game/objects/items/clothing.js'));
server.importModule(require('./code/game/objects/items.js'));
server.importModule(require('./code/game/objects/objs.js'));
server.importModule(require('./code/modules/atmospherics/environmental/turf.js'));
server.importModule(require('./code/modules/atmospherics/environmental/controller.js'));
server.importModule(require('./code/onclick/hud.js'));
server.importModule(require('./code/onclick/inventory.js'));

for(var x = -7; x <= 7; x++) for(var y = -7; y <= 7; y++) {
	var turf = new Bluespess.Atom(server, {"components": ["SimulatedTurf"],"vars":{"appearance":{"icon":'icons/turf/floors.png',"icon_state":"floor"}}}, x, y, 0);
	//turf.appearance.icon = 'icons/turf/floors.png';
	//turf.appearance.icon_state = 'floor';
}
for(var i = 0; i < 5; i++) {
	var template = {"components": ["Item"], "vars":{"appearance":{"icon":'icons/obj/items.png', "icon_state":"cuff_red","layer":2}}};
	var a = new Bluespess.Atom(server, template, i, 0, 0);
	console.log(template);
	a.components.Item.inhand_icon_state = "coil_red";
}

server.on("client_login", (client) => {
	var template = {"components": ["Player", "MobInventory", "LivingMob"]};
	var atom = new Bluespess.Atom(server, template, 0, 0, 0);
	console.log(template);
	atom.components.Mob.client = client;
	atom.appearance.icon = 'icons/mob/human.png';
	atom.appearance.icon_state = "skeleton";
	atom.appearance.layer = 5;
});

if(require.main == module) {
	console.log("Starting server..");
	var serve = serveStatic('./res/', {'index': ['index.html']});

	var httpServer = http.createServer((req, res) => {
		serve(req, res, finalhandler(req, res));
	});

	httpServer.listen(8080);
	server.startServer({websocket:{server: httpServer}});
	console.log("Server started.");
}