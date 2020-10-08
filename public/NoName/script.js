$().ready(() => {
    $('#form-inline').on('submit', searchFunction);
});

async function getCategory() {
    const res = await fetch('/getCategory');
    const Category = await res.json();

    for (let cate of Category.category) {
        const res1 = await fetch(`/getTypeProducts/${cate.MA_DANH_MUC}`);
        const TypeProducts = await res1.json();
        let code = '';
        for (let type of TypeProducts.Type) {
            code += `<a onclick="getProductByType('${type.MA_LOAI_HANG}')"><div>${type.TEN_LOAI}</div></a>`
        }

        $('.popular_categories').append(`
        <div class="owl-item" style="width: 20%;">
        <a onclick="getProductByCategory('${cate.MA_DANH_MUC}')"><div
                class="popular_category d-flex flex-column align-items-center justify-content-center">
                <div class="popular_category_image w-75"><img src="../../public/NoName/images/${cate.MA_DANH_MUC}.png" alt=""></div>
            
            <div class="popular_category_text d-flex flex-column align-items-start justify-content-start">${cate.TEN_DANH_MUC}</div>
            </div></a>
            <div class="d-flex flex-column align-items-start mt-2 ml-3">
                ${code}
            </div>
        </div>
        `);

    }
}
getCategory();

async function searchFunction(evt) {
    evt.preventDefault();
    var keyword = $('.header_search_input').val();
    var chooseName = $('#fruit1').is(":checked");
    var chooseType = $('#fruit2').is(":checked");
    // console.log(chooseName + ',' + chooseType + ',' + keyword)
    const rows = await fetch(`/search/${keyword}?chooseName=${chooseName}&chooseType=${chooseType}`);
    const data = await rows.json();
    // console.log(data.products.length);       
    if(data.products.length > 0){
        $('.row-body').empty();
        $('.popular_categories').remove();
        $('.row-body').append('<div class="row-filter"></div>');
        $('.row-body').append('<div class="row-products-category d-flex justify-content-center flex-wrap"></div>');
        $('.row-body').append('<div class="row pagination-container w-100 d-flex justify-content-center" ></div>')

        $('.row-filter').append(`
            <button onclick='sortByPrices(${JSON.stringify(data.products)})' type="button" class="btn btn-info">Giá tăng dần</button>
            <button onclick='sortByTime(${JSON.stringify(data.products)})' type="button" class="btn btn-danger">Thời gian kết thúc</button>
        `);

        $('.row-body .row-products-category').empty();
        for (let p of data.products) {
            // var n = p.info.HO_TEN.search(' ');
            // s = '*';
            // s = s.repeat(n);
            // s += p.info.HO_TEN.substr(n,p.info.HO_TEN.length);
            // p.info.HO_TEN = s
            $('.row-products-category').append(`
            <div class="owl-item border border border-primary rounded m-1" style="width: 18rem;">
                <a href="/detail/${p.MA_SAN_PHAM}">
                <div class="viewed_item discount d-flex flex-column align-items-center justify-content-center text-center">
                    <div class="viewed_image"><img src="${p.LINK_ANH}" alt=""></div>
                    <div class="viewed_content text-center" style="height: 200px;">
                        <div class="viewed_name">${p.TEN_SAN_PHAM}</div>
                        <div class="viewed_price">VNĐ <del>${p.GIA_HIEN_TAI}</del></div>
                        <div class="viewed_price">VNĐ <mark style="color: #df3b3b;">${p.info.GIA_DAU}</mark></div>
                        
                        <p class="card-text"><small class="text-muted"><mark>${p.Name}</mark> đang giữ giá đầu cao nhất</small></p>
                        
                    </div>
                    
                    <ul class="item_marks">
                        <li class="item_mark item_discount">${p.info.SL} lượt</li>
                        <li class='item_mark item_time'>${p.TimeOut}s</li>
                        ${p.deadline}
                        
                    </ul>
                    
                </div>
                
                
            </a>
            </div>
        
            `);
            }

            
            $('.row-body').append(`
                <style>
                    .simple-pagination ul {
                        margin: 0 0 20px;
                        padding: 0;
                        list-style: none;
                        text-align: center;
                    }
                    
                    .simple-pagination li {
                        display: inline-block;
                        margin-right: 5px;
                    }
                    
                    .simple-pagination li a,
                    .simple-pagination li span {
                        color: #666;
                        padding: 5px 10px;
                        text-decoration: none;
                        border: 1px solid #EEE;
                        background-color: #FFF;
                        box-shadow: 0px 0px 10px 0px #EEE;
                    }
                    
                    .simple-pagination .current {
                        color: #FFF;
                        background-color: #FF7182;
                        border-color: #FF7182;
                    }
                    
                    .simple-pagination .prev.current,
                    .simple-pagination .next.current {
                        background: #e04e60;
                    }
                </style>
                <script>
                    var items = $(".row-products-category .owl-item");
                    var numItems = items.length;
                    var perPage = 8;

                    items.slice(perPage).hide();

                    $('.row.pagination-container').pagination({
                        items: numItems,
                        itemsOnPage: perPage,
                        prevText: "&laquo;",
                        nextText: "&raquo;",
                        onPageClick: function (pageNumber) {
                            var showFrom = perPage * (pageNumber - 1);
                            var showTo = showFrom + perPage;
                            items.hide().slice(showFrom, showTo).show();
                        }
                    });
                </script>
            `);
        // var s = window.location.href;
        // window.location = s.indexOf("#pos") == -1 ? s + "#pos" : s;
    }else{
        $('.row-body').empty();
        $('.popular_categories').remove();
        $('.row-body').append(`
            <div class="row p-5 d-flex justify-content-center">
                <img src="https://www.shopless.co.nz/images/info/no-search-result.svg" alt="Smiley face" height="500px" width="500px">
            </div>
        `);
    }
    
}

