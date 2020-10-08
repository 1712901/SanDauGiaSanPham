const express = require("express");
const request = require('request');
const router = express.Router();
const multipleUploadMiddleware = require("../middleware/multipleUploadMiddleware");
const Sellers = require('../Models/SellerM');
let debug = console.log.bind(console);

let multipleUpload = async (req, res) => {
  try {
    // thực hiện upload
    await multipleUploadMiddleware(req, res);

    // Nếu upload thành công, không lỗi thì tất cả các file của bạn sẽ được lưu trong biến req.files
    debug(req.files);
    
    // Mình kiểm tra thêm một bước nữa, nếu như không có file nào được gửi lên thì trả về thông báo cho client
    if (req.files.length <= 0) {
      return res.send(`You must select at least 1 file or more.`);
    }

    const duongdan="http://localhost:3000/public/images/";
    const MA_NB="USR004";
    const MA_LH=req.body.LH;
    const TENSP = req.body.tensp;
    const GKD = req.body.GKD;
    const BG = req.body.BG;
    const GBN = req.body.GBN;
    const MOTA1 = req.body.mytextarea;
    var date_ob = new Date();
    var cong =date_ob.getDate()+1;
    var date = ("0" + date_ob.getDate()).slice(-2);
    var date2 = ("0" + cong).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var hours = date_ob.getHours();
    var minutes = date_ob.getMinutes();
    var seconds = date_ob.getSeconds();
    var MOTA2= JSON.stringify(req.body)
    console.log(MOTA2)
    const NGAYDANG = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
    const NGAYKT = (year + "-" + month + "-" + date2 + " " + hours + ":" + minutes + ":" + seconds);
    const ANH1 = duongdan + req.files[0].filename;
    const ANH2 = duongdan + req.files[1].filename;
    const ANH3 = duongdan + req.files[2].filename;
    Sellers.Insert_SanPham(TENSP,GKD,MA_NB,MA_LH,ANH1,NGAYDANG,NGAYKT,MOTA1,GBN,ANH1,ANH2,ANH3,BG);
    // trả về cho người dùng cái thông báo đơn giản.
    
    return res.send(`
        <a>Your files has been uploaded.<a>
    `);
  } catch (error) {
    // Nếu có lỗi thì debug lỗi xem là gì ở đây
    debug(error);

    // Bắt luôn lỗi vượt quá số lượng file cho phép tải lên trong 1 lần
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.send(`Exceeds the number of files allowed to upload.`);
    }

    return res.send(`Error when trying upload many files: ${error}}`);

  }
};
let initRoutes = (app) => {
  // Upload nhiều file với phương thức post
  router.post("/multiple-upload", multipleUpload);
  return app.use("/", router);
};
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
module.exports = initRoutes;
