
//fetch all product details list
function DataBindFindProduct(t) {
    $('#divFactor').show();
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
                 
                    "</tr>";
            }


            $("#LoadingStatusProductDetails").html(" ");
            $(setData).html(strText);
        }

    });
}

$(document).mouseup(function (e) {
    //var container = $("#frmModalGetData1");

    //// If the target of the click isn't the container
    //if (!container.is(e.target) && container.has(e.target).length === 0) {
    //    container.hide();
    //}
});

$(document).delegate(".Calc", "focusout", function () {
    $('#txtUnitPrice').val(CurrencyFormat($('#txtUnitPrice').val()));
    $('#txtTotalPrice').val(CurrencyFormat($('#txtTotalPrice').val()));
    $('#txtGiveMoney').val(CurrencyFormat($('#txtGiveMoney').val()));
    
    var q = $("#txtQuantity").val();
    var p = CurrencyFormat($("#txtUnitPrice").val(), false);
    var d = $("#txtDiscount").val();
    var t = (q * p);
    t = t - (t * (d / 100));

    t = (isNaN(t) ? 'نادرست' : t);
    $("#txtTotalPrice").val(CurrencyFormat(t));
});


$(document).delegate(".Calc", "keyup", function (e) {
    var i = $(this).attr("id");
    var f = CurrencyFormat($(this).val(), false);

    if (isNaN(f) && i!=="txtTotalPrice" ) {
        $(this).notify("عدد وارد شود", { autoHideDelay: 1000});
    }
});



$(document).delegate("#cmdSaveFactorDet", "click", function (e) {
    
    if (checkEmpty($('#txtFindProducts')) || $('#lblFindpdID').text() === "0000") {
        $("#txtFindProducts").notify("کالای مورد نظر را انتخاب نمایید");
        $("#txtFindProducts").focus();
    } else {
        if ($('#txtQuantity').val() > 0) {
            var cnt = $('#SetFactorDetailList').find('tr').length+1;

            if (inTableExist("SetFactorDetailList", 1, $('#lblFindpdID').text())) {
                $("#txtFindProducts").notify("کالا قبلا ثبت شده است");
                return;
            }

            var strText = "<tr>";
            strText += "<td>" + cnt + "</td>";
            strText += "<td>" + $('#lblFindpdID').text() + "</td>";
            strText += "<td>" + $('#txtFindProducts').val() + "</td>";
            strText += "<td>" + $('#txtQuantity').val() + "</td>";
            strText += "<td>" + $('#txtUnitPrice').val() + "</td>";
            strText += "<td>" + $('#txtDiscount').val() + "</td>";
            strText += "<td>" + $('#txtTotalPrice').val() + "</td>";
            strText += "<td>" + $('#txtFactorDetDesc').val() + "</td>";
            strText += "</tr>";
            $('#SetFactorDetailList').append(strText);
            //clear data
            $('#lblFindpdID').text("0000");
            $('#txtFindProducts').val("");
            $('#txtQuantity').val("");
            $('#txtUnitPrice').val("");
            $('#txtDiscount').val("");
            $('#txtTotalPrice').val("");
            $('#txtFactorDetDesc').val("");
            $('#txtFindProducts').focus();
            //
            GetSumOfFactorDetail();
            AddCssFactorDetailColumn();//set Column width Setting
        } else {
            $('#txtQuantity').notify("وارد نمودن تعداد الزامی است");
            $('#txtQuantity').focus();
        }
    }
});

$(document).delegate("#cmdDeleteDetail", "click", function (e) {
   var r = $('#tFactorDetail .rowSelected').find('td').eq(1).text();
    if (r.length > 0) {
        $('#tFactorDetail .rowSelected').remove();
        var i = -1;
        $('#tFactorDetail tr').each(function () {
                i+=1;
                $(this).find("td").eq(0).html(i);
            });
        GetSumOfFactorDetail();
    } else {
        $('#cmdDeleteDetail').notify('یک سطر را انتخاب نمایید', "warn");
    }
});

