//fetch all product group list
function DataBindColor(t) {
    $('#divTableColor').show();
    $("#LoadingStatus").html("در حال بارگذاری...");

    $.ajax({
        type: "Get",
        url: '/color/GetColorList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $(t);
            var  strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<tr class='row_" +
                    data[i].colorId +
                    "'>" +
                    "<td>" +
                    (i + 1) +
                    "</td>" +
                    "<td>" +
                    data[i].colorId +
                    "</td>" +
                    "<td>" +
                    data[i].colorName +
                    "</td>" +
                    "</tr>";


            }

            $("#LoadingStatus").html(" ");
            $(setData).html(strText);
        }

    });
}

function addNewColor() {

    $('#frmModalGetData1').css({ "top": "200px", "left": "800px" });


    $('#frmModalGetData1').show();
    $('#txtColorName').focus();
    $('#lblColorID').text("0");
    $('#txtColorName').val("");
}

function editColor() {
    //the select  id
    var colorId = $('.rowSelected').find('td').eq(1).text();
    var colorName = $('.rowSelected').find('td').eq(2).text();
    if (colorId.length > 0) {
        $('#lblColorID').text(colorId);
        $('#txtColorName').val(colorName);
        $('#frmModalGetData1').css({ "top": "200px", "left": "800px" });
        $('#frmModalGetData1').show();
        $('#txtColorName').focus();
    } else {
        $.notify('یک سطر را انتخاب نمایید',"warn");
    }
}

function closeModal(frm) {
    //$('#frmModalGetData1').hide();
    $('#' + frm).hide();
}

function cmdUpdate() {
    if (checkEmpty($('#txtColorName'))) {
        $('#txtColorName').notify("لطفا مقدار را وارد نمایید","warn");
        $('#txtColorName').focus();
        return;
    }
    var d = [];
    d[0] = $('#lblColorID').text();
    d[1] = $('#txtColorName').val();
    $.ajax({
        type: "Post",
        url: "/color/SaveColor",
        data: { 'd': d },
        dataType: "json",
        success: function (result) {
            DataBindColor('#SetColorList');
            closeModal('frmModalGetData1');
        }
    });
}

function showDeleteModal() {
    var colorId = $('.rowSelected').find('td').eq(1).text();
    var colorName = $('.rowSelected').find('td').eq(2).text();
    if (colorId.length > 0) {
        $('#lblDisplayDeleteInfo').text("اطلاعات سطر انتخابی :" + colorName + "---" + colorId);
        $('#frmModalDelete').css({ "top": "200px", "left": "800px" });
        $('#frmModalDelete').show();
    } else {
        $.notify('یک سطر را انتخاب نمایید', "warn");
    }

}

function deleteColor() {
    var colorId = $('.rowSelected').find('td').eq(1).text();
    $.ajax({
        type: "Post",
        url: "/color/DeleteColor",
        data: { 'SizeId': parseInt(colorId) },
        dataType: "json",
        success: function (result) {
            DataBindColor('#SetColorList');
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
    $('#divTableColor').hide();
    $('#frmModalDelete').hide();
    $('#frmModalGetData1').hide();

    DataBindColor('#SetColorList');
});