async function getProductByCategory(MaDanhMuc) {
    const rows = await fetch(`/Category/${MaDanhMuc}`);
    const data = await rows.json();
    if($('.popular_categories').length){
        $('.popular_categories').remove();
        $('.row-body').empty();
        $('.row-body').append(`
            <div class="row">
                <div class="col-3">
                    <div class="card bg-light mb-3">
                        <div class="card-header">Category</div>
                        
                        <script>load()</script>
                    </div>
                </div>
                <div class="col-9 d-flex flex-wrap justify-content-center bg-light">
                    <div class="row"></div>
                    <div class="row pagination-container w-100 d-flex justify-content-center">
                        
                    </div>
                    <div id="pagination"></div>
                </div>
                
            </div>
        `);
    }
    
    $('.col-9 > .row').empty();
    for (let p of data.products) {
         
    $('.col-9 .row').append(`
    <div class="owl-item border border-primary rounded m-1" style="width: 18rem;">
        <a href="/detail/${p.MA_SAN_PHAM}">
        <div class="viewed_item discount d-flex flex-column align-items-center justify-content-center text-center">
            <div class="viewed_image"><img src="${p.LINK_ANH}" alt=""></div>
            <div class="viewed_content text-center" style="height: 200px;">
                <div class="viewed_name">${p.TEN_SAN_PHAM}</div>
                <div class="viewed_price">VNĐ <del>${p.GIA_HIEN_TAI}</del></div>
                <div class="viewed_price">VNĐ <mark style="color: #df3b3b;">${p.info.GIA_DAU}</mark></div>
                <p class="card-text"><small class="text-muted"><mark>${p.Name}</mark> đang giữ giá đầu cao nhất</small></p>
                
            </div>
            <ul class="item_marks">
                <li class="item_mark item_discount">${p.info.SL} lượt</li>
                <li class="item_mark item_time">${(Date.parse(p.THOI_DIEM_KETTHUC) - Date.parse(p.THOI_DIEM_DANG)) /1000}s</li>
                ${p.deadline}
            </ul>
            
        </div>
        
    </a>
    </div>

    `);
    }
    $('.row.pagination-container').empty();
    $('#pagination').append(`
    <style>
        .simple-pagination ul {
            margin: 0 0 20px;
            padding: 0;
            list-style: none;
            text-align: center;
        }
        
        .simple-pagination li {
            display: inline-block;
            margin-right: 5px;
        }
        
        .simple-pagination li a,
        .simple-pagination li span {
            color: #666;
            padding: 5px 10px;
            text-decoration: none;
            border: 1px solid #EEE;
            background-color: #FFF;
            box-shadow: 0px 0px 10px 0px #EEE;
        }
        
        .simple-pagination .current {
            color: #FFF;
            background-color: #FF7182;
            border-color: #FF7182;
        }
        
        .simple-pagination .prev.current,
        .simple-pagination .next.current {
            background: #e04e60;
        }
    </style>
    <script>
        var items = $(".row .owl-item");
        var numItems = items.length;
        var perPage = 6;

        items.slice(perPage).hide();

        $('.row.pagination-container').pagination({
            items: numItems,
            itemsOnPage: perPage,
            prevText: "&laquo;",
            nextText: "&raquo;",
            onPageClick: function (pageNumber) {
                var showFrom = perPage * (pageNumber - 1);
                var showTo = showFrom + perPage;
                items.hide().slice(showFrom, showTo).show();
            }
        });
    </script>
    `);
}

