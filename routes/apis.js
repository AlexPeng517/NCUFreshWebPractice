require('../lib/db');

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');
var Comment = mongoose.model('Comment');
var Users = mongoose.model('Users');
var bcrypt = require('bcryptjs')

 var bodyParser = require('body-parser');
 var urlencodedParser = bodyParser.urlencoded({ extended: false });





/*
module.exports.register = function(newUser, callback){
	bcrypt.genSalt(10, function(err,salt){
		bcrypt.hash(newUser.password, salt, function(err, hash)){
			newUser.password = hash
			newUser.save(callback)
		}
	})
}


// getUserByUsername, 用username來找使用者
module.exports.getUserByUsername = function(username, callback) {
  var query = { username: username }
  Users.findOne(query, callback)
}

// getUserById, 用id來找使用者
module.exports.getUserById = function(id, callback) {
  Users.findById(id, callback)
}

// comparePassword, 當使用者登入的時候我們要比對登入密碼跟我們資料庫密碼相同
module.exports.comparePassword = function(candidatePassword, hash,callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if(err) throw err
    callback(null, isMatch)
});
}

*/


router.post('/register',urlencodedParser,function(req, res, next){
  Users.findOne({Username: req.body.username},function(err,userinfo){

    if(userinfo.Username == req.body.username){
      res.redirect('../users/signin');
    }else{
        bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(req.body.passwd, salt, function(err, hash){
          new Users({
            Username: req.body.username,
            Password: hash
          }).save(function(err){
            if (err){
              console.log("Fail to register");
            }else{
              console.log("New user created");
            }
          });
          res.redirect('/');
        });
      });

    }

  });
  
});

router.get('/delete/:id', function(req, res, next) {
  Blog.remove({_id: req.params.id }, function(err){
       if (err) console.log('Fail to delete article');
       else console.log('Done');
  });
  res.redirect('/users/profile');
});

router.post('/login',urlencodedParser, function(req, res, next) {
  Users.findOne({Username:req.body.username},function (err, userinfo) {
    console.log(req.body.passwd);
    console.log(userinfo.Password);
    bcrypt.compare(req.body.passwd,userinfo.Password,function(err, result){
      if (result){
        console.log("valid");
        req.session.logined = true;
        res.redirect('/');
      }else{
        console.log("invalid");
        req.session.logined = false;
        res.redirect('../users/signin');
      }
    });
  });

  

});

/*
 var input_pwd = req.body.passwd;
  
  Users.findOne({Username:req.body.username}, function(req, res, username){
    //if (err) throw err;
    console.log(username);
    bcrypt.compare(input_pwd,this.Password,function(err,isMatch){
       if (isMatch){
        //req.session.logined = true;
        //res.redirect('/profile');
        console.log("success");
       }else{
        //req.session.logined = false;
        //alert("Invalid Password");
        //res.redirect('/');
       }
    });
    
    });


*/



/*
  if ((!req.body.user) || (!req.body.passwd)) {
    res.redirect('/users/register');
    return;
  }
  req.session.name = req.body.user;
  req.session.passwd = req.body.passwd;
  req.session.logined = true;
  res.redirect('/');
*/









router.post('/add', function(req, res, next) {
  if (!req.session.name){
  	res.redirect('/');
  	return;
  }
  new Blog({
  	Username: req.session.name,
  	Article: req.body.Content,
  	CreateDate: Date.now()
  }).save(function(err){
  	if (err){
  		console.log('Fail to save to DB');
  		return;
  	}
  	console.log('Save to DB');
  });
  res.redirect('/');
});

router.post('/update/:id', function(req, res, next) {
  console.log(req.params.id);
  if (!req.params.id){
  	res.redirect('/');
  	return;
  }
  console.log(req.params.id);
  Blog.update({_id: req.params.id}, {Article: req.body.Content}, function(err){
  	if (err) console.log('Fail to update article');
  	else console.log('Done');
  });
  res.redirect('/users/profile');
});

router.post('/comment/:id', function(req, res, next){
	if (!req.params.id){
		res.redirect('/');
		return;
	}
	new Comment({
		Visitor: req.body.Visitor,
		Comment: req.body.Comment,
		MessageID: req.params.id,
		CreateDate: Date.now()
	}).save(function(err){
		if (err) {
			console.log('Fail to save to DB');
			return;
		}
		console.log('Save to DB');
	});
	res.redirect('/users/message/'+req.params.id) ;
});



module.exports = router;
