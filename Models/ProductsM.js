const db = require('../utils/db');
const createError=require('http-errors');
const run=db.errorhandle;
const perPage = 6;
module.exports = {
    getAllProducts: async () =>{
        const sql = 'SELECT * FROM auctionfloor.san_pham limit 30;';
        const [rows,err] = await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return rows;
    },
    searchProducts: async (sql) => {
        // const sql = `SELECT * FROM(
        //     SELECT s.TEN_SAN_PHAM, s.GIA_HIEN_TAI,s.GIA_MUA_NGAY,s.LINK_ANH,s.MA_SAN_PHAM,s.MO_TA,s.THOI_DIEM_DANG,s.THOI_DIEM_KETTHUC, l.TEN_LOAI,d.TEN_DANH_MUC FROM auctionfloor.san_pham s,auctionfloor.danh_muc d,auctionfloor.loai_hang l 
        //     WHERE s.MA_LOAI_HANG = l.MA_LOAI_HANG and l.MA_DANH_MUC = d.MA_DANH_MUC
        // ) AS temp WHERE MATCH(TEN_DANH_MUC) AGAINST('${keyword}' IN NATURAL LANGUAGE MODE) or MATCH(TEN_SAN_PHAM) AGAINST('${keyword}' IN NATURAL LANGUAGE MODE)`;
        const [rows,err] = await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return rows;
    },
    Top5ProductsNearEnd: async () =>{
        const sql = 'select * from san_pham order by (THOI_DIEM_KETTHUC - THOI_DIEM_DANG) asc limit 5;';
        const [rows,err] = await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return rows;
    },
    Top5ProductsManyPrices: async  ()=>{
        const sql = 'select ls.MA_SAN_PHAM,sp.TEN_SAN_PHAM,sp.GIA_HIEN_TAI, sp.MA_NGUOI_BAN,sp.LINK_ANH,sp.THOI_DIEM_DANG,sp.THOI_DIEM_KETTHUC,sp.MO_TA,sp.GIA_MUA_NGAY, count(PHIEN_GIAO_DICH) from lich_su_dau_gia ls, san_pham sp where ls.MA_SAN_PHAM = sp.MA_SAN_PHAM group by ls.MA_SAN_PHAM order by count(PHIEN_GIAO_DICH) desc limit 5;';
        const [rows,err] = await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return rows;
    },
    Top5ProducstsPricesHigh: async ()=>{
        const sql = 'select * from san_pham order by GIA_HIEN_TAI desc limit 5;';
        const [rows,err] = await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return rows;
    },
    GetProductsByCatID:  async (catID)=>{
        const sql = `select * from auctionfloor.san_pham s,auctionfloor.loai_hang l WHERE s.MA_LOAI_HANG = l.MA_LOAI_HANG and l.MA_DANH_MUC = '${catID}';`;
        const [rows,err] = await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return rows;
    },
    GetProductsByType: async (typeid,productid) =>{
        const sql = `SELECT * FROM auctionfloor.san_pham s where s.MA_LOAI_HANG = '${typeid}' and s.MA_SAN_PHAM <> '${productid}' limit 5;`;
        const [rows,err] = await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return rows;
    },
    GetDetailProductsByID: async (ProductsID)=>{
        const sql = `select * from auctionfloor.san_pham WHERE MA_SAN_PHAM = '${ProductsID}';`;
        const [rows,err] = await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return rows;
    },
    GetInfoProducts: async (ProductsID) =>{
        const sql = `select ls.PHIEN_GIAO_DICH,ls.THOI_DIEM,ls.IDUSER,ls.GIA_DAU,max(ls.GIA_DAU) as TopPrice,ls.KET_QUA,ls.MA_SAN_PHAM,u.HO_TEN,count(ls.PHIEN_GIAO_DICH) as SL from lich_su_dau_gia ls, user u where ls.IDUSER = u.IDUSER and ls.MA_SAN_PHAM = '${ProductsID}';`;
        const [rows,err] = await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return rows;
    },
    //Qtrung thêm vào từ đây
    GetLichSuDauGia: async (ProductsID) => {
        const sql = `select lich_su_dau_gia.THOI_DIEM,user.HO_TEN,lich_su_dau_gia.GIA_DAU from auctionfloor.user, auctionfloor.lich_su_dau_gia
        where user.IDUSER = lich_su_dau_gia.IDUSER and lich_su_dau_gia.MA_SAN_PHAM = '${ProductsID}';`;
        const rows = await db.load(sql);
        return rows;
    },
    // nhớ sửa lại chỗ USR002 thành lấy user
    GetDiemBidder: async (maUser) => {
        const sql = `SELECT B.MA_USER, ROUND(SUM(B.DIEM_CONG)/COUNT(B.DIEM_CONG)*100) AS TONG_DIEM FROM auctionfloor.danh_gia_mua_ban B
                     WHERE B.MA_USER = '${maUser}'
                    GROUP BY B.MA_USER`;
        const rows = await db.load(sql);
        return rows;
    },
    GetSanPhamYeuThichBidder: async () => {
        const sql = `SELECT *
                    FROM auctionfloor.danh_sach_yeu_thich YT,auctionfloor.san_pham SP
                     WHERE YT.MA_SAN_PHAM = SP.MA_SAN_PHAM AND YT.IDUSER = 'USR002'`;
        const rows = await db.load(sql);
        return rows;
    },
    GetSanPhamDangDauGiaBidder: async (iduser) => {
        const sql = `SELECT *
                     FROM auctionfloor.lich_su_dau_gia LS, auctionfloor.san_pham SP
                    WHERE LS.MA_SAN_PHAM = SP.MA_SAN_PHAM AND LS.IDUSER = '${iduser}' AND LS.KET_QUA = 0`;
        const rows = await db.load(sql);
        return rows;
    },
    GetSanPhamDaThangBidder: async (iduser) => {
        const sql = `SELECT *
                    FROM auctionfloor.lich_su_dau_gia LS, auctionfloor.san_pham SP
                    WHERE LS.MA_SAN_PHAM = SP.MA_SAN_PHAM AND LS.IDUSER = '${iduser}' AND LS.KET_QUA = 1`;
        const rows = await db.load(sql);
        return rows;
    },
    GetThongTinBidder: async (iduser) => {
        const sql = `SELECT *
                    FROM auctionfloor.user BD, auctionfloor.danh_gia_mua_ban DG
                    WHERE BD.IDUSER = DG.MA_USER AND BD.IDUSER = '${iduser}'`;
        const rows = await db.load(sql);
        return rows;
    },
    GetTenUser: async (MA_USER) => {
        const sql = `SELECT HO_TEN
                    FROM auctionfloor.user 
                    WHERE IDUSER = '${MA_USER}'`;
        const rows = await db.load(sql);
        return rows;
    },
    LuuSanPhamVaoDSYeuThich: async (MaSP, IDuser) => {
        const sql = `INSERT INTO auctionfloor.danh_sach_yeu_thich(MA_SAN_PHAM, IDUSER)
                    VALUES ('${MaSP}','${IDuser}')`;
        const rows = await db.load(sql);
        return rows;
    },
    BidderDatGiaSP: async (IDUSER,GIA_DAU,MA_SAN_PHAM) => {
        const rows1 = await db.load('select * from auctionfloor.lich_su_dau_gia');
        const len = rows1.length*10 + 1;
        const PHIEN_GIAO_DICH = 'PGD' + len;
        const THOI_DIEM = '2019-12-05 23:05:00';
        //const THOI_DIEM = new Date();
        //THOI_DIEM.getDate();
        const sql = `INSERT INTO auctionfloor.lich_su_dau_gia(PHIEN_GIAO_DICH,THOI_DIEM,IDUSER,GIA_DAU,KET_QUA,MA_SAN_PHAM)
                    VALUES ('${PHIEN_GIAO_DICH}','${THOI_DIEM}','${IDUSER}','${GIA_DAU}',0,'${MA_SAN_PHAM}')`;
        const rows = await db.load(sql);
        return rows;
    },
    DanhGiaNguoiBan: async (IDngmua,IDNguoiBan,Nhanxet,DiemCong) => {
        const rows1 = await db.load('select * from auctionfloor.Danh_gia_mua_ban');
        const len = rows1.length + 1;
        const MA_DANH_GIA = 'DGMB' + len;
        const sql = `INSERT INTO auctionfloor.Danh_gia_mua_ban(MA_DANH_GIA,MA_USER,DIEM_CONG,NHAN_XET,NGUOI_DANH_GIA)
                    VALUES ('${MA_DANH_GIA}','${IDNguoiBan}',${DiemCong},'${Nhanxet}','${IDngmua}')`;
        const rows = await db.load(sql);
        return rows;
    },
    YeuCauUpdateNguoiBan: async (IDBidder) => {
        const rows1 = await db.load('select * from auctionfloor.yeu_cau');
        const len = rows1.length + 1;
        const MA_YEU_CAU = 'YCB' + len;
        const NGAY_YEU_CAU= '2019-12-05 23:05:00';
        const sql = `INSERT INTO auctionfloor.yeu_cau(MA_YEU_CAU,USERID,NGAY_YEU_CAU)
                    VALUES ('${MA_YEU_CAU}','${IDBidder}','${NGAY_YEU_CAU}')`;
        const rows = await db.load(sql);
        return rows;
    }
}