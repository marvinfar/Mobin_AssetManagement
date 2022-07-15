//fetch all product details list
function DataBindProductDetails(t) {
    $('#divTableProductDetails').show();
    $("#LoadingStatusProductDetails").html("در حال بارگذاری...");

    $.ajax({
        type: "Get",
        url: '/productDetails/GetProductDetailsList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $(t);
            var strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<tr class='row_" +
                    data[i].pdId +
                    "' data-id='" + data[i].pdId + "'>" +
                    "<td style='width: 5%'>" + (i + 1) + "</td>" +
                    "<td style='width: 10%' data-pid='" + data[i].productId + "'>" +
                    data[i].productName +
                    "</td>" +
                    "<td style='width: 5%'>" +
                    data[i].productGroupName +
                    "</td>" +
                    "<td style='width: 10%' data-brand='" + data[i].pBrand + "'>" +
                    Null2Empty(data[i].brandName) +
                    "</td>" +
                    "<td style='width: 5%' data-material='" + data[i].pMaterial + "'>" +
                    Null2Empty(data[i].materialName) +
                    "</td>" +
                    "<td style='width: 5%' data-color='" + data[i].pColor + "'>" +
                    Null2Empty(data[i].colorName) +
                    "</td>" +
                    "<td style='width: 5%' data-size='" + data[i].pSize + "'>" +
                    Null2Empty(data[i].sizeName) +
                    "</td>" +
                    "<td style='width: 5%' data-gender='" + data[i].pGender + "'>" +
                    Null2Empty(data[i].genderName) +
                    "</td>" +
                    "<td style='width: 5%' data-country='" + data[i].pCountry + "'>" +
                    Null2Empty(data[i].countryName) +
                    "</td>" +
                    "<td style='width: 10%' >" + Null2Empty(data[i].pDescription )+
                    "</td>" +
                    "<td style='width: 5%' >" + Null2Empty(data[i].pImage) +
                    "</td>" +

                    "</tr>";
            }


            $("#LoadingStatusProductDetails").html(" ");
            $(setData).html(strText);
        }

    });



}

function GetProducts(s) {
    if (s === null) { s = -1 };
    $.ajax({
        type: "Get",
        url: '/productDetails/GetProductList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $('#selProducts');
            var strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<option value='" +
                    data[i].productId +
                    "'>" +
                    data[i].productName + "</option>";
            }
            $(setData).html(strText);
            strText += "<option value=-1>انتخاب کنید</option>";
            $(setData).html(strText);
            //select last item
            $('#selProducts option[value=' + s + ']').prop('selected', true);
        }

    });

}

function GetBrands(s) {
 
    $.ajax({
        type: "Get",
        url: '/productDetails/GetBrandList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $('#selBrand');
            var strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<option value='" +
                    data[i].brandId +
                    "'>" +
                    data[i].brandName + "</option>";
            }
            $(setData).html(strText);
            strText += "<option value=-1>انتخاب کنید</option>";
            $(setData).html(strText);
            $('#selFilterPBr').html(strText);
            //select last item
            $('#selBrand option[value=' + s + ']').prop('selected', true);
            $('#selFilterPBr option[value='+ -1 + ']').prop('selected', true);
        }

    });

}

function GetMaterials(s) {
    if (s === null) { s = -1 };
    $.ajax({
        type: "Get",
        url: '/productDetails/GetMaterialList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $('#selMaterial');
            var strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<option value='" +
                    data[i].materialId +
                    "'>" +
                    data[i].materialName + "</option>";
            }
            $(setData).html(strText);
            strText += "<option value=-1>انتخاب کنید</option>";
            $(setData).html(strText);
            $('#selFilterPMt').html(strText);
            //select last item
            $('#selMaterial option[value=' + s + ']').prop('selected', true);
            $('#selFilterPMt option[value=' + -1 + ']').prop('selected', true);
        }

    });

}

function GetColors(s) {
    if (s === null) { s = -1 };
    $.ajax({
        type: "Get",
        url: '/productDetails/GetColorList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $('#selColor');
            var strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<option value='" +
                    data[i].colorId +
                    "'>" +
                    data[i].colorName + "</option>";
            }
            $(setData).html(strText);
            strText += "<option value=-1>انتخاب کنید</option>";
            $(setData).html(strText);
            $('#selFilterPCo').html(strText);
            //select last item
            $('#selColor option[value=' + s + ']').prop('selected', true);
            $('#selFilterPCo option[value='+ -1 +']').prop('selected', true);
        }

    });
}

