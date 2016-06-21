// vendor library
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

//mysql
var mysql      = require('mysql');
var connection = mysql.createConnection({//Database setting
  host     : 'localhost', //database IP
  user     : 'root',
  password : 'root',
  database : 'UniNetExpressLane' //database name
});

var queryString = 'SELECT Text FROM Emailtext';

// node mailler
var nodemailer = require('nodemailer'); //nodemailler
var transporter = nodemailer.createTransport({
  service: 'gmail',
    auth: {
      user: 'expresslane.alert@gmail.com',
	  pass: 'vk0kipN;ik'
    }
});


// custom library
// model
var Model = require('./models/model');

// index
var index = function(req, res, next) {
   if(!req.isAuthenticated()) {
      res.render('index', {title: 'Home',req:req});
   } else {

     var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
    req.getConnection(function (err, connection) {

        var query = connection.query("UPDATE User set flag=1 WHERE id = ? ",[user.id], function(rows)
        {


        });

    });
          res.render('index', {title: 'Home',req:req, user: user});
   }
};

var member = function(req, res, next) {
   if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role === 1) {
          res.render('admin', {title: 'Home', user: user});
      } else {
          res.render('member', {title: 'Home', user: user});
      }
   }
};


var profile = function(req, res, next) {
   if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role === 1) {
          res.render('profileadmin', {title: 'profileadmin', user: user});
      } else {
          res.render('profile', {title: 'profile', user: user});
      }
   }
};

var repass = function(req, res, next) {
   if(!req.isAuthenticated()) {
      res.render('repass', {title: 'Reset Password',req:req});
   } else {

      var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
      }
          res.render('repass', {title: 'Reset Password', req:req,user: user});
   }
};

var repasspost = function(req, res, next) {
   if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role === 1) {
          res.redirect('/');
      } else {
          res.redirect('/');
      }
   }
};

var about = function(req, res, next) {
   if(!req.isAuthenticated()) {
        res.render('about', {title: 'about',req:req});
   }else{
    var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
      }
      res.render('about', {title: 'about',req:req, user: user});

  }
};

var status = function(req, res, next) {
   if(!req.isAuthenticated()) {
       req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM Online_Status',function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            res.render('status',{page_title:"status",req:req,data:rows});
         });
         //console.log(query.sql);
         });
   }else{
    var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
      }
      req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM Online_Status',function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            res.render('status',{page_title:"status",req:req,user:user,data:rows});
         });
         //console.log(query.sql);
         });
         
  }
};


var service = function(req, res, next) {
   if(!req.isAuthenticated()) {
        res.render('service', {title: 'service',req:req});
   }else{
    var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
      }
      res.render('service', {title: 'service',req:req, user: user});
   }
};
var document = function(req, res, next) {
   if(!req.isAuthenticated()) {
        res.render('document', {title: 'document',req:req});
   }else{
    var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
      }
      res.render('document', {title: 'document',req:req, user: user});

  }
};

var contact = function(req, res, next) {
   if(!req.isAuthenticated()) {
        res.render('contact', {title: 'contact',req:req});
   }else{
    var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
      }
      res.render('contact', {title: 'contact',req:req, user: user});

  }
};


var serviceac = function(req, res, next) {
   if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role === 1) {
          res.redirect('/adminindex');
      } else {
        req.getConnection(function(err,connection){
          var query = connection.query('SELECT ResourceAllocated.resourceString1,ResourceAllocated.resourceString2,ResourceAllocated.IP1,ResourceAllocated.IP2,ResourceAllocated.startTime,ResourceAllocated.endTime FROM ResourceAllocated LEFT JOIN ServiceActivities ON ResourceAllocated.said=ServiceActivities.said JOIN ServiceRequests ON ServiceActivities.sid=ServiceRequests.sid WHERE user = ? and actbyuser != 1',[user.id],function(err,rows){
            res.render('serviceac',{page_title:"user",user: user,data:rows});
          });
        });
      }
   }
};

var ccServiceac = function(req, res, next){
  if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role !== 1) {
          res.redirect('/serviceac');
      } else {
        var id = req.params.id;
        //var query = connection.query("UPDATE ServiceActivities set actbyuser = '1' WHERE said = ?",[data.id], function(err, rows){

        //  if (err)
        //      console.log("Error Updating : %s ",err );
        //};
      }
    }
};

