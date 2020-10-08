
async function loadSP(){
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
        <script>
        tinymce.init({
          selector: '#mytextarea'
        });
      </script>
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