async function getProductByType(MaLoaiHang){
    
    const rows = await fetch(`/Type/${MaLoaiHang}`);
    const data = await rows.json();
    
    if($('.popular_categories').length){
        $('.popular_categories').remove();
        $('.row-body').empty();
        $('.row-body').append(`
            <div class="row">
                <div class="col-3">
                <div class="card bg-light mb-3">
                    <div class="card-header">Category</div>
                    <script>load()</script>
                </div>
            </div>
                <div class="col-9 d-flex flex-wrap justify-content-center">
                    <div class="row"></div>
                    <div class="row pagination-container w-100 d-flex justify-content-center">
                    </div>
                    <div id="pagination"></div>
                </div>
            </div>
        `);
    }
    
    $('.col-9 > .row').empty();
    for (let p of data.products) {
         
    $('.col-9 .row').append(`
    <div class="owl-item border border-primary rounded m-1" style="width: 18rem;">
        <a href="/detail/${p.MA_SAN_PHAM}">
        <div class="viewed_item discount d-flex flex-column align-items-center justify-content-center text-center">
            <div class="viewed_image"><img src="${p.LINK_ANH}" alt=""></div>
            <div class="viewed_content text-center" style="height: 200px;">
                <div class="viewed_name">${p.TEN_SAN_PHAM}</div>
                <div class="viewed_price">VNĐ <del>${p.GIA_HIEN_TAI}</del></div>
                <div class="viewed_price">VNĐ <mark style="color: #df3b3b;">${p.info.GIA_DAU}</mark></div>
                <p class="card-text"><small class="text-muted"><mark>${p.Name}</mark> đang giữ giá đầu cao nhất</small></p>
                
            </div>
            <ul class="item_marks">
                <li class="item_mark item_discount">${p.info.SL} lượt</li>
                <li class="item_mark item_time">${(Date.parse(p.THOI_DIEM_KETTHUC) - Date.parse(p.THOI_DIEM_DANG)) /1000}s</li>
                ${p.deadline}
            </ul>
            
        </div>
        
    </a>
    </div>

    `);
    }
    $('.row.pagination-container').empty();
    $('#pagination').append(`
    <style>
        .simple-pagination ul {
            margin: 0 0 20px;
            padding: 0;
            list-style: none;
            text-align: center;
        }
        
        .simple-pagination li {
            display: inline-block;
            margin-right: 5px;
        }
        
        .simple-pagination li a,
        .simple-pagination li span {
            color: #666;
            padding: 5px 10px;
            text-decoration: none;
            border: 1px solid #EEE;
            background-color: #FFF;
            box-shadow: 0px 0px 10px 0px #EEE;
        }
        
        .simple-pagination .current {
            color: #FFF;
            background-color: #FF7182;
            border-color: #FF7182;
        }
        
        .simple-pagination .prev.current,
        .simple-pagination .next.current {
            background: #e04e60;
        }
    </style>
    <script>
        var items = $(".row .owl-item");
        var numItems = items.length;
        var perPage = 6;

        items.slice(perPage).hide();

        $('.row.pagination-container').pagination({
            items: numItems,
            itemsOnPage: perPage,
            prevText: "&laquo;",
            nextText: "&raquo;",
            onPageClick: function (pageNumber) {
                var showFrom = perPage * (pageNumber - 1);
                var showTo = showFrom + perPage;
                items.hide().slice(showFrom, showTo).show();
            }
        });
    </script>
    `);

}

