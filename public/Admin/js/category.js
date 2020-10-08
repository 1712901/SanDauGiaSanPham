function showFormAddCatlv1(option, name) {
    const maDanhMuc = $('#catLv1 tbody tr th a');
    const tenDanhMuc = $('#catLv1 tbody tr td:first-of-type');
    $('#optionDanhMuc').empty();
    for (let i = 0; i < maDanhMuc.length; i++) {
        $('#optionDanhMuc').append(`
            <option value='${maDanhMuc[i].text}' ${maDanhMuc[i].text === option ? 'selected' : ''}>${tenDanhMuc[i].textContent}</option>
                `);
    }
    $('#TenLoaiHang').val(name);
}
function Remove(codeId, type, trTable) {
    console.log(codeId);
    switch (type) {
        case 1:
            //Xóa category Lv1
            $.post('/admin/category/removeLv1', { MaDanhMuc: `${codeId}` }, (data, status, xhr) => {
                try {
                    let objData = JSON.parse(data);
                    if (objData.status === 500) {
                        console.log(objData.messenge);
                        $('.confirm .modal-body p').html(`<div class="alert alert-danger" role="alert">Không thể Xóa Danh mục</div>`);
                    }
                    if (objData.status === 200) {
                        console.log(objData.messenge);
                         $('.confirm').modal('toggle');
                        trTable.remove()
                    }
                } catch (error) {
                    document.write(data);
                }
            })
            break;
        case 2:
            //Xóa catelogy Lv2
            $.post('/admin/category/removeLv2', { MaLoaiHang: `${codeId}` }, (data, status, xhr) => {
                try {
                    let objData = JSON.parse(data);
                    if (objData.status === 500) {
                        console.log(objData.messenge);
                        $('.confirm .modal-body p').html(`<div class="alert alert-danger" role="alert">Không thể Xóa Danh mục</div>`);
                    }
                    if (objData.status === 200) {
                        console.log(objData.messenge);
                        $('.confirm').modal('toggle');
                       trTable.remove()
                    }
                } catch (error) {
                    document.write(data);
                }
            })
            break;
        case 3:
            //Xóa product
            $.post('/admin/products/removePoduct', { MaSanPham: `${codeId}` }, (data, status, xhr) => {
                try {
                    let objData = JSON.parse(data);
                    if (objData.status === 500) {
                        console.log(objData.messenge);
                    }
                    if (objData.status === 200) {
                        console.log(objData.messenge);
                        $('.confirm').modal('toggle');
                        trTable.remove()
                    }
                } catch (error) {
                    document.write(data);
                }
            });
            break;
    };
}
function AddCatLv2() {
    const tenLoaiHang = $('#TenLoaiHang').val();
    const maDanhMuc = $('#optionDanhMuc :selected').val();
    $.post('/admin/category/addLV2', { MaDanhMuc: `${maDanhMuc}`, TenLoaiHang: `${tenLoaiHang}` }, (data, status, xhr) => {
        try {
            let objData = JSON.parse(data);
            if (objData.status === 500) {
                console.log(objData.messenge);
            }
            if (objData.status === 200) {
                console.log(objData.messenge);
                $('#CategoryLv2').modal('toggle');
            }
        } catch (error) {
            document.write(data);
        }
    });
}
function AddCatLv1() {
    const tenDanhMuc = $('#TenDanhMuc').val().toUpperCase();
    $.post('/admin/category/addLV1', { TenDanhMuc: `${tenDanhMuc}` }, function (data, status, xhr) {
        try {
            let objData = JSON.parse(data);
            if (objData.status === 500) {
                console.log(objData.messenge);
            }
            if (objData.status === 200) {
                console.log(objData.messenge);
                $('#CategoryLv1').modal('toggle');
            }
        } catch (error) {
            document.write(data);
        }
    });
}
function EditCatLv1(codeId, trTable) {
    const tenDanhMucNew = $('#TenDanhMuc').val().toUpperCase();
     $.post('/admin/category/editLv1', { MaDanhMuc: `${codeId}`, TenDanhMucMoi:`${tenDanhMucNew}`}, function (data, status, xhr) {
        try {
            let objData = JSON.parse(data);
            if (objData.status === 500) {
                console.log(objData.messenge);
            }
            if (objData.status === 200) {
                console.log(objData.messenge);
                $('#CategoryLv1').modal('toggle');
            }
        } catch (error) {
            document.write(data);
        }
    });
}
function EditCatLv2(codeId, trTable) {
    const tenLoaiHangNew = $('#TenLoaiHang').val();
    const maDanhMucNew = $('#optionDanhMuc :selected').val();
    $.post('/admin/category/editLv2', { MaLoaiHang: `${codeId}`, TenLoaiHang:`${tenLoaiHangNew}`,MaDanhMuc:`${maDanhMucNew}`}, function (data, status, xhr) {
         //let objData = JSON.parse(data);
        try {
            let objData = JSON.parse(data);
            if (objData.status === 500) {
                console.log(objData.messenge);
            }
            if (objData.status === 200) {
                console.log(objData.messenge);
                $('#CategoryLv2').modal('toggle');
            }
        } catch (error) {
            document.write(data);
        }
    });

}
function showConfirm(title, message) {
    $('.confirm .modal-header .modal-title').html(title);
    $('.confirm .modal-body p').html(message);
    $('.confirm').modal('toggle');
    $(".confirm .modal-footer button.btn-primary").prop("onclick", null).off("click");
}
