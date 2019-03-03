var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId
var randtoken = require('rand-token');

// SHOW LIST OF projects
app.get('/', function(req, res, next) {
	console.log("List projects ")
	req.db.collection('projects').find().sort({"_id": 1}).toArray(function(err, result) {
		project_name = ""
		try {
			project_name = result[0]["project"]["information"]["details"]["name"]
		}
		catch(err) {
			project_name = ""
		}

		if(req.headers['user-agent'].includes("curl")){
			console.log(req.headers['user-agent'])
			res.send(result)
		}
		else{
			//if (err) return console.log(err)
			if (err) {
				req.flash('error', err)
				res.render('projects/list', {
					title: 'Projects List',
					data: undefined
				})
			} else {
				// render to views/user/list.ejs template name
				res.render('projects/list', {
					title: 'Projects List',
					project_name: project_name,
					data: result
				})
			}
		}
	})
})

// SHOW EDIT projects FORM
app.get('/edit/(:id)', function(req, res, next) {
	console.log("GET " + req.params.id)

	var o_id = new ObjectId(req.params.id)

	req.db.collection('projects').find({"_id": o_id}).toArray(function(err, result) {

		if(err) return console.log(err)

		// if project not found
		if (!result) {
			req.flash('error', 'Project not found with id = ' + req.params.id)
			res.redirect('/projects')
		}
		else { // if project found
			// render to views/user/edit.ejs template name

			console.log(result)

			res.render('projects/edit', {
				title: 'Edit Project',
				//data: rows[0],
				id: result[0]._id,
				project_name: result[0]["project"]["information"]["details"]["name"],
				project: JSON.stringify(result[0].project,null,2)
			})
		}
	})
})

// EDIT projects POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	console.log("PUT " + req.params.id)
	req.assert('name', 'Name is required').notEmpty()           //Validate name
	req.assert('description', 'Description is required').notEmpty()             //Validate description
    req.assert('epic', 'A valid epic is required').notEmpty()  //Validate epic

    var errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!

		/********************************************
		 * Express-validator module

		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			description: req.sanitize('description').escape().trim(),
			epic: req.sanitize('epic').escape().trim()
		}

		var o_id = new ObjectId(req.params.id)
		req.db.collection('projects').update({"_id": o_id}, user, function(err, result) {
			if (err) {
				req.flash('error', err)

				// render to views/user/edit.ejs
				res.render('projects/edit', {
					title: 'Edit Project',
					id: req.params.id,
					name: req.body.name,
					description: req.body.description,
					epic: req.body.epic
				})
			} else {
				req.flash('success', 'Data updated successfully!')

				res.redirect('/projects')

				// render to views/user/edit.ejs
				/*res.render('user/edit', {
					title: 'Edit Project',
					id: req.params.id,
					name: req.body.name,
					description: req.body.description,
					epic: req.body.epic
				})*/
			}
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)

		/**
		 * Using req.body.name
		 * because req.param('name') is deprecated
		 */
        res.render('projects/edit', {
            title: 'Edit Project',
			id: req.params.id,
			name: req.body.name,
			description: req.body.description,
			epic: req.body.epic
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
	var o_id = new ObjectId(req.params.id)
	req.db.collection('projects').remove({"_id": o_id}, function(err, result) {
		if (err) {
			req.flash('error', err)
			// redirect to projects list page
			res.redirect('/projects')
		} else {
			req.flash('success', 'Project deleted successfully! id = ' + req.params.id)
			// redirect to projects list page
			res.redirect('/projects')
		}
	})
})

