const db=require('../utils/db');
const tbnDanhmuc = 'danh_muc';
const tbnLoaiHang='loai_hang';
const createError=require('http-errors');
const run=db.errorhandle;

exports.getCategoryLv1=async ()=>{
    const sql=`SELECT * FROM ${tbnDanhmuc}`;
    let [rows,err]=await run(db.load(sql));
    if(err){
        throw createError(err.status);
    }
    return rows;
}
exports.getCategoryLv2=async (maDanhMuc)=>{
    const sql=`SELECT * FROM ${tbnLoaiHang} WHERE '${maDanhMuc}'=MA_DANH_MUC`;
    let [rows,err]=await run(db.load(sql));
    if(err){
        throw createError(err.status);
    }
    return rows;
}
exports.getProductsByTypeProduct=async (maLoaiHang)=>{
    const sql=`SELECT * FROM auctionfloor.san_pham WHERE MA_LOAI_HANG = '${maLoaiHang}';`;
    let [rows,err]=await run(db.load(sql));
    if(err){
        throw createError(err.status);
    }
    return rows;
}
exports.addCategogyLv1=async (entity)=>{
    const sql = `INSERT INTO ${tbnDanhmuc} SET ?`;
    let [id,err]=await run(db.INSERT(sql,entity));
    if(err){
        throw createError(err.status);
    }
    return id;
};
exports.addCategogyLv2=async (entity)=>{
    const sql = `INSERT INTO ${tbnLoaiHang} SET ?`;
    let id=await db.INSERT(sql,entity);
    return id;
};
exports.removeCategogyLv1=async (entity)=>{
    const sql = `DELETE FROM ${tbnDanhmuc} WHERE ?`;
    let [id,err]=await run(db.DELETE(sql,entity));
    if(err){
        throw createError(err.status);
    }
    return id;
};
exports.removeCategogyLv2=async (entity)=>{
    const sql = `DELETE FROM ${tbnLoaiHang} WHERE ?`;
    let [id,err]=await run(db.DELETE(sql,entity));
    if(err){
        throw createError(err.status);
    }
    return id;
};
exports.getCode=async (tb)=>{
    let id="";
    let sql="";
    if(tb===1){
        sql=`SELECT MA_DANH_MUC FROM ${tbnDanhmuc}  ORDER BY MA_DANH_MUC DESC LIMIT 1;`;
    }else if(tb===2){
        sql=`SELECT MA_LOAI_HANG FROM ${tbnLoaiHang} ORDER BY MA_LOAI_HANG DESC LIMIT 1;`;
    }
    id=await db.load(sql);
    return id;
};
exports.editNameCatLv1=async (entity)=>{
    let sql = `UPDATE ${tbnDanhmuc} SET TEN_DANH_MUC=? WHERE MA_DANH_MUC=?`;
    let [id,err]=await run(db.UPDATE(sql,[entity.TenDanhMuc,entity.maDanhMuc]));
    if(err){
        throw createError(err.status);
    }
    return id;
}
exports.editNameCatLv2=async (entity)=>{
    let sql = `UPDATE ${tbnLoaiHang} SET MA_DANH_MUC=?,TEN_LOAI=? WHERE MA_LOAI_HANG=?`;
    let [id,err]=await run(db.UPDATE(sql,[entity.maDanhMuc,entity.tenLoaiHang,entity.maLoaiHang]));
    if(err){
        throw createError(err.status);
    }
    return id;
}