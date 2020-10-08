const db = require('../utils/db');
const createError=require('http-errors');
const run=db.errorhandle;
module.exports = {
    getAllCategory : async () =>{
        const sql = 'select * from `danh_muc`';
        const [rows,err] =await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return rows;
    },
    getAllTypeProducts : async (id) =>{
        const sql = `SELECT * FROM auctionfloor.loai_hang where MA_DANH_MUC = '${id}'`;
        const [rows,err] =await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return rows;
    }

}