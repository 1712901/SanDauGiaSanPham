const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pagination = require('pagination');
const nodemailer = require('nodemailer');
const request = require('request');
const UserM = require('../Models/UserM');
const CateM = require('../Models/CategoryM');
const ProductsM = require('../Models/ProductsM');
const path = require('path');

// const passport = require('../Controllers/passport-config');
const passport = require('passport')
const session = require('express-session');
router.use(session({
	secret: "mysession",
	cookie: {
		maxAge: 6000000 //đơn vị là milisecond
	},
	saveUninitialized: true,
	resave: true
}));

router.use(passport.initialize());
router.use(passport.session());

passport.use('local', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'pwd'
},
	async function (username, pwd, done) {
		// console.log(username)
		const data = await UserM.CheckLogin_1(username);
		// console.log(data)
		if (data.length < 1) {
			// console.log(1)
			return done(null, false, { message: 'Incorrect username.' });
		}
		else { //tìm xem có dữ liệu trong kho đối chiếu không
			// console.log(2)
			return done(null, username);
		}
		
	}
));

passport.serializeUser((username, done) => {
	done(null, username);
})

passport.deserializeUser(async (name, done) => {
	
	try {
		// console.log('11')
		const data = await UserM.CheckLogin_1(name);
		// console.log(data)
		if (data.length < 1) {
			// console.log(1)
			return done(null, false)
		}
		else { //tìm xem có dữ liệu trong kho đối chiếu không
			// console.log(2)
			return done(null, name)
		}
	} catch (e) {
		console.log(e)
	}


})

router.get('/Login', (req, res) => {
	res.sendFile('Login.html', { root: path.join(__dirname, '../Views/NoName/Login') });
})

router.get('/Logout', (req, res) => {
	req.logOut();
	res.redirect('/Login/')
})

router.get('/',async (req, res, next) => {
	// try {
		if (req.isAuthenticated()) {
			if(await UserM.GetTypebyName(req.session.passport.user) == '2'){
				return res.redirect('/Seller');
			}
			if(await UserM.GetTypebyName(req.session.passport.user) == '3'){
				return res.redirect('/admin');
			}
		}

		const ProductsNearEnd = await ProductsM.Top5ProductsNearEnd();
		for (let p of ProductsNearEnd) {
			p.TimeOut = (new Date(p.THOI_DIEM_KETTHUC).getTime() - new Date(p.THOI_DIEM_DANG).getTime()) / 1000;
			const info = await ProductsM.GetInfoProducts(p.MA_SAN_PHAM);
			p.info = info[0];
			p.deadline = ''
			if (p.TimeOut < 10) {
				p.deadline = '<li class="item_mark item_timelast"><i class="fas fa-hourglass-half"></i></li>'
			}
			var n = p.info.HO_TEN.search(' ');
			s = '*';
			s = s.repeat(n);
			s += p.info.HO_TEN.substr(n, p.info.HO_TEN.length);
			p.info.HO_TEN = s

			p.Time = (Date.parse(p.THOI_DIEM_KETTHUC) - Date.parse(p.THOI_DIEM_DANG)) / 1000;
		}
		const ProductsManyPrices = await ProductsM.Top5ProductsManyPrices();
		for (let p of ProductsManyPrices) {
			p.TimeOut = (new Date(p.THOI_DIEM_KETTHUC).getTime() - new Date(p.THOI_DIEM_DANG).getTime()) / 1000;
			const info = await ProductsM.GetInfoProducts(p.MA_SAN_PHAM);
			p.info = info[0];
			p.deadline = ''
			if (p.TimeOut < 10) {
				p.deadline = '<li class="item_mark item_timelast"><i class="fas fa-hourglass-half"></i></li>'
			}
			var n = p.info.HO_TEN.search(' ');
			console.log(p.info.HO_TEN);
			s = '*';
			s = s.repeat(n);
			s += p.info.HO_TEN.substr(n, p.info.HO_TEN.length);
			p.info.HO_TEN = s

			p.Time = (Date.parse(p.THOI_DIEM_KETTHUC) - Date.parse(p.THOI_DIEM_DANG)) / 1000;
		}
		const ProducstsPricesHigh = await ProductsM.Top5ProducstsPricesHigh();
		for (let p of ProducstsPricesHigh) {
			p.TimeOut = (new Date(p.THOI_DIEM_KETTHUC).getTime() - new Date(p.THOI_DIEM_DANG).getTime()) / 1000;
			const info = await ProductsM.GetInfoProducts(p.MA_SAN_PHAM);
			p.info = info[0];
			p.deadline = ''
			if (p.TimeOut < 10) {
				p.deadline = '<li class="item_mark item_timelast"><i class="fas fa-hourglass-half"></i></li>'
			}
			console.log( p.info.HO_TEN);
			if(p.info.HO_TEN){
			var n = p.info.HO_TEN.search(' ');
			s = '*';
			s = s.repeat(n);
			s += p.info.HO_TEN.substr(n, p.info.HO_TEN.length);
			p.info.HO_TEN = s

			p.Time = (Date.parse(p.THOI_DIEM_KETTHUC) - Date.parse(p.THOI_DIEM_DANG)) / 1000;
			}
		}

		if (req.isAuthenticated()) {
			res.render('NoName/start', { layout: "main", ProductsNearEnd: ProductsNearEnd, ProductsManyPrices: ProductsManyPrices, ProducstsPricesHigh: ProducstsPricesHigh, "authentication": req.session.passport.user });
		} else {
			res.render('NoName/start', { layout: "main", ProductsNearEnd: ProductsNearEnd, ProductsManyPrices: ProductsManyPrices, ProducstsPricesHigh: ProducstsPricesHigh });
		}
	// } catch (error) {
	// 	next(error.status);
	// }


});

