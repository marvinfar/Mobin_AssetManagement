

$(document).mouseup(function (e) {
    //var container = $("#frmModalGetData1");

    //// If the target of the click isn't the container
    //if (!container.is(e.target) && container.has(e.target).length === 0) {
    //    container.hide();
    //}
});

$(document).delegate(".Calc", "focusout", function () {
    $('#txtServiceTotalPrice').val(CurrencyFormat($('#txtServiceTotalPrice').val()));
    $('#txtServiceDetPrice').val(CurrencyFormat($('#txtServiceDetPrice').val()));
   
});

$(document).delegate("#txtServiceAmvalNumber", "focusout", function () {
    if ($("#txtServiceAmvalNumber").val() !== "") {
        $("#cmdCheckServiceAmval").trigger("click");
    }
});

$(document).delegate("#txtServiceAmvalNumber", "keyup", function (e) {
    $("#lblServiceMessage").html("پیام");
    $("#lblServiceMessage").hide();
    $("#txtServiceCustomerName").val("");
    $("#lblServiceCustomerId").text("0000");
    $("#txtServiceFindProducts").val("");
    $("#lblServiceFindpdID").text("0000");
    $('#cmdServiceSaveDet').attr("disabled", "disabled");
    if (isNaN($(this).val())) {
        $(this).notify("عدد وارد شود", { autoHideDelay: 1000 });
    }
});

$(document).delegate(".Calc", "keyup", function (e) {
    var f = CurrencyFormat($(this).val(), false);

    if (isNaN(f) ) {
        $(this).notify("عدد وارد شود", { autoHideDelay: 1000});
    }
});

$(document).delegate("input", "change", function(e) {
    if ($("#chkServiceKhoroojHesab").is(":checked")) {
        if ($("#chkServiceEsghat").is(":checked")) {
            $("#chkServiceKhoroojHesab").prop('checked', false);
        }
    }
    if ($("#chkServiceEsghat").is(":checked")) {
        if ($("#chkServiceKhoroojHesab").is(":checked")) {
            $("#chkServiceEsghat").prop('checked', false);
        }
    }
});

$(document).delegate("#cmdServiceSaveDet", "click", function (e) {

    var cnt = $('#SetServiceDetailList').find('tr').length + 1;

    if (inTableExist("SetServiceDetailList", 3, $('#txtServiceAmvalNumber').val())) {
        $("#txtServiceAmvalNumber").notify("شماره اموال قبلا ثبت شده است");
        return;
    }
    if (checkEmpty($("#txtServiceDetDesc"))) {
        $("#txtServiceDetDesc").notify("لازم است شرح موردی سرویس تکمیل گردد", "warn");
        return;
    }
    var a = $('#chkServiceKhoroojHesab').is(':checked') ? '****' : '';
    var b = $('#chkServiceEsghat').is(':checked') ? '****' : '';
    var rt = $('#lblRadifTakhsis').text();
    var strText = "<tr data-id="+rt+">";
    strText += "<td>" + cnt + "</td>";
    strText += "<td>" + $('#lblServiceFindpdID').text() + "</td>";
    strText += "<td>" + $('#txtServiceFindProducts').val() + "</td>";
    strText += "<td>" + $('#txtServiceAmvalNumber').val() + "</td>";
    strText += "<td>" + $('#lblServiceCustomerId').text() + "</td>";
    strText += "<td>" + $('#txtServiceCustomerName').val() + "</td>";
    strText += "<td>" + $('#txtServiceDetPrice').val() + "</td>";
    strText += "<td>" + $('#txtServiceDetDesc').val() + "</td>";
    strText += "<td>" + a + "</td>";
    strText += "<td>" + b + "</td>";
    strText += "</tr>";
    $('#SetServiceDetailList').append(strText);
    //clear data
    $('#lblServiceFindpdID').text("0000");
    $('#txtServiceFindProducts').val("");
    $('#txtServiceAmvalNumber').val("");
    $('#lblServiceCustomerId').text("0000");
    $('#txtServiceCustomerName').val("");
    $('#txtServiceDetPrice').val("");
    $('#txtServiceDetDesc').val("");
    $('#chkServiceKhoroojHesab').prop('checked', false);
    $('#chkServiceEsghat').prop('checked', false);
    $('#lblRadifTakhsis').text("XXXX");
    $('#txtServiceAmvalNumber').focus();
    //
    GetSumOfCurrencyTable($('#SetServiceDetailList tr'), 6);
    AddCssServiceDetailColumn();//set Column width Setting
        
});

$(document).delegate("#cmdDeleteDetail", "click", function (e) {
    var r = $('#tServiceDetail .rowSelected').find('td').eq(1).text();
    
    if (r.length > 0) {
        $('#tServiceDetail .rowSelected').remove();
        var i = -1;
        $('#tServiceDetail tr').each(function () {
                i+=1;
                $(this).find("td").eq(0).html(i);
            });
        GetSumOfServiceDetail();
    } else {
        $('#cmdDeleteDetail').notify('یک سطر را انتخاب نمایید', "warn");
    }
});