function sortByPrices(arr){
    console.log(arr);
    const products = arr;
    products.sort((a,b)=>{
        var GiaA = a.GIA_HIEN_TAI;
        var GiaB = b.GIA_HIEN_TAI;
        if(GiaA < GiaB){
            return -1;
        }
        if(GiaA > GiaB){
            return 1;
        }
        return 0;
    })

    $('.row-body').empty();
    $('.row-body').append('<div class="row-filter"></div>');
    $('.row-body').append('<div class="row-products-category d-flex justify-content-center flex-wrap"></div>');
    $('.row-body').append('<div class="row pagination-container w-100 d-flex justify-content-center"></div>')

    $('.row-filter').append(`
        <button onclick='sortByPrices(${JSON.stringify(arr)})' type="button" class="btn btn-info">Giá tăng dần</button>
        <button onclick='sortByTime(${JSON.stringify(arr)})' type="button" class="btn btn-danger">Thời gian kết thúc</button>
    `);

    

    // $('.row-products-category').empty();
    for (let p of products) {
        $('.row-products-category').append(`
        <div class="owl-item border border-primary rounded m-1" style="width: 18rem;">
            <a href="/detail/${p.MA_SAN_PHAM}">
            <div class="viewed_item discount d-flex flex-column align-items-center justify-content-center text-center">
                <div class="viewed_image"><img src="${p.LINK_ANH}" alt=""></div>
                <div class="viewed_content text-center" style="height: 250px;">
                    <div class="viewed_name">${p.TEN_SAN_PHAM}</div>
                    <div class="viewed_price">VNĐ <del>${p.GIA_HIEN_TAI}</del></div>
                    <div class="viewed_price">VNĐ <mark style="color: #df3b3b;">${p.info.GIA_DAU}</mark></div>
                    <p class="card-text"><small class="text-muted"><mark>${p.Name}</mark> đang giữ giá đầu cao nhất</small></p>
                    
                </div>
                <ul class="item_marks">
                    <li class="item_mark item_discount">${p.info.SL} lượt</li>
                    <li class="item_mark item_time">${p.TimeOut}s</li>
                    ${p.deadline}
                </ul>
                
            </div>
            
        </a>
        </div>
    
        `);
    }

    $('.row-body').append(`
        <style>
            .simple-pagination ul {
                margin: 0 0 20px;
                padding: 0;
                list-style: none;
                text-align: center;
            }
            
            .simple-pagination li {
                display: inline-block;
                margin-right: 5px;
            }
            
            .simple-pagination li a,
            .simple-pagination li span {
                color: #666;
                padding: 5px 10px;
                text-decoration: none;
                border: 1px solid #EEE;
                background-color: #FFF;
                box-shadow: 0px 0px 10px 0px #EEE;
            }
            
            .simple-pagination .current {
                color: #FFF;
                background-color: #FF7182;
                border-color: #FF7182;
            }
            
            .simple-pagination .prev.current,
            .simple-pagination .next.current {
                background: #e04e60;
            }
        </style>
        <script>
            var items = $(".row-products-category .owl-item");
            var numItems = items.length;
            var perPage = 8;

            items.slice(perPage).hide();

            $('.row.pagination-container').pagination({
                items: numItems,
                itemsOnPage: perPage,
                prevText: "&laquo;",
                nextText: "&raquo;",
                onPageClick: function (pageNumber) {
                    var showFrom = perPage * (pageNumber - 1);
                    var showTo = showFrom + perPage;
                    items.hide().slice(showFrom, showTo).show();
                }
            });
        </script>
    `);
    
    // var s = window.location.href;
    // window.location = s.indexOf("#pos") == -1 ? s + "#pos" : s;
}