function GetSizes(s) {
    if (s===null) {s=-1};
    $.ajax({
        type: "Get",
        url: '/productDetails/GetSizeList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $('#selSize');
            var strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<option value='" +
                    data[i].sizeId +
                    "'>" +
                    data[i].sizeName + "</option>";
            }
            $(setData).html(strText);
            strText += "<option value=-1>انتخاب کنید</option>";
            $(setData).html(strText);
            $('#selFilterPSi').html(strText);
            //select last item
            $('#selSize option[value=' + s + ']').prop('selected', true);
            $('#selFilterPSi option[value='+ -1 +']').prop('selected', true);
        }

    });
}

function GetCountries(s) {
    if (s === null) { s = -1 };
    $.ajax({
        type: "Get",
        url: '/productDetails/GetCountryList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $('#selCountry') 
            var strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<option value='" +
                    data[i].countryId +
                    "'>" +
                    data[i].countryName + "</option>";
            }
            $(setData).html(strText);
            strText += "<option value=-1>انتخاب کنید</option>";
            $(setData).html(strText);
            $('#selFilterPCnt').html(strText);
            //select last item
            $('#selCountry option[value=' + s + ']').prop('selected', true);
            $('#selFilterPCnt option[value='+ -1 +']').prop('selected', true);
        }

    });
}

function GetGenders(s) {
    if (s === null) { s = -1 };
    $.ajax({
        type: "Get",
        url: '/productDetails/GetGenderList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $('#selGender');
            var strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<option value='" +
                    data[i].genderId +
                    "'>" +
                    data[i].genderName + "</option>";
            }
            $(setData).html(strText);
            strText += "<option value=-1>انتخاب کنید</option>";
            $(setData).html(strText);
            $('#selFilterPGe').html(strText);
            //select last item
            $('#selGender option[value=' + s + ']').prop('selected', true);
            $('#selFilterPGe option[value='+ -1 +']').prop('selected', true);
        }

    });
}

function GetProductGroup(s) {
    if (s === null) { s = -1 };
    $.ajax({
        type: "Get",
        url: '/products/GetProductGroupList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $('#selFilterPG');
            var strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<option value='" +
                    data[i].productGroupId +
                    "'>" +
                    data[i].productGroupName + "</option>";

            }
            $(setData).html(strText);
            strText += "<option value=-1>انتخاب کنید</option>";
            $(setData).html(strText);
            $('#selFilterPG').html(strText);
            //select last item
            $('#selFilterPG option[value=' + s + ']').prop('selected', true);
        }

    });

}

$(document).mouseup(function (e) {
    var container = $("#frmModalGetData1");

    // If the target of the click isn't the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
    }
});

function checkEmpty(inp) {
    if (inp.val() === "") {
        return true;
    }
   
}


function subMenuOpen() {
    var getName = function () {
        document.onclick = function (e) {
            if (e.target.className == 'myBtn') {
                var image = e.target.getAttribute("id");
                var i = image.indexOf("-");
                var u = image.substring(i + 1);

                if ($("#sm-" + u).is(":visible")) {
                    $("#sm-" + u).hide();
                } else {
                    $("#sm-" + u).show();
                }

                //////////////////////
            }
        }
    }
    getName();


}

function addNewProductDetails() {

    $('#frmModalGetData1').css({ "top": "150px", "left": "800px", "height": "600px", "width": "600px" });

    GetProducts(-1);
    GetBrands(-1);
    GetMaterials(-1);
    GetColors(-1);
    GetSizes(-1);
    GetCountries(-1);
    GetGenders(-1);

    $('#frmModalGetData1').show();
    $('#selProducts').focus();
    $('#lblProductDetailsID').text("0");
    $('#txtDescription').val("");
}

