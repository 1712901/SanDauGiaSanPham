var express = require('express');
var router = express.Router();
const productModel = require('../Models/ADProducts.M');
const userModel = require('../Models/ADUsers.M');

router.get('/',(req, res) => {
    res.render('AdRender/AdProducts');
});
router.post('/removePoduct',async (req, res, next) => {
    const maSanPham=req.body.MaSanPham;
    console.log(maSanPham);
    try {
        await productModel.RemoveHistory({ MA_SAN_PHAM: maSanPham});
        await productModel.Removefavour({MA_SAN_PHAM: maSanPham});
        await userModel.RemoveFeedback({MA_SP: maSanPham}); // remove feedback
        const id = await productModel.Remove({ MA_SAN_PHAM: maSanPham});
        if (id !== undefined) {
            res.end(JSON.stringify({
                status: 200,
                messenge: "success"
            }))
        } 
    } catch (error) {
        next(error);
    }
    
})
module.exports = router;