app.get('/new', function(req, res, next) {
	console.log("Get to new")
	var token = randtoken.generate(12);

	var o_id = ""
	var check = 0
	var limit = 10
	do {
	   o_id = new ObjectId(token)
	  	steve = req.db.collection('projects').find({"_id":o_id}).sort({"_id": 1}).toArray(function(err, result) {
			check = result.length
		})
		--limit
	}
	while (check == 0 && limit>1);
	var ts = String(Math.round((new Date()).getTime() / 1000))
	console.log("Get to new " + token + " @ " + ts )
	// fetch and sort projects collection by id in descending order
	//req.db.collection('forms').find().sort({"_id": 1}).toArray(function(err, result) {

		// if(req.headers['user-agent'].includes("curl")){
		// 	console.log(req.headers['user-agent'])
		// 	res.send(result)
		// }
		// else{
			//if (err) return console.log(err)
			// if (err) {
			// 	req.flash('error', err)
			// 	res.render('projects/new', {
			// 		title: 'Projects Form',
			// 		data: ''
			// 	})
			// } else {
				// render to views/user/list.ejs template name
				res.render('projects/new', {
					title: 'Projects Form',
					pid: token,
					origin_date: ts
					//data: result[0]
				})
			//}
		//}
	//})
})

app.post('/information', function(req, res, next) {
	console.log("Posting to information")
	pid = req.body['pid']

	delete req.body['pid']

	origin_date = req.body['origin_date']

	delete req.body['origin_date']

	console.log(pid + " @ " + origin_date)

	project = {}

	for (var key in req.body) {
	    console.log("Body has " + req.body[key] + " is #" + key); // "User john is #234"
	}

	// fetch and sort projects collection by id in descending order
	//req.db.collection('forms').find().sort({"_id": 1}).toArray(function(err, result) {

		// if(req.headers['user-agent'].includes("curl")){
		// 	console.log(req.headers['user-agent'])
		// 	res.send(result)
		// }
		// else{
			//if (err) return console.log(err)
			// if (err) {
			// 	req.flash('error', err)
			// 	res.render('projects/information', {
			// 		title: 'Project Information',
			// 		data: ''
			// 	})
			// } else {
				// render to views/user/list.ejs template name
				res.render('projects/information', {
					title: 'Project Information',
					pid: pid,
					origin_date: origin_date
					//data: result[0]
				})
			//}
		//}
	//})
})

