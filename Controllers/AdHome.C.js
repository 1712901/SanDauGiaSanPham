const express = require('express');
const AdHomeModel = require('../models/ADHome.M');
var routers = express.Router();

routers.get('/', async (req, res,next) => {
    try {
        let totalUser_1 = await AdHomeModel.totalUser(1);
        let totalUser_2 = await AdHomeModel.totalUser(2);
        let totalProducts=await AdHomeModel.totalProduct();
        res.render('AdRender/AdHome', {total_1: totalUser_1[0].total,
                 total_2: totalUser_2[0].total,
                 total_3:totalProducts[0].total,
                 activeHome:true}
                 );
    } catch (error) {
        next(error);
    }
});
module.exports = routers;