//fetch all product group list
function DataBindBrand(t) {
    $('#divTableBrand').show();
    $("#LoadingStatus").html("در حال بارگذاری...");

    $.ajax({
        type: "Get",
        url: '/brand/GetBrandList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $(t);
            var  strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<tr class='row_" +
                    data[i].brandId +
                    "'>" +
                    "<td>" +
                    (i + 1) +
                    "</td>" +
                    "<td>" +
                    data[i].brandId +
                    "</td>" +
                    "<td>" +
                    data[i].brandName +
                    "</td>" +
                    "</tr>";


            }

            $("#LoadingStatus").html(" ");
            $(setData).html(strText);
        }

    });
}

function addNewBrand() {

    $('#frmModalGetData1').css({ "top": "200px", "left": "800px" });


    $('#frmModalGetData1').show();
    $('#txtBrandName').focus();
    $('#lblBrandID').text("0");
    $('#txtBrandName').val("");
}

function editBrand() {
    //the select product group id
    var brandId = $('.rowSelected').find('td').eq(1).text();
    var brandName = $('.rowSelected').find('td').eq(2).text();
    if (brandId.length > 0) {
        $('#lblBrandID').text(brandId);
        $('#txtBrandName').val(brandName);
        $('#frmModalGetData1').css({ "top": "200px", "left": "800px" });
        $('#frmModalGetData1').show();
        $('#txtBrandName').focus();
    } else {
        $.notify('یک سطر را انتخاب نمایید',"warn");
    }
}

function closeModal(frm) {
    //$('#frmModalGetData1').hide();
    $('#' + frm).hide();
}

function cmdUpdate() {
    if (checkEmpty($('#txtBrandName'))) {
        $('#txtBrandName').notify("لطفا مقدار را وارد نمایید","warn");
        $('#txtBrandName').focus();
        return;
    }
    var d = [];
    d[0] = $('#lblBrandID').text();
    d[1] = $('#txtBrandName').val();
    $.ajax({
        type: "Post",
        url: "/brand/SaveBrand",
        data: { 'd': d },
        dataType: "json",
        success: function (result) {
            DataBindBrand('#SetBrandList');
            closeModal('frmModalGetData1');
        }
    });
}

function showDeleteModal() {
    var brandId = $('.rowSelected').find('td').eq(1).text();
    var brandName = $('.rowSelected').find('td').eq(2).text();
    if (brandId.length > 0) {
        $('#lblDisplayDeleteInfo').text("اطلاعات سطر انتخابی :" + brandName + "---" + brandId);
        $('#frmModalDelete').css({ "top": "200px", "left": "800px" });
        $('#frmModalDelete').show();
    } else {
        $.notify('یک سطر را انتخاب نمایید', "warn");
    }

}

function deleteBrand() {
    var brandId = $('.rowSelected').find('td').eq(1).text();
    $.ajax({
        type: "Post",
        url: "/brand/DeleteBrand",
        data: { 'BrandId': parseInt(brandId) },
        dataType: "json",
        success: function (result) {
            DataBind('#SetBrandList');
            closeModal('frmModalDelete');
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

$(document).ready(function () {
    CheckUserSession();
    $('#divTableBrand').hide();
    $('#frmModalDelete').hide();
    $('#frmModalGetData1').hide();

    DataBindBrand('#SetBrandList');
});