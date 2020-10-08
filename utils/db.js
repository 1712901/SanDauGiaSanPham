var mysql = require('mysql');

var connection = () => {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mysql901',
    database: 'auctionfloor'
  });
}
exports.load = (sql) => {
  return new Promise((resole, reject) => {
    const con = connection();
    con.connect((err) => {
      if (err) {
        reject(err);
      }
    });
    con.query(sql, (err, result, fields) => {
      if (err) {
        reject(err);
      }
      resole(result);
    });
    con.end();
  })
};

exports.INSERT = (sql, entity) => {
  return new Promise((resole, reject) => {
    const con = connection();
    con.connect((err) => {
      if (err) {
        reject(err);
      }
    });
    con.query(sql, entity, (err, result, fields) => {
      if (err) {
        reject(err);
      }
      else resole(result.insertId);
    });
    con.end();
  });
}
exports.DELETE = (sql, entity) => {
  return new Promise((resole, reject) => {
    const con = connection();
    con.connect((err) => {
      if (err) {
        reject(err);
      }
    });
    con.query(sql, entity, (err, result, fields) => {
      if (err) {
        reject(err);
      }
      else resole(result.affectedRows);
    });
    con.end();
  });
}
exports.UPDATE = (sql, entity) => {
  return new Promise((resole, reject) => {
    const con = connection();
    con.connect((err) => {
      if (err) {
        reject(err);
      }
    });
    sql=mysql.format(sql,entity);
    console.log(sql);
    con.query(sql, (err, result, fields) => {
      if (err) {
        reject(err);
      }
      else resole(result.changedRows);
    });
    con.end();
  });
}
exports.errorhandle=(promise)=>{
  return promise.then(data=>[data,undefined]).catch(err=>[undefined,err]);
};
