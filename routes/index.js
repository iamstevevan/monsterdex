const express = require('express')
const app = express()
const util = require('util');
const fs = require('fs');
const xmlParser = require('xml2json');

app.get('/', function(req, res) {
	console.log("GET root")
	var a = fs.readFile('monsters.xml', 'utf8', function(err, contents) {
	    //always show player at base load
	    var selected = 0
	    var monsters = JSON.parse(xmlParser.toJson(String(contents)));
		console.log("Found monsters xml with " + monsters.monsters.monster.length + " monsters (including player)");
		if("items" in monsters.monsters.monster[selected]) {
			console.log(monsters.monsters.monster[selected]["items"]);
		}		

		res.render('', {
			title: 'Monster Rolodex',
			data: monsters.monsters.monster,
			selected: selected,
			selected_monster: "player",
			selected_stat:  "text"
		})
	});

})

app.get('/(:id)', function(req, res, next) {
	console.log("GET by ID : " + req.params.id);

	var selected = req.params.id
	var selected_monster = selected

	// console.log(selected);

	var a = fs.readFile('monsters.xml', 'utf8', function(err, contents) {
	    //console.log(contents);

	    var monsters = JSON.parse(xmlParser.toJson(String(contents)));

		console.log("Found monsters xml with " + monsters.monsters.monster.length + " monsters (including player)");
		//console.log(typeof(monsters));

		var abort = false;
		console.log("Looking for " + selected)
		for(let i = 0; i<monsters.monsters.monster.length && !abort; i++) {
			
			if(monsters.monsters.monster[i].id == selected ) {
				console.log("Found selected monster index " + i)
				selected = i
				abort = true
			}
		}
		if(monsters.monsters.monster) {
			console.log(monsters.monsters.monster);
		}
		//console.log("Sending back " + selected_monster + " @ " + selected);
		// res.json(true)
		res.render('', {
			title: 'Monster Rolodex',
			data: monsters.monsters.monster,
			selected: selected,	//id
			selected_monster: selected_monster,	//string
			selected_stat:  "text"
		})
	});

})

// EDIT projects POST ACTION
app.post('/', function(req, res, next) {
	console.log("GET " + req.params.id);
	
	var selected = req.body.hidden_selected
	var selected_monster = selected

	console.log(selected);

	var a = fs.readFile('monsters.xml', 'utf8', function(err, contents) {
	    //console.log(contents);

	    var monsters = JSON.parse(xmlParser.toJson(String(contents)));

		console.log("Found monsters xml with " + monsters.monsters.monster.length + " monsters (including player)");
		//console.log(typeof(monsters));

		console.log("Looking for " + selected)
		for(let i = 0; i<  monsters.monsters.monster.length; i++) {
			
			if(monsters.monsters.monster[i].id == selected) {
				console.log("Found selected monster index " + i)
				selected = i
				break;
			}
		}

		// res.json(true)
		res.render('', {
			title: 'Monster Rolodex',
			data: monsters.monsters.monster,
			selected: selected,
			selected_monster: selected_monster,
			selected_stat:  "text"
		})
	});

})

module.exports = app;