$(document).delegate("#cmdEditDetail", "click", function (e) {
    var fdet = []; // Radif,pdid,pname,quantity,unitprice,.....
    
    for (var i = 0; i <= 7; i++) {
        fdet[i] = $('#tFactorDetail .rowSelected').find('td').eq(i).text();
    }
    
    if (fdet[1].length > 0) {
        $('#lblFindpdID').data("id", fdet[0]);
        $('#lblFindpdID').text(fdet[1]);
        $('#txtFindProducts').val(fdet[2]);
        $('#txtQuantity').val(fdet[3]);
        $('#txtUnitPrice').val(fdet[4]);
        $('#txtDiscount').val(fdet[5]);
        $('#txtTotalPrice').val(fdet[6]);
        $('#txtFactorDetDesc').val(fdet[7]);
        $('#cmdUpdateDetail').attr("value", "ثیت تغییرات سطر شماره " + fdet[0]);
        $('#cmdUpdateDetail').show();
        $('#cmdSaveFactorDet').attr("disabled", "disabled");
        $('#cmdDeleteDetail').attr("disabled", "disabled");
        $('#txtFindProducts').select();

    } else {
        $('#cmdEditDetail').notify('یک سطر را انتخاب نمایید', "warn");
    }
});

$(document).delegate("#txtFindProducts", "keyup", function (e) {
    if (e.keyCode == 13 || e.keyCode == 27) { return }
    $("#lblFindpdID").html("0000");
    var strFind = $('#txtFindProducts').val();
   
    if (strFind.length !== 0) {
        $("#tPDFilter").css("visibility", "visible");

       $.ajax({
            type: "GET",
            url: "/productDetails/ProductSearchFilter",
            data: { 'str': strFind },
            dataType: "json",
            success: function (data) {
                var setData = $('#SetProductDetailsList');
                var strText = "";
                for (var i = 0; i < data.length; i++) {
                    strText += "<tr class='row_" +
                        data[i].pdId +
                        "' data-id='" + data[i].pdId + "'>" +
                        "<td style='width: 5%'>" + (i + 1) + "</td>" +
                        "<td style='width: 80%'>"  +
                        data[i].productNameX +
                        "</td>" +
                        "</tr>";
                }
                $("#LoadingStatusProductDetails").html(" ");
                $(setData).html(strText);

            }
        });
    }
    else {
        $("#tPDFilter").css("visibility", "collapse");
        $("#lblFindpdID").html("0000");
    }

    
});

$(document).delegate("#txtFactorCustomerName", "keyup", function (e) {
    if (e.keyCode==13 || e.keyCode==27){return}
    $("#lblCustomerId").html("0000");
    var strFind = $('#txtFactorCustomerName').val();
    var strSql = "SELECT * FROM tblCustomer WHERE ";

    if (strFind.length !== 0) {
        $("#tCustomerFilter").css("visibility", "visible");

        strSql += "CustomerLName LIKE N'%" + strFind + "%' ";

        $.ajax({
            type: "GET",
            url: "/customer/ApplyFilter",
            data: { 'strSql': strSql },
            dataType: "json",
            success: function (data) {
                var setData = $('#SetCustomerList');
                var strText = "";
                for (var i = 0; i < data.length; i++) {
                    strText += "<tr class='row_" +
                        data[i].customerId +
                        "' data-id='" + data[i].customerId + "'>" +
                        "<td style='width: 15px'>" +
                        (i + 1) +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].customerFName +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].customerLName +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        Null2Empty(data[i].customerMobile) +
                        "</td>" +
                        "</tr>";
                    
                }
                
                $("#LoadingStatusCustomer").html(" ");
                $(setData).html(strText);

            }
        });
    }
    else {
        $("#tCustomerFilter").css("visibility", "collapse");
        $("#lblCustomerId").html("0000");
    }


});

$(document).delegate("#selInpFactorPayType", "change", function () {
    
    var s = $(this).val();
    if (s === "1") {
        if ($("#lblFactorTotalPrice").text() === "0000") {
            $(this).notify("مبلغ فاکتور قابل تقسیط نمی باشد", "warn");
            $(this).val("0");
            return;
        }
        $('#lblTaghsit').show();
    } else {
        $('#lblTaghsit').hide();
        $("#divFactor").find("*").removeAttr("disabled");
    }

});

