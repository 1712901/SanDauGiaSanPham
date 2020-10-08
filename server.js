const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const expbhs = require('express-handlebars');
var express_handlebars_sections = require('express-handlebars-sections');
const session = require('express-session');
const axios = require('axios');
// controller admin
const AdCategoryCTL = require("./Controllers/AdCategory.C");
const AdProductsCTL = require("./Controllers/AdProduct.C");
const AdUserCTL = require("./Controllers/AdUser.C");
const AdRequestCTL = require("./Controllers/ADRequest.C");
const AdHomeCTL = require("./Controllers/AdHome.C");
//
const adLoginCTL = require("./Controllers/AdLogin.C");
//------------------TUAN ---------------------------
const passport = require('passport')
LocalStrategy = require('passport-local').Strategy;

//------------------------------------

const modun = require("./models/helperHandlebars");// đăng ký helper
var path = require('path');
const app = express()
const NoNameC = require('./Controllers/NoName');
app.use('/', NoNameC);
app.engine('hbs', expbhs({
	defaultLayout: 'mainAD',
	extname: 'hbs',
	layoutsDir: path.join(__dirname, 'views/Layouts'),
	partialsDir: path.join(__dirname, 'views/Partials'),
	section: express_handlebars_sections(),
	helpers: {
		section: function (name, options) {
			if (!this._sections) { this._sections = {} };
			this._sections[name] = options.fn(this);
			return null;
		}
	}
}));
// ------------ Passport --------------
// ---------------- TUAN --------------
app.use(express.static('public'));
app.use('/public', express.static('public'));
app.use('/Login', express.static('Views/NoName/Login'));
app.use('/SignUp', express.static('Views/NoName/Login'));
app.use('/checkOTP', express.static('Views/NoName/Login'));
// ------------------------------------------------------
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//---------------- Vi -----------------------
const UserM = require('./Models/UserM');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const init = require('./Controllers/web');
const SellerC=require('./Controllers/SellerC');

// async function checkAuthenticated_Admin(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		if(await UserM.GetTypebyName(req.session.passport.user) == '3'){
// 			return next();
// 		}else{
// 			return res.render('NoName/Login/Login.hbs', { layout: "LoginLO", "msg": "P Try Again!!!" });
// 		}
// 	}else{
// 		return res.redirect('/Login/')
// 	}
// }

app.use('/admin',checkAuthenticated_Admin, AdHomeCTL);
app.use('/admin/category',checkAuthenticated_Admin, AdCategoryCTL);
app.use('/admin/products',checkAuthenticated_Admin, AdProductsCTL);
app.use('/admin/requests',checkAuthenticated_Admin, AdRequestCTL);
app.use('/admin/users',checkAuthenticated_Admin, AdUserCTL);

async function checkAuthenticated_Seller(req, res, next) {
	if (req.isAuthenticated()) {
		if(await UserM.GetTypebyName(req.session.passport.user) == '2'){
			return next()
		}else{
			return res.render('NoName/Login/Login.hbs', { layout: "LoginLO", "msg": "You not seller!!!" });
		}
	}else{
		return res.redirect('/Login/')
	}
}

async function checkAuthenticated_Admin(req, res, next) {
	if (req.isAuthenticated()) {
		if(await UserM.GetTypebyName(req.session.passport.user) == '3'){
			return next()
		}else{
			return res.render('NoName/Login/Login.hbs', { layout: "LoginLO", "msg": "You not Admin!!!" });
		}
	}else{
		return res.redirect('/Login/')
	}
}
app.use('/seller',checkAuthenticated_Seller,SellerC);
init(app);