var addServiceac = function(req, res, next){
  var input = JSON.parse(JSON.stringify(req.body));
  var user = req.user;
  
   req.getConnection(function (err, connection) {
   var query = connection.query("INSERT INTO ServiceRequests set user = ? ",[user.id], function(err, rows){
		if (err)
			console.log("Error inserting : %s ",err );
		var query = connection.query("INSERT INTO ServiceActivities (sid) SELECT sid From ServiceRequests WHERE user = ? Order By ServiceRequests.sid Desc LIMIT 1",[user.id],function(err,a){
			//console.log(a);
        if (err)
			console.log("Error inserting : %s ",err );
        var query = connection.query("SELECT said From ServiceActivities Order By said Desc LIMIT 1",function(err,ss){
			if (err)
				console.log("Error inserting : %s ",err );
			var str = JSON.stringify(ss);
            ss1 = JSON.parse(str);
            var data = {

				resourceString1    : input.resourceString1,
				resourceString2    : input.resourceString2,
				IP1                : input.IP1,
				IP2                : input.IP2,
				startTime          : input.startTime,
				endTime            : input.endTime,
				said               : ss1[0].said,
            };
			
            var query = connection.query("INSERT INTO ResourceAllocated set ? ",data, function(err, rows){
				if (err)
					console.log("Error inserting : %s ",err );
			});
        });
      });
    });
    res.redirect('/serviceac');
  });
};


var user = function(req, res, next) {
   if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role !== 1) {
          res.redirect('/');
      } else {

        req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM User WHERE role IS NOT NULL',function(err,rows1)
        {

            if(err)
                console.log("Error Selecting : %s ",err );
            var query = connection.query('SELECT * FROM User WHERE role IS NULL',function(err,rows2)
            {

            if(err)
                console.log("Error Selecting : %s ",err );
            res.render('user',{page_title:"user",user: user,data:rows1,data1:rows2});
         });
         });
         //console.log(query.sql);
         });

      }

   }
};

var accept = function(req,res){
     if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role !== 1) {
          res.redirect('/');
      } else {
          var id = req.params.id;
		  
		  // query User data
		  var Nametemp, Lastnametemp, Userid, Userpassword, Emailtemp = "";
		  var datatemp = connection.query("SELECT * FROM User WHERE id = ? ",[id],function(err, rows){
				if (err){
					console.log("Error reciving data : %s ",err );
				} else {
					datatemp = rows[0];
					Nametemp = rows[0].NameE;
					Lastnametemp = rows[0].LastNameE;
					Userid = rows[0].username;
					Userpassword = rows[0].password;
					Emailtemp = rows[0].email;
					console.log("data recived : %s ",err );	
				}
		  });
		  //
		  
          req.getConnection(function (err, connection) {
            connection.query("UPDATE User SET role = 2 WHERE id = ? ",[id], function(err, rows){
             if(err)
                 console.log("Error accept : %s ",err );
             res.redirect('/user');
            });
			
            var emailtemp = connection.query(queryString, function(err, result){ //Query data from database
              if(!err) {
                //connection.release();
                var temp = result[3].Text.split("*").map(function (val) {
                  return (val);
                });

                // send email notification
                transporter.sendMail({
                  form: 'Uninet Express Lane Services Team',
                  to: Emailtemp,
                  subject: 'Uninet Express Lane',
                  html:'<div style="width:600px;font-size:14px;color:#333333;font-family:Trebuchet MS,Verdana,Arial,Helvetica,sans-serif;"><br>Dear '+ Nametemp+' '+ Lastnametemp+', <br><br>'+temp[0]+Nametemp+temp[1]+Userid+temp[2]+Userpassword+temp[3]+'<br><br><br><hr color="#666666" align="left" width="600" size="1" noshade=""></div>',
                });

                //console.log(arr);
                console.log("Email was send ...");

              } else {
                console.log("Error query database ...");
                //connection.release();
              }
            });
          });
      }
   }
};

var saveedit = function(req, res){
    if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role !== 1) {
          res.redirect('/memberindex');
      } else {
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        var data = {
            username  : input.username,
            NameE    : input.NameE,
            LastNameE : input.LastNameE,
            org     : input.org,
            phone   : input.phone,
            email   : input.email,
            membertype : input.membertype,
            role    : input.role,
            flag    : input.flag
        };

        var query = connection.query("UPDATE User set ? WHERE id = ? ",[data,id], function(err, rows)
        {

          if (err)
              console.log("Error Updating : %s ",err );

          res.redirect('/user');

        });

    });
   }
  }
};
var edit = function(req, res){
    if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role !== 1) {
          res.redirect('/memberindex');
      } else {
    var id = req.params.id;

    req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM User WHERE id = ?',[id],function(err,rows)
        {

            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('edit',{page_title:"Edit",user:user,data:rows});
         });

         //console.log(query.sql);
       });
     }
   }
};


