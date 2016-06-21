// vendor library
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var cron = require('node-schedule');
var CronJob = require('cron').CronJob;

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
var check = function(req, res) {
	var query = connection.query("SELECT * FROM ServiceActivities INNER JOIN ResourceAllocated ON ResourceAllocated.said = ServiceActivities.said WHERE actType = 0",function(err,servicetime)
	{
		for(i=0;i<servicetime.length;i++){
			console.log(servicetime[i].endTime);

			cron.scheduleJob(servicetime[i].endTime, function(){
				var query = connection.query("UPDATE ServiceActivities INNER JOIN ResourceAllocated ON ResourceAllocated.said = ServiceActivities.said SET actType=3 WHERE actType = 0 and endTime = NOW()",function(err)
				{      
					if (err)
						console.log("Error Updating : %s ",err );


					console.log(new Date(), "update");
				});
			});

		}
	});

	var query = connection.query("SELECT * FROM ServiceActivities INNER JOIN ResourceAllocated ON ResourceAllocated.said = ServiceActivities.said WHERE actType = 4",function(err,time)
	{
		for(i=0;i<time.length;i++){
			console.log(time[i].startTime);

			cron.scheduleJob(time[i].startTime, function(){
				var query = connection.query("INSERT INTO ActivePackage (said,username,resourceString1,resourceString2,IP1,IP2,startTime,endTime) SELECT ResourceAllocated.said,User.username,ResourceAllocated.resourceString1,ResourceAllocated.resourceString2,ResourceAllocated.IP1,ResourceAllocated.IP2,ResourceAllocated.startTime,ResourceAllocated.endTime FROM ResourceAllocated INNER JOIN ServiceActivities ON ServiceActivities.said = ResourceAllocated.said INNER JOIN ServiceRequests ON ServiceRequests.sid = ServiceActivities.sid INNER JOIN User ON User.id = ServiceRequests.user WHERE actType = 4 and startTime = NOW() and ResourceAllocated.said NOT IN (SELECT said FROM ActivePackage)",function(err)
				{
					var query = connection.query("UPDATE ServiceActivities INNER JOIN ResourceAllocated ON ResourceAllocated.said = ServiceActivities.said SET actType=7 WHERE actType = 4 and startTime = NOW()",function(err)
					{

						if (err)
							console.log("Error Updating : %s ",err );


						console.log(new Date(), "update");
					});
				});
			});
		}
	});
	var query = connection.query("SELECT * FROM ServiceActivities INNER JOIN ResourceAllocated ON ResourceAllocated.said = ServiceActivities.said WHERE actType = 7",function(err,activetime)
	{
		for(i=0;i<activetime.length;i++){
			console.log(activetime[i].endTime);

			cron.scheduleJob(activetime[i].endTime, function(){
				var query = connection.query("DELETE FROM ActivePackage WHERE endTime = NOW()",function(err)
				{      
					var query = connection.query("UPDATE ServiceActivities INNER JOIN ResourceAllocated ON ResourceAllocated.said = ServiceActivities.said SET actType=10 WHERE actType = 7 and endTime = NOW()",function(err)
					{      
						if (err)
							console.log("Error Updating : %s ",err );


						console.log(new Date(), "update");
					});
				});
			});

		}
	});
};


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
    next();
};

