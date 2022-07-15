//fetch all Vendor list
function DataBindVendor(t) {
    $('#divTableVendor').show();
    $("#LoadingStatus").html("در حال بارگذاری...");

    $.ajax({
        type: "Get",
        url: '/vendor/GetVendorList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $(t);
            var  strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<tr class='row_" +
                    data[i].vendorId +
                    "'>" +
                    "<td style='width: 15px'>" +
                    (i + 1) +
                    "</td>" +
                    "<td style='width: 25px'>" +
                    data[i].vendorId +
                    "</td>" +
                    "<td style='width: 150px'>" +
                    data[i].companyName +
                    "</td>" +
                    "<td style='width: 120px'>" +
                    Null2Empty(data[i].vendorName) +
                    "</td>" +
                    "<td style='width: 120px'>" +
                    Null2Empty(data[i].companyPhone) +
                    "</td>" +
                    "<td>" +
                    Null2Empty(data[i].fax) +
                    "</td>" +
                    "<td style='width: 100px'>" +
                    Null2Empty(data[i].mobile) +
                    "</td>" +
                    "<td style='width: 90px'>" +
                    Null2Empty(data[i].email) +
                    "</td>" +
                    "<td style='width: 450px'>" +
                    Null2Empty(data[i].address) +
                    "</td>" +

                    "</tr>";
            }

            $("#LoadingStatus").html(" ");
            $(setData).html(strText);
        }

    });
}

function addNewVendor() {

    $('#frmModalGetData1').css({ "top": "120px", "left": "800px", "height":"750px" });


    $('#frmModalGetData1').show();
    $('#txtVendorCompanyName').focus();
    $('#lblVendorID').text("0");
    $('#txtVendorCompanyName').val("");
    $('#txtVendorName').val("");
    $('#txtVendorCompanyPhone').val("");
    $('#txtVendorFax').val("");
    $('#txtVendorMobile').val("");
    $('#txtVendorEmail').val("");
    $('#txtVendorAddress').val("");
}

function editVendor() {
    //the select  id
    var vndr=[]; // id,fname,lname,mobile,phone,add,comp
    for (var i = 0; i <= 7; i++) {
        vndr[i] = $('.rowSelected').find('td').eq(i+1).text();
    }
    if (vndr[1].length > 0) {
        $('#lblVendorID').text(vndr[0]);
        $('#txtVendorCompanyName').val(vndr[1]);
        $('#txtVendorName').val(vndr[2]);
        $('#txtVendorCompanyPhone').val(vndr[3]);
        $('#txtVendorFax').val(vndr[4]);
        $('#txtVendorMobile').val(vndr[5]);
        $('#txtVendorEmail').val(vndr[6]);
        $('#txtVendorAddress').val(vndr[7]);

        $('#frmModalGetData1').css({ "top": "200px", "left": "800px", "height": "750px" });
        $('#frmModalGetData1').show();
        $('#txtVendorCompanyName').focus();
    } else {
        $.notify('یک سطر را انتخاب نمایید',"warn");
    }
}

function closeModal(frm) {
    //$('#frmModalGetData1').hide();
    $('#' + frm).hide();
}

function cmdUpdate() {
    var vcomp = $('#txtVendorCompanyName');
    var vname = $('#txtVendorName');
    if (checkEmpty(vcomp) || checkEmpty(vname)) {
        $('#cmdUpdate').notify("لطفا نام شرکت یا پیمانکار را وارد نمایید","warn");
        $('#txtVendorCompanyName').focus();
        return;
    }
    var d = [];
    d[0] = $('#lblVendorID').text();
    d[1] = $('#txtVendorCompanyName').val();
    d[2] = $('#txtVendorName').val();
    d[3] = $('#txtVendorCompanyPhone').val();
    d[4] = $('#txtVendorFax').val();
    d[5] = $('#txtVendorMobile').val();
    d[6] = $('#txtVendorEmail').val();
    d[7] = $('#txtVendorAddress').val();
    $.ajax({
        type: "Post",
        url: "/vendor/SaveVendors",
        data: { 'd': d },
        dataType: "json",
        success: function (result) {
            DataBindVendor('#SetVendorList');
            closeModal('frmModalGetData1');
        }
    });
}