$(document).delegate("#txtServiceVendorName", "keyup", function (e) {
    if (e.keyCode==13 || e.keyCode==27){return}
    $("#lblServiceVendorId").html("0000");
    var strFind = $('#txtServiceVendorName').val();
    var strSql = "SELECT * FROM tblVendors WHERE ";

    if (strFind.length !== 0) {
        $("#tVendorFilter").css("visibility", "visible");

        strSql += "companyName LIKE N'%" + strFind + "%' ";

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
                        "' data-id='" + data[i].vendorId + "'>" +
                        "<td style='width: 15px'>" +
                        (i + 1) +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].companyName +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].vendorName +
                        "</td>" +
                        "</tr>";
                }
                
                $("#LoadingStatusVendor").html(" ");
                $(setData).html(strText);

            }
        });
    }
    else {
        $("#tVendorFilter").css("visibility", "collapse");
        $("#lblServiceVendorId").html("0000");
    }
});

$(document).delegate("input", "keypress", function (e) {
    /* ENTER PRESSED*/
    if (e.keyCode == 13) {
        /* FOCUS ELEMENT */
        var inputs = $(this).parents("div").eq(0).find(":input:text");
        var idx = inputs.index(this);
        
        if (idx === inputs.length - 1 ) {
            inputs[0].focus();
        } else {
            inputs[idx + 1].focus(); //  handles submit buttons
            inputs[idx + 1].select();
        }
        return false;
    }
});

$(document).delegate("#cmdServiceSaveMain", "click", function () {
    
    if (sessionStorage.getItem('user_id') === null) {
        alert("اعتبار کاربری شما به اتمام رسیده است لطفا مجددا وارد شود");
        return;
    }
    if (checkEmpty($("#txtServiceVendorName")) || $("#lblServiceVendorId").text() === "0000") {
        $("#txtServiceVendorName").notify("پیمانکار مورد نظر را انتخاب نمایید", "warn");
        $("#txtServiceVendorName").focus();
        return;
    }
    if (!CheckFarsiValidDate($('#txtServiceDate').val())) {
        $('#txtServiceDate').notify("اشکال در ورود تاریخ", "warn");
        return;
    };
    
    if (checkEmpty($('#txtServiceDesc'))) {
        $('#txtServiceDesc').notify("شرحی برای سرویس در نظر گرفته شود", "warn");
        return;
    };
    
   
    var l = $("#SetServiceDetailList tr").length;
    if (l === 0) {
        $("#cmdServiceSaveMain").notify("لیست سرویس ها خالی می باشد");
        return;
    }
 
   var sum = GetSumOfCurrencyTable($('#SetServiceDetailList tr'), 6);
    if (checkEmpty($('#txtServiceTotalPrice'))) {
        $('#txtServiceTotalPrice').val(CurrencyFormat(sum));
        if (sum === 0) {
            $('#txtServiceTotalPrice').notify("لطفا مبلغی برای کل سرویسهای انجام شده تعیین نمایید", "warn");
            return;
        }
    }

    //save Service Main Info
    var d = [];
    d[0] = 0;
    var newVal = $('#txtServiceDate').val().split('/');
    var x = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
    d[1] = x[0] + "/" + x[1] + "/" + x[2];
    d[2] = $('#lblServiceVendorId').text();
    d[3] = $('#txtServiceDesc').val();
    d[4] = CurrencyFormat($('#txtServiceTotalPrice').val(), false);
    d[5] = sessionStorage.getItem("user_id");
    $.ajax({
        type: "Post",
        url: "/service/SaveServiceMain",
        data: { 'd': d },
        dataType: "json",
        success: function (result) {
            SaveServiceDetail(result,d[1],d[5]);
        }
    });

});

function SaveServiceDetail(serviceId,dt,uid) {
    var d = [];
    var sId = serviceId;
    
    $('#SetServiceDetailList tr').each(function () {
        d[0] = $(this).data("id");//RadifTakhsis
        d[1] = $(this).find("td").eq(0).html();//radif
        d[2] = $(this).find("td").eq(1).html();//pdid
        d[3] = $(this).find("td").eq(3).html();//amval
        d[4] = $(this).find("td").eq(4).html();//customerId
        d[5] = CurrencyFormat($(this).find("td").eq(6).html(), false);//service price
        d[6] = $(this).find("td").eq(7).html();//detail desc
        d[7] = dt;//Date For Save in Esghat and Takhsis Table
        d[8] = uid;
            ////
        var option = 0;
        if ($(this).find("td").eq(8).html() === "****") { option = 1; } // Khoroj az hesab
        if ($(this).find("td").eq(9).html() === "****") { option = 2; } // Esghat

        $.ajax({
            type: "Post",
            url: "/service/SaveServiceDetail",
            data: {'serviceId':sId, 'd': d,'option':option },
            dataType: "json",
            success: function (result) {
                $("#txtServiceVendorName").notify("اطلاعات با موفقیت ثبت شد", "success");
                $("#txtServiceVendorName").val("");
                $("#lblServiceVendorId").text("0000");
                $("#txtServiceDesc").val("");
                $("#txtServiceTotalPrice").val("");
                $("#txtServiceAmvalNumber").val("");
                $("#lblServiceMessage").text("پیام");
                $("#lblServiceMessage").hide();
                $("#txtServiceCustomerName").val("");
                $("#lblServiceCustomerId").text("0000");
                $("#txtServiceFindProducts").val("");
                $("#lblServiceFindpdID").text("0000");
                $("#txtServiceDetPrice").val("");
                $("#txtServiceDetDesc").val("");
                $("#chkServiceKhoroojHesab").prop('checked', false);
                $("#chkServiceEsghat").prop('checked', false);
                ClearTable("SetServiceDetailList");
                $("#txtServiceVendorName").focus();
            }
        });
    });
}