$(document).delegate("#lblTaghsit", "click", function () {
    if (CurrencyFormat($("#lblFactorTotalPrice").val(), false) !=="0000") {
        $('#frmModalGetData1').css({ "top": "200px", "left": "800px", "width": "300px", "height": "600px" });
        $('#frmModalGetData1').show();

        $('#txtPayDate').val($("#txtFactorDate").val());
        $('#txtPayDate').focus();

        $("#divFactor").find("*").prop("disabled", true);
        $("#lblPayTypeTotalPrice").text($("#lblFactorTotalPrice").text());
        
        if ($("#tblPayList").find('tr').length === 1) {
            $("#lblResidualPrice").text($("#lblPayTypeTotalPrice").text());    
        }
    } else {
        $("#lblTaghsit").notify("مبلغ کل فاکتور کامل نشده است", "error");
    }
});

$(document).delegate("#cmdSavePayList", "click", function () {
    var l = $('#SetPayType').find('tr').length;
    var b = false;
    if ($("#lblResidualPrice").text() === "0" && l > 0) {
        if (l === 1 && $("#chkFirstPay").is(":checked")) { b = true }
        if (!b) {
            $("#lblTaghsit").text("اقساط در " + l + " مرحله پرداخت خواهد شد");
            $("#frmModalGetData1").hide();
            $("#divFactor").find("*").prop("disabled", false);
        } else {// Aghsat faghat 1 satr pishpardakht darad bayad naghdi hesab shavad
            $("#selInpFactorPayType").notify("مبلغ پیش پرداخت برابر با کل فاکتور می باشد،در این صورت فاکتور نقدی پرداخت خواهد شد", "warn");
            $("#selInpFactorPayType").val("0");
            ClearTable("SetPayType");
            $("#lblResidualPrice").text($("#lblPayTypeTotalPrice").text());
            $("#lblTaghsit").text("قسط بندی");
            $("#lblTaghsit").hide();
            $("#frmModalGetData1").hide();
            $("#divFactor").find("*").prop("disabled", false);
        }
    } else {
        $("#cmdSavePayList").notify("مبلغ باقیمانده باید صفر شود", "warn");
    }
});

$(document).delegate("#cmdCancelPayList", "click", function () {
    $('#SetPayType tr').remove();
    $("#frmModalGetData1").hide();
    $("#divFactor").find("*").prop("disabled", false);
    $("#selInpFactorPayType").val("0");
    $('#lblTaghsit').hide();
    $('#lblTaghsit').text("قسط بندی");
    $('#chkFirstPay').attr("checked", "checked");
});

$(document).delegate("#cmdAddPayType", "click", function () {
    var sum = 0;
    var newMoney = 0;
    var dateLess = false;//برای اینکه تاریخ وارد شده کمتر از تاریخهای لیست نباشد
    if (checkEmpty($('#txtPayDate')) || checkEmpty($('#txtGiveMoney'))) {
        $('#cmdAddPayType').notify("اطلاعات کامل نمی باشد", "warn");
        return;
    }
    if (inTableExist("SetPayType", 1, $('#txtPayDate').val())) {
        $("#txtPayDate").notify("تاریخ قبلا ثبت شده است");
        $("#txtPayDate").focus();
        return;
    }
    if (!CheckFarsiValidDate($('#txtPayDate').val())) {
        $('#txtPayDate').notify("اشکال در ورود تاریخ", "warn");
        $("#txtPayDate").focus();
        return;
    }
    $("#SetPayType tr").each(function() {
        var x = $(this).find("td").eq(1).html();
        if (FarsiDateDiff($('#txtPayDate').val(), x) > 0) { dateLess = true}
    });
    if (dateLess) {
        $('#txtPayDate').notify("تاریخ وارد شده نباید کمتر از تاریخهای داخل لیست باشد", "warn");
        return;
    }
    //Check the payment list dosen't greater than totalprice
    sum = GetSumOfCurrencyTable($('#SetPayType tr'), 2);//Get sum of money in list
    newMoney = CurrencyFormat($('#txtGiveMoney').val(), false);
    if ((Number(sum) + Number(newMoney)) > Number(CurrencyFormat($('#lblPayTypeTotalPrice').text(), false))) {
        $('#cmdAddPayType').notify("مبلغ وارد شده بیش از حد مجاز می باشد", "error");
        return;
    }

    sum = GetSumOfCurrencyTable($('#SetPayType tr'), 2);
    newMoney = CurrencyFormat($('#txtGiveMoney').val(), false);
    var res = Number(CurrencyFormat($('#lblPayTypeTotalPrice').text(), false)) - (Number(sum) + Number(newMoney));
    $('#lblResidualPrice').text(CurrencyFormat(res));   //مبلغ باقیمانده

    var cnt = $('#SetPayType').find('tr').length + 1;
    var strText = "<tr>";
    strText += "<td>" + cnt + "</td>";
    strText += "<td>" + $('#txtPayDate').val() + "</td>";
    strText += "<td>" + $('#txtGiveMoney').val() + "</td>";
    strText += "</tr>";
    $('#SetPayType').append(strText);
    $("#txtPayDate").focus();

});

