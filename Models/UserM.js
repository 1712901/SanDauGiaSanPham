const db = require('../utils/db');
const run=db.errorhandle;
const createError=require('http-errors');
module.exports = {
    InsertUser : async (fullname, address, email,username, password) =>{
        const rows = await db.load('select * from `user`');
        const len = rows.length + 1;
        const iduser = 'USR0' + len;
        const sql = 'insert into `user`(IDUSER,USERNAME,PWD,HO_TEN,EMAIL,LOAIUSER) values' + `('${iduser}','${username}','${password}','${fullname}','${email}',1)`;
        const [r,err] = await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return r;
    },
    CheckLogin: async(username, email)=>{
        const sql = `select * from auctionfloor.user where USERNAME = '${username}' or EMAIL = '${email}'`;
        const [rows,err] = await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return rows;
    },
    CheckLogin_1: async(username)=>{
        const sql = `select * from auctionfloor.user where USERNAME = '${username}'`;
        const [rows,err] = await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return rows;
    },
    //Quốc Trung thêm vào
    UpdateUser : async (iduser,username,name ,email, password) =>{
        const sql = `UPDATE auctionfloor.user
        SET USERNAME = '${username}', HO_TEN = '${name}', PWD = '${password}', EMAIL = '${email}'
        WHERE IDUSER = '${iduser}'`;
        const [rows,err] = await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return rows;
    },
    GetIDbyName : async (username) =>{
        const sql = `select * from auctionfloor.user where USERNAME='${username}'`;
        const [rows,err] = await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return rows[0].IDUSER;
    },
    GetTypebyName : async (username) =>{
        const sql = `select * from auctionfloor.user where USERNAME='${username}'`;
        const [rows,err] = await run(db.load(sql));
        if(err){
            throw createError(err.status);
        }
        return rows[0].LOAIUSER;
    }

};