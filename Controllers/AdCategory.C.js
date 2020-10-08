var express = require('express');
var router = express.Router();
var CategoryModel = require('../models/ADCategory.M')
var ProductMedel = require('../Models/ADProducts.M')
const createError = require('http-errors');
router.get('/', async (req, res, next) => {
    try {
        let idLv1 = req.query.lv1;
        let idLv2 = req.query.lv2;
        const rowsLv1 = await CategoryModel.getCategoryLv1();

        if (idLv1 == undefined && !(Object.keys(rowsLv1).length === 0)) {
            idLv1 = rowsLv1[0].MA_DANH_MUC;
        }
        const rowsLv2 = await CategoryModel.getCategoryLv2(idLv1);

        if (idLv2 == undefined && !(Object.keys(rowsLv2).length === 0)) {
            idLv2 = rowsLv2[0].MA_LOAI_HANG;
        }
        const product = await ProductMedel.getProductsByTypeProduct(idLv2);

        console.log(idLv1);
        const dataCatagory = {
            catLv1: rowsLv1,
            catLv2: rowsLv2,
            IdLv1: idLv1,
            IdLv2: idLv2,
            products: product,
            activeCat: true
        }
        res.render('AdRender/AdCategory', dataCatagory);
    } catch (error) {
        next(createError(400));
    }

});
router.post('/addLV2', async (req, res, next) => {
    const emtity = {
        TEN_LOAI: req.body.TenLoaiHang,
        MA_DANH_MUC: req.body.MaDanhMuc,
        MA_LOAI_HANG: ''
    }
    try {
        let maLoaiHang = (await CategoryModel.getCode(2))[0].MA_LOAI_HANG;
        if (maLoaiHang.length <= 0) {
            maLoaiHang = 'LH001';
        }
        else {
            let stt = parseInt(maLoaiHang.slice(2, 5));
            maLoaiHang = "LH";
            for (i = 0; i < 3 - (stt + "").length; i++) {
                maLoaiHang += "0"
            }
            maLoaiHang += (stt + 1);
        }
        emtity.MA_LOAI_HANG = maLoaiHang;
        console.log(emtity);
        const id = await CategoryModel.addCategogyLv2(emtity);
        if (id !== undefined) {
            res.end(JSON.stringify({
                status: 200,
                messenge: "success"
            }));
        }
    } catch (error) {
        next(error);
    }

})
router.post('/addLV1', async (req, res, next) => {
    const emtity = {
        TEN_DANH_MUC: req.body.TenDanhMuc,
        MA_DANH_MUC: ''
    }
    try {
        let maDanhMuc = (await CategoryModel.getCode(1))[0].MA_DANH_MUC;
        if (maDanhMuc.length <= 0) {
            maDanhMuc = 'DN001';
        }
        else {
            let stt = parseInt(maDanhMuc.slice(2, 5)) + 1 + "";
            maDanhMuc = "DN";
            for (i = 0; i < 3 - stt.length; i++) {
                maDanhMuc += "0"
            }
            maDanhMuc += stt;
        }
        emtity.MA_DANH_MUC = maDanhMuc;
        console.log(emtity);
        const id = await CategoryModel.addCategogyLv1(emtity);
        if (id !== undefined) {
            res.end(JSON.stringify({
                status: 200,
                messenge: "success"
            }));
        }
    } catch (error) {
        next(error);
    }

});
router.post('/removeLv1', async (req, res, next) => {
    const maDanhMuc = req.body.MaDanhMuc;
    console.log(maDanhMuc);
    try {
        const number = await CategoryModel.getCategoryLv2(maDanhMuc);
        if (number.length > 0) {
            res.end(JSON.stringify({
                status: 500,
                messenge: "Fail"
            }))
        }
        else {
            const id = await CategoryModel.removeCategogyLv1({ MA_DANH_MUC: maDanhMuc });
            if (id !== undefined) {
                res.end(JSON.stringify({
                    status: 200,
                    messenge: "success"
                }))
            }
        }
    } catch (error) {
        next(createError(500));
    }

});
router.post('/removeLv2', async (req, res, next) => {
    const maLoaiHang = req.body.MaLoaiHang;
    console.log(maLoaiHang);
    try {
        const number = await CategoryModel.getProductsByTypeProduct(maLoaiHang);
        if (number.length > 0 && number !== undefined) {
            res.end(JSON.stringify({
                status: 500,
                messenge: "Fail"
            }));
        } else {
            const id = await CategoryModel.removeCategogyLv2({ MA_LOAI_HANG: maLoaiHang });
            res.end(JSON.stringify({
                status: 200,
                messenge: "success"
            }));
        }
    } catch (error) {
        next(error);
    }
});
router.post('/editLv1', async (req, res, next) => {
    const entity = {
        maDanhMuc: req.body.MaDanhMuc,
        TenDanhMuc: req.body.TenDanhMucMoi
    }
    try {
        const id = await CategoryModel.editNameCatLv1(entity);
        if (id !== undefined) {
            res.end(JSON.stringify({
                status: 200,
                messenge: "success"
            }));
        }
    } catch (error) {
        next(error);
    }

});
router.post('/editLv2', async (req, res, next) => {
    const entity = {
        maLoaiHang: req.body.MaLoaiHang,
        tenLoaiHang: req.body.TenLoaiHang,
        maDanhMuc: req.body.MaDanhMuc
    }
    try {
        const id = await CategoryModel.editNameCatLv2(entity);
        if (id !== undefined) {
            res.end(JSON.stringify({
                status: 200,
                messenge: "success"
            }));
        }
    } catch (error) {
        next(error);
    }

});
module.exports = router;