app.post('/Login', function (req, response, next) {
	passport.authenticate('local', async (err, user, info) => {
		if (err) { return next(err); }
		if (!user) { return response.render('NoName/Login/Login.hbs', { layout: "LoginLO", "msg": "P Try Again!!!" }); }

		const data = await UserM.CheckLogin_1(req.body.username);
		if (data.length < 1) {
			return response.render('NoName/Login/Login.hbs', { layout: "LoginLO", "msg": "U Try Again!!!" });
		}

		var pwd = req.body.pwd;
		var hash = data[0].PWD;

		bcrypt.compare(pwd, hash, async function (err, res) {
			// res === false
			if (res != true) {

				response.render('NoName/Login/Login.hbs', { layout: "LoginLO", "msg": "Pass Try Again!!!" });
			} else {
				req.logIn(user, async function (err) {
					if (err) { return next(err); }
					if(await UserM.GetTypebyName(req.session.passport.user) == '1'){
						return response.redirect('/')
					}
					if(await UserM.GetTypebyName(req.session.passport.user) == '2'){
						return response.redirect('/Seller');
					}
					if(await UserM.GetTypebyName(req.session.passport.user) == '3'){
						return response.redirect('/admin');
					}
				});
			}
		});

	})(req, response, next);
})

app.post('/SignUp', async (req, res) => {

	if (
		req.body['g-recaptcha-response'] === undefined ||
		req.body['g-recaptcha-response'] === '' ||
		req.body['g-recaptcha-response'] === null
	) {

		res.render('NoName/Login/SignUp', { layout: "LoginLO", "msg": "Check Captcha!!!" });

	} else {

		const secretKey = '6LcRvsQUAAAAAOwTFD3JEfhJ7yOFAb1-wWZjtmwX';

		const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;

		var password = '1';
		bcrypt.genSalt(10, function (err, salt) {
			bcrypt.hash(req.body.password, salt, function (err, hash) {
				password = hash;
				// console.log(password)
			});

		});
		request(verifyUrl, async (err, response, body) => {
			body = JSON.parse(body);
			if (body.success !== undefined && !body.success) {
				res.render('NoName/Login/SignUp', { layout: "LoginLO", "msg": "Error Captcha!!!" });
			} else {

				const fullname = req.body.fullname;
				const address = req.body.address;
				const email = req.body.email;
				const username = req.body.username;
				const data = await UserM.CheckLogin(username, email);
				if (data.length > 0) {
					res.render('NoName/Login/SignUp', { layout: "LoginLO", "msg": "User Name or Email exists, Try Again!!!" });
				} else {
					const OTP = Math.random().toString().slice(-5);

					let transporter = nodemailer.createTransport({
						service: 'gmail',
						auth: {
							user: 'teotu22@gmail.com',
							pass: 'teotu___1999'
						}
					});

					let mailOptions = {
						from: 'teotu22@gmail.com',
						to: `ewf83988@bcaoo.com`,
						subject: 'Xác nhận đăng kí',
						text: "Mã OTP của bạn là: " + OTP
					};

					transporter.sendMail(mailOptions, function (error, info) {
						if (error) {
							console.log(error);
						}
					});
					console.log('send mail');
					res.render('NoName/confirm', { "OTP": OTP, "username": username, "password": password, "fullname": fullname, "email": email, "address": address });
				}
			}
		});

	}
});

app.post('/checkOTP', async (req, res) => {
	if (req.body.OTPinput === req.body.OTP) {
		try {
			const rows = await UserM.InsertUser(req.body.fullname, req.body.address, req.body.email, req.body.username, req.body.password);
			res.redirect('/Login/');
		} catch (e) {
			res.redirect('/SignUp/');
		}
	} else {
		res.render('NoName/confirm', { "OTP": req.body.OTP, "username": req.body.username, "password": req.body.password, "fullname": req.body.fullname, "email": req.body.email, "address": req.body.address, "msg": "O Check OTP Again!!!" });
	}
})

async function checkOTPMail(req, res, next) {
	console.log(req.body)
	if (req.body.OTPinput == req.body.OTP) {
		try {
			const rows = await UserM.InsertUser(req.body.fullname, req.body.address, req.body.email, req.body.username, req.body.password);
			console.log('insert--------------------')
			next();
		} catch (e) {
			return res.redirect('/SignUp/');
		}
	} else {
		return res.render('NoName/confirm', { "OTP": req.body.OTP, "username": req.body.username, "password": req.body.password, "fullname": req.body.fullname, "email": req.body.email, "address": req.body.address, "msg": "O  Check OTP Again!!!" });
	}
}
require('./middleware/error')(app);
const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}!`));