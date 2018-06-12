var showPickerFields = function(){
    //pick variables from cookie
    // 1-Setup Picker Fields, 2-Hide Picker Display, 3-Show Picker Fields
    var rDates = Cookies.getJSON("rDates");
    console.log(rDates);
    var fromDate = rDates.fDate;
    var toDate = rDates.tDate;
    //---Time Picker JS-----
    $("#fromDate").val(fromDate);
    $("#toDate").val(toDate);
    console.log(fromDate);
    $("#fromDate").datepicker({'dateFormat': "dd.mm.yy"});
    // $("#fromDate").datepicker({
    //     'defaultDate': Date.parse(fromDate),
    //     'setDate': Date.parse(fromDate)
    // });
    $("#toDate").datepicker({'dateFormat': "dd.mm.yy"});
    // $("#toDate").datepicker({
    //     'defaultDate': '04.06.2018',
    //     'setDate': toDate
    // });
   
    $(".picker-display").hide();
    $(".picker-fields").show();
}

var showPickerDisplays = function(period, sDate){
    //pick variables from cookie
    // Setup Picker Display, 2-Hide Picker Fields, 3-Show Picker Display
    console.log(Cookies.getJSON("rDates"));
    if(period == "wDate" || period == "mDate"){
        $("#selDate").addClass("form-control-sel");
    }else{
        $("#selDate").removeClass("form-control-sel");
    }
    $("#selDate").val(sDate);
    $(".picker-fields").hide();
    $(".picker-display").show();
}

var setCookies =  function(k,v){
    ck = Cookies.get(k);
    if(ck != null){
        Cookies.remove(k)
    }
    Cookies.set(k,v);
}

var getDates = function(target){
    // sets the date &   type of clicked/selected button in a coookie
    setCookies("period", target);
    if(target == "tDate"){
        minDate = maxDate = Date.today().toString('dd.MM.yyyy');
        setCookies("rDates", {fDate: minDate, tDate: maxDate});
        setCookies("selDates", minDate);
        showPickerDisplays(target,minDate);
    }else if (target == "yDate"){
        minDate = maxDate = Date.parse("yesterday").toString('dd.MM.yyyy');
        setCookies("rDates", {fDate: minDate, tDate: maxDate});
        setCookies("selDates", minDate);
        showPickerDisplays(target,minDate); 
    }else if(target == "wDate"){
        minDate = Date.today().last().week().toString('dd.MM.yyyy');
        maxDate = Date.today().toString('dd.MM.yyyy');
        sDate = minDate + "-" + maxDate;
        setCookies("rDates", {fDate: minDate, tDate: maxDate});
        setCookies("selDates", sDate);
        showPickerDisplays(target,sDate); 
    }else if (target == "mDate"){
        minDate = new Date().moveToFirstDayOfMonth().toString('dd.MM.yyyy');
        maxDate = new Date().moveToLastDayOfMonth().toString('dd.MM.yyyy');
        sDate = minDate + "-" + maxDate;
        setCookies("rDates", {fDate: minDate, tDate: maxDate});
        setCookies("selDates", sDate);
        showPickerDisplays(target, sDate); 
    }else if (target == "cDate"){
        showPickerFields();
        Cookies.remove("selDates");
        // Cookies.remove("rDates");
    }
};

var getNextDate =  function(target){
    // gets next date hen right arrow/carret is clicked
    console.log(target);
};


var getPreviousDate =  function(target){
    // gets previous date when left arrow/carret is clicked
    console.log(target);
};

var loadReportTemplate = function(rTemp){
    console.log(rTemp);
    //--first load template with a progress bar then update it with info fetched if any
};

$(document).ready( function () {
    $('#myTable').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'csv', 'excel', 'pdf', 'print'
        ]
    } );

    var aTarget = $(".active").children("input").prop("id");
    getDates(aTarget);

    //--Get Dates/ranges of clicked period buttons and display them accordingly
    $("#dTargets label").on('click',function(){
        var target = $(this).children("input").prop("id");
        getDates(target);
    });

    $("#rTemplates").change(function(){
        // alert("changed");
        var rTmp = $(this).find(":selected");
        var sTitle= rTmp.text();
        var sTemp = rTmp.prop('id');
        //update heading
        $("#reportTitle").text(sTitle);
        //store load selected template
        loadReportTemplate(sTemp);
    });

} );