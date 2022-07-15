//fetch all product group list
function DataBindCountry(t) {
    $('#divTableCountry').show();
    $("#LoadingStatus").html("در حال بارگذاری...");

    $.ajax({
        type: "Get",
        url: '/country/GetCountryList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $(t);
            var  strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<tr class='row_" +
                    data[i].countryId +
                    "'>" +
                    "<td>" +
                    (i + 1) +
                    "</td>" +
                    "<td>" +
                    data[i].countryId +
                    "</td>" +
                    "<td>" +
                    data[i].countryName +
                    "</td>" +
                    "</tr>";


            }

            $("#LoadingStatus").html(" ");
            $(setData).html(strText);
        }

    });
}

function addNewCountry() {

    $('#frmModalGetData1').css({ "top": "200px", "left": "800px" });


    $('#frmModalGetData1').show();
    $('#txtCountryName').focus();
    $('#lblCountryID').text("0");
    $('#txtCountryName').val("");
}

function editCountry() {
    //the select product group id
    var countryId = $('.rowSelected').find('td').eq(1).text();
    var countryName = $('.rowSelected').find('td').eq(2).text();
    if (countryId.length > 0) {
        $('#lblCountryID').text(countryId);
        $('#txtCountryName').val(countryName);
        $('#frmModalGetData1').css({ "top": "200px", "left": "800px" });
        $('#frmModalGetData1').show();
        $('#txtCountryName').focus();
    } else {
        $.notify('یک سطر را انتخاب نمایید',"warn");
    }
}

function closeModal(frm) {
    //$('#frmModalGetData1').hide();
    $('#' + frm).hide();
}

function cmdUpdate() {
    if (checkEmpty($('#txtCountryName'))) {
        $('#txtCountryName').notify("لطفا مقدار را وارد نمایید","warn");
        $('#txtCountryName').focus();
        return;
    }
    var d = [];
    d[0] = $('#lblCountryID').text();
    d[1] = $('#txtCountryName').val();
    $.ajax({
        type: "Post",
        url: "/country/SaveCountry",
        data: { 'd': d },
        dataType: "json",
        success: function (result) {
            DataBindCountry('#SetCountryList');
            closeModal('frmModalGetData1');
        }
    });
}

function showDeleteModal() {
    var countryId = $('.rowSelected').find('td').eq(1).text();
    var countryName = $('.rowSelected').find('td').eq(2).text();
    if (countryId.length > 0) {
        $('#lblDisplayDeleteInfo').text("اطلاعات سطر انتخابی :" + countryName + "---" + countryId);
        $('#frmModalDelete').css({ "top": "200px", "left": "800px" });
        $('#frmModalDelete').show();
    } else {
        $.notify('یک سطر را انتخاب نمایید', "warn");
    }

}

function deleteCountry() {
    var countryId = $('.rowSelected').find('td').eq(1).text();
    $.ajax({
        type: "Post",
        url: "/country/DeleteCountry",
        data: { 'CountryId': parseInt(countryId) },
        dataType: "json",
        success: function (result) {
            DataBindCountry('#SetCountryList');
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
    $('#divTableCountry').hide();
    $('#frmModalDelete').hide();
    $('#frmModalGetData1').hide();

    DataBindCountry('#SetCountryList');
});