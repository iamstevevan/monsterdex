const express = require('express')
const app = express()
const util = require('util');
const fs = require('fs');
const xmlParser = require('xml2json');

app.get('/', function(req, res) {

	var a = fs.readFile('monsters.xml', 'utf8', function(err, contents) {
	    //always show player at base load
	    var selected = 0
	    var monsters = JSON.parse(xmlParser.toJson(String(contents)));
		console.log("Found monsters xml with " + monsters.monsters.monster.length + " monsters (including player)");
		console.log(monsters.monsters.monster[selected]);


		res.render('', {
			title: 'Monster Rolodex',
			data: monsters.monsters.monster,
			selected: selected,
			selected_monster: "player",
			selected_stat:  "text"
		})
	});

})

// EDIT projects POST ACTION
app.post('/(:id)', function(req, res, next) {
	console.log("POST " + req.params.id);
	console.log(req.body);
	var selected = req.params.id

	var a = fs.readFile('monsters.xml', 'utf8', function(err, contents) {
	    //console.log(contents);

	    var monsters = JSON.parse(xmlParser.toJson(String(contents)));

		console.log("Found monsters xml with " + monsters.monsters.monster.length + " monsters (including player)");
		console.log(typeof(monsters));
		console.log(monsters.monsters.monster[0]["spawning"]["native_room"]);

		for(let i = 0; i<  monsters.monsters.monster.length; i++) {
			if(monsters.monsters.monster[i].id == req.params.id) {
				console.log("Found selected monster index " + i)
				selected = i
				break;
			}
		}

		res.render('', {
			title: 'Monster Rolodex',
			data: monsters.monsters.monster,
			selected: selected,
			selected_monster: monsters.monsters.monster[selected].id,
			selected_stat:  "text"
		})
	});

})


module.exports = app;