$(document).delegate("#cmdDeletePayType", "click", function (e) {
    var r = $('#tblPayList .rowSelected').find('td').eq(0).text();
    if (r.length > 0) {
        var removedMoney = CurrencyFormat($('#tblPayList .rowSelected').find('td').eq(2).text(), false);
        var resMoney = CurrencyFormat($("#lblResidualPrice").text(), false);
        $("#lblResidualPrice").text(CurrencyFormat(Number(resMoney) + Number(removedMoney)));

        $('#tblPayList .rowSelected').remove();
        var i = -1;
        $('#tblPayList tr').each(
            function () {
                i += 1;
                $(this).find("td").eq(0).html(i);
            });

    } else {
        $('#cmdDeletePayType').notify('یک سطر را انتخاب نمایید', "warn");
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

$(document).delegate("#cmdUpdateDetail", "click", function (e) {

    var radif = $('#lblFindpdID').data("id");
    var exists = false;
    $('#tFactorDetail tr').each(function () {
        var pdid = $(this).find("td").eq(1).html();
        var r = $(this).find("td").eq(0).html();

        if (r !== radif) {
            if (pdid === $('#lblFindpdID').text()) {
                $("#txtFindProducts").notify("کالا قبلا ثبت شده است");
                $(this).addClass('.Error');
                exists = true;
            }
        }
    });

    if (exists) { return }; // when in update mode user try save the exist pdid

    $('#tFactorDetail tr').each(function() {
        var curRadif = $(this).find("td").eq(0).html();
        if (radif === curRadif) {
            $(this).find("td").eq(1).html($('#lblFindpdID').text());
            $(this).find("td").eq(2).html($('#txtFindProducts').val());
            $(this).find("td").eq(3).html($('#txtQuantity').val() );
            $(this).find("td").eq(4).html($('#txtUnitPrice').val());
            $(this).find("td").eq(5).html($('#txtDiscount').val());
            $(this).find("td").eq(6).html($('#txtTotalPrice').val());
            $(this).find("td").eq(7).html($('#txtFactorDetDesc').val());
            //
            $('#cmdUpdateDetail').attr("value", "ثیت تغییرات  ");
            $('#cmdUpdateDetail').hide();
            $('#cmdSaveFactorDet').removeAttr("disabled");
            $('#cmdDeleteDetail').removeAttr("disabled");

            $('#lblFindpdID').text("0000");
            $('#txtFindProducts').val("");
            $('#txtQuantity').val("");
            $('#txtUnitPrice').val("");
            $('#txtDiscount').val("");
            $('#txtTotalPrice').val("");
            $('#txtFactorDetDesc').val("");

            $('#txtFindProducts').focus();
            //
            GetSumOfFactorDetail();
        }
    });
});

$(document).delegate("#cmdSaveFactor", "click", function() {
    if (sessionStorage.getItem('user_id') === null) {
        alert("اعتبار کاربری شما به اتمام رسیده است لطفا مجددا وارد شود");
        return;
    }
    if (checkEmpty($("#txtFactorCustomerName")) || $("#lblCustomerId").text() === "0000") {
        $("#txtFactorCustomerName").notify("نام مشتری یا خریدار کامل شود", "warn");
        $("#txtFactorCustomerName").focus();
        return;
    }
    if (!CheckFarsiValidDate($('#txtFactorDate').val())) {
        $('#txtFactorDate').notify("اشکال در ورود تاریخ", "warn");
        return;
    };
  
    if (checkEmpty($('#txtFactorTime'))) {
        $('#txtFactorTime').notify("اشکال در ورود ساعت", "warn");
        return;
    }
    var l = $("#SetFactorDetailList tr").length;
    if (l === 0) {
        $("#tFactorDetail").notify("لیست ثبت سفارشات خالی می باشد");
        return;
    }
    //if totalprice of factor has been changed you must update paylist
    var tp = CurrencyFormat($("#lblFactorTotalPrice").text(), false);
    var sum = GetSumOfCurrencyTable($('#SetPayType tr'), 2);
    if ($("#selInpFactorPayType").val() === "1" && Number(tp) !== Number(sum)) {
        $("#lblResidualPrice").text(CurrencyFormat(Number(tp) - Number(sum)));
        $("#lblTaghsit").notify("مبلغ فاکتور با مجموع اقساط همخوانی ندارد");
        return;
    }

    //save Factor Main Info
    var d = [];
    d[0] = 0;
    d[1] = $('#lblCustomerId').text();
    var newVal = $('#txtFactorDate').val().split('/');
    var x = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
    d[2] = x[0] + "/" + x[1] + "/" + x[2];
    d[3] = $('#txtFactorTime').val();
    d[4] = sessionStorage.getItem('user_id');
    d[5] = $('#txtFactorMainDesc').val();
    d[6] = CurrencyFormat($('#lblFactorTotalPrice').text(), false);
    d[7] = $('#selInpFactorPayType').val();
    $.ajax({
        type: "Post",
        url: "/inputFactor/SaveFactorMainInfo",
        data: { 'd': d },
        dataType: "json",
        success: function (result) {
            SaveFactorDetail(result);
        }
    });

});

function SaveFactorDetail(inpFactorId) {
    var d = [];
    d[0] = inpFactorId;
    
        $('#SetFactorDetailList tr').each(function() {
            d[1] = $(this).find("td").eq(0).html();//radif
            d[2] = $(this).find("td").eq(1).html();//pdid
            d[3] = $(this).find("td").eq(3).html();//quantity
            d[4] = CurrencyFormat($(this).find("td").eq(4).html(), false);//unit price
            d[5] = $(this).find("td").eq(5).html(); //discount
            d[6] = CurrencyFormat($(this).find("td").eq(6).html(), false);//total price
            d[7] = $(this).find("td").eq(7).html();//detail desc
            ////
            d[4] = d[4] === "" ? 0 : d[4];
            d[5] = d[5] === "" ? 0 : d[4];
            d[6] = d[6] === "" ? 0 : d[6];

            $.ajax({
                type: "Post",
                url: "/inputFactor/SaveFactorDetailInfo",
                data: { 'd': d },
                dataType: "json",
                success: function (result) {
                    SaveFactorPayType(inpFactorId);            
                }
            });
        });
}

function kos() {
    var l = $('#SetPayType').find('tr').length;
    
    
}
function SaveFactorPayType(inpFactorId) {
    var d = [];
    var l = $("#SetPayType").find('tr').length;
    
    if ($("#selInpFactorPayType").val() === "1") {
        if (l > 0) {
            d[0] = inpFactorId;
            $('#SetPayType tr').each(function ()  {
                d[1] = $(this).find("td").eq(0).html();//radif

                var newVal = $(this).find("td").eq(1).html().split("/");
                var x = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
                d[2] = x[0] + "/" + x[1] + "/" + x[2]; //Check's Date
                d[3] = CurrencyFormat($(this).find("td").eq(2).html(), false);//Give Money
                if (d[1] === "1" && $("#chkFirstPay").is(":checked")) {//PishPardakht
                    d[4] = 1; //Paid
                    newVal = $(this).find("td").eq(1).html().split("/");
                     x = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
                    d[5] = x[0] + "/" + x[1] + "/" + x[2];
                    //d[5] = null; //d[2]; //Paid date
                } else {
                    d[4] = 0; //Paid
                    d[5] = null; //Paid date
                }
                //
                $.ajax({
                    type: "Post",
                    url: "/inputFactor/SaveFactorPayList",
                    data: { 'd': d },
                    dataType: "json",
                    success: function (result) {
                        
                    }
                });
            });
        }
    }
    $.notify("اطلاعات ورود با شماره فاکتور " + inpFactorId + " ثبت شد", "success");
    //Clear Page
    $(".txtStyle").val("");
    ClearTable("SetFactorDetailList");
    ClearTable("SetPayType");

    var today = GetCurrentShamsiDate(), current = new Date();
    var c = current.getHours() + ":" + current.getMinutes();
    $('#txtFactorTime').val(c);
    $('#txtFactorDate').val(today);
    $('#selInpFactorPayType').val("0");
    $('#lblTaghsit').text("قسط بندی");
    $('#lblTaghsit').hide();
    $("#txtFactorCustomerName").focus();
    $("#lblFactorTotalPrice").text("0000");
    $("#lblCustomerID").html("0000");
    $("#lblFindpdID").html("0000");

};

function AddCssFactorDetailColumn() {
    $('#tFactorDetail tr').each(function() {
        $(this).find('td').eq(0).css('width', '5%');
        $(this).find('td').eq(1).css('width', '5%');
        $(this).find('td').eq(2).css('width', '30%');
        $(this).find('td').eq(3).css('width', '5%');
        $(this).find('td').eq(4).css('width', '10%');
        $(this).find('td').eq(5).css('width', '5%');
        $(this).find('td').eq(6).css('width', '15%');
        $(this).find('td').eq(7).css('width', '25%');
    });
};

function GetSumOfFactorDetail() {
    
    var sumTotal = 0;
    $('#tFactorDetail tbody tr').each(function() {
        var curTotal =CurrencyFormat($(this).find("td").eq(6).html(),false);
        sumTotal += Number(curTotal);
    });

    sumTotal = CurrencyFormat(sumTotal);
    $('#lblFactorTotalPrice').text(sumTotal);
    
}

$(document).on("dblclick", "#tPDFilter tbody ",
    function () {
        
        var pname = $('.rowSelected').find('td').eq(1).text();

        var pdid = $('.rowSelected').data('id');

        $("#txtFindProducts").val(pname);

        $("#lblFindpdID").text(pdid);
        $("#tPDFilter").css("visibility", "collapse");
        $("#txtFindProducts").select();
    });

$(document).on("dblclick", "#tCustomerFilter tbody",
    function () {
        var fname = $('.rowSelected').find('td').eq(1).text();
        var lname = $('.rowSelected').find('td').eq(2).text();
        var cusId = $('.rowSelected').data('id');
        
        $("#txtFactorCustomerName").val(fname + " " + lname );
        $("#lblCustomerId").text(cusId);
        $("#tCustomerFilter").css("visibility", "collapse");
        $("#txtFactorCustomerName").select();
    });

$(document).ready(function () {
    CheckUserSession();
    $('#frmModalDelete').hide();
    $('#frmModalGetData1').hide();
    $('#cmdUpdateDetail').hide();
    $('#lblTaghsit').hide();

    var uname = sessionStorage.getItem('user_name');
    $.notify(uname + " خوش آمدید ", { className: 'success', position: "top,center" });

    var today = GetCurrentShamsiDate();
    $('#txtFactorDate').val(today);
    $('#txtPayDate').val(today);

    var current = new Date();
    $('#txtFactorTime').val(current.getHours() + ":" + current.getMinutes());
    

    $('#txtUserName').val(uname);
    
    setInterval(function () {
        var current = new Date();
        var c = current.getHours() + ":" + current.getMinutes();
        $('#txtFactorTime').val(c);
    }, 60000);

    $('#txtFactorCustomerName').focus();
    $('#txtFactorCustomerName').val("انبار انبار مبین");
    $('#lblCustomerId').text("1937");
    $('#chkFirstPay').attr("checked","checked");
});
