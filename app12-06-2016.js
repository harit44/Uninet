// vendor libraries
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var ejs = require('ejs');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var connection  = require('express-myconnection');
var plotly = require('plotly')("choocku", "7sz7hclk2g")

var route = require('./route');
// model
var Model = require('./models/model');

var app = express();

passport.use(new LocalStrategy(function(username, password, done) {
   new Model.User({username: username}).fetch().then(function(data) {
      var user = data;
      if(user === null) {
         return done(null, false, {message: 'Invalid username or password'});
      } else {
         user = data.toJSON();
         if(!bcrypt.compareSync(password, user.password)) {
            return done(null, false, {message: 'Invalid username or password'});
         } else {
            if(user.role === null){
               return done(null, false, {message: 'Invalid username or password'});;
            }else{
               return done(null, user);
            }
         }
      }
   });
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
   new Model.User({username: username}).fetch().then(function(user) {
      done(null, user);
   });
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static( "public" ) );
app.use(cookieParser());
app.use(bodyParser());
app.use(session({secret: 'secret strategic xxzzz code'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(

    connection(mysql,{

        host: 'localhost',
        user: 'root',
        password : 'root',
        database:'UniNetExpressLane'
    },'pool')
);

// GET
app.get('/', route.index,route.check );

app.get('/profile', route.profile);
app.get('/repass', route.repass);
app.post('/repass', route.repasspost);
app.get('/about', route.about);
app.get('/contact', route.contact);
app.get('/status', route.status);
app.get('/service', route.service);
app.get('/document', route.document);
// signin
// GET
// POST
app.post('/signin', route.signInPost);

// signup

// GET
// POST
app.get('/signup', route.signUp);
app.post('/signup', route.signUpPost);

// logout
// GET
app.get('/signout', route.signOut);


app.get('/serviceac', route.serviceac,route.check );
app.post('/addServiceac', route.addServiceac);
app.get('/serviceac/cancel/:id', route.ccServiceac);

app.post('/servicemanage', route.addService,route.check );
app.get('/user', route.user);

app.get('/user/accept/:id',route.accept);
app.get('/servicemanage/accept/:id',route.accept_service);
app.get('/user/edit/:id', route.edit);
app.get('/servicemanage/edit/:id', route.edit);
app.post('/user/edit/:id',route.saveedit);
app.post('/servicemanage/edit/:id',route.saveedit_service);
app.get('/user/delete/:id', route.delete_user);
app.get('/servicemanage/delete/:id', route.delete_service);
app.get('/servicemanage/deleteactive/:id', route.delete_active);
app.get('/servicemanage', route.servicemanage ,route.check);
/********************************/
/********************************/

// mail management
app.get('/emailmanage', route.emailmanage);
//app.get('/emailmanage',route.emailLogs);
app.get('/emailmanage/mailedit/:id', route.mailedit);
app.post('/emailmanage/mailedit/:id', route.mailsave);

// 404 not found
//app.use(route.notFound404);
app.use(app.router);
var server = app.listen(app.get('port'), function() {

   var message = 'Server is running @ http://localhost:' + server.address().port;
   console.log(message);
});
