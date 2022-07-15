//fetch all product group list
function DataBindSize(t) {
    $('#divTableSize').show();
    $("#LoadingStatus").html("در حال بارگذاری...");

    $.ajax({
        type: "Get",
        url: '/size/GetSizeList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $(t);
            var  strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<tr class='row_" +
                    data[i].sizeId +
                    "'>" +
                    "<td>" +
                    (i + 1) +
                    "</td>" +
                    "<td>" +
                    data[i].sizeId +
                    "</td>" +
                    "<td>" +
                    data[i].sizeName +
                    "</td>" +
                    "</tr>";


            }

            $("#LoadingStatus").html(" ");
            $(setData).html(strText);
        }

    });
}

function addNewSize() {

    $('#frmModalGetData1').css({ "top": "200px", "left": "800px" });


    $('#frmModalGetData1').show();
    $('#txtSizeName').focus();
    $('#lblSizeID').text("0");
    $('#txtSizeName').val("");
}

function editSize() {
    //the select product group id
    var sizeId = $('.rowSelected').find('td').eq(1).text();
    var sizeName = $('.rowSelected').find('td').eq(2).text();
    if (sizeId.length > 0) {
        $('#lblSizeID').text(sizeId);
        $('#txtSizeName').val(sizeName);
        $('#frmModalGetData1').css({ "top": "200px", "left": "800px" });
        $('#frmModalGetData1').show();
        $('#txtSizeName').focus();
    } else {
        $.notify('یک سطر را انتخاب نمایید',"warn");
    }
}

function closeModal(frm) {
    //$('#frmModalGetData1').hide();
    $('#' + frm).hide();
}

function cmdUpdate() {
    if (checkEmpty($('#txtSizeName'))) {
        $('#txtSizeName').notify("لطفا مقدار را وارد نمایید","warn");
        $('#txtSizeName').focus();
        return;
    }
    var d = [];
    d[0] = $('#lblSizeID').text();
    d[1] = $('#txtSizeName').val();
    $.ajax({
        type: "Post",
        url: "/size/SaveSize",
        data: { 'd': d },
        dataType: "json",
        success: function (result) {
            DataBindSize('#SetSizeList');
            closeModal('frmModalGetData1');
        }
    });
}

function showDeleteModal() {
    var sizeId = $('.rowSelected').find('td').eq(1).text();
    var sizeName = $('.rowSelected').find('td').eq(2).text();
    if (sizeId.length > 0) {
        $('#lblDisplayDeleteInfo').text("اطلاعات سطر انتخابی :" + sizeName + "---" + sizeId);
        $('#frmModalDelete').css({ "top": "200px", "left": "800px" });
        $('#frmModalDelete').show();
    } else {
        $.notify('یک سطر را انتخاب نمایید', "warn");
    }

}

function deleteSize() {
    var sizeId = $('.rowSelected').find('td').eq(1).text();
    $.ajax({
        type: "Post",
        url: "/size/DeleteSize",
        data: { 'SizeId': parseInt(sizeId) },
        dataType: "json",
        success: function (result) {
            DataBindSize('#SetSizeList');
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
    $('#divTableSize').hide();
    $('#frmModalDelete').hide();
    $('#frmModalGetData1').hide();

    DataBindSize('#SetSizeList');
});