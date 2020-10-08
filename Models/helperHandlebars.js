const expbhs = require('handlebars');
expbhs.registerHelper('listBuilder', (users, options) => {
    let listUser = "";
    let i = 1;
    for (const user of users) {
        listUser += `
        <tr>
            <th scope="row">${i++}</th>
            <td>${user.IDUSER}</td>
            <td>${user.HO_TEN}</td>
            <td>${user.EMAIL}</td>
            <td></td>
            <td class="justify-content-center d-flex">
            <button class="btn btn-danger btn-sm mx-1"><i class="fa fa-trash-alt"></i></button>
            <button class="btn btn-primary btn-sm mx-1"><i class="fa fa-pencil-alt"></i></button>
            </td>
        </tr>`
    }
    return listUser;
});
expbhs.registerHelper('listSeller', (users, options) => {
    let listUser = "";
    let i = 1;
    for (const user of users) {
        listUser += `
        <tr>
            <th scope="row">${i++}</th>
            <td>${user.IDUSER}</td>
            <td>${user.HO_TEN}</td>
            <td>${user.EMAIL}</td>
            <td></td>
            <td class="justify-content-center d-flex">  
                <button class="btn btn-danger btn-sm mx-1"><i class="fa fa-trash-alt"></i></button>
                <button class="btn btn-primary btn-sm mx-1"><i class="fa fa-pencil-alt"></i></button>
                <button class="btn btn-warning btn-sm mx-1"><i class="fa fa-angle-double-down"></i></button>
            </td>
        </tr>`
    }
    return listUser;
});
expbhs.registerHelper('listCategoryLv1', (data,idActive, options) => {
    let listCategory = "";
    for (const row of data) {
        listCategory += `
        <tr ${idActive==row.MA_DANH_MUC ? "class='table-success'":""}>
            <th scope="row"><a href="?lv1=${row.MA_DANH_MUC}" >${row.MA_DANH_MUC}</a></th>
            <td>${row.TEN_DANH_MUC}</td>
            <td >
            <button class="btn btn-danger btn-sm"><i class="fa fa-trash-alt"></i></button>
            <button class="btn btn-primary btn-sm"><i class="fa fa-pencil-alt"></i></button>
            </td>
        </tr>`
    }
    return listCategory;
});
expbhs.registerHelper('listCategoryLv2', (data,idLv1,idActive , options) => {
    let listCategory = "";
    let i = 1;
    for (const row of data) {
        listCategory += `
        <tr ${idActive==row.MA_LOAI_HANG ? "class='table-success'":""}>
            <th scope="row"><a href="?lv1=${idLv1}&lv2=${row.MA_LOAI_HANG}">${row.MA_LOAI_HANG}</a></th>
            <td>${row.TEN_LOAI}</td>
            <td>
            <button class="btn btn-danger btn-sm"><i class="fa fa-trash-alt"></i></button>
            <button class="btn btn-primary btn-sm"><i class="fa fa-pencil-alt"></i></button>
            </td>
        </tr>`
    }
    return listCategory;
});
expbhs.registerHelper('listProducts', (data, options) => {
    let listProducts = "";
    let i = 1;
    for (const row of data) {
        listProducts += `
        <tr>
            <th scope="row">${i}</th>
            <td>${row.MA_SAN_PHAM}</td>
            <td>${row.TEN_SAN_PHAM}</td>
            <td>${row.GIA_HIEN_TAI}</td>
            <td><a class="far fa-trash-alt" href="#"></a></td>
            <td><a class="far fa-edit" href="#"></a></td>
        </tr>`
    }
    return listProducts;
});
expbhs.registerHelper('listResuest',(data,option)=>{
    let tr="";
    
})
exports = expbhs;

