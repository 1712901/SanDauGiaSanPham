var express = require('express');
var router = express.Router();
const requestModel = require('../models/ADRequest.M')
const userModel = require('../Models/ADUsers.M')

router.get('/', async (req, res, next) => {
    try{
    const row = await requestModel.getReq();
    res.render('AdRender/AdRequests', { requests: row ,actiRequests:true});
    }catch(error){
        next(error.status);
    }
});
router.post('/remove', async (req, res, next) => {
    const idReq = req.body.IdReq;
    const entity = {
        MA_YEU_CAU: idReq
    }
    try {
        const id = await requestModel.removeReq(entity);
        if (id !== undefined) {
            res.end(JSON.stringify({
                status: 200,
                messenge: "success"
            }));
        }
    } catch (error) {
        next(error.status);
    }
   
});
router.post('/upgrade', async (req, res, next) => {
    const idReq = req.body.IdReq;
    const idUser = await requestModel.getIdUser(idReq);

    console.log(idUser +" "+idReq);
    const entity = {
        IDUSER: idUser,
        LOAIUSER: 2
    }
    try {
        const idremove = await userModel.UpdatePemmission(entity);
    if (idremove != undefined) {
        const id = await requestModel.removeReq({ MA_YEU_CAU: idReq });
        if (id !== undefined) {
            res.end(JSON.stringify({
                status: 200,
                messenge: "success"
            }));
        }
    }
    } catch (error) {
        next(error.status);
    }
});
module.exports = router;