//fetch all product group list
function DataBindMaterial(t) {
    $('#divTableMaterial').show();
    $("#LoadingStatus").html("در حال بارگذاری...");

    $.ajax({
        type: "Get",
        url: '/material/GetMaterialList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $(t);
            var  strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<tr class='row_" +
                    data[i].materialId +
                    "'>" +
                    "<td>" +
                    (i + 1) +
                    "</td>" +
                    "<td>" +
                    data[i].materialId +
                    "</td>" +
                    "<td>" +
                    data[i].materialName +
                    "</td>" +
                    "</tr>";


            }

            $("#LoadingStatus").html(" ");
            $(setData).html(strText);
        }

    });
}

function addNewMaterial() {

    $('#frmModalGetData1').css({ "top": "200px", "left": "800px" });


    $('#frmModalGetData1').show();
    $('#txtMaterialName').focus();
    $('#lblMaterialID').text("0");
    $('#txtMaterialName').val("");
}

function editMaterial() {
    //the select Material id
    var materialId = $('.rowSelected').find('td').eq(1).text();
    var materialName = $('.rowSelected').find('td').eq(2).text();
    if (materialId.length > 0) {
        $('#lblMaterialID').text(materialId);
        $('#txtMaterialName').val(materialName);
        $('#frmModalGetData1').css({ "top": "200px", "left": "800px" });
        $('#frmModalGetData1').show();
        $('#txtMaterialName').focus();
    } else {
        $.notify('یک سطر را انتخاب نمایید',"warn");
    }
}

function closeModal(frm) {
    //$('#frmModalGetData1').hide();
    $('#' + frm).hide();
}

function cmdUpdate() {
    if (checkEmpty($('#txtMaterialName'))) {
        $('#txtMaterialName').notify("لطفا مقدار را وارد نمایید","warn");
        $('#txtMaterialName').focus();
        return;
    }
    var d = [];
    d[0] = $('#lblMaterialID').text();
    d[1] = $('#txtMaterialName').val();
    $.ajax({
        type: "Post",
        url: "/material/SaveMaterial",
        data: { 'd': d },
        dataType: "json",
        success: function (result) {
            DataBindMaterial('#SetMaterialList');
            closeModal('frmModalGetData1');
        }
    });
}

function showDeleteModal() {
    var materialId = $('.rowSelected').find('td').eq(1).text();
    var materialName = $('.rowSelected').find('td').eq(2).text();
    if (materialId.length > 0) {
        $('#lblDisplayDeleteInfo').text("اطلاعات سطر انتخابی :" + materialName + "---" + materialId);
        $('#frmModalDelete').css({ "top": "200px", "left": "800px" });
        $('#frmModalDelete').show();
    } else {
        $.notify('یک سطر را انتخاب نمایید', "warn");
    }

}

function deleteMaterial() {
    var materialId = $('.rowSelected').find('td').eq(1).text();
    $.ajax({
        type: "Post",
        url: "/material/DeleteMaterial",
        data: { 'MaterialId': parseInt(materialId) },
        dataType: "json",
        success: function (result) {
            DataBindMaterial('#SetMaterialList');
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
    $('#divTableMaterial').hide();
    $('#frmModalDelete').hide();
    $('#frmModalGetData1').hide();
   
    DataBindMaterial('#SetMaterialList');
});