var member = function(req, res, next) {
	if(!req.isAuthenticated()) {

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
      var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    req.getConnection(function (err, connection) {
        var username = input.username;
        var email = input.email;
        var hash = bcrypt.hashSync(input.password);
        var query = connection.query("SELECT * FROM User WHERE username = ? and email = ? ",[username,email], function(err, check)
        {
           
           if (JSON.stringify(check) === '[]'){
                 var error = "Invalid username or email"
                 if(!req.isAuthenticated()) {
      res.render('repass', {title: 'Reset Password',req:req,error:error});
   } else {

      var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
      }

          res.render('repass', {title: 'Reset Password', req:req,user: user,error:error});
   }
          
        }else{
        var query = connection.query("UPDATE User set password = ? WHERE username = ? and email = ? ",[hash,username,email], function(err, rows)
        {

        var user = req.user;
         if(user !== undefined) {
         user = user.toJSON();
      }
          if (err)
              console.log("Error Updating : %s ",err );
          res.render('repassed', {title: 'repassed',req:req,user : user});

        });
}
      });
    });
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
				res.render('status',{page_title:"status",req:req,status_user:rows});
			});
			//console.log(query.sql);
		});
	}else{
		var user = req.user;
		
		if(user !== undefined) {
			user = user.toJSON();
		}
		if (user.role === 1) {
			req.getConnection(function(err,connection){

				var query = connection.query('SELECT * FROM Online_Status',function(err,status)
				{
					if(err)
						console.log("Error Selecting : %s ",err );
					var query = connection.query('SELECT * FROM Netfpga_Status',function(err,rows)
					{

						if(err)
							console.log("Error Selecting : %s ",err );
						var query = connection.query('SELECT *  FROM Nagios_Status',function(err,nagios){

							if(err){
								console.log("Error Selecting : %s ",err );
							}
							var query = connection.query('SELECT *  FROM log_netfpga',function(err,logs_netfpga){
								
								if(err){
									console.log("Error Selecting : %s ",err );
								}
								var query = connection.query('SELECT *  FROM log_Online_status',function(err,logs_node){

									if(err){
										console.log("Error Selecting : %s ",err );
									}
									var query = connection.query('SELECT *  FROM log_nagios',function(err,logs_nagios){

									if(err){
										console.log("Error Selecting : %s ",err );
									}
									res.render('status',{page_title:"status",req:req,user:user,status:status,logs_nagios:logs_nagios,data:rows,nagios:nagios,logs_netfpga:logs_netfpga,logs_node:logs_node});
								});
								});
								
							});

						});

					});
				//res.render('status',{page_title:"status",req:req,user:user,data:rows});
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
					res.render('status',{page_title:"status",user:user,req:req,status_user:rows});
				});
			//console.log(query.sql);
		});
		} 
	}
	var plotly = require('plotly')("uninet", "viv06akyfb")
	var layout_KMUTNB = {
		showlegend: true,
		title: 'Node Connected : BSU',
		yaxis: {
			title: 'Connected',
			autorange: true,
			range: [0,100]
		},
		xaxis: {
			title: 'Time',
			autorange: true
		}
	};
	var layout_UNINET = {
		showlegend: true,
		title: 'Node Connected : PYT1',
		yaxis: {
			title: 'Connected',
			autorange: true,
			range: [0,100]
		},
		xaxis: {
			title: 'Time',
			autorange: true
		}
	};
	var layout_MU = {
		showlegend: true,
		title: 'Node Connected : SLY',
		yaxis: {
			title: 'Connected',
			autorange: true,
			range: [0,100]
		},
		xaxis: {
			title: 'Time',
			autorange: true
		}
	};var layout_KKU = {
		showlegend: true,
		title: 'Node Connected : KKN',
		yaxis: {
			title: 'Connected',
			autorange: true,
			range: [0,100]
		},
		xaxis: {
			title: 'Time',
			autorange: true
		}
	};var layout_CU = {
		showlegend: true,
		title: 'Node Connected : PYT2',
		yaxis: {
			title: 'Connected',
			autorange: true,
			range: [0,100]
		},
		xaxis: {
			title: 'Time',
			autorange: true
		}
	};var layout_RMUTSB = {
		showlegend: true,
		title: 'Node Connected : RMUTSB',
		yaxis: {
			title: 'Connected',
			autorange: true,
			range: [0,1]
		},
		xaxis: {
			title: 'Time',
			autorange: true
		}
	};
	var layout_Service = {
		showlegend: true,
		title: 'Service Usage',
		yaxis: {
			title: 'Count of service',
			autorange: true,
			range: [0,100]
		},
		xaxis: {
			title: 'Time',
			autorange: true
		}
	};
	var initData_BSU = [{x:[], y:[], stream:{token:'h4yuqakvt1', maxpoints:1000000},type: "scatter",fill: "tozeroy",}];
	var initData_PYT1 = [{x:[], y:[], stream:{token:'c5n0koxfu6', maxpoints:1000000},type: "scatter",fill: "tonexty",}];
	var initData_PYT2 = [{x:[], y:[], stream:{token:'wao498mu0b', maxpoints:1000000},type: "scatter",fill: "tozeroy",}];
	var initData_SLY = [{x:[], y:[], stream:{token:'82i69jmj4g', maxpoints:1000000},type: "scatter",fill: "tonexty",}];
	var initData_KKN = [{x:[], y:[], stream:{token:'9lnl04ku3k', maxpoints:1000000},type: "scatter",fill: "tozeroy",}];
	var initData_RMUTSB = [{x:[], y:[], stream:{token:'6pwsiq7naz', maxpoints:1000000},type: "scatter",fill: "tonexty",}];
	var initData_service = [{x:[], y:[], stream:{token:'1raay3ixe6', maxpoints:1000000},type: "scatter",fill: "tozeroy",}];
	var initGraphOptions_BSU = {showLink: false,layout: layout_KMUTNB,filename : "BSU",fileopt : "overwrite"};
	var initGraphOptions_PYT1 = {showLink: false,layout: layout_UNINET,filename : "PYT1",fileopt : "overwrite"};
	var initGraphOptions_PYT2 = {showLink: false,layout: layout_CU,filename : "PYT2",fileopt : "overwrite"};
	var initGraphOptions_SLY = {showLink: false,layout: layout_MU,filename : "SLY",fileopt : "overwrite"};
	var initGraphOptions_KKN = {showLink: false,layout: layout_KKU,filename : "KKN",fileopt : "overwrite"};
	var initGraphOptions_RMUTSB = {showLink: false,layout: layout_RMUTSB,filename : "RMUTSB",fileopt : "overwrite"};
	var initGraphOptions_service = {showLink: false,layout: layout_Service,filename : "Service",fileopt : "overwrite"};