router.get('/getCategory', async (req, res, next) => {
	try {
		const cate = await CateM.getAllCategory();
		return res.json({ "category": cate });
	} catch (error) {
		next(error.status);
	}

})

router.get('/getTypeProducts/:id', async (req, res, next) => {
	try {
		const typeProducts = await CateM.getAllTypeProducts(req.params.id);
		return res.json({ "Type": typeProducts });
	} catch (error) {
		next(error.status);
	}

})

router.get('/Category/:catID', async (req, res, next) => {
	try {
		const products = await ProductsM.GetProductsByCatID(`${req.params.catID}`);
		for (let p of products) {
			p.TimeOut = (new Date(p.THOI_DIEM_KETTHUC).getTime() - new Date(p.THOI_DIEM_DANG).getTime()) / 1000;
			const info = await ProductsM.GetInfoProducts(p.MA_SAN_PHAM);
			p.info = info[0];
			p.deadline = ''
			if (p.TimeOut < 10) {
				p.deadline = '<li class="item_mark item_timelast"><i class="fas fa-hourglass-half"></i></li>'
			}
			var n = p.info.HO_TEN.search(' ');
			n = n == -1 ? 0 : n
			var s = '*';
			s = s.repeat(n);
			s += p.info.HO_TEN.substr(n, p.info.HO_TEN.length);
			p.Name = s;
		}
		return res.json({ "products": products });
	} catch (error) {
		next(error.status);
	}

})

router.get('/Type/:typeid', async (req, res, next) => {
	try {
		const products = await ProductsM.GetProductsByType(`${req.params.typeid}`);
		for (let p of products) {
			p.TimeOut = (new Date(p.THOI_DIEM_KETTHUC).getTime() - new Date(p.THOI_DIEM_DANG).getTime()) / 1000;
			const info = await ProductsM.GetInfoProducts(p.MA_SAN_PHAM);
			p.info = info[0];
			p.deadline = ''
			if (p.TimeOut < 10) {
				p.deadline = '<li class="item_mark item_timelast"><i class="fas fa-hourglass-half"></i></li>'
			}
			var n = p.info.HO_TEN.search(' ');
			n = n == -1 ? 0 : n
			var s = '*';
			s = s.repeat(n);
			s += p.info.HO_TEN.substr(n, p.info.HO_TEN.length);
			p.Name = s;
		}
		return res.json({ "products": products });
	} catch (error) {
		next(error.status);
	}

});

