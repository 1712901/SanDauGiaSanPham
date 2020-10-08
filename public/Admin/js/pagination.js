function catchEventClick(){
    $('.pagination li.prev').nextUntil('li.next').on('click',function (e){
        e.preventDefault();
        newPage($(this).text());
        $('.pagination li.active').attr("class","page-item");
        $(this).attr("class","page-item active");
    })
    $('.pagination li.prev').on('click',function(e){
        e.preventDefault();
        const currentPage=$('.pagination li.active');
        if(currentPage.text()===$(this).next().text()){
            return;
        }
        currentPage.attr("class","page-item");
        currentPage.prev().attr("class","page-item active");
        newPage(currentPage.prev().text());
    })
     $('.pagination li.next').on('click',function(e){
        e.preventDefault();
        const currentPage=$('.pagination li.active');
         if(currentPage.text()===$(this).prev().text()){
            return;
        }
        currentPage.attr("class","page-item");
        currentPage.next().attr("class","page-item active");
        newPage(currentPage.next().text());
    })
}
function creatPagination(page) {
    const tbRows =$('tbody.hasPagin > tr');
    let totalPages= parseInt(tbRows.length/8)+1;
    if(totalPages<=1){
        $('.pagination').remove();
        return;
    }
    for (let i = 1; i <= totalPages; i++) {
        $('.pagination li.next').before(
            ` <li class="page-item ${page === i ? ' active' : ''}"><a class="page-link" href="#">${i}</a></li>`
        );
    }
    newPage(page);
}
function newPage(pageIndex) {
    const rows =$('tbody.hasPagin > tr');
    for (let i = 0; i < rows.length; i++) {
        if (i < (pageIndex - 1) * 8 || i > pageIndex * 8 - 1) {
            rows.eq(i).attr("style", "display:none");
        }
        else rows.eq(i).attr("style", "display:");
    }
}