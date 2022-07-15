//fetch all product group list
function DataBind(t) {
    $('#divTableProductGroup').show();
    $("#LoadingStatus").html("در حال بارگذاری...");

    $.ajax({
        type: "Get",
        url: '/productGroup/GetProductGroupList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $(t);
            var  strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<tr class='row_" +
                    data[i].productGroupId +
                    "'>" +
                    "<td>" +
                    (i + 1) +
                    "</td>" +
                    "<td>" +
                    data[i].productGroupId +
                    "</td>" +
                    "<td>" +
                    data[i].productGroupName +
                    "</td>" +
                    "</tr>";


            }

            $("#LoadingStatus").html(" ");
            $(setData).html(strText);
        }

    });



}

function addNewProductGroup() {

    $('#frmModalGetData1').css({ "top": "200px", "left": "800px" });


    $('#frmModalGetData1').show();
    $('#txtProductGroupName').focus();
    $('#lblProductGroupID').text("0");
    $('#txtProductGroupName').val("");
}

function editProductGroup() {
    //the select product group id
    var pGId = $('.rowSelected').find('td').eq(1).text();
    var pGName = $('.rowSelected').find('td').eq(2).text();
    if (pGId.length > 0) {
        $('#lblProductGroupID').text(pGId);
        $('#txtProductGroupName').val(pGName);
        $('#frmModalGetData1').css({ "top": "200px", "left": "800px" });
        $('#frmModalGetData1').show();
        $('#txtProductGroupName').focus();
    } else {
        alert('یک سطر را انتخاب نمایید');
    }
}

function closeModal(frm) {
    //$('#frmModalGetData1').hide();
    $('#' + frm).hide();
}

function cmdUpdate() {
    if (checkEmpty($('#txtProductGroupName'))) {
        alert("لطفا مقدار را وارد نمایید");
        $('#txtProductGroupName').focus();
        return;
    }
    var d = [];
    d[0] = $('#lblProductGroupID').text();
    d[1] = $('#txtProductGroupName').val();
    $.ajax({
        type: "Post",
        url: "/productGroup/SaveProductGroup",
        data: { 'd': d },
        dataType: "json",
        success: function (result) {
            DataBind('#SetProductGroupList');
            closeModal('frmModalGetData1');
        }
    });
}

function showDeleteModal() {
    var pGId = $('.rowSelected').find('td').eq(1).text();
    var pGName = $('.rowSelected').find('td').eq(2).text();
    if (pGId.length > 0) {
        $('#lblDisplayDeleteInfo').text("اطلاعات سطر انتخابی :" + pGName + "---" + pGId);
        $('#frmModalDelete').css({ "top": "200px", "left": "800px" });
        $('#frmModalDelete').show();
    } else {
        alert('یک سطر را انتخاب نمایید');
    }

}

function deleteProductGroup() {
    var pGId = $('.rowSelected').find('td').eq(1).text();
    $.ajax({
        type: "Post",
        url: "/productGroup/DeleteProductGroup",
        data: { 'pGId': parseInt(pGId) },
        dataType: "json",
        success: function (result) {
            DataBind('#SetProductGroupList');
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
    $('#divTableProductGroup').hide();
    $('#frmModalDelete').hide();
    $('#frmModalGetData1').hide();
    
    DataBind('#SetProductGroupList');
});