function editProductDetails() {
    //the select product detail
    
    var pdId = $('.rowSelected').data('id');

    if (pdId !== undefined) {
        var pId = $('.rowSelected').find('td').eq(1).data('pid');
        var pbrand = $('.rowSelected').find('td').eq(3).data('brand');
        var pmat = $('.rowSelected').find('td').eq(4).data('material');
        var pcolor = $('.rowSelected').find('td').eq(5).data('color');
        var psize = $('.rowSelected').find('td').eq(6).data('size');
        var pgender = $('.rowSelected').find('td').eq(7).data('gender');
        var pcountry = $('.rowSelected').find('td').eq(8).data('country');
        var pdesc = $('.rowSelected').find('td').eq(9).text();
        var pimg = $('.rowSelected').find('td').eq(10).text();
        
        $('#lblProductDetailsID').text(pdId);
        $('#lblProductGroupName').text($('.rowSelected').find('td').eq(2).html());
        GetProducts(pId);
        GetBrands(pbrand);
        GetMaterials(pmat);
        GetColors(pcolor);
        GetSizes(psize);
        GetCountries(pcountry);
        GetGenders(pgender);
        $('#txtDescription').val(pdesc);
        
        $('#frmModalGetData1').css({ "top": "150px", "left": "800px", "height": "600px", "width": "600px" });
        $('#frmModalGetData1').show();
        $('#selProducts').focus();
    } else {
        $.notify('یک سطر را انتخاب نمایید');
    }
}

function closeModal(frm) {
    //$('#frmModalGetData1').hide();
    $('#' + frm).hide();
}

function cmdUpdate() {

    var selectedId = $('#selProducts option:selected').val();
    if (selectedId === -1) {
        alert("لطفا کالا را انتخاب نمایید");
        $('#selProducts').focus();
        return;
    }

    var d = [];
    d[0] = $('#lblProductDetailsID').text();
    d[1] = $('#selProducts').val();
    d[2] = $('#selBrand').val();
    d[3] = $('#selMaterial').val();
    d[4] = $('#selColor').val();
    d[5] = $('#selSize').val();
    d[6] = $('#selGender').val();
    d[7] = $('#selCountry').val();
    d[8] = $('#txtDescription').val();
    d[9] = 'c:' + '"\"';

    $.ajax({
        type: "Post",
        url: "/productDetails/SaveProductDetails",
        data: { 'd': d },
        dataType: "json",
        success: function (result) {
            DataBindProductDetails('#SetProductDetailsList');
            closeModal('frmModalGetData1');
            if (d[0]==="0") { // if new record 
                addNewProductDetails();
            }
        }
    });
}

function showDeleteModal() {
    var pdId = $('.rowSelected').data('id');
    var pName = $('.rowSelected').find('td').eq(1).text();
    var pGname = $('.rowSelected').find('td').eq(2).text();
    var pbrand = $('.rowSelected').find('td').eq(3).text();

    if (pdId !== undefined) {
        $('#lblDisplayDeleteInfo').text("اطلاعات سطر انتخابی نام کالا :" + pName + "--- گروه :" + pGname + "---برند " + pbrand);
        $('#frmModalDelete').css({ "top": "200px", "left": "800px" });
        $('#frmModalDelete').show();
    } else {
        $.notify('یک سطر را انتخاب نمایید');
    }

}

function deleteProductDetails() {
    var pdId = $('.rowSelected').data('id');
    $.ajax({
        type: "Post",
        url: "/productDetails/DeleteProductDetails",
        data: { 'pdId': parseInt(pdId) },
        dataType: "json",
        success: function (result) {
            DataBindProductDetails('#SetProductDetailsList');
            closeModal('frmModalDelete');
        }

    });
}

function Null2Empty(v) {
    if (v == null) {
        return ("");
    } else {
        return (v);
    }
};

function clearFilter() {
    DataBindProductDetails('#SetProductDetailsList');

    $("#txtFilterPName").val("");
    $("#txtFilterPDesc").val("");
    
    $('#selFilterPG option[value=' + -1 + ']').prop('selected', true);
    $('#selFilterPBr option[value=' + -1 + ']').prop('selected', true);
    $('#selFilterPMt option[value=' + -1 + ']').prop('selected', true);
    $('#selFilterPCo option[value=' + -1 + ']').prop('selected', true);
    $('#selFilterPSi option[value=' + -1 + ']').prop('selected', true);
    $('#selFilterPGe option[value=' + -1 + ']').prop('selected', true);
    $('#selFilterPCnt option[value=' + -1 + ']').prop('selected', true);
}



