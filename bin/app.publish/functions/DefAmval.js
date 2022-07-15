
$(document).delegate("#txtAmvalNumber", "keyup", function () {
    $("#lblMessage").hide();
    $("#lblMessage").css('color', 'red');
    $("#lblMessage").text("پیام");
    $('#cmdSaveAmval').prop('disabled', 'disabled');
});

$(document).delegate("#txtAmvalNumber", "focusout", function () {
    if ($("#txtAmvalNumber").val() !== "") {
        var n = $("#txtAmvalNumber").val();
        if (n.length !== 5) {
            $.alert({
                title: 'توجه',
                escapeKey: true,
                backgroundDismiss: true,
                content: 'اموال وارد شده صحیح نمی باشد',
                type: 'orange',
                boxWidth: '15%',
                useBootstrap: false
            });
            return;
        };
        if (!isNaN(n)) {
            $.ajax({
                type: "GET",
                url: "/takhsisAmval/GetAmvalCustomer",
                data: { 'n': n },
                dataType: "json",
                success: function (data) {
                    if (data.length > 0) {
                        if (data[0].esghat) {
                            $('#lblMessage').text("این شماره اموال اسقاط شده است");
                            $('#lblMessage').css('color', 'red');
                        } else {
                            var x = data[0].customerFName + " " + data[0].customerLName;
                            var y = data[0].productName;
                            $('#lblMessage').text("این شماره اموال قبلا تعریف شده و متعلق به " + x + " و کالای " + y + " می باشد");
                            $('#lblMessage').css('color', 'red');
                        }
                        $('#lblMessage').show();
                    } else {
                        $('#lblMessage').text("شماره اموال بااین مشخصات تخصیص داده نشده است");
                        $('#lblMessage').css('color','greenyellow');
                        $('#lblMessage').show();
                        $('#cmdSaveAmval').removeAttr('disabled');
                    };
                }
            });

        } else {
            $.alert({
                title: 'توجه',
                escapeKey: true,
                backgroundDismiss: true,
                content: 'اموال وارد شده صحیح نمی باشد',
                type: 'orange',
                boxWidth: '15%',
                useBootstrap: false
            });
            //$("#txtAmvalNumber").notify("اموال وارد شده صحیح نمی باشد", "warn");
        }

    }


});

