const db=require('../utils/db');
const tbnRequest = 'yeu_cau';
const tbnUser='user';
const run=db.errorhandle;
const createError=require('http-errors');

exports.getReq=async()=>{
    const sql=`SELECT MA_YEU_CAU ,HO_TEN ,NGAY_YEU_CAU FROM ${tbnRequest} ,${tbnUser}  where ${tbnRequest}.USERID=${tbnUser}.IDUSER;`
    const [row,err] =await run(db.load(sql));
    if(err){
        throw createError(500,"Error server!");
    }
    return row;
}
exports.removeReq=async(entity)=>{
    const sql = `DELETE FROM ${tbnRequest} WHERE ?`;
    const [id,err] =await run(db.DELETE(sql,entity));
    if(err){
        throw createError(500,"Error server!");
    }
    return id;
}
exports.getIdUser=async(idReq)=>{
    const sql=`SELECT USERID FROM ${tbnRequest} where MA_YEU_CAU='${idReq}';`
    const [idUser,err] =await run(db.load(sql));
    if(err){
        throw createError(500,"Error server!");
    }
    return idUser[0].USERID;
}