var delete_user = function(req,res){
    if(!req.isAuthenticated()) {
      res.redirect('/');
	} else {
		var user = req.user;
		if(user !== undefined) {
			user = user.toJSON();
		} if (user.role !== 1) {
			res.redirect('/');
		} else {
		//exports.list = function(req, res){
			var id = req.params.id;
	 
			// query User data
			var mailchecker = 0;
			var Nametemp, Lastnametemp, Userid, Userpassword, Emailtemp = "";
			var datatemp = connection.query("SELECT * FROM User WHERE id = ? ",[id],function(err, rows){
				if (err){
					console.log("Error reciving data : %s ",err );
				} else {
					datatemp = rows[0];
					Nametemp = rows[0].NameE;
					Lastnametemp = rows[0].LastNameE;
					Userid = rows[0].username;
					Userpassword = rows[0].password;
					Emailtemp = rows[0].email;
					console.log("data recived : %s ",err );
			
					//Send Email
					var emailtemp = connection.query(queryString, function(err, result){ //Query data from database
						if(!err) {
							//connection.release();
							mailchecker = 1;
							var temp = result[4].Text
							// send email notification
							transporter.sendMail({
								form: 'Uninet Express Lane Services Team',
								to: Emailtemp,
								subject: 'Uninet Express Lane',
								html:'<div style="width:600px;font-size:14px;color:#333333;font-family:Trebuchet MS,Verdana,Arial,Helvetica,sans-serif;"><br>Dear '+ Nametemp+' '+ Lastnametemp+', <br><br>'+temp+'<br><br><br><hr color="#666666" align="left" width="600" size="1" noshade=""></div>',
							});
							if (mailchecker == 1){
								req.getConnection(function (err, connection) {
									connection.query("DELETE FROM User  WHERE id = ? ",[id], function(err, rows){
										if(err)
											console.log("Error deleting : %s ",err );
											res.redirect('/user');
									});
									//console.log(query.sql);
								});
							}
							//console.log(arr);
							console.log("Email was send ...");
							} else {
								console.log("Error query database ...");
							//connection.release();
							}
					});
				}
			});
		}
	}
};

// mail management
var emailmanage = function(req, res, next) {
   if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role !== 1) {
          res.redirect('/memberindex');
      } else {

        req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM Emailtext',function(err,rows)
        {

            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('emailmanage',{page_title:"Email Management",user: user,data:rows});


         });
    });
  }

   }
};

//mail edit
var mailedit = function(req, res){
    if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role !== 1) {
          res.redirect('/emailmanage');
      } else {
    var id = req.params.id;

    req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM Emailtext WHERE id = ?',[id],function(err,rows)
        {

            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('mailedit',{page_title:"Edit Email template",user:user,data:rows});
         });
       });
     }
   }
};

// save email template
var mailsave = function(req, res){
    if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role !== 1) {
          res.redirect('/emailmanage');
      } else {
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        //var text = input.Text;
        var data = {
            id  : input.id,
            Text    : input.Text
        };
        var query = connection.query("UPDATE Emailtext set ? WHERE id = ?  ",[data,id], function(err, rows)
        {

          if (err){
				console.log("Error Updating : %s ",err )};
				// update email template
				eamildata = connection.query(queryString, function(err, result){ //Query data from database
				if(!err) {
					//connection.release();
					console.log("Data was recived ...");
					console.log("Database was disconnected ...");
					console.log("Email template was Updated ...");

                } else {
					console.log("Error query database ...");
					//connection.release();
                }
            });
          res.redirect('/emailmanage');
        });
    });
   }
  }
};


