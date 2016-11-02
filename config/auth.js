var users = require('../app/models').users;
var crypto = require('crypto');
exports.login = function(req, res){
	if(req.body.username != null && req.body.username != '' && req.body.password != null && req.body.password != ''){
		users.findOne({where :{username: req.body.username}}).then(function(user){
			if(user == null)
			{
				res.status(401);
				res.end('No user with that username');
				console.log('No user with that username');	
			}
			else{
				var hashedPassword = crypto.createHash('md5').update(req.body.password).digest("hex");
				if(user.hashedPassword == hashedPassword){
					if(req.body.rememberme == true){
						res.cookie('username',req.body.username,{signed: true, maxAge: 360000000});
						res.cookie('usernamelocal',req.body.username, {maxAge: 360000000});
					}	
					else
					{
						res.cookie('username',req.body.username,{signed: true});
						res.cookie('usernamelocal',req.body.username);
					}
					res.status(200);
					res.end('success');
					console.log(req.body.username+' logged in');
					
				}
				else{
					res.status(401);
					res.end('Wrong credentials');
					console.log('Wrong credentials');
					
				}
			}
		})
	}
	else{
		console.log('Enter username and password');
		res.status(401);
		res.end('Enter username and password');
	}
}
exports.logout = function(req, res){
	if(req.signedCookies.username){
		res.cookie('username','');
		res.cookie('usernamelocal','');
		res.end(req.signedCookies.username+' logged out. Bye!');
	}
	else{
		res.end('No login found');
	}
}
exports.register = function(req, res){
	if(req.body.username!=null && req.body.password!=null)
	console.log("registering for "+req.body.username+" "+crypto.createHash('md5').update(req.body.password).digest("hex"));
	if(req.body.username !=null && req.body.password !=null)
	{
		users.findOne({where: {username: req.body.username}}).then(function(user){
			if(user !=null){
				res.end('Username already exists');
				res.status(400);
			}
			else
			{
				users.create({username: req.body.username, hashedPassword: crypto.createHash('md5').update(req.body.password).digest("hex"), color: req.body.color});
				res.status(200);
				res.end('Successfully added: '+req.body.username);
			}
		})
	}
	else
	{
		console.log('Enter all details');
		res.status (400);
		res.end('Enter all details');
	}
}

exports.verifyLoggedIn = function(req, res, next){
	if(req.signedCookies.username)
		next();
	else
	{
		// var err = new Error('Not logged in');
		// err.status = 401;
		// return next(err);
		res.status(401);
		res.end("Not logged in!");
	}
}
