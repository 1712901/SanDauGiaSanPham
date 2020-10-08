const db=require('../utils/db');
const tbnNameUser = 'user';
const tbnNameFeedback = 'feed_back';
const createError = require('http-errors');
const run=db.errorhandle;
exports.ListUsers=async (type)=>{
    const sql=`SELECT IDUSER,USERNAME,PWD,HO_TEN,EMAIL FROM ${tbnNameUser} WHERE LOAIUSER=${type}`;
    let total=await db.load(sql);
    return total;
};
exports.UpdatePemmission=async (entity)=>{
    let sql = `UPDATE ${tbnNameUser} SET LOAIUSER=? Where IDUSER=?`;
    let [id,err]=await run(db.UPDATE(sql,[entity.LOAIUSER,entity.IDUSER]));
    if(err){
        throw createError(err.status);
    }
    return id;
};
exports.RemoveUser=async (entity)=>{
    let sql = `DELETE FROM ${tbnNameUser} Where ?`;
    let [id,err]=await run(db.DELETE(sql,entity));
    if(err){
        throw createError(err);
    }
    return id;
};
exports.RemoveFeedback=async (entity)=>{
    let sql = `DELETE FROM ${tbnNameFeedback} Where ?`;
    let [id,err]=await run(db.DELETE(sql,entity));
    if(err){
        throw createError(err);
    }
    return id;
};