$(document).delegate("#cmdCheckServiceAmval", "click", function (e) {

    var n = $("#txtServiceAmvalNumber").val();
    if (n.length !== 5) {
        $("#txtServiceAmvalNumber").notify("شماره اموال وارد شده صحیح نمی باشد", "warn");
        return;
    };
    if (!isNaN(n)) {
        $.ajax({
            type: "GET",
            url: "/esghatAmval/CheckAmvalInEsghat",
            data: { 'n': n },
            dataType: "json",
            success: function (data) {
                if (data) {
                    // true = already esghat
                    $('#lblServiceMessage').text("این شماره اموال اسقاط شده است");
                    $("#lblServiceMessage").show();
                } else {//bayad check shavad aya be kasi taalogh darad?
                    $.ajax({
                        type: "GET",
                        url: "/esghatAmval/CheckAmvalInTakhsis",
                        data: { 'n': n },
                        dataType: "json",
                        success: function (result) {
                            if (result != null) {
                                var x = result.customerFName + " " + result.customerLName;
                                var y = result.productName;
                                $('#lblServiceMessage')
                                    .text("این شماره اموال متعلق به " + x + " و کالای " + y + " می باشد");
                                $("#txtServiceCustomerName").val(x);
                                $("#lblServiceCustomerId").text(result.customerId);
                                $("#txtServiceFindProducts").val(y);
                                $("#lblServiceFindpdID").text(result.pdId);
                                $("#lblRadifTakhsis").text(result.radif);
                                $('#cmdServiceSaveDet').removeAttr('disabled');
                                $("#txtServiceDetPrice").focus();
                            }
                        },
                        error: function (ajaxContext) {
                            $('#lblServiceMessage')
                                .text("این شماره اموال تخصیص نیافته است و تا قبل از تخصیص قابل سرویس نمی باشد ");
                        }
                    });
                    $('#lblServiceMessage').show();
                };
            }
        });

    } else {
        $("#txtServiceAmvalNumber").notify("شماره اموال وارد شده صحیح نمی باشد", "warn");
    }
});

function AddCssServiceDetailColumn() {
    $('#tServiceDetail tr').each(function() {
        $(this).find('td').eq(0).css('width', '5%');
        $(this).find('td').eq(1).css('width', '5%');
        $(this).find('td').eq(2).css('width', '10%');
        $(this).find('td').eq(3).css('width', '5%');
        $(this).find('td').eq(4).css('width', '5%');
        $(this).find('td').eq(5).css('width', '10%');
        $(this).find('td').eq(6).css('width', '10%');
        $(this).find('td').eq(7).css('width', '20%');
        $(this).find('td').eq(8).css('width', '5%');
        $(this).find('td').eq(9).css('width', '5%');
    });
};

function GetSumOfServiceDetail() {
    
    var sumTotal = 0;
    $('#tServiceDetail tbody tr').each(function() {
        var curTotal =CurrencyFormat($(this).find("td").eq(6).html(),false);
        sumTotal += Number(curTotal);
    });

    sumTotal = CurrencyFormat(sumTotal);
    $('#txtServiceTotalPrice').text(sumTotal);
    
}


$(document).on("dblclick", "#tVendorFilter tbody", function () {
        var vname = $('.rowSelected').find('td').eq(1).text();
        var venId = $('.rowSelected').data('id');
        
        $("#txtServiceVendorName").val(vname);
        $("#lblServiceVendorId").text(venId);
        $("#tVendorFilter").css("visibility", "collapse");
        $("#txtServiceVendorName").select();
});

$(document).ready(function () {
    CheckUserSession();
    $('#frmModalDelete').hide();
    $('#frmModalGetData1').hide();
    $('#lblServiceMessage').hide();

    var uname = sessionStorage.getItem('user_name');
    $.notify(uname + " خوش آمدید ", { className: 'success', position: "top,center" });

    var today = GetCurrentShamsiDate();
    $('#txtServiceDate').val(today);
    
    $('#txtUserName').val(uname);

    $('#txtServiceVendorName').focus();
    $('#cmdServiceSaveDet').attr("disabled", "disabled");
    $("#lblRadifTakhsis").text("XXXX");
    $("#lblRadifTakhsis").hide();
});