//////////////////////// KMUTNB ////////////////////////////////////
plotly.plot(initData_BSU, initGraphOptions_BSU, function (err, msg) {
	var data = 1;
	var old_status = 'Online';
	var current_status = 'Online';
	var hours = true;
	var currentdate = new Date().toLocaleString();
	if (err) return console.log(err)
		console.log(msg)
	var stream1 = plotly.stream('h4yuqakvt1', function (err, res) {
		console.log(err, res);
    clearInterval(loop); // once stream is closed, stop writing
});
	var loop = setInterval(function () {
		var date = new Date();
		console.log(date.getMinutes())
		connection.query('SELECT * from Online_Status', function(err, rows, fields) {
			current_status = rows[1].statuss;
		});

		if(current_status != old_status || (date.getMinutes() == '00' && hours == true )){
			if(date.getMinutes() == '00'){
				hours = false;
			}else{
				hours = true;
			}
			if(current_status  == 'Offline'){
				data = 0;
			}else{
				data = 1;
			}
			old_status = current_status;

			console.log(data)
			var i = Math.floor((Math.random() * 100) + 1);
			currentdate = new Date().toLocaleString();
			var streamObject = JSON.stringify({ x : currentdate, y : data });
			stream1.write(streamObject+'\n');
			//console.log(streamObject)
		}else{
			var old_date = currentdate;
			var streamObject = JSON.stringify({ x : currentdate, y : data });
			stream1.write(streamObject+'\n');
		}
	},30000);
});

//////////////////////// UNINET ////////////////////////////////////
plotly.plot(initData_PYT1, initGraphOptions_PYT1, function (err, msg) {
	var data = 1;
	var old_status = 'Online';
	var current_status = 'Online';
	var hours = true;
	var currentdate = new Date().toLocaleString();
	if (err) return console.log(err)
		console.log(msg)
	var stream1 = plotly.stream('c5n0koxfu6', function (err, res) {
		console.log(err, res);
    clearInterval(loop); // once stream is closed, stop writing
});
	var loop = setInterval(function () {
		var date = new Date();
		console.log(date.getMinutes())
		connection.query('SELECT * from Online_Status', function(err, rows, fields) {
			current_status = rows[0].statuss;
            });

		if(current_status != old_status || (date.getMinutes() == '00' && hours == true )){
			if(date.getMinutes() == '00'){
				hours = false;
			}else{
				hours = true;
			}
			if(current_status  == 'Offline'){
				data = 0;
			}else{
				data = 1;
			}
			old_status = current_status;

			console.log(data)
			var i = Math.floor((Math.random() * 100) + 1);
			currentdate = new Date().toLocaleString();
			var streamObject = JSON.stringify({ x : currentdate, y : data });
			stream1.write(streamObject+'\n');
			//console.log(streamObject)
		}else{
			var old_date = currentdate;
			var streamObject = JSON.stringify({ x : currentdate, y : data });
			stream1.write(streamObject+'\n');
		}
	},30000);
});

