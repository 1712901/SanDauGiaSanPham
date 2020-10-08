const db=require('../utils/db');
const tbnProduct = 'san_pham';
const tbnHistory='lich_su_dau_gia';
const tbnUser='user';
const tbnfavour='danh_sach_yeu_thich';
const createError=require('http-errors');
const run=db.errorhandle;

exports.getProductsByTypeProduct=async (maDanhMuc)=>{
    const sql=`SELECT MA_SAN_PHAM,TEN_SAN_PHAM,GIA_HIEN_TAI,HO_TEN FROM ${tbnProduct},${tbnUser} WHERE MA_LOAI_HANG = '${maDanhMuc}' and user.IDUSER=san_pham.MA_NGUOI_BAN ;`;
    let [rows,err]=await run(db.load(sql));
    if(err){
        throw createError(err.status);
    }
    return rows;
}
exports.getProductsByIdUser=async (id)=>{
    const sql=`SELECT MA_SAN_PHAM FROM ${tbnProduct} WHERE MA_NGUOI_BAN='${id}' ;`;
    let [rows,err]=await run(db.load(sql));
    if(err){
        throw createError(err.status);
    }
    return rows;
}
exports.RemoveHistory=async (entity)=>{
    const sqlHis = `DELETE FROM ${tbnHistory} WHERE ?`;
    let [idHis,errHis]=await run(db.DELETE(sqlHis,entity));
    if(errHis){
        throw createError(err.status);
    }
}
exports.Remove= async(entity)=>{
    const sql = `DELETE FROM ${tbnProduct} WHERE ?`;
    let [id,err]=await run(db.DELETE(sql,entity));
    if(err){
        throw createError(err.status);
    }
    return id;
}
// exports.RemoveHistoryByIdUser= async(entity)=>{//{{IDUSER:value}}

//     const sqlHis = `DELETE FROM ${tbnHistory} WHERE ?`;
//     let [rows,err]=await run(db.DELETE(sqlHis,entity));
//     if(err){
//         throw createError(err.status);
//     }
//     return rows;
// }
exports.Removefavour= async(entity)=>{//{{IDUSER:value}}

    const sqlHis = `DELETE FROM ${tbnfavour} WHERE ?`;
    let [rows,err]=await run(db.DELETE(sqlHis,entity));
    if(err){
        throw createError(err.status);
    }
    return rows;
}

