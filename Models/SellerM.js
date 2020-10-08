const db = require('../utils/db');

module.exports = {
    Insert_SanPham: async (TENSP, GIAHT, MA_NB, MA_LH, LINKANH, NGAYDANG, NGAYKTM, MOTA, GIAMUANGAY, LINK_ANH_A, LINK_ANH_B, LINK_ANH_C, BUOC_GIA) => {
        var rows = await db.load('select * from `san_pham`');
        var lent = rows.length + 1
        const MASP = "SP" + lent;

        const sql = 'INSERT INTO `san_pham`(MA_SAN_PHAM,TEN_SAN_PHAM,GIA_HIEN_TAI,MA_NGUOI_BAN,MA_LOAI_HANG,LINK_ANH,THOI_DIEM_DANG,THOI_DIEM_KETTHUC,MO_TA,GIA_MUA_NGAY,LINK_ANH_BS1,LINK_ANH_BS2,LINK_ANH_BS3,BUOC_GIA) VALUES' + `('${MASP}','${TENSP}',${GIAHT},'${MA_NB}','${MA_LH}','${LINKANH}','${NGAYDANG}','${NGAYKTM}','${MOTA}',${GIAMUANGAY},'${LINK_ANH_A}','${LINK_ANH_B}','${LINK_ANH_C}',${BUOC_GIA})`;
        const r = await db.load(sql);
        return r;
    },
    Load_LOAIHANG: async () => {
        var rows = await db.load('SELECT MA_LOAI_HANG,TEN_LOAI FROM auctionfloor.loai_hang');
        return rows;
    },
    //danh sách sản phẩm còn đấu giá
    Load_SpOfSeller: async (id) => {
        const sql = `SELECT * FROM auctionfloor.san_pham where MA_NGUOI_BAN = "${id}" and THOI_DIEM_KETTHUC > CURRENT_TIMESTAMP() and san_pham.MA_SAN_PHAM not in (select DISTINCT a.MA_SAN_PHAM from lich_su_dau_gia as a where a.KET_QUA = 1)`;
        var rows = await db.load(sql);
        return rows;
    },
    //danh sách sản phẩm đã đấu giá
    Load_SpOfSeller_DADAUGIA: async (id) => {
        const sql = `SELECT * FROM auctionfloor.san_pham where MA_NGUOI_BAN = "${id}" and san_pham.MA_SAN_PHAM in (select lich_su_dau_gia.MA_SAN_PHAM from lich_su_dau_gia where KET_QUA=1)`;
        var rows = await db.load(sql);
        return rows;
    },
    update_MOTASANPHAM: async (id, data) => {
        const sql = `UPDATE san_pham SET MO_TA = concat(MO_TA,"<p>",CURRENT_TIMESTAMP(),"</p>",'${data}') WHERE MA_SAN_PHAM = '${id}'`;
        var rows = await db.load(sql);
        return rows;
    },
    Tu_Choi_Ra_Gia: async(user)=>{
        const sql = `update lich_su_dau_gia set KET_QUA=2 where PHIEN_GIAO_DICH ="${user}"`
        var rows = await db.load(sql);
        return rows;
    },
    DANHGIANGUOIMUA: async(user)=>{
        const sql = `update lich_su_dau_gia set KET_QUA=2 where PHIEN_GIAO_DICH ="${user}"`
        var rows = await db.load(sql);
        return rows;
    },
    NGUOICHIENTHANG: async(id)=>{
        const sql = `select * from user where user.IDUSER in (SELECT IDUSER FROM auctionfloor.lich_su_dau_gia where MA_SAN_PHAM='${id}')`
        var rows = await db.load(sql);
        return rows;
    }
};