//////////////////////// MAHIDOL ////////////////////////////////////
plotly.plot(initData_SLY, initGraphOptions_SLY, function (err, msg) {
	var data = 1;
	var old_status = 'Online';
	var current_status = 'Online';
	var hours = true;
	var currentdate = new Date().toLocaleString();
	if (err) return console.log(err)
		console.log(msg)
	var stream1 = plotly.stream('82i69jmj4g', function (err, res) {
		console.log(err, res);
    clearInterval(loop); // once stream is closed, stop writing
});
	var loop = setInterval(function () {
		var date = new Date();
		console.log(date.getMinutes())
		connection.query('SELECT * from Online_Status', function(err, rows, fields) {
			current_status = rows[2].statuss;
            });

		if(current_status != old_status || (date.getMinutes() == '00' && hours == true )){
			if(date.getMinutes() == '00'){
				hours = false;
			}else{
				hours = true;
			}
			if(current_status  == 'Offline'){
				data = 0;
			}else{
				data = 1;
			}
			old_status = current_status;

			console.log(data)
			var i = Math.floor((Math.random() * 100) + 1);
			currentdate = new Date().toLocaleString();
			var streamObject = JSON.stringify({ x : currentdate, y : data });
			stream1.write(streamObject+'\n');
			//console.log(streamObject)
		}else{
			var old_date = currentdate;
			var streamObject = JSON.stringify({ x : currentdate, y : data });
			stream1.write(streamObject+'\n');
		}
	},30000);
});

//////////////////////// CU ////////////////////////////////////
plotly.plot(initData_PYT2, initGraphOptions_PYT2, function (err, msg) {
	var data = 1;
	var old_status = 'Online';
	var current_status = 'Online';
	var hours = true;
	var currentdate = new Date().toLocaleString();
	if (err) return console.log(err)
		console.log(msg)
	var stream1 = plotly.stream('wao498mu0b', function (err, res) {
		console.log(err, res);
    clearInterval(loop); // once stream is closed, stop writing
});
	var loop = setInterval(function () {
		var date = new Date();
		console.log(date.getMinutes())
		connection.query('SELECT * from Online_Status', function(err, rows, fields) {
			current_status = rows[3].statuss;
            });

		if(current_status != old_status || (date.getMinutes() == '00' && hours == true )){
			if(date.getMinutes() == '00'){
				hours = false;
			}else{
				hours = true;
			}
			if(current_status  == 'Offline'){
				data = 0;
			}else{
				data = 1;
			}
			old_status = current_status;

			console.log(data)
			var i = Math.floor((Math.random() * 100) + 1);
			currentdate = new Date().toLocaleString();
			var streamObject = JSON.stringify({ x : currentdate, y : data });
			stream1.write(streamObject+'\n');
			//console.log(streamObject)
		}else{
			var old_date = currentdate;
			var streamObject = JSON.stringify({ x : currentdate, y : data });
			stream1.write(streamObject+'\n');
		}
	},30000);
});

//////////////////////// KKU ////////////////////////////////////
plotly.plot(initData_KKN, initGraphOptions_KKN, function (err, msg) {
	var data = 1;
	var old_status = 'Online';
	var current_status = 'Online';
	var hours = true;
	var currentdate = new Date().toLocaleString();
	if (err) return console.log(err)
		console.log(msg)
	var stream1 = plotly.stream('9lnl04ku3k', function (err, res) {
		console.log(err, res);
    clearInterval(loop); // once stream is closed, stop writing
});
	var loop = setInterval(function () {
		var date = new Date();
		console.log(date.getMinutes())
		connection.query('SELECT * from Online_Status', function(err, rows, fields) {
			current_status = rows[5].statuss;
            });

		if(current_status != old_status || (date.getMinutes() == '00' && hours == true )){
			if(date.getMinutes() == '00'){
				hours = false;
			}else{
				hours = true;
			}
			if(current_status  == 'Offline'){
				data = 0;
			}else{
				data = 1;
			}
			old_status = current_status;

			console.log(data)
			var i = Math.floor((Math.random() * 100) + 1);
			currentdate = new Date().toLocaleString();
			var streamObject = JSON.stringify({ x : currentdate, y : data });
			stream1.write(streamObject+'\n');
			//console.log(streamObject)
		}else{
			var old_date = currentdate;
			var streamObject = JSON.stringify({ x : currentdate, y : data });
			stream1.write(streamObject+'\n');
		}
	},30000);
});