function applyFilter() {
    var condition = false;
    var strSql = "SELECT * FROM vProductDetails WHERE ";

    var pn= $('#txtFilterPName').val();
    var gId = $('#selFilterPG option:selected').val();
    var gname = $('#selFilterPG option:selected').text();
    var br = $('#selFilterPBr option:selected').val();
    var mt = $('#selFilterPMt option:selected').val();
    var cl = $('#selFilterPCo option:selected').val();
    var si = $('#selFilterPSi option:selected').val();
    var ge = $('#selFilterPGe option:selected').val();
    var cnt = $('#selFilterPCnt option:selected').val();
    var desc = $('#txtFilterPDesc').val();
    
    if (pn !== "") {
        strSql += "productName LIKE N'%" + pn + "%' AND ";
        condition = true;
    }
    if (gId !== "-1") {
        strSql += "productGroupName = N'" + gname + "' AND ";
        condition = true;
    }
    if (br !== "-1") {
        strSql += "pBrand = " + br + " AND ";
        condition = true;
    }
    if (mt !== "-1") {
        strSql += "pMaterial = " + mt + " AND ";
        condition = true;
    }
    if (cl !== "-1") {
        strSql += "pColor = " + cl + " AND ";
        condition = true;
    }
    if (si !== "-1") {
        strSql += "pSize = " + si + " AND ";
        condition = true;
    }
    if (ge !== "-1") {
        strSql += "pGender = " + ge + " AND ";
        condition = true;
    }
    if (cnt !== "-1") {
        strSql += "pCountry = " + cnt + " AND ";
        condition = true;
    }
    if (desc !=="") {
        strSql += "pDescription LIKE N'%" + desc + "%' AND ";
        condition = true;
    }

    if (condition) {
        strSql = strSql.substring(strSql.length - 4, 0);
        
        $.ajax({
            type: "GET",
            url: "/productDetails/ApplyFilter",
            data: { 'strSql': strSql },
            dataType: "json",
            success: function (data) {
                var setData = $('#SetProductDetailsList');
                var strText = "";

                for (var i = 0; i < data.length; i++) {
                    strText += "<tr class='row_" +
                        data[i].pdId +
                        "' data-id='" + data[i].pdId + "'>" +
                        "<td style='width: 5%'>" + (i + 1) + "</td>" +
                        "<td style='width: 10%' data-pid='" + data[i].productId + "'>" +
                        data[i].productName +
                        "</td>" +
                        "<td style='width: 5%'>" +
                        data[i].productGroupName +
                        "</td>" +
                        "<td style='width: 10%' data-brand='" + data[i].pBrand + "'>" +
                        Null2Empty(data[i].brandName) +
                        "</td>" +
                        "<td style='width: 5%' data-material='" + data[i].pMaterial + "'>" +
                        Null2Empty(data[i].materialName) +
                        "</td>" +
                        "<td style='width: 5%' data-color='" + data[i].pColor + "'>" +
                        Null2Empty(data[i].colorName) +
                        "</td>" +
                        "<td style='width: 5%' data-size='" + data[i].pSize + "'>" +
                        Null2Empty(data[i].sizeName) +
                        "</td>" +
                        "<td style='width: 5%' data-gender='" + data[i].pGender + "'>" +
                        Null2Empty(data[i].genderName) +
                        "</td>" +
                        "<td style='width: 5%' data-country='" + data[i].pCountry + "'>" +
                        Null2Empty(data[i].countryName) +
                        "</td>" +
                        "<td style='width: 10%' >" + Null2Empty(data[i].pDescription) +
                        "</td>" +
                        "<td style='width: 5%' >" + Null2Empty(data[i].pImage) +
                        "</td>" +

                        "</tr>";
                }

                $("#LoadingStatusProductDetails").html(" ");
                $(setData).html(strText);

            }
        });
    }

}

$(document).ready(function () {
    CheckUserSession();
    $('#divTableProductDetails').hide();
    $('#frmModalDelete').hide();
    $('#frmModalGetData1').hide();

    GetProducts(-1);
    GetBrands(-1);
    GetMaterials(-1);
    GetColors(-1);
    GetSizes(-1);
    GetCountries(-1);
    GetGenders(-1);
    GetProductGroup(-1);
    DataBindProductDetails('#SetProductDetailsList');
    $.notify(sessionStorage.getItem('user_name') + " خوش آمدید ", { className: 'success', position: "top,center" });
});