var servicemanage = function(req, res, next) {
   if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role !== 1) {
          res.redirect('/');
      } else {
          //exports.list = function(req, res){
        
        req.getConnection(function(err,connection){
        var query = connection.query('SELECT * FROM ResourceAllocated LEFT JOIN ServiceActivities ON ResourceAllocated.said=ServiceActivities.said JOIN ServiceRequests ON ServiceActivities.sid=ServiceRequests.sid JOIN User ON User.id = ServiceRequests.user WHERE actbyuser != 1 and actType =0 ',function(err,request){
        var query = connection.query('SELECT * FROM ActivePackage',function(err,active){
        var query = connection.query('SELECT * FROM Netfpga_Status',function(err,rows)
        {

            if(err)
                console.log("Error Selecting : %s ",err );
     	    var query = connection.query('SELECT *  FROM Nagios_Status',function(err,nagios){

            if(err){
                console.log("Error Selecting : %s ",err );
		}else{
		console.log(nagios)
     	  }
            res.render('servicemanage',{page_title:"servicemanage",active:active,request:request,user: user,nagios:nagios,data:rows});

         });

         });
          });
          });
         //console.log(query.sql);
    });
  }

   }
};
var addService = function(req, res, next){
  if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role !== 1) {
          res.redirect('/');
      } else {
  var input = JSON.parse(JSON.stringify(req.body));
  req.getConnection(function (err, connection) {
            var data = {
              username           : user.username,
              resourceString1    : input.resourceString1,
              resourceString2    : input.resourceString2,
              IP1                : input.IP1,
              IP2                : input.IP2,
              startTime          : input.startTime,
              endTime            : input.endTime,

            };
            var query = connection.query("INSERT INTO ActivePackage set ? ",[data], function(err, rows){
              if (err)
                console.log("Error inserting : %s ",err );
    res.redirect('/servicemanage');
  });
});
      }
   }
};

var accept_service = function(req,res){
     if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role !== 1) {
          res.redirect('/');
      } else {
    var id = req.params.id;
    req.getConnection(function (err, connection) {
                  

        
        var query = connection.query('SELECT * FROM ResourceAllocated LEFT JOIN ServiceActivities ON ResourceAllocated.said=ServiceActivities.said JOIN ServiceRequests ON ServiceActivities.sid=ServiceRequests.sid JOIN User ON User.id = ServiceRequests.user WHERE ResourceAllocated.said = ?',[id], function(err, rows)
        {  
          var data = {
              username           : rows[0].username,
              resourceString1    : rows[0].resourceString1,
              resourceString2    : rows[0].resourceString2,
              IP1                : rows[0].IP1,
              IP2                : rows[0].IP2,
              startTime          : rows[0].startTime,
              endTime            : rows[0].endTime

            };

           var query = connection.query("INSERT INTO ActivePackage SET ?",data, function(err,rows)
        {
            connection.query("UPDATE ServiceActivities SET actType = 1 WHERE said = ? ",[id], function(err,rows){  
             if(err)
                 console.log("Error accept : %s ",err );
             res.redirect('/servicemanage');
            });
         //console.log(query.sql);
          });
 });
 });
      }
   }
};
var edit_service = function(req, res){
    if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role !== 1) {
          res.redirect('/memberindex');
      } else {
    var id = req.params.apid;

    req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM ActivePackage WHERE apid = ?',[id],function(err,rows)
        {

            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('edit',{page_title:"Edit",user:user,data:rows});
         });

         //console.log(query.sql);
       });
     }
   }
};
var saveedit_service = function(req, res){
    if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role !== 1) {
          res.redirect('/memberindex');
      } else {
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        var data = {
            resourceString1    : input.resourceString1,
            resourceString1 : input.resourceString1,
            IP1     : input.IP1,
            IP2   : input.IP2,
            startTime   : input.startTime,
            endTime : input.endTime
        };

        var query = connection.query("UPDATE ActivePackage SET ? WHERE apid = ? ",[data,id], function(err, rows)
        {

          if (err)
              console.log("Error Updating : %s ",err );

          res.redirect('/servicemanage');

        });

    });
   }
  }
};

var delete_service = function(req,res){
     if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role !== 1) {
          res.redirect('/');
      } else {
          //exports.list = function(req, res){

     var id = req.params.id;

     req.getConnection(function (err, connection) {

        connection.query("UPDATE ServiceActivities INNER JOIN ResourceAllocated ON ServiceActivities.said = ResourceAllocated.said SET actbyuser=1 WHERE ServiceActivities.said = ?",[id], function(err, rows)
        {

             if(err)
                 console.log("Error deleting : %s ",err );

             res.redirect('/servicemanage');

         });

         //console.log(query.sql);
    });
  }

   }
};
var delete_active = function(req,res){
     if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {

      var user = req.user;
      if(user !== undefined) {
         user = user.toJSON();
      }
      if (user.role !== 1) {
          res.redirect('/');
      } else {
          //exports.list = function(req, res){

     var id = req.params.id;

     req.getConnection(function (err, connection) {

        connection.query("DELETE FROM ActivePackage  WHERE apid = ? ",[id], function(err, rows)
        {

             if(err)
                 console.log("Error deleting : %s ",err );

             res.redirect('/servicemanage');

         });

         //console.log(query.sql);
    });
  }

   }
};