//////////////////////// RMUTSB ////////////////////////////////////
plotly.plot(initData_RMUTSB, initGraphOptions_RMUTSB, function (err, msg) {
	var data = 1;
	var old_status = 'Online';
	var current_status = 'Online';
	var hours = true;
	var currentdate = new Date().toLocaleString();
	if (err) return console.log(err)
		console.log(msg)
	var stream1 = plotly.stream('6pwsiq7naz', function (err, res) {
		console.log(err, res);
    clearInterval(loop); // once stream is closed, stop writing
});
	var loop = setInterval(function () {
		var date = new Date();
		console.log(date.getMinutes())
		connection.query('SELECT * from Online_Status', function(err, rows, fields) {
			current_status = rows[4].statuss;
            });

		if(current_status != old_status || (date.getMinutes() == '00' && hours == true )){
			if(date.getMinutes() == '00'){
				hours = false;
			}else{
				hours = true;
			}
			if(current_status  == 'Offline'){
				data = 0;
			}else{
				data = 1;
			}
			old_status = current_status;

			console.log(data)
			var i = Math.floor((Math.random() * 100) + 1);
			currentdate = new Date().toLocaleString();
			var streamObject = JSON.stringify({ x : currentdate, y : data });
			stream1.write(streamObject+'\n');
			//console.log(streamObject)
		}else{
			var old_date = currentdate;
			var streamObject = JSON.stringify({ x : currentdate, y : data });
			stream1.write(streamObject+'\n');
		}
	},30000);
});
//////////////////////// Service Usage ////////////////////////////////////
plotly.plot(initData_service, initGraphOptions_service, function (err, msg) {
	var old_service = 0;
	var current_service = 0;
	var hours = true;
	var currentdate = new Date().toLocaleString();
	if (err) return console.log(err)
		console.log(msg)
	var stream1 = plotly.stream('1raay3ixe6', function (err, res) {
		console.log(err, res);
    clearInterval(loop); // once stream is closed, stop writing
});
	var loop = setInterval(function () {
		var date = new Date();
		console.log(date.getMinutes())
		connection.query('SELECT * from ActivePackage', function(err, rows, fields) {
			current_service = rows.length;
		});

		if(current_service != old_service || (date.getMinutes() == '00' && hours == true )){
			if(date.getMinutes() == '00'){
				hours = false;
			}else{
				hours = true;
			}
			old_service = current_service;
			currentdate = new Date().toLocaleString();
			var streamObject = JSON.stringify({ x : currentdate, y : current_service });
			stream1.write(streamObject+'\n');
			//console.log(streamObject)
		}else{
			var old_date = currentdate;
			var streamObject = JSON.stringify({ x : old_date, y : current_service });
			stream1.write(streamObject+'\n');
		}
	},30000);
});
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
			res.redirect('/');
			} else {
			req.getConnection(function(err,connection){
				var query = connection.query('SELECT * FROM ResourceAllocated LEFT JOIN ServiceActivities ON ResourceAllocated.said=ServiceActivities.said JOIN ServiceRequests ON ServiceActivities.sid=ServiceRequests.sid JOIN ServiceActivityType ON ServiceActivities.actType=ServiceActivityType.actType WHERE user = ? and actbyuser != 1 and (ServiceActivities.actType = 0 or ServiceActivities.actType = 4 or ServiceActivities.actType = 7)',[user.id],function(err,data){
          var query = connection.query('SELECT * FROM ResourceAllocated LEFT JOIN ServiceActivities ON ResourceAllocated.said=ServiceActivities.said JOIN ServiceRequests ON ServiceActivities.sid=ServiceRequests.sid JOIN ServiceActivityType ON ServiceActivities.actType=ServiceActivityType.actType WHERE user = ? ',[user.id],function(err,history){
					  res.render('serviceac',{page_title:"serviceac", user:user, data:data, history:history});
				  });
        });
			});
		}
	}next();
};

