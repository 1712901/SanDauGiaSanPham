const db=require('../utils/db');
const createError=require('http-errors');
const run=db.errorhandle;
const tbnNameUser = 'user';
const tbnNameProduct='san_pham';

exports.totalUser=async (type)=>{
    const sql=`SELECT count(*) AS total FROM ${tbnNameUser} WHERE LOAIUSER=${type}`;
    let [total,err]=await run(db.load(sql));
    if(err){
        throw createError(500,"Error server!");
    }
    return total;
}
exports.totalProduct=async ()=>{
    const sql=`SELECT count(*) AS total FROM ${tbnNameProduct} `;
    let [total,err]=await run(db.load(sql));
    if(err){
        throw createError(500,"Error server!");
    }
    return total;
}