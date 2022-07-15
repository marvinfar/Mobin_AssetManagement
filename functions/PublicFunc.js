function Miladi2Farsi(gy, gm, gd) {
    g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    if (gy > 1600) {
        jy = 979;
        gy -= 1600;
    } else {
        jy = 0;
        gy -= 621;
    }
    gy2 = (gm > 2) ? (gy + 1) : gy;
    days = (365 * gy) + (parseInt((gy2 + 3) / 4)) - (parseInt((gy2 + 99) / 100)) + (parseInt((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * (parseInt(days / 12053));
    days %= 12053;
    jy += 4 * (parseInt(days / 1461));
    days %= 1461;
    if (days > 365) {
        jy += parseInt((days - 1) / 365);
        days = (days - 1) % 365;
    }
    jm = (days < 186) ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
    jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    if (Number(jm) < 10) {
        jm = '0' + jm;
    }
    if (Number(jd) < 10) {
        jd = '0' + jd;
    }
    return [jy, jm, jd];
}
function Farsi2Miladi(jy, jm, jd) {
    
    if (jy > 979) {
        gy = 1600;
        jy -= 979;
    } else {
        gy = 621;
    }
    days = (365 * jy) + ((parseInt(jy / 33)) * 8) + (parseInt(((jy % 33) + 3) / 4)) + 78 + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    gy += 400 * (parseInt(days / 146097));
    days %= 146097;
    if (days > 36524) {
        gy += 100 * (parseInt(--days / 36524));
        days %= 36524;
        if (days >= 365) days++;
    }
    gy += 4 * (parseInt(days / 1461));
    days %= 1461;
    if (days > 365) {
        gy += parseInt((days - 1) / 365);
        days = (days - 1) % 365;
    }
    gd = days + 1;
    sal_a = [0, 31, ((gy % 4 == 0 && gy % 100 != 0) || (gy % 400 == 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (gm = 0; gm < 13; gm++) {
        v = sal_a[gm];
        if (gd <= v) break;
        gd -= v;
    }
    if (Number(gm) < 10) {
        gm = '0' + gm;
    }
    if (Number(gd) < 10) {
        gd = '0' + gd;
    }
    return [gy, gm, gd];
}

function GetCurrentShamsiDate() {
    var newVal = GetCurrentMiladiDate().split("/");
    newVal[0] = Number(newVal[0]);
    newVal[1] = Number(newVal[1]);
    newVal[2] = Number(newVal[2]);
    var today = Miladi2Farsi(newVal[0], newVal[1], newVal[2]);
    var output = today[0] + "/" + today[1] + "/" + today[2];
    return output;
}
function GetCurrentMiladiDate() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = d.getFullYear() + '/' +
        (month < 10 ? '0' : '') + month + '/' +
        (day < 10 ? '0' : '') + day;

    return output;
}

function CheckFarsiValidDate(inp) {
    var c = true;
    var newVal = inp.split('/');
    var y = Number(newVal[0]);
    var m = Number(newVal[1]);
    var d = Number(newVal[2]);

    if (isNaN(y + m + d)) { return false };

    if (!(y >= 1390 && y <= 1450)) { return false }

    if (!(m >= 1 && m <= 12)) { return false }

    if (!(d >= 1 && d <= 31)) { return false }

    if (m>=6 && d===31) {return false}
    return true;
}

function FarsiDateDiff(first, second) {
    var newVal = first.split("/");
    var f = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
    newVal = second.split("/");
    var s = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));

    var f1 = new Date(f), s1 = new Date(s),
        diff = new Date(s1 - f1), days = diff / 1000 / 60 / 60 / 24;

    return days;
}

function GetSumOfCurrencyTable(object, col) {
    var sum = 0;
    object.each(function () {//Get Sum of value in list
        var money = CurrencyFormat($(this).find("td").eq(col).html(), false);
        sum += Number(money);
    });
    return sum;
}

function Null2Empty(v) {
    if (v == null) {
        return ("");
    } else {
        return (v);
    }
};

function checkEmpty(inp) {
    if (inp.val() === "") {
        return true;
    }
}

function subMenuOpen() {
    var getName = function () {
        document.onclick = function (e) {
            if (e.target.className == 'myBtn') {
                var image = e.target.getAttribute("id");
                var i = image.indexOf("-");
                var u = image.substring(i + 1);

                if ($("#sm-" + u).is(":visible")) {
                    $("#sm-" + u).hide();
                } else {
                    $("#sm-" + u).show();
                }

                //////////////////////
            }
        }
    }
    getName();
}

function CurrencyFormat(Num, y = true) { //function to add commas to textboxes

    if (y) { //if y then set currency format
        Num += '';
        Num = Num.replace(',', '');
        Num = Num.replace(',', '');
        Num = Num.replace(',', '');
        Num = Num.replace(',', '');
        Num = Num.replace(',', '');
        Num = Num.replace(',', '');
        x = Num.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1))
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        return x1 + x2;

    } else { // Remove Currency Format
        for (var i = 0; i < Num.length; i++) {
            Num = Num.replace(",", "");
        }
        return Num;
    }
};

function inTableExist(tblname, col, value) {
    var check = false;
    $('#' + tblname + ' tr').each(function () {
        var pdid = $(this).find("td").eq(col).html();
        if (value === pdid) {
            check = true;
        }

    });
    return check;
}

function ClearTable(tblname) {
    $("#"+tblname+" tr").each(function () {
        $(this).remove('tr');
    });
}

function CheckUserSession() {
    setUserLevelToButton();
    if (sessionStorage.getItem('user_id') === null) {
        window.location.href = "/Login/LoginView";
    }
}
function RedirectToPage() {
    
    //setUserLevelToButton();
    //
    var uLevel = sessionStorage.getItem('user_lvl');
    //
    var currentUrl = $(location).attr("href").substring(8);
    var n = currentUrl.search("/");
    currentUrl = currentUrl.substring(n);
   
    var myArray = [["cmdDefProductGroup", "/productGroup/productGroupView"],   ["cmdDefProducts", "/products/productsView"],
        ["cmdDefProductDetails", "/productDetails/productDetailsView"],
        ["cmdDefCountry", "/country/countryView"],
        ["cmdDefBrand", "/brand/brandView"],
        ["cmdDefSize", "/size/sizeView"],
        ["cmdDefMaterial", "/material/materialView"],
        ["cmdDefColor", "/color/colorView"],
        ["cmdDefUsers", "/DefineUsers/DefineUsersView"],
        ["cmdDefUserLevel", "/userLevel/userLevelView"],
        ["cmdDefCustomer", "/customer/customerView"],
        ["cmdDefVendor", "/vendor/vendorView"],
        ["cmdChangePass", "/DefineUsers/ChangePassView"],
        ["cmdInpFactor", "/inputFactor/inputFactorView"],
        ["cmdOutFactor", "/outputFactor/outputFactorView"],
        ["cmdDefAmvalProduct", "/defAmvalProduct/defAmvalProductView"],
        ["cmdTakhsisAmvalToUser", "/takhsisAmval/takhsisAmvalView"],
        ["cmdEsghatAmval", "/esghatAmval/esghatAmvalView"],
        ["cmdService", "/service/serviceView"],
        ["cmdRepMasrafi", "/rep/repMasrafiView"],
        ["cmdRepAmval", "/rep/repAmvalView"],
        ["cmdDashboard", "/dashboard/dashboardView"]
    ];
    
    var getName = function () {
        document.onclick = function (e) {

            if (e.target.className === 'myBtn') {
                var im = e.target.getAttribute("id");
                var st = $('#' + im).data('id');
                
                if (st.search(uLevel) >=0) {// user level has access 
                    for (var i = 0; i <= myArray.length; i++) {
                        if (myArray[i][0] === im) {
                            if (myArray[i][1] !== currentUrl) {
                                window.open(myArray[i][1]);
                            }
                        }
                    }
                } else {
                    $.alert({
                        title: 'توجه',
                        escapeKey: true,
                        backgroundDismiss: true,
                        content: "شما به این صفحه دسترسی ندارید  ",
                        type: 'red',
                        boxWidth: '15%',
                        useBootstrap: false
                    });
                }

            }
        }
    }
    getName();
}

function setUserLevelToButton() {
    
    var myArray = [["cmdDefProductGroup", "6"], ["cmdDefProducts", "6"],
        ["cmdDefProductDetails", "6,9"], ["cmdDefCountry", "6"],
        ["cmdDefBrand", "6,9"], ["cmdDefSize", "6,9"],
        ["cmdDefMaterial", "6,9"], ["cmdDefColor", "6"],
        ["cmdDefUsers", "6"], ["cmdDefUserLevel", "6"],
        ["cmdDefCustomer", "6,9"], ["cmdDefVendor", "6,9"], ["cmdChangePass", "6,9,7"],
        ["cmdInpFactor", "6,9"], ["cmdOutFactor", "6,9"],
        ["cmdDefAmvalProduct", "6,9"], ["cmdTakhsisAmvalToUser", "6,9"],
        ["cmdEsghatAmval", "6,9"], ["cmdService", "6,9"],
        ["cmdRepMasrafi", "6,9,7"], ["cmdRepAmval", "6,9,7"],
        ["cmdDashboard", "6,9,7"]
    ];

    $("#" + myArray[0][0]).data('id', myArray[0][1]);
    $("#" + myArray[1][0]).data('id', myArray[1][1]);
    $("#" + myArray[2][0]).data('id', myArray[2][1]);
    $("#" + myArray[3][0]).data('id', myArray[3][1]);
    $("#" + myArray[4][0]).data('id', myArray[4][1]);
    $("#" + myArray[5][0]).data('id', myArray[5][1]);
    $("#" + myArray[6][0]).data('id', myArray[6][1]);
    $("#" + myArray[7][0]).data('id', myArray[7][1]);
    $("#" + myArray[8][0]).data('id', myArray[8][1]);
    $("#" + myArray[9][0]).data('id', myArray[9][1]);
    $("#" + myArray[10][0]).data('id', myArray[10][1]);
    $("#" + myArray[11][0]).data('id', myArray[11][1]);
    $("#" + myArray[12][0]).data('id', myArray[12][1]);
    $("#" + myArray[13][0]).data('id', myArray[13][1]);
    $("#" + myArray[14][0]).data('id', myArray[14][1]);
    $("#" + myArray[15][0]).data('id', myArray[15][1]);
    $("#" + myArray[16][0]).data('id', myArray[16][1]);
    $("#" + myArray[17][0]).data('id', myArray[17][1]);
    $("#" + myArray[18][0]).data('id', myArray[18][1]);
    $("#" + myArray[19][0]).data('id', myArray[19][1]);
    $("#" + myArray[20][0]).data('id', myArray[20][1]);
    $("#" + myArray[21][0]).data('id', myArray[21][1]);



    //for (var i = 0; i <= myArray.length; i++) {
    //    $("#" + myArray[i][0]).data('id', myArray[i][1]);
    //}
}

function ExportToExcel(mytblId) {
    var htmltable = document.getElementById(mytblId);
    var html = htmltable.outerHTML;
    window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html));
}

function MergeTable(tabname, col) {

    var l = $("#" + tabname).find('tr').length;
    var tn = $("#" + tabname).find('tr').eq(0).find('td').eq(col).html();
    var r = 1, fi = 1;
    for (var i =1; i < l - 1; i++) {
        if (tn === $("#" + tabname).find('tr').eq(i).find('td').eq(col).html()) {
            r += 1;
            tn = $("#" + tabname).find('tr').eq(i).find('td').eq(col).html();

        } else {

            $("#" + tabname).find('tr').eq(fi).find('td').eq(col).attr('rowspan', r);
            tn = $("#" + tabname).find('tr').eq(i).find('td').eq(col).html();
            for (var j = 0; j < r - 1; j++) {
                $("#" + tabname).find('tr').eq(fi + j + 1).find('td').eq(col).remove();
            }
            r = 1;
            fi = i;
        }
    }
    $("#" + tabname).find('tr').eq(fi).find('td').eq(col).attr('rowspan', r + 1);
    for (var k = 0; k < r; k++) {
        $("#" + tabname).find('tr').eq(fi + k + 1).find('td').eq(col).remove();
    }

    $("#" + tabname).find('td').filter(function () {
        return this.rowSpan > 1;
    }).css('background-color', 'lightblue');

};