var ccServiceac = function(req,res){
  if(!req.isAuthenticated()) {
    res.redirect('/');
    } else {
    
    var user = req.user;
    if(user !== undefined) {
      user = user.toJSON();
    }
    var id = req.params.id;
    req.getConnection(function (err, connection) {
      var query = connection.query("UPDATE ServiceActivities SET actbyuser = 1 ,actType = 1 WHERE actType = 0 and said = ? ",[id], function(err,rows){
        if(err)
        console.log("Error accept : %s ",err );
      });
      var query = connection.query("UPDATE ServiceActivities SET actbyuser = 1 ,actType = 5 WHERE actType = 4 and said = ? ",[id], function(err,rows){
        if(err)
        console.log("Error accept : %s ",err );
      });
      var query = connection.query("UPDATE ServiceActivities SET actbyuser = 1 ,actType = 8 WHERE actType = 7 and said = ? ",[id], function(err,rows){
        if(err)
        console.log("Error accept : %s ",err );
      });
      res.redirect('/serviceac');
    });
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
					var mac1 = input.resourceString1.toString().toLowerCase();
					var mac2 = input.resourceString2.toString().toLowerCase();

					var data = {
						resourceString1    : mac1,
						resourceString2    : mac2,
						IP1                : input.IP1,
						IP2                : input.IP2,
						startTime          : input.startTime,
						endTime            : input.endTime,
						said               : ss1[0].said,
					};


					//waiting email template to replace
					var query = connection.query("INSERT INTO ResourceAllocated set ? ",data, function(err, rows){
						if (err)
							console.log("Error inserting : %s ",err );
						res.redirect('/serviceac');
					});
				});
			});
		});
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
				
				var emailtemp = connection.query('SELECT Text FROM Emailtext WHERE id = 4', function(err, result){ //Query data from database
					if(!err) {
						//connection.release();
						var temp = result[0].Text.split("*").map(function (val) {
							return (val);
						});
						
						// send email notification
						transporter.sendMail({
							form: 'Uninet Express Lane Services Team',
							to: Emailtemp,
							subject: 'Uninet Express Lane',
							html:'<div style="width:600px;font-size:14px;color:#333333;font-family:Trebuchet MS,Verdana,Arial,Helvetica,sans-serif;"><br>Dear '+ Nametemp+' '+ Lastnametemp+', <br><br>'+temp[0]+Nametemp+temp[1]+Userid+temp[2]+'<br><br><br><hr color="#666666" align="left" width="600" size="1" noshade=""></div>',
						});

						var logdata = {
								//logDate 	: now(),
								Sender 		: user.username,
								Reciver 	: Userid+"("+Emailtemp+")",
								emailData  	: temp[0]+Nametemp+temp[1]+Userid+temp[2]
						};

						//save logs to database
						var savelogs = connection.query("INSERT INTO  `EmailLogs` SET ?",logdata,function(err,rows){
							if(err){
								console.log("Error when query logs : %s",err);
							} else {
								console.log("Log saved");
							}
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
			res.redirect('/');
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
			res.redirect('/');
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

//delete user
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
					Nametemp = rows[0].NameE;
					Lastnametemp = rows[0].LastNameE;
					Userid = rows[0].username;
					Userpassword = rows[0].password;
					Emailtemp = rows[0].email;
					console.log("data recived : %s ",err );

					// delete user
					req.getConnection(function (err, connection) {
						connection.query("DELETE FROM User  WHERE id = ? ",[id], function(err, rows){
							if(err){
								console.log("Error deleting : %s ",err );
								console.log("Error query database ...");
							}
							res.redirect('/user');	
						});
					});
				}
			});
		}
	}
};