app.post('/data', function(req, res, next) {
	console.log("Posting to data")

	var pid = req.body['pid']

	delete req.body['pid']

	origin_date = req.body['origin_date']

	delete req.body['origin_date']

	var p = req.body['information_project_name']

	console.log(pid + " " + p + " @ " + origin_date)

	var access_request = {}
	var notifier_request = {}

	for (var key in req.body) {
		//console.log(key)
	    if(key.startsWith("information_req")) {

	    	var index = key.substring(key.length -1)

	    	if(index in access_request){
	    		access_request[index][key.substring(0,key.length -1).replace("information_req_","")] = req.body[key]
	    	}
	    	else {
	    		access_request[index] = {}
	    		access_request[index][key.substring(0,key.length -1).replace("information_req_","")] = req.body[key]
	    	}
	    }
	    else if (key.startsWith("information_not")) {
	    	var index = key.substring(key.length -1)

	    	if(index in notifier_request){
	    		notifier_request[index][key.substring(0,key.length -1).replace("information_not_","")] = req.body[key]
	    	}
	    	else {
	    		notifier_request[index] = {}
	    		notifier_request[index][key.substring(0,key.length -1).replace("information_not_","")] = req.body[key]
	    	}
	    }
	}

	//console.log(access_request)

	var project = '{"timestamps": {"origin_date": ""},"information": {"details": {"name": "", "description": "", "docs": "", "funding_id": ""}, "contacts": {"program": {"name": "", "email": "", "cell": "", "desk": ""}, "project": {"name": "", "email": "", "cell": "", "desk": ""}, "splunk": {"name": "", "email": "", "cell": "", "desk": ""} }, "approvers": {"primary": {"name": "", "email": "", "cell": "", "desk": "", "env": ""}, "backup": {"name": "", "email": "", "cell": "", "desk": "", "env": ""} }, "access_requests": "", "notifications": ""} }'
	var project = JSON.parse(project);

	project["timestamps"]["origin_date"] = origin_date

	project["information"]["access_requests"] = access_request
	project["information"]["notifications"] = notifier_request

	project["information"]["details"]["name"] = req.body["information_project_name"]
	project["information"]["details"]["description"] = req.body["information_project_description"]
	project["information"]["details"]["docs"] = req.body["information_project_docs"]
	project["information"]["details"]["funding_id"] = req.body["information_funding_id"]

	project["information"]["contacts"]["program"]["name"] = req.body["information_program_contact_name"]
	project["information"]["contacts"]["program"]["email"] = req.body["information_program_contact_email"]
	project["information"]["contacts"]["program"]["cell"] = req.body["information_program_contact_cell"]
	project["information"]["contacts"]["program"]["desk"] = req.body["information_program_contact_desk"]

	project["information"]["contacts"]["project"]["name"] = req.body["information_project_contact_name"]
	project["information"]["contacts"]["project"]["email"] = req.body["information_project_contact_email"]
	project["information"]["contacts"]["project"]["cell"] = req.body["information_project_contact_cell"]
	project["information"]["contacts"]["project"]["desk"] = req.body["information_project_contact_desk"]

	project["information"]["contacts"]["splunk"]["name"] = req.body["information_splunk_contact_name"]
	project["information"]["contacts"]["splunk"]["email"] = req.body["information_splunk_contact_email"]
	project["information"]["contacts"]["splunk"]["cell"] = req.body["information_splunk_contact_cell"]
	project["information"]["contacts"]["splunk"]["desk"] = req.body["information_splunk_contact_desk"]

	project["information"]["approvers"]["primary"]["name"] = req.body["information_primary_approver_name"]
	project["information"]["approvers"]["primary"]["email"] = req.body["information_primary_approver_email"]
	project["information"]["approvers"]["primary"]["cell"] = req.body["information_primary_approver_cell"]
	project["information"]["approvers"]["primary"]["desk"] = req.body["information_primary_approver_desk"]
	project["information"]["approvers"]["primary"]["env"] = req.body["information_primary_approver_env"]

	project["information"]["approvers"]["backup"]["name"] = req.body["information_backup_approver_name"]
	project["information"]["approvers"]["backup"]["email"] = req.body["information_backup_approver_email"]
	project["information"]["approvers"]["backup"]["cell"] = req.body["information_backup_approver_cell"]
	project["information"]["approvers"]["backup"]["desk"] = req.body["information_backup_approver_desk"]
	project["information"]["approvers"]["backup"]["env"] = req.body["information_backup_approver_env"]

	console.log(JSON.stringify(project))

	o_id = new ObjectId(pid)

	// console.log(o_id)

	//console.log("Before save id is " + id)

	let dbupdate = req.db.collection('projects').insert( { _id: o_id, project: project } )

	//console.log(dbupdate) // Promise { <pending> }

	dbupdate.then(function(result) {
	   //console.log(result) //will log results.
	})

	// fetch and sort projects collection by id in descending order
	//req.db.collection('forms').find().sort({"_id": 1}).toArray(function(err, result) {

		// if(req.headers['user-agent'].includes("curl")){
		// 	console.log(req.headers['user-agent'])
		// 	res.send(result)
		// }
		// else{
			//if (err) return console.log(err)
			// if (err) {
			// 	req.flash('error', err)
			// 	res.render('projects/data', {
			// 		title: 'Project Data',
			// 		data: ''
			// 	})
			// } else {
				// render to views/user/list.ejs template name
				res.render('projects/data', {
					title: 'Project Data',
					pid: pid,
					origin_date: origin_date,
					project: p
					//data: result[0]
				})
			//}
		//}
	//})
})

