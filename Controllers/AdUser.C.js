var express = require('express');
var router = express.Router();
const userModels = require('../models/ADUsers.M');
const requestModel=require('../Models/ADRequest.M');
const productModel=require('../Models/ADProducts.M');
const createError = require('http-errors');

router.get('/', async (req, res, next) => {
    try {
        let type = req.query.t;
        if (type === "Builder") {// danh sách các người mua
            const rows = await userModels.ListUsers(1);
            console.log("/users/?t=Builder");

            res.render('AdRender/AdUsers', { Builder: rows, activeUser: true });

        } else if (type === "Seller") {// danh sach các người bán
            const rows = await userModels.ListUsers(2);
            console.log("/users/?t=Seller");
            res.render('AdRender/AdUsers', { Seller: rows, activeUser: true });
        }
        else next(createError(400));
    } catch (error) {
        next(createError(400));
    }
});
router.post('/downgrade', async (req, res, next) => {
    const idUser = req.body.IdUser;
    const entity = {
        IDUSER: idUser,
        LOAIUSER: 1
    }
    try {
        const id = await userModels.UpdatePemmission(entity);
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
router.post('/upgrade', async (req, res, next) => {
    const idUser = req.body.IdUser;
    const emtity = {
        IDUSER: idUser,
        LOAIUSER: 2
    }
    try {
        const id = await userModels.UpdatePemmission(emtity);
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
router.post('/remove', async (req, res, next) => {
    const idUser = req.body.IdUser;
    const emtity = {
        IDUSER: idUser
    }
    try {
        await requestModel.removeReq({USERID: idUser}); //Xóa bảng yêu cầu.
        await productModel.RemoveHistory({ IDUSER: idUser});//Xóa bảng lịch sử bằng IdUser
        await userModels.RemoveFeedback({ MA_NGBAN: idUser});//Xóa bảng feed back
        const listProduct=await productModel.getProductsByIdUser(idUser);
        for(let i=0;i<listProduct.length;i++){
            await productModel.RemoveHistory({ MA_SAN_PHAM: listProduct[i].MA_SAN_PHAM});//Xóa Bảng lịch sử bẳng IdProduct
            await productModel.Removefavour({MA_SAN_PHAM:listProduct[i].MA_SAN_PHAM});//Xóa bởi Sản Phẩm
            await userModels.RemoveFeedback({ MA_SP: listProduct[i].MA_SAN_PHAM});// Xóa bảng Feedback
        }
        await productModel.Removefavour({IDUSER:idUser}); // Xóa bảng yêu thích
        await productModel.Remove({ MA_NGUOI_BAN: idUser});// xóa bảng sản Phẩm

        const id = await userModels.RemoveUser(emtity); //Xóa user
        if (id !== undefined) {
            res.end(JSON.stringify({
                status: 200,
                messenge: "success"
            }));
        }
    } catch (error) {
        console.log(error);
        next(error);
    }

})
module.exports = router;