router.get('/SignUp', (req, res) => {
	res.sendFile('/SignUp.html', { root: path.join(__dirname, '../Views/NoName/Login') });
})
router.get('/search/:keyword', async (req, res, next) => {
	try {
		var sql = `SELECT * FROM(
			SELECT s.TEN_SAN_PHAM, s.GIA_HIEN_TAI,s.GIA_MUA_NGAY,s.LINK_ANH,s.MA_SAN_PHAM,s.MO_TA,s.THOI_DIEM_DANG,s.THOI_DIEM_KETTHUC, l.TEN_LOAI,d.TEN_DANH_MUC FROM auctionfloor.san_pham s,auctionfloor.danh_muc d,auctionfloor.loai_hang l 
			WHERE s.MA_LOAI_HANG = l.MA_LOAI_HANG and l.MA_DANH_MUC = d.MA_DANH_MUC
		) AS temp `;
		const keyword = req.params.keyword;
		if (req.query.chooseName == 'true' && req.query.chooseType == 'true') {
			sql += `WHERE MATCH(TEN_DANH_MUC) AGAINST('${keyword}' IN NATURAL LANGUAGE MODE) or MATCH(TEN_SAN_PHAM) AGAINST('${keyword}' IN NATURAL LANGUAGE MODE)`;
		} else if (req.query.chooseName == 'true') {
			sql += `WHERE MATCH(TEN_SAN_PHAM) AGAINST('${keyword}' IN NATURAL LANGUAGE MODE)`;
		} else if (req.query.chooseType == 'true') {
			sql += `WHERE MATCH(TEN_DANH_MUC) AGAINST('${keyword}' IN NATURAL LANGUAGE MODE);`
		} else {
			sql += `WHERE MATCH(TEN_DANH_MUC) AGAINST('${keyword}' IN NATURAL LANGUAGE MODE) or MATCH(TEN_SAN_PHAM) AGAINST('${keyword}' IN NATURAL LANGUAGE MODE)`;
		}

		const products = await ProductsM.searchProducts(sql);
		for (let p of products) {
			p.TimeOut = (new Date(p.THOI_DIEM_KETTHUC).getTime() - new Date(p.THOI_DIEM_DANG).getTime()) / 1000;
			p.deadline = ''
			if (p.TimeOut < 10) {
				p.deadline = '<li class="item_mark item_timelast"><i class="fas fa-hourglass-half"></i></li>'
			}
			const info = await ProductsM.GetInfoProducts(p.MA_SAN_PHAM);
			p.info = info[0];

			var n = p.info.HO_TEN.search(' ');
			n = n == -1 ? 0 : n
			var s = '*';
			s = s.repeat(n);
			s += p.info.HO_TEN.substr(n, p.info.HO_TEN.length);
			p.Name = s;
		}
		return res.json({ "products": products });
	} catch (error) {
		next(error.status);
	}
});

//Quốc Trung thêm từ đây
router.post('/BidderManage/UPGRADE',async (req, res, next) => {
	try {
		console.log(req.body);
		const iduser = await UserM.GetIDbyName(req.session.passport.user);
		ProductsM.YeuCauUpdateNguoiBan(iduser);
		res.redirect(`/BidderManage`);
	} catch (error) {
		next(error.status);
	}

});
router.post('/detail/SP',async (req, res, next) => {
	try {
		console.log(req.body.nhanxet);
		const iduser = await UserM.GetIDbyName(req.session.passport.user);
		const IDNguoiBan = req.body.MaNGban;
		const Nhanxet = req.body.nhanxet;
		const DiemCong = req.body.LIKES;
		ProductsM.DanhGiaNguoiBan(iduser, IDNguoiBan, Nhanxet, DiemCong);
		res.redirect(`/detail/${req.body.MaSP}`);
	} catch (error) {
		next(error.status);
	}

});
router.get('/detail/:products', async (req, res, next) => {
	// try {
		
	// } catch (error) {
	// 	next(error.status);
	// }
		if (req.isAuthenticated()) {
			const maUser = await UserM.GetIDbyName(req.session.passport.user);
			const GiaDau = req.query.giachon;
			const maSP = req.query.MaSP;
			if (GiaDau != 0) {
				ProductsM.BidderDatGiaSP(maUser, GiaDau, req.params.products);
			} else {
				ProductsM.LuuSanPhamVaoDSYeuThich(maSP, maUser);
			}
			const rows = await ProductsM.GetDetailProductsByID(req.params.products);
			const rows2 = await ProductsM.GetProductsByType(rows[0].MA_LOAI_HANG, req.params.products);
			for (let p of rows2) {
				p.TimeOut = (new Date(p.THOI_DIEM_KETTHUC).getTime() - new Date(p.THOI_DIEM_DANG).getTime()) / 1000;
				const info = await ProductsM.GetInfoProducts(p.MA_SAN_PHAM);
				p.info = info[0];
			}
			//QTRUNG THÊM VÀO
			const rows3 = await ProductsM.GetLichSuDauGia(req.params.products);
			// console.log(rows3)
			for (let p of rows3) {
				var n = p.HO_TEN.search(' ');
				n = n == -1 ? 0 : n
				var s = '*';
				s = s.repeat(n);
				s += p.HO_TEN.substr(n, p.HO_TEN.length);
				p.Name = s;
				// console.log(s)
			}
			const rows4 = await ProductsM.GetDiemBidder(maUser);
			// console.log(req.session.passport.user)
			res.render('./NoName/detailproduct', { layout: "main", "products": rows[0], "relative": rows2, "history": rows3, "bidder_diem": rows4[0],"authentication": req.session.passport.user });

		}else{
			
			const rows = await ProductsM.GetDetailProductsByID(req.params.products);
			const rows2 = await ProductsM.GetProductsByType(rows[0].MA_LOAI_HANG, req.params.products);
			for (let p of rows2) {
				p.TimeOut = (new Date(p.THOI_DIEM_KETTHUC).getTime() - new Date(p.THOI_DIEM_DANG).getTime()) / 1000;
				const info = await ProductsM.GetInfoProducts(p.MA_SAN_PHAM);
				p.info = info[0];
			}
			//QTRUNG THÊM VÀO
			// const rows3 = await ProductsM.GetLichSuDauGia(req.params.products);
			// console.log(rows3)
			// for (let p of rows3) {
			// 	var n = p.HO_TEN.search(' ');
			// 	n = n == -1 ? 0 : n
			// 	var s = '*';
			// 	s = s.repeat(n);
			// 	s += p.HO_TEN.substr(n, p.HO_TEN.length);
			// 	p.Name = s;
			// 	// console.log(s)
			// }
			// const rows4 = await ProductsM.GetDiemBidder(maUser);
			res.render('./NoName/detailproductNoName', { layout: "main", "products": rows[0], "relative": rows2 });

		}
		
});
//QUỐC TRUNG THÊM VÀO