app.post('/knowledgeobjects', function(req, res, next) {


	//console.log("PUT " + req.params.id)
	// req.assert('name', 'Name is required').notEmpty()           //Validate name
	// req.assert('description', 'Description is required').notEmpty()             //Validate description
 //    req.assert('epic', 'A valid epic is required').notEmpty()  //Validate epic

    // var errors = req.validationErrors()
	console.log("Posting to knowledgeobjects")

	var pid = req.body['pid']

	delete req.body['pid']

	origin_date = req.body['origin_date']

	delete req.body['origin_date']

	var p = req.body['project']

	var k2 = req.body['k2_project_checkbox']

	console.log(k2)

	console.log(pid + " " + p + " @ " + origin_date)

	var ds = {}

	for (var key in req.body) {
	    if(key.startsWith("data_src")) {

	    	var index = key.substring(key.length -1)
	    	//console.log("Found data source table row item with index " + index)
	    	if(index in ds){
	    		ds[index][key.substring(0,key.length -1).replace("data_src_","")] = req.body[key]
	    	}
	    	else {
	    		ds[index] = {}
	    		ds[index][key.substring(0,key.length -1).replace("data_src_","")] = req.body[key]
	    	}
	    }
	}
	//console.log("Data sources array is: \n")
	//console.log(ds)

	var data_sources = ''

	if(k2) {
		data_sources = '{"data": {"sources": "", "k2": {"galoriginaldestination": "", "dp_fqcn": "", "esb_ib_nonprod_fqcn": "", "esb_ib_prod_fqcn": "", "was_prod_fqcn": ""}, "settings": {"max_vol_prod": "", "max_vol_nonprod": "", "growth_prod": "", "growth_nonprod": "", "online_retention_prod": "", "online_retention_nonprod": "", "offline_retention_prod": "", "offline_retention_nonprod": ""}}}'
	}
	else {
		data_sources = '{"data": {"sources": "", "settings": {"max_vol_prod": "", "max_vol_nonprod": "", "growth_prod": "", "growth_nonprod": "", "online_retention_prod": "", "online_retention_nonprod": "", "offline_retention_prod": "", "offline_retention_nonprod": ""}}}'
	}

	// var data_sources = '{"data": {"sources": "", "settings": {"max_vol_prod": "", "max_vol_nonprod": "", "growth_prod": "", "growth_nonprod": "", "online_retention_prod": "", "online_retention_nonprod": "", "offline_retention_prod": "", "offline_retention_nonprod": ""}}}'

	var data_sources = JSON.parse(data_sources);


	data_sources["data"]["sources"] = ds
	data_sources["data"]["settings"]["max_vol_prod"] = req.body["data_max_vol_prod"]
	data_sources["data"]["settings"]["max_vol_nonprod"] = req.body["data_max_vol_nonprod"]
	data_sources["data"]["settings"]["growth_prod"] = req.body["#data_growth_prod"]
	data_sources["data"]["settings"]["growth_nonprod"] = req.body["data_growth_nonprod"]
	data_sources["data"]["settings"]["online_retention_prod"] = req.body["data_online_retention_prod"]
	data_sources["data"]["settings"]["online_retention_nonprod"] = req.body["data_online_retention_nonprod"]
	data_sources["data"]["settings"]["offline_retention_prod"] = req.body["data_offline_retention_prod"]
	data_sources["data"]["settings"]["offline_retention_nonprod"] = req.body["data_offline_retention_nonprod"]

	if(k2) {
		data_sources["data"]["k2"]["galoriginaldestination"] = req.body["k2_galoriginaldestination"]
		data_sources["data"]["k2"]["dp_fqcn"] = req.body["k2_dp_fqcn"]
		data_sources["data"]["k2"]["esb_ib_nonprod_fqcn"] = req.body["k2_esb_ib_nonprod_fqcn"]
		data_sources["data"]["k2"]["esb_ib_prod_fqcn"] = req.body["k2_esb_ib_prod_fqcn"]
		data_sources["data"]["k2"]["was_prod_fqcn"] = req.body["k2_was_prod_fqcn"]
	}

	// console.log(JSON.stringify(data_sources))

	errors = false

    if( errors == false) {   //No errors were found.  Passed Validation!

		/********************************************
		 * Express-validator module

		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		// var user = {
		// 	name: req.sanitize('name').escape().trim(),
		// 	description: req.sanitize('description').escape().trim(),
		// 	epic: req.sanitize('epic').escape().trim()
		// }

		// this is used to display the actual mongodb key, where PID is just the token used to create it.
		var o_id = new ObjectId(pid)

		req.db.collection('projects').update({"_id": o_id}, {$set: data_sources}, function(err, result) {
			// console.log(result)
			if (err) {
				console.log("write Failed")
				res.render('projects/review', {
					title: 'Project Review',
					pid: o_id,
					origin_date: origin_date,
					project: p
					//data: result[0]
				})
			} else {
				console.log("write OK")
				res.render('projects/review', {
					title: 'Project Review',
					pid: o_id,
					origin_date: origin_date,
					project: p
					//data: result[0]
				})
			}
		})
	}
	else {   //Display errors to user
		// var error_msg = ''
		// errors.forEach(function(error) {
		// 	error_msg += error.msg + '<br>'
		// })
		// req.flash('error', error_msg)

		// *
		//  * Using req.body.name
		//  * because req.param('name') is deprecated

  //       res.render('projects/edit', {
  //           title: 'Edit Project',
		// 	id: req.params.id,
		// 	name: req.body.name,
		// 	description: req.body.description,
		// 	epic: req.body.epic
  //       })
    }
})

app.post('/save', function(req, res, next) {

	pid = req.body['pid']

	delete req.body['pid']

	fullproject = req.body['project']

	delete req.body['project']

	console.log(fullproject)

	id = new ObjectId(pid)

	console.log("Before save id is " + id)

	let dbupdate = req.db.collection('projects').insert( { _id: id, project: fullproject } )

	console.log(dbupdate) // Promise { <pending> }

	dbupdate.then(function(result) {
	   console.log(result) //will log results.
	})

	// fetch and sort projects collection by id in descending order
	req.db.collection('forms').find().sort({"_id": 1}).toArray(function(err, result) {

		if(req.headers['user-agent'].includes("curl")){
			console.log(req.headers['user-agent'])
			res.send(result)
		}
		else{
			//if (err) return console.log(err)
			if (err) {
				req.flash('error', err)
				res.render('projects/new', {
					title: 'Projects Form',
					data: ''
				})
			} else {
				// render to views/user/list.ejs template name
				res.render('projects/new', {
					title: 'Projects Form',
					data: result[0]
				})
			}
		}
	})

	// // fetch and sort projects collection by id in descending order
	// req.db.collection('forms').find().sort({"_id": 1}).toArray(function(err, result) {

	// 	if(req.headers['user-agent'].includes("curl")){
	// 		console.log(req.headers['user-agent'])
	// 		res.send(result)
	// 	}
	// 	else{
	// 		//if (err) return console.log(err)
	// 		if (err) {
	// 			req.flash('error', err)
	// 			res.render('projects/review', {
	// 				title: 'Project Review',
	// 				data: ''
	// 			})
	// 		} else {
	// 			// render to views/user/list.ejs template name
	// 			res.render('projects/save', {
	// 				title: 'Project Save',
	// 				pid: pid,
	// 				project: project,
	// 				data: result[0]
	// 			})
	// 		}
	// 	}
	// })
})

// SHOW LIST OF projects
app.get('/stakeholders', function(req, res, next) {
	console.log("List stakeholders ")
	req.db.collection('projects').find().sort({"_id": 1}).toArray(function(err, result) {
		project_name = ""
		try {
			project_name = result[0]["project"]["information"]["details"]["name"]
		}
		catch(err) {
			project_name = ""
		}

		if(req.headers['user-agent'].includes("curl")){
			console.log(req.headers['user-agent'])
			res.send(result)
		}
		else{
			//if (err) return console.log(err)
			if (err) {
				req.flash('error', err)
				res.render('projects/list', {
					title: 'Projects List',
					data: undefined
				})
			} else {
				// render to views/user/list.ejs template name
				res.render('projects/list', {
					title: 'Projects List',
					project_name: project_name,
					data: result
				})
			}
		}
	})
})





module.exports = app