function sortByTime(arr){
    products = arr;
    products.sort((a,b)=>{
        var t1 = new Date(a.THOI_DIEM_KETTHUC);
        var t2 = new Date(a.THOI_DIEM_DANG);
        var cal1 = t1.getTime() - t2.getTime();

        var t3 = new Date(b.THOI_DIEM_KETTHUC);
        var t4 = new Date(b.THOI_DIEM_DANG);
        var cal2 = t3.getTime() - t4.getTime();

        if(cal1 < cal2){
            return -1;
        }
        if(cal1 > cal2){
            return 1;
        }
        return 0;
    })
    
    $('.row-body').empty();
    $('.row-body').append('<div class="row-filter"></div>');
    $('.row-body').append('<div class="row-products-category d-flex justify-content-center flex-wrap"></div>');
    $('.row-body').append('<div class="row pagination-container w-100 d-flex justify-content-center"></div>')

    $('.row-filter').append(`
        <button onclick='sortByPrices(${JSON.stringify(arr)})' type="button" class="btn btn-info">Giá tăng dần</button>
        <button onclick='sortByTime(${JSON.stringify(arr)})' type="button" class="btn btn-danger">Thời gian kết thúc</button>
    `);

    for (let p of products) {
        $('.row-products-category').append(`
        <div class="owl-item border border-primary rounded m-1" style="width: 18rem;">
            <a href="/detail/${p.MA_SAN_PHAM}">
            <div class="viewed_item discount d-flex flex-column align-items-center justify-content-center text-center">
                <div class="viewed_image"><img src="${p.LINK_ANH}" alt=""></div>
                <div class="viewed_content text-center" style="height: 250px;">
                    <div class="viewed_name">${p.TEN_SAN_PHAM}</div>
                    <div class="viewed_price">VNĐ <del>${p.GIA_HIEN_TAI}</del></div>
                    <div class="viewed_price">VNĐ <mark style="color: #df3b3b;">${p.info.GIA_DAU}</mark></div>
                    
                    <p class="card-text"><small class="text-muted"><mark>${p.Name}</mark> đang giữ giá đầu cao nhất</small></p>
                    
                </div>
                <ul class="item_marks">
                    <li class="item_mark item_discount">${p.info.SL} lượt</li>
                    <li class="item_mark item_time">${p.TimeOut}s</li>
                    ${p.deadline}
                </ul>
                
            </div>
            
        </a>
        </div>
    
        `);
        }

        $('.row-body').append(`
        <style>
            .simple-pagination ul {
                margin: 0 0 20px;
                padding: 0;
                list-style: none;
                text-align: center;
            }
            
            .simple-pagination li {
                display: inline-block;
                margin-right: 5px;
            }
            
            .simple-pagination li a,
            .simple-pagination li span {
                color: #666;
                padding: 5px 10px;
                text-decoration: none;
                border: 1px solid #EEE;
                background-color: #FFF;
                box-shadow: 0px 0px 10px 0px #EEE;
            }
            
            .simple-pagination .current {
                color: #FFF;
                background-color: #FF7182;
                border-color: #FF7182;
            }
            
            .simple-pagination .prev.current,
            .simple-pagination .next.current {
                background: #e04e60;
            }
        </style>
        <script>
            var items = $(".row-products-category .owl-item");
            var numItems = items.length;
            var perPage = 8;

            items.slice(perPage).hide();

            $('.row.pagination-container').pagination({
                items: numItems,
                itemsOnPage: perPage,
                prevText: "&laquo;",
                nextText: "&raquo;",
                onPageClick: function (pageNumber) {
                    var showFrom = perPage * (pageNumber - 1);
                    var showTo = showFrom + perPage;
                    items.hide().slice(showFrom, showTo).show();
                }
            });
        </script>
    `);
    // var s = window.location.href;
    // window.location = s.indexOf("#pos") == -1 ? s + "#pos" : s;
}

async function load(){
    const res = await fetch('/getCategory');
    const Category = await res.json();

    for (let cate of Category.category) {
        const res1 = await fetch(`/getTypeProducts/${cate.MA_DANH_MUC}`);
        const TypeProducts = await res1.json();
        let code = '';
        for (let type of TypeProducts.Type) {
            code += `<a class="dropdown-item" onclick="getProductByType('${type.MA_LOAI_HANG}')"><div >${type.TEN_LOAI}</div></a>`
        }

        $('.card.bg-light.mb-3').append(`
            <div>
            <button onclick="getProductByCategory('${cate.MA_DANH_MUC}')" class="btn" type="button" style="width: 85%;">
            ${cate.TEN_DANH_MUC}
            </button>
            
            <button class="btn btn-link" data-toggle="collapse" data-target="#collapseExample${cate.MA_DANH_MUC}" aria-expanded="false" aria-controls="collapseExample">
                +
            </button>
            </div>
        <div class="collapse" id="collapseExample${cate.MA_DANH_MUC}">
            <div class="card card-body">
                ${code}
            </div>
        </div>
        `);

    }
}



