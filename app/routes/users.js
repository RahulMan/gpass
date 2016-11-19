var express = require('express');
var router = express.Router();
var auth = require('../../config/auth');
var users = require('../models').users;
var localStorage = require('localStorage')

var randomString = function(invalidChar)
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";
    possible = possible.replace(invalidChar,'');
    for( var i=0; i < 23; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

var shuffle = function (array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}

router.get('/glogin/:username', function(req, res) {
    console.log('glogging in-- first step');
    users.findOne({
        where: {
            username: req.params.username
        }
    }).then(function(user){
        if(user==null){
            console.log("user not found");
            res.status(401);
            res.end('User not found');
            return;
        }
        config = [];
        var password = user.hashedPassword;
        var color = user.color;
        var randomColor = [0,1,2,3,4,5,6,7,8,9,10,11];
        var ansArray =  [];
        var positionsLetters = [0,1,2,3,4,5,6,7,8,9,10,11,0,1,2,3,4,5,6,7,8,9,10,11];
        for(var i = 0;i<password.length;i++){
            // var randomColor = shuffle(order);
            var randomColor = [0,1,2,3,4,5,6,7,8,9,10,11];
            shuffle(randomColor);
            var randomText = randomString(password[i]);
            randomText += password[i];
            randomText = randomText.shuffle();
            var correctIndexColor = randomColor.indexOf(color) ;
            var correctIndexLetter = positionsLetters[randomText.indexOf(password[i])];
            var ans = (correctIndexLetter - correctIndexColor);
            if(ans>=12) ans-=12;
            if(ans<=-12) ans+=12;
            config.push({"randomText": randomText, "randomColor": randomColor});
            ansArray.push(ans);
        }
        console.log(config);
        console.log(ansArray);
        res.cookie('_gan',ansArray.toString(),{signed: true});
        res.cookie('username_unverified',req.params.username,{signed: true});
        // res['configText'] = configText;
        // res['configColor'] = configColor;
        res.status(200);
        // res.end("proceeding");
        res.json(config);
    },function(error){
            console.log(error);
            res.status(401);
            res.end('User not found');
        }
    )
    // auth.login(req,res);
});

router.post('/glogin/', function(req, res) {
    console.log('glogging in- second step');
    correctAnswers = req.signedCookies._gan.split(',');
    proposedAnswers = req.body.answers;
    
    if(proposedAnswers.length!=correctAnswers.length){
        console.log('Password length error');
        res.status(401);
        res.end('Incorrect');
        return;
    }
    for(var i=0;i<correctAnswers.length;i++)
        correctAnswers[i] = parseInt(correctAnswers[i]);
    console.log(correctAnswers);
    console.log(proposedAnswers);
    console.log("Checking individual entries now now");
    for(var i=0;i<proposedAnswers.length;i++)
    {
        if(!(proposedAnswers[i]==correctAnswers[i] || proposedAnswers[i]==correctAnswers[i]+12 ||  proposedAnswers[i]==correctAnswers[i]-12))
            {
                res.status(401);
                res.end('Incorrect');
                console.log('Letter '+i+' differenet. Login abort.');
                return;
            }
    }
    console.log('successful login: '+req.signedCookies.username_unverified);
    res.cookie('username',req.signedCookies.username_unverified,{signed: true});
    res.cookie('usernamelocal',req.signedCookies.username_unverified);
    res.status(200);
    res.end('Signed In');
    console.log('Sign In successful');
});


router.get('/:username',  function(req, res) {
    users.findOne({where:{username:req.params.username}}).then(function(user){
        if(user!=null){
        console.log(JSON.stringify(user));
        // res.json(centre);
        res.json(user);
        }
    });
});




router.post('/login', function(req, res) {
    console.log('logging in');
    auth.login(req,res);
});

// router.put('/:username', function(req, res) {
//     if(req.body.oldpassword!=null)
//     {users.findOne({where:{username:req.params.username}}).then(function(user){
//             if(user!=null){
//                 if(user.hashedPassword == crypto.createHash('md5').update(req.body.oldpassword).digest("hex")){
//                      console.log('correct old password');
//                     user.updateAttributes({
//                       hashedPassword: crypto.createHash('md5').update(req.body.newpassword).digest("hex")
//                     }).then(function (result) { 
//                             console.log(JSON.stringify(result));
//                             res.end("successfully updated")
//                         }, function(rejectedPromiseError){
    
//                         });
//                 }
//                 else
//                     {
//                         console.log('incorrect old password');
//                         res.status(401);
//                         res.end('wrong old password');
//                     }
//             }
//         });}
//     else{
//             users.update(
//     req.body, {where:{username:req.params.username}}
//     )
//     .then(function (result) { 
//         console.log(JSON.stringify(result));
//         res.end("successfully updated")
//     }, function(rejectedPromiseError){

//     });
//     }
// });

router.delete('/:username',function(req,res){
    users.destroy({
        where:{
            username:req.params.username
        }
    }).then(function(result){
        res.json(result);
    },function(rejectedPromiseError){
        res.status(400);
        res.end("Error Occurred in user route delete!");
    })
});


router.post('/register', function(req, res) {
    console.log('Registering');
    auth.register(req,res);
});



router.post('/logout', function(req, res) {
    auth.logout(req,res);
});

module.exports = router;