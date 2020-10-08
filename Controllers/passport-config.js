const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
  

passport.serializeUser((username, done) => {
  done(null, username);
})

passport.deserializeUser((name, done) => {
  //tại đây hứng dữ liệu để đối chiếu
  if (name == 'admin') { //tìm xem có dữ liệu trong kho đối chiếu không
      return done(null, name)
  } else {
      return done(null, false)
  }
})

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'pwd'},
  function(username, pwd, done) {
    // console.log(username)
    if (username == 'admin'){
      return done(null, username);
    }else{
      return done(null, false, { message: 'Incorrect username.' });
    }
  }
));
module.exports = passport