//cancel user request
var cancel_user = function(req,res){
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
					Nametemp = rows[0].NameE;
					Lastnametemp = rows[0].LastNameE;
					Userid = rows[0].username;
					Userpassword = rows[0].password;
					Emailtemp = rows[0].email;
					console.log("data recived : %s ",err );
					
					//Send Email
					var emailtemp = connection.query('SELECT Text FROM Emailtext WHERE id = 5', function(err, result){ //Query data from database
						if(!err) {
							mailchecker = 1;
							var temp = result[0].Text

							// send email notification
							transporter.sendMail({
								form: 'Uninet Express Lane Services Team',
								to: Emailtemp,
								subject: 'Uninet Express Lane',
								html:'<div style="width:600px;font-size:14px;color:#333333;font-family:Trebuchet MS,Verdana,Arial,Helvetica,sans-serif;"><br>Dear '+ Nametemp+' '+ Lastnametemp+', <br><br>'+temp+'<br><br><br><hr color="#666666" align="left" width="600" size="1" noshade=""></div>',
							});

							//log data
							var logdata = {
									//logDate 	: now(),
									Sender 		: user.username,
									Reciver 	: Userid+"("+Emailtemp+")",
									emailData  	: temp
							};
							//save logs to database
							var savelogs = connection.query("INSERT INTO  `EmailLogs` SET ?",logdata,function(err,rows){
								if(err){
									console.log("Error when query logs : %s",err);
								} else {
									console.log("Log saved");
								}
							});

							// delete user
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

// mail management -- query data  (template & logs)
var emailmanage = function(req, res, next) {
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
				
				var query = connection.query('SELECT * FROM Emailtext',function(err,rows){
					if(!err){
						//console.log("query email text");
						var query = connection.query('SELECT * FROM EmailLogs ORDER BY logDate DESC',function(err,logs){
							if(!err){
								//console.log("query email logs");
								res.render('emailmanage',{page_title:"Email Management",user: user,data:rows,logs:logs});
							} else {
								console.log("Error Selecting : %s ",err );
							}
						});
					} else {
						console.log("Error Selecting : %s ",err );
					}	
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
        var query = connection.query('SELECT * FROM ResourceAllocated LEFT JOIN ServiceActivities ON ResourceAllocated.said=ServiceActivities.said JOIN ServiceRequests ON ServiceActivities.sid=ServiceRequests.sid JOIN User ON User.id = ServiceRequests.user JOIN ServiceActivityType ON ServiceActivities.actType = ServiceActivityType.actType',function(err,history){
			var query = connection.query('SELECT * FROM ResourceAllocated LEFT JOIN ServiceActivities ON ResourceAllocated.said=ServiceActivities.said JOIN ServiceRequests ON ServiceActivities.sid=ServiceRequests.sid JOIN User ON User.id = ServiceRequests.user WHERE actType = 4',function(err,approve){	
                var query = connection.query('SELECT * FROM ResourceAllocated LEFT JOIN ServiceActivities ON ResourceAllocated.said=ServiceActivities.said JOIN ServiceRequests ON ServiceActivities.sid=ServiceRequests.sid JOIN User ON User.id = ServiceRequests.user WHERE actbyuser != 1 and actType =0 ',function(err,request){
					var query = connection.query('SELECT * FROM ActivePackage',function(err,active){
							if(err)
							console.log("Error Selecting : %s ",err );
						
								res.render('servicemanage',{page_title:"servicemanage",active:active,request:request,user: user,history:history,approve:approve});
								
						});
					});
				});
                            });
				//console.log(query.sql);
			});
		}
		
	}
    next();
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
				
				
				var Nametemp, Lastnametemp, Emailtemp,SAID ,startTime, endTime ='';
				var query = connection.query('SELECT * FROM ResourceAllocated LEFT JOIN ServiceActivities ON ResourceAllocated.said=ServiceActivities.said JOIN ServiceRequests ON ServiceActivities.sid=ServiceRequests.sid JOIN User ON User.id = ServiceRequests.user WHERE ResourceAllocated.said = ?',[id], function(err, rows){	
					Userid = rows[0].username;
					Nametemp = rows[0].NameE;
					Lastnametemp = rows[0].LastNameE;
					Emailtemp = rows[0].email;
					SAID = rows[0].said;
					startTime = rows[0].startTime;
					endTime = rows[0].endTime;

					var data = {
						said               : rows[0].said,
						username           : rows[0].username,
						resourceString1    : rows[0].resourceString1,
						resourceString2    : rows[0].resourceString2,
						IP1                : rows[0].IP1,
						IP2                : rows[0].IP2,
						startTime          : rows[0].startTime,
						endTime            : rows[0].endTime
						
					};
                    if (rows[0].startTime <= new Date()) {
					var query = connection.query("INSERT INTO ActivePackage SET ?",data, function(err,rows)
					{
						connection.query("UPDATE ServiceActivities SET actType = 7 WHERE said = ? ",[id], function(err,rows){  
							if(err)
							console.log("Error accept : %s ",err );
							res.redirect('/servicemanage');
							//send email function
							var emailtemp = connection.query('SELECT Text FROM Emailtext WHERE id = 2', function(err, result){ //Query data from database
								if(!err) {
									//connection.release();
									var temp = result[0].Text.split("*").map(function (val) {
										return (val);
									});
									
									// send email notification
									transporter.sendMail({
										form: 'Uninet Express Lane Services Team',
										to: Emailtemp,
										subject: 'Uninet Express Lane',
										html:'<div style="width:600px;font-size:14px;color:#333333;font-family:Trebuchet MS,Verdana,Arial,Helvetica,sans-serif;"><br>Dear '+ Nametemp+' '+ Lastnametemp+', <br><br>'+temp[0]+SAID+temp[1]+ startTime+temp[2]+ endTime+temp[3]+'<br><br><br><hr color="#666666" align="left" width="600" size="1" noshade=""></div>',
									});
									
									//log data
									var logdata = {
											//logDate 	: now(),
											Sender 		: user.username,
											Reciver 	: Userid+"("+Emailtemp+")",
											emailData  	: temp[0]+SAID+temp[1]+ startTime+temp[2]+ endTime+temp[3]
									};

									//save logs to database
									var savelogs = connection.query("INSERT INTO  `EmailLogs` SET ?",logdata,function(err,rows){
										if(err){
											console.log("Error when query logs : %s",err);
										} else {
											console.log("Log saved");
										}
									});
									
									//console.log(arr);
									console.log("Email was send ...");
									} else {
									console.log("Error query database ...");
									//connection.release();
								}
							});
						});
						//console.log(query.sql);
					});
                }else{
						connection.query("UPDATE ServiceActivities SET actType = 4 WHERE said = ? ",[id], function(err,rows){  
							if(err)
							console.log("Error accept : %s ",err );
							res.redirect('/servicemanage');
							//send email function
							var emailtemp = connection.query('SELECT Text FROM Emailtext WHERE id = 2', function(err, result){ //Query data from database
								if(!err) {
									//connection.release();
									var temp = result[0].Text.split("*").map(function (val) {
										return (val);
									});
									
									// send email notification
									transporter.sendMail({
										form: 'Uninet Express Lane Services Team',
										to: Emailtemp,
										subject: 'Uninet Express Lane',
										html:'<div style="width:600px;font-size:14px;color:#333333;font-family:Trebuchet MS,Verdana,Arial,Helvetica,sans-serif;"><br>Dear '+ Nametemp+' '+ Lastnametemp+', <br><br>'+temp[0]+SAID+temp[1]+ startTime+temp[2]+ endTime+temp[3]+'<br><br><br><hr color="#666666" align="left" width="600" size="1" noshade=""></div>',
									});
									
									//log data
									var logdata = {
											//logDate 	: now(),
											Sender 		: user.username,
											Reciver 	: Userid+"("+Emailtemp+")",
											emailData  	: temp[0]+SAID+temp[1]+ startTime+temp[2]+ endTime+temp[3]
									};

									//save logs to database
									var savelogs = connection.query("INSERT INTO  `EmailLogs` SET ?",logdata,function(err,rows){
										if(err){
											console.log("Error when query logs : %s",err);
										} else {
											console.log("Log saved");
										}
									});
									
									//console.log(arr);
									console.log("Email was send ...");
									} else {
									console.log("Error query database ...");
									//connection.release();
								}
							});
						});
						//console.log(query.sql)
                    
                }
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
			res.redirect('/');
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
				var query = connection.query('SELECT * FROM ResourceAllocated LEFT JOIN ServiceActivities ON ResourceAllocated.said=ServiceActivities.said JOIN ServiceRequests ON ServiceActivities.sid=ServiceRequests.sid JOIN User ON User.id = ServiceRequests.user WHERE ResourceAllocated.said = ?',[id], function(err, rows){	
					Nametemp = rows[0].NameE;
					Lastnametemp = rows[0].LastNameE;
					Emailtemp = rows[0].email;
					SAID = rows[0].said;
					startTime = rows[0].startTime;
					endTime = rows[0].endTime;
					console.log("recived Data");
				});
				
				connection.query("UPDATE ServiceActivities INNER JOIN ResourceAllocated ON ServiceActivities.said = ResourceAllocated.said SET actType = 6 , actbyuser=1 WHERE ServiceActivities.said = ?",[id], function(err, rows)
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
			console.log(id);
			req.getConnection(function (err, connection) {
				connection.query("UPDATE ServiceActivities INNER JOIN ActivePackage ON ServiceActivities.said = ActivePackage.said set actType = 9,actbyuser = 1 WHERE ActivePackage.apid = ? ",[id], function(err, rows)
				{
					if(err)
					console.log("Error deleting : %s ",err );
					console.log(id);

				connection.query("DELETE FROM ActivePackage  WHERE apid = ? ",[id], function(err, rows)
				{
					
					if(err)
					console.log("Error deleting : %s ",err );
					
					res.redirect('/servicemanage');
					
				});
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
			var emailtemp = connection.query('SELECT Text FROM Emailtext WHERE id = 1', function(err, result){ //Query data from database
				if(!err) {
					//connection.release();
					var temp = result[0].Text
					// send email notification
					transporter.sendMail({
						form: 'Uninet Express Lane Services Team',
						to: user.email,
						subject: 'Uninet Express Lane',
						html:'<div style="width:600px;font-size:14px;color:#333333;font-family:Trebuchet MS,Verdana,Arial,Helvetica,sans-serif;"><br>Dear '+ user.NameE+' '+ user.LastNameE+', <br><br>'+temp+'<br><br><br><hr color="#666666" align="left" width="600" size="1" noshade=""></div>',
					});
					
					//log data
					var logdata = {
										//logDate 	: now(),
										Sender 		: "AUTO Sender",
										Reciver 	: user.username+"("+user.email+")",
										emailData  	: temp
					};

					//save logs to database
					var savelogs = connection.query("INSERT INTO  `EmailLogs` SET ?",logdata,function(err,rows){
						if(err){
							console.log("Error when query logs : %s",err);
						} else {
							console.log("Log saved");
						}
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
//check service
module.exports.check = check;
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
module.exports.cancel_user = cancel_user;
module.exports.servicemanage = servicemanage;
// email management
module.exports.emailmanage = emailmanage;
module.exports.mailedit = mailedit;
module.exports.mailsave = mailsave;
//module.exports.emailLogs = emailLogs;
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