router.get('/BidderManage',async (req, res, next) => {
	try {
		const FavoritesProductBidder = await ProductsM.GetSanPhamYeuThichBidder();
		for (let p of FavoritesProductBidder) {
			p.TimeOut = (new Date(p.THOI_DIEM_KETTHUC).getTime() - new Date(p.THOI_DIEM_DANG).getTime()) / 1000;
			const info = await ProductsM.GetInfoProducts(p.MA_SAN_PHAM);
			p.info = info[0];
		}
		const iduser = await UserM.GetIDbyName(req.session.passport.user) //`USR002`; // nhớ thay đổi vào chỗ này
		const SanphamDangDauGiaBidder = await ProductsM.GetSanPhamDangDauGiaBidder(iduser);
		const SanphamDaThangBidder = await ProductsM.GetSanPhamDaThangBidder(iduser);
		const ThongTinBidder = await ProductsM.GetThongTinBidder(iduser);
		const DiemBidder = await ProductsM.GetDiemBidder(iduser);
		res.render('./NoName/Bidder', { layout: "main",SanphamDangDauGiaBidder: SanphamDangDauGiaBidder, FavoritesProductBidder: FavoritesProductBidder, SanphamDaThangBidder: SanphamDaThangBidder, ThongTinBidder: ThongTinBidder[0], DiemBidder: DiemBidder[0], DanhGiaBidder: ThongTinBidder,"authentication": req.session.passport.user });
	} catch (error) {
		next(error.status);
	}
});

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/Login/')
}
// function checkAuthenticated_Admin(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		return next()
// 	}
// 	res.redirect('/Login/')
// }
async function checkAuthenticated_Bidder(req, res, next) {
	if (req.isAuthenticated()) {
		if(await UserM.GetTypebyName(req.session.passport.user) == '1'){
			return next()
		}else{
			return res.render('NoName/Login/Login.hbs', { layout: "LoginLO", "msg": "P Try Again!!!" });
		}
	}else{
		return res.redirect('/Login/')
	}
	
}

// function checkAuthenticated_Seller(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		if(await UserM.GetTypebyName(req.session.passport.user) == '2'){
// 			return next()
// 		}else{
// 			return res.render('NoName/Login/Login.hbs', { layout: "LoginLO", "msg": "P Try Again!!!" });
// 		}
// 	}else{
// 		return res.redirect('/Login/')
// 	}
// }


module.exports = router;