function showDeleteModal() {
    var vendorId = $('.rowSelected').find('td').eq(1).text();
    var vcomp = $('.rowSelected').find('td').eq(2).text();
    var vname = $('.rowSelected').find('td').eq(3).text();

    if (vendorId.length > 0) {
        $('#lblDisplayDeleteInfo').text("اطلاعات سطر انتخابی :" + vcomp  + " " + vname);
        $('#frmModalDelete').css({ "top": "200px", "left": "800px" });
        $('#frmModalDelete').show();
    } else {
        $.notify('یک سطر را انتخاب نمایید', "warn");
    }

}

function deleteVendor() {
    
    var vendorId = $('.rowSelected').find('td').eq(1).text();
    $.ajax({
        type: "Post",
        url: "/vendor/DeleteVendor",
        data: { 'VendorId': Number(vendorId) },
        dataType: "json",
        success: function (result) {
            DataBindVendor('#SetVendorList');
            closeModal('frmModalDelete');
        },
        error: function() {
            $("#cmdDeleteVendor").notify("کد مورد نظر در سایر اطلاعات گردش دارد حذف امکانپذیز نمی باشد", "error");
        }

    });
}

function applyFilter() {
    var condition = false;
    var strSql = "SELECT * FROM tblVendors WHERE ";

    var vcomp = $('#txtFilterCompany').val();
    var vname = $('#txtFilterVendorName').val();
    var mob = $('#txtFilterMobile').val();

    if (vcomp !== "") {
        strSql += "companyName LIKE N'%" + vcomp + "%' AND ";
        condition = true;
    }
    if (vname !== "") {
        strSql += "vendorName LIKE N'%" + vname + "%' AND ";
        condition = true;
    }
    if (mob !== "") {
        strSql += "mobile LIKE N'%" + mob + "%' AND ";
        condition = true;
    }
    
    if (condition) {
        strSql = strSql.substring(strSql.length - 4, 0);
        
        $.ajax({
            type: "GET",
            url: "/vendor/ApplyFilter",
            data: { 'strSql': strSql },
            dataType: "json",
            success: function (data) {
                var setData = $('#SetVendorList');
                var strText = "";

                for (var i = 0; i < data.length; i++) {
                    strText += "<tr class='row_" +
                        data[i].vendorId +
                        "'>" +
                        "<td style='width: 15px'>" +
                        (i + 1) +
                        "</td>" +
                        "<td style='width: 25px'>" +
                        data[i].vendorId +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].companyName +
                        "</td>" +
                        "<td style='width: 120px'>" +
                        Null2Empty(data[i].vendorName) +
                        "</td>" +
                        "<td style='width: 120px'>" +
                        Null2Empty(data[i].companyPhone) +
                        "</td>" +
                        "<td>" +
                        Null2Empty(data[i].fax) +
                        "</td>" +
                        "<td style='width: 100px'>" +
                        Null2Empty(data[i].mobile) +
                        "</td>" +
                        "<td style='width: 90px'>" +
                        Null2Empty(data[i].email) +
                        "</td>" +
                        "<td style='width: 450px'>" +
                        Null2Empty(data[i].address) +
                        "</td>" +

                        "</tr>";
                }
                $("#LoadingStatus").html(" ");
                $(setData).html(strText);

            }
        });
    }

}

function clearFilter() {
    DataBindVendor('#SetVendorList');

    $("#txtFilterCompany").val("");
    $("#txtFilterVendorName").val("");
    $("#txtFilterMobile").val("");
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
    $('#divTableVendor').hide();
    $('#frmModalDelete').hide();
    $('#frmModalGetData1').hide();

    DataBindVendor('#SetVendorList');
});