$(document).delegate("#txtAmvalFindProducts", "keyup", function (e) {
    if (e.keyCode == 13 || e.keyCode == 27) { return }
    $("#lblAmvalFindpdID").html("0000");
    var strFind = $('#txtAmvalFindProducts').val();
    
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
                        "<td style='width: 80%'>" +
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
        $("#lblAmvalFindpdID").html("0000");
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

$(document).delegate(".Calc", "focusout", function () {
    $('#txtBuyPrice').val(CurrencyFormat($('#txtBuyPrice').val()));
});

$(document).delegate("#cmdFindAmval", "click", function () {
    var d = [];
    var valSelect = $("#selAmvalFilterAny").val();

    d[0] = valSelect;
    d[1] = $("#txtFindAnything1").val();
    d[2] = $("#txtFindAnything2").val();

    if (valSelect === "1") { //search by Amval
        if ($("#txtFindAnything1").val() === "") {
            $.alert({
                title: 'توجه',
                escapeKey: true,
                backgroundDismiss: true,
                content: 'اموال وارد شده صحیح نمی باشد',
                type: 'orange',
                boxWidth: '15%',
                useBootstrap: false
            });
            //$("#txtFindAnything1").notify("شماره اموال صحیح نمی باشد", "warn");
            return;
        }
    }
    if (Number(valSelect) >= 2 && Number(valSelect) <= 4) { //Search by other item
        if ($("#txtFindAnything1").val()=== "") {
            $.alert({
                title: 'توجه',
                escapeKey: true,
                backgroundDismiss: true,
                content: 'مقداری جهت جستجو وارد نشده است',
                type: 'orange',
                boxWidth: '15%',
                useBootstrap: false
            });
            //$("#txtFindAnything1").notify("مقداری جهت جستجو وارد نشده است", "warn");
            return;
        }
    }
    if (valSelect==="5") { //Search by Date
         d[1] = $("#txtFindAnything1").val();
         d[2] = $("#txtFindAnything2").val();
        if (d[2] === "" && d[1] !== "") {
            $("#txtFindAnything2").val(d[1]);
            d[2] = d[1];
        }
        if (d[1] + d[2] !== "") {
            if (!CheckFarsiValidDate(d[1]) || !CheckFarsiValidDate(d[2])) {
                $.alert({
                    title: 'توجه',
                    escapeKey: true,
                    backgroundDismiss: true,
                    content: 'تاریخ جستجو باید صحیح باشد',
                    type: 'orange',
                    boxWidth: '15%',
                    useBootstrap: false
                });
                //$("#txtFindAnything1").notify(" تاریخ جستجو باید صحیح باشد", "warn");
                return;
            }
        }
        if (FarsiDateDiff(d[1], d[2]) < 0) {
            $.alert({
                title: 'توجه',
                escapeKey: true,
                backgroundDismiss: true,
                content: 'تاریخ دوم نباید کمتر از تاریخ اول باشد',
                type: 'orange',
                boxWidth: '15%',
                useBootstrap: false
            });
            // $("#txtFindAnything2").notify(" تاریخ دوم نباید کمتر از تاریخ اول باشد", "warn");
            return;
        }
        if (d[1] + d[2] !== "") {
            var newVal1 = d[1].split('/'), newVal2 = d[2].split('/');
            d[1] = Farsi2Miladi(Number(newVal1[0]), Number(newVal1[1]), Number(newVal1[2]));
            d[2] = Farsi2Miladi(Number(newVal2[0]), Number(newVal2[1]), Number(newVal2[2]));
            d[1] = d[1][0] + "-" + d[1][1] + "-" + d[1][2];
            d[2] = d[2][0] + "-" + d[2][1] + "-" + d[2][2];
        }
    }

    //
    $.ajax({
        type: "POST",
        url: "/defAmvalProduct/GetAmvalList",
        data: { 'd': d },
        dataType: "json",
        success: function (data) {
            $("#SetAmvalList").html("");
            var strText = "";
            var dt = "";
            for (var i = 0; i < data.length; i++) {
                if (data[i].myDate !== null) {
                    var newValue = data[i].myDate.split('-');
                    dt = Miladi2Farsi(Number(newValue[0]), Number(newValue[1]), Number(newValue[2]));
                    dt = dt[0] + "/" + dt[1] + "/" + dt[2];
                } else {
                    dt = "";
                }
                
                strText = "<tr data-id='"+data[i].pdId+"'>" +
                        "<td style='width: 15px'>" +
                        (i + 1) +
                        "</td>" +
                        "<td style='width: 50px'>" +
                        data[i].amval +
                        "</td>" +
                        "<td style='width: 350px'>" +
                        data[i].productNameX +
                        "</td>" +
                        "<td style='width: 50px'>" +
                        Null2Empty(dt) +
                        "</td>" +
                    "<td style='width: 60px'>" + CurrencyFormat(Null2Empty(data[i].buyPrice)) +
                        "</td>" +
                        "<td style='width: 60px'>" +
                        Null2Empty(data[i].sapPR) +
                        "</td>" +
                        "<td style='width: 60px'>" +
                        Null2Empty(data[i].serialNumeber) +
                        "</td>" +
                        "<td style='width: 60px'>" +
                        Null2Empty(data[i].barcodeNumber) +
                        "</td>" +
                        "<td style='width: 130px'>" +
                        Null2Empty(data[i].description) +
                        "</td>" +
                    "</tr>";
                    $("#SetAmvalList").append(strText);
            }
            
        }
    });

});

$(document).delegate("#cmdClearFindAmval", "click", function () {
    $("#txtFindAnything1").val("");
    $("#txtFindAnything2").val("");
    $("#selAmvalFilterAny").val("1");
    $("#SetAmvalList").html("");
});

$(document).delegate("#cmdSaveAmval", "click", function (e) {
    
    if (sessionStorage.getItem('user_id') === null) {
        alert("اعتبار کاربری شما به اتمام رسیده است لطفا مجددا وارد شود");
        return;
    }
    if (checkEmpty($("#txtAmvalNumber"))) {
        $("#txtAmvalNumber").notify("شماره اموال وارد نشده است", "warn");
    }
    if (checkEmpty($("#txtAmvalFindProducts")) || $("#lblAmvalFindpdID").text() === "0000") {
        $.alert({
            title: 'توجه',
            escapeKey: true,
            backgroundDismiss: true,
            content: 'کالایی انتخاب نشده است',
            type: 'orange',
            boxWidth: '15%',
            useBootstrap: false
        });
        // $("#txtAmvalFindProducts").notify("کالایی انتخاب نشده است", "warn");
        $("#txtAmvalFindProducts").focus();
        return;
    }
    if (!checkEmpty($("#txtBuyDate"))) {
        if (!CheckFarsiValidDate($('#txtBuyDate').val())) {
            $.alert({
                title: 'توجه',
                escapeKey: true,
                backgroundDismiss: true,
                content: 'اشکال در ورود تاریخ',
                type: 'orange',
                boxWidth: '15%',
                useBootstrap: false
            });
            //$('#txtBuyDate').notify("اشکال در ورود تاریخ", "warn");
            return;
        };
    }
    if ($('#txtAmvalNumber').val().length !== 5) {
        $.alert({
            title: 'توجه',
            escapeKey: true,
            backgroundDismiss: true,
            content: 'اموال وارد شده صحیح نمی باشد',
            type: 'orange',
            boxWidth: '15%',
            useBootstrap: false
        });
        //$('#txtAmvalNumber').notify("شماره اموال صحیح نمی باشد", "warn");
        return;
    }
    
    /////
    var d = [];
    d[0] = $('#txtAmvalNumber').val();
    d[1] = $('#lblAmvalFindpdID').text();
    var newVal = $('#txtBuyDate').val().split('/');
    var x = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
    d[2] = x[0] + "/" + x[1] + "/" + x[2];
    d[3] = CurrencyFormat($("#txtBuyPrice").val(), false);
    d[3] = d[3] === "" ? 0 : d[3];
    d[4] = $("#txtSapPR").val();
    d[5] = $('#txtSerialNumber').val();
    d[6] = $('#txtBarcode').val();
    d[7] = $('#txtAmvalDesc').val();
    d[8] = sessionStorage.getItem('user_id') === null ? 2 : sessionStorage.getItem('user_id');

    $.ajax({
        type: "POST",
        url: "/defAmvalProduct/SaveAmval",
        data: { 'd': d },
        dataType: "json",
        success: function (result) {
            if (result) {
                $("#txtAmvalNumber").notify("ثبت موفق", "success");
                $("#txtAmvalNumber").focus();
                $("#txtAmvalNumber").val("");
                $("#lblMessage").text("پیام");
                $("#lblMessage").css('color', 'red');
                $("#txtAmvalFindProducts").val("");
                $("#lblAmvalFindpdID").html("0000");
                $("#lblMessage").hide();
                $("#txtBuyDate").val("");
                $("#txtBuyPrice").val("");
                $("#txtSapPR").val("");
                $("#txtSerialNumber").val("");
                $("#txtBarcode").val("");
                $("#txtAmvalDesc").val("");
                $("#cmdSaveAmval").prop('disabled', 'disabled');
            } else {
                $.alert({
                    title: 'توجه',
                    escapeKey: true,
                    backgroundDismiss: true,
                    content: 'این شماره اموال قبلا ثبت شده است و یا اینکه اسقاط می باشد',
                    type: 'red',
                    boxWidth: '15%',
                    useBootstrap: false
                });
                //$("#txtAmvalNumber").notify("این شماره اموال قبلا ثبت شده است و یا اینکه اسقاط می باشد");
                $("#txtAmvalNumber").focus();
                $("#txtAmvalNumber").select();
            }
        },
        error: function() {
            $.alert({
                title: 'توجه',
                escapeKey: true,
                backgroundDismiss: true,
                content: 'ثبت اطلاعات با موفقیت انجام نشد لطفا دوباره سعی نمایید',
                type: 'red',
                boxWidth: '15%',
                useBootstrap: false
            });
            // $('#txtAmvalNumber').notify("ثبت اطلاعات با موفقیت انجام نشد لطفا دوباره سعی کنید", "error");
        }
    });
});

$(document).delegate("#selAmvalFilterAny", "change", function() {
    var valSelect = $(this).val();
    $("#txtFindAnything1").val("");
    $("#txtFindAnything2").val("");
    if (valSelect === "5") {
        $("#txtFindAnything2").show();
    } else {
        $("#txtFindAnything2").hide();
    }
});

$(document).delegate("#cmdEditAmval", "click", function () {

    var aml = []; // Radif,amval,pdid,pname,..

    for (var i = 0; i <= 7; i++) {
        aml[i] = $('#tAmvalList .rowSelected').find('td').eq(i).text();
    }

    if (aml[0].length > 0) {
        $("#txtAmvalNumber").val(aml[1]);
        $("#txtAmvalFindProducts").val(aml[2]);
        $('#lblAmvalFindpdID').text($('#tAmvalList .rowSelected').data('id'));
        $("#txtBuyDate").val(aml[3]);
        $("#txtBuyPrice").val(aml[4]);
        $("#txtSapPR").val(aml[5]);
        $("#txtSerialNumber").val(aml[6]);
        $("#txtBarcode").val(aml[7]);
        $("#txtAmvalDesc").val(aml[8]);

        $('#cmdEditAmval').data("id", aml[0]); // needed for update, because I lost rowselected 

        $("#divAmvalList *").prop('disabled', true);
        $("#txtAmvalNumber").prop('disabled', true);
        $('#cmdUpdateAmval').val("بروزرسانی تغییرات سطر " + aml[0]);
        $('#cmdUpdateAmval').show();
    } else {
        $.alert({
            title: 'توجه',
            escapeKey: true,
            backgroundDismiss: true,
            content: 'سطری را جهت ویرایش انتخاب نمایید',
            type: 'orange',
            boxWidth: '15%',
            useBootstrap: false
        });
        //$("#cmdEditAmval").notify("سطری را جهت ویرایش انتخاب نمایید","warn");
    }

});

$(document).delegate("#cmdUpdateAmval", "click", function() {
    if (checkEmpty($("#txtAmvalFindProducts")) || $("#lblAmvalFindpdID").text() === "0000") {
        $("#txtAmvalFindProducts").notify("کالایی انتخاب نشده است", "warn");
        $("#txtAmvalFindProducts").focus();
        return;
    }
    if (!checkEmpty($("#txtBuyDate"))) {
        if (!CheckFarsiValidDate($('#txtBuyDate').val())) {
            $.alert({
                title: 'توجه',
                escapeKey: true,
                backgroundDismiss: true,
                content: 'اشکال در ورود تاریخ',
                type: 'orange',
                boxWidth: '15%',
                useBootstrap: false
            });
            //$('#txtBuyDate').notify("اشکال در ورود تاریخ", "warn");
            return;
        };
    }
    var d = [];
    d[0] = $('#txtAmvalNumber').val();
    d[1] = $('#lblAmvalFindpdID').text();
    if (!checkEmpty($("#txtBuyDate"))) {
        var newVal = $('#txtBuyDate').val().split('/');
        var x = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
        d[2] = x[0] + "/" + x[1] + "/" + x[2];
    } else {d[2]="1900/01/01"}
    d[3] = CurrencyFormat($("#txtBuyPrice").val(), false);
    d[3] = d[3] === "" ? 0 : d[3];
    d[4] = $("#txtSapPR").val();
    d[5] = $('#txtSerialNumber').val();
    d[6] = $('#txtBarcode').val();
    d[7] = $('#txtAmvalDesc').val();
    d[8] = sessionStorage.getItem('user_id') === null ? 2 : sessionStorage.getItem('user_id');
    $.ajax({
        type: "POST",
        url: "/defAmvalProduct/UpdateAmval",
        data: { 'd': d },
        dataType: "json",
        success: function (result) {
            var selRow = $('#cmdEditAmval').data("id");
            
            $("#tAmvalList tr:eq(" + selRow + ")").data('id', $("#lblAmvalFindpdID").html());
            //" td:eq(1)").css("color", "red"));
            $("#tAmvalList tr").each(function() {
                var curRadif = $(this).find("td").eq(0).html();
                
                if (selRow === curRadif) {
                   $(this).find("td").eq(2).html($("#txtAmvalFindProducts").val());
                   $(this).find("td").eq(3).html($("#txtBuyDate").val());
                   $(this).find("td").eq(4).html($("#txtBuyPrice").val());
                   $(this).find("td").eq(5).html($("#txtSapPR").val());
                   $(this).find("td").eq(6).html($("#txtSerialNumber").val());
                   $(this).find("td").eq(7).html($("#txtBarcode").val());
                   $(this).find("td").eq(8).html($("#txtAmvalDesc").val());
                }
            });
           
           
            $("#txtAmvalNumber").notify("تغییرات با موفقیت ثبت شد", "success");
            $("#txtAmvalNumber").focus();
            $("#txtAmvalNumber").val("");
            $("#txtAmvalNumber").prop('disabled', false);
            $("#txtAmvalFindProducts").val("");
            $("#lblAmvalFindpdID").html("0000");
            $("#txtBuyDate").val("");
            $("#txtBuyPrice").val("");
            $("#txtSapPR").val("");
            $("#txtSerialNumber").val("");
            $("#txtBarcode").val("");
            $("#txtAmvalDesc").val("");
            $("#cmdUpdateAmval").hide();
            $("#divAmvalList *").prop('disabled', false);
        },
        error: function () {
            $.alert({
                title: 'توجه',
                escapeKey: true,
                backgroundDismiss: true,
                content: 'ثبت اطلاعات با موفقیت انجام نشد لطفا دوباره سعی نمایید',
                type: 'red',
                boxWidth: '15%',
                useBootstrap: false
            });
            //  $('#txtAmvalNumber').notify("ثبت اطلاعات با موفقیت انجام نشد لطفا دوباره سعی کنید", "error");
        }
    });
});

$(document).delegate("#cmdDeleteAmval", "click", function () {
  var selRow = $('#tAmvalList .rowSelected').find('td').eq(0).text();
    if (selRow.length > 0) {
        var amval = $('#tAmvalList .rowSelected').find('td').eq(1).text();
        $.confirm({
            title: ' حذف اموال',
            content: 'آیا اموال با شماره ' + amval + 'حذف گردد؟',
            type: 'red',
            boxWidth:'15%',
            useBootstrap: false,
            buttons: {
                حذف: function () {
                    $.ajax({
                        type: "POST",
                        url: "/defAmvalProduct/DeleteAmval",
                        data: { 'n': amval },
                        dataType: "json",
                        success: function (result) {
                            $("#tAmvalList tr:eq(" + selRow + ")").remove();
                            var i = 1;
                            $("#SetAmvalList tr").each(function () {
                                $(this).find("td").eq(0).html(i);
                                i += 1;;
                            });
                        },
                        error: function () {
                            $.alert({
                                title: 'توجه',
                                escapeKey: true,
                                backgroundDismiss: true,
                                content: 'اموال مورد نظر تخصیص یا اسقاط شده است و قابل حذف نمی باشد ',
                                type: 'red',
                                boxWidth: '15%',
                                useBootstrap: false
                            });                        }
                    });
                },
                انصراف: function() {
                }
            }
        });
        
    } else {
       // $("#cmdDeleteAmval").notify("سطری را جهت حذف انتخاب نمایید", "warn");
       $.alert({
           title: 'توجه',
           escapeKey: true,
           backgroundDismiss: true,
           content: 'سطری را جهت حذف انتخاب نمایید',
           type: 'orange',
           boxWidth: '15%',
           useBootstrap: false
       });
    }
});

$(document).on("dblclick", "#tPDFilter tbody ", function () {

    var pname = $('.rowSelected').find('td').eq(1).text();
        var pdid = $('.rowSelected').data('id');

        $("#txtAmvalFindProducts").val(pname);
        $("#lblAmvalFindpdID").text(pdid);
        $("#tPDFilter").css("visibility", "collapse");
        $("#txtAmvalFindProducts").select();
    });


$(document).ready(function () {
    CheckUserSession();

    $('#lblMessage').hide();
    
    var uname = sessionStorage.getItem('user_name');
    $.notify(uname + " خوش آمدید ", { className: 'success', position: "top,center" });

    var today = GetCurrentShamsiDate();
    $('#txtSabtAmvalDate').val(today);
    
    $('#txtUserName').val(uname);
    
    $('#txtAmvalNumber').focus();
    $('#cmdSaveAmval').prop('disabled','disabled');

    $('#txtFindAnything2').hide();
    $('#cmdUpdateAmval').hide();
});