// sign in
// GET
var signIn = function(req, res, next) {
   if(req.isAuthenticated()) res.redirect('/memberindex');
   res.render('signin', {title: 'Sign In'});
};

// sign in
// POST
var signInPost = function(req, res, next) {
   passport.authenticate('local', { successRedirect: '/signin',
                          failureRedirect: '/'}, function(err, user, info) {
      if(err) {
         return res.render('index', {title: 'Sign In',req:req, errorMessage: err.message});
      }

      if(!user) {
         return res.render('index', {title: 'Sign In',req:req, errorMessage: info.message});
      }
      return req.logIn(user, function(err) {
         if(err) {
            return res.render('index', {title: 'Sign In',req:req, errorMessage: err.message});
         } else {
            user.flag = 1;
            return res.redirect('/');
         }
      });
   })(req, res, next);
};

// sign up
// GET

var signUp = function(req, res, next) {
   if(req.isAuthenticated()) {
      res.redirect('/');
   } else {
      res.render('signup', {title: 'Sign Up'});
   }
};

// sign up
// POST
var signUpPost = function(req, res, next) {
   var user = req.body;
   var usernamePromise = null;
   usernamePromise = new Model.User({username: user.username}).fetch();

   return usernamePromise.then(function(model) {
      if(model) {
         res.render('signup', {title: 'signup', errorMessagesu: 'username already exists' });
      } else {
         //****************************************************//
         // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
         //****************************************************//
         var password = user.password;
         var hash = bcrypt.hashSync(password);
         var signUpUser = new Model.User({username: user.username, password: hash, NameE: user.NameE,LastNameE: user.LastNameE,org: user.org,phone: user.phone,email: user.email});

         //send email  function
         var emailtemp = connection.query(queryString, function(err, result){ //Query data from database
           if(!err) {
             //connection.release();
             var emailtemp = result[0].Text
             // send email notification
             transporter.sendMail({
               form: 'Uninet Express Lane Services Team',
               to: user.email,
               subject: 'Uninet Express Lane',
               html:'<div style="width:600px;font-size:14px;color:#333333;font-family:Trebuchet MS,Verdana,Arial,Helvetica,sans-serif;"><br>Dear '+ user.NameE+' '+ user.LastNameE+', <br><br>'+emailtemp+'<br><br><br><hr color="#666666" align="left" width="600" size="1" noshade=""></div>',
             });

             //console.log(arr);
             console.log("Email was send ...");

           } else {
             console.log("Error query database ...");
             //connection.release();
           }
         });

         signUpUser.save().then(function(model) {
            // sign in the newly registered user
            res.render('registed', {title: 'Registed'});
         });
      }
   });
};


// sign out
var signOut = function(req, res, next) {
   if(!req.isAuthenticated()) {
      res.redirect('/');
   } else {
     var user = req.user;
     req.getConnection(function (err, connection) {
        var query = connection.query("UPDATE User set flag=0 WHERE id = ? ",[user.id], function(err, rows)
        {
        });

    });
      req.logout();
      res.redirect('/');
   }
};

// 404 not found
var notFound404 = function(req, res, next) {
   res.status(404);
   res.render('404', {title: '404 Not Found'});
};

// export functions
/**************************************/
// index
module.exports.index = index;
module.exports.member = member;
//admin
// profile
module.exports.profile = profile;
//repassword
module.exports.repass = repass
module.exports.repasspost = repasspost
//content
module.exports.about = about;
module.exports.contact = contact;
module.exports.status = status;
module.exports.service = service;
module.exports.document = document;
//memberaction
module.exports.serviceac = serviceac;
module.exports.addServiceac = addServiceac;
module.exports.ccServiceac = ccServiceac;
//adminaction
module.exports.user = user;
module.exports.accept = accept;
module.exports.edit = edit;
module.exports.saveedit = saveedit;
module.exports.delete_user = delete_user;
module.exports.servicemanage = servicemanage;
// email management
module.exports.emailmanage = emailmanage;
module.exports.mailedit = mailedit;
module.exports.mailsave = mailsave;
//servicemanage
module.exports.accept_service = accept_service;
module.exports.edit_service = edit_service;
module.exports.saveedit_service = saveedit_service;
module.exports.delete_service = delete_service;
module.exports.delete_active = delete_active;
module.exports.addService = addService;
// sigin in
// GET
module.exports.signIn = signIn;
// POST
module.exports.signInPost = signInPost;

// sign up
// GET
module.exports.signUp = signUp;
// POST
module.exports.signUpPost = signUpPost;

// sign out
module.exports.signOut = signOut;

// 404 not found
module.exports.notFound404 = notFound404;
