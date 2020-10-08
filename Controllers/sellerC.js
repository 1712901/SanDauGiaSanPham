const express = require('express');
const router = express.Router();

const multipleUploadMiddleware = require("../middleware/multipleUploadMiddleware");
const Sellers = require('../Models/SellerM');

const CateM = require('../Models/CategoryM');
const ProductsM = require('../Models/ProductsM');


router.get('/',async (req, res) =>{
	res.render('AdSeller/index_DK_SP',{layout: false,"authentication": req.session.passport.user});
});
router.get('/DK_SP/Load_Loai_Hang',async (req, res) =>{
	const row = await Sellers.Load_LOAIHANG();
	return res.json({"LOAIHANG": row});
});
router.get('/DK_SP',async (req, res) =>{
	const products = await Sellers.Load_SpOfSeller(id);
	console.log(products);
	res.render('index', {products : products,"authentication": req.session.passport.user});
});
router.get('/DS_SP_OfSeller',async (req, res) =>{
	const id='USR004';
	const products = await Sellers.Load_SpOfSeller(id);
	for(let p of products){
		p.TimeOut = (new Date(p.THOI_DIEM_KETTHUC).getTime() - new Date(p.THOI_DIEM_DANG).getTime()) / 1000;
		const info = await ProductsM.GetInfoProducts(p.MA_SAN_PHAM);
		p.info = info[0];
	}
	return res.json({"products" : products});
});
router.get('/DS_SP_DADAUGIA',async (req, res) =>{
	const id='USR004';
	const products = await Sellers.Load_SpOfSeller_DADAUGIA(id);
	for(let p of products){
		p.TimeOut = (new Date(p.THOI_DIEM_KETTHUC).getTime() - new Date(p.THOI_DIEM_DANG).getTime()) / 1000;
		const info = await ProductsM.GetInfoProducts(p.MA_SAN_PHAM);
		p.info = info[0];
	}
	return res.json({"products" : products});
});

// let debug = console.log.bind(console);
router.get('/DK_SP',async (req, res) =>{
	const products = await Sellers.Load_SpOfSeller(id);
	console.log(products);
	res.render('index', {products : products,"authentication": req.session.passport.user});
});
router.get('/detail/:products',async (req, res) => {
	const rows = await ProductsM.GetDetailProductsByID(req.params.products);
	const rows2 = await ProductsM.GetProductsByType(rows[0].MA_LOAI_HANG, req.params.products);
	const rows3 = await ProductsM.GetLichSuDauGia(req.params.products);
	const rows4 = await Sellers.NGUOICHIENTHANG(req.params.products);
	//const rows4 = await ProductsM.GetDiemBidder();                                                       , "bidder_diem":rows4[0]
	res.render('./AdSeller/detailproduct', { layout:"main", "products": rows[0], "relative": rows2, "history": rows3, "NguoiChienThang": rows4[0],"authentication": req.session.passport.user});
});
router.get('/detail/getAPISP/:products', async (req, res) => {
	const rows = await ProductsM.GetDetailProductsByID(req.params.products);
	//const rows4 = await ProductsM.GetDiemBidder();                                                       , "bidder_diem":rows4[0]
	return res.json({"products" : rows});;
});
router.post("/FIXMOTA/:products", async (req, res) => {
	const MOTA1 = req.body.mt;
	try {
		const rows = Sellers.update_MOTASANPHAM(req.params.products,MOTA1);
		return res.send(`chỉnh sửa thành công`);
	} catch (e) {
		return res.send(`chỉnh sủa thất bại`);
	}
});

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/Login/')
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/')
	}
	next()
}
module.exports = router;

