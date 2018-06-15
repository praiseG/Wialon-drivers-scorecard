/// Global event handlers
var callbacks = {};

//Date/DtePicker functions
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

var getTimefromInput = function(){};

// wialon functions
/// IE check
function ie() {
	return (navigator.appVersion.indexOf("MSIE 6") != -1 || navigator.appVersion.indexOf("MSIE 7") != -1 || navigator.appVersion.indexOf("MSIE 8") != -1);
}

/// Execute callback
var execCallback = function(id) {
	if (!callbacks[id])
		return;
	callbacks[id].call();
};

/// Wrap callback
function wrapCallback(callback) {
	var id = (new Date()).getTime();
	callbacks[id] = callback;
	return id;
}

/// Fetch varable from 'GET' request
function getHtmlVar(name) {
	if (!name)
		return null;
	var pairs = decodeURIComponent(document.location.search.substr(1)).split("&");
	for (var i = 0; i < pairs.length; i++) {
		var pair = pairs[i].split("=");
		if (pair[0] == name) {
			pair.splice(0, 1);
			return pair.join("=");
		}
	}
	return null;
}

/// Load script
function loadScript(src, callback) {
	var script = document.createElement("script");
	script.setAttribute("type","text/javascript");
	script.setAttribute("charset","UTF-8");
	script.setAttribute("src", src);
	if (callback && typeof callback == "function") {
		wrapCallback(callback);
		if (ie())
			script.onreadystatechange = function () {
				if (this.readyState == 'complete' || this.readyState == 'loaded')
					callback();
			};
		else
			script.setAttribute("onLoad", "execCallback(" + wrapCallback(callback) + ")");
	}
	document.getElementsByTagName("head")[0].appendChild(script);
}


function login(code){
    console.log("Code: " + code);
    if(code){
      alert("Login Error");
      return;
    }
    var username = wialon.core.Session.getInstance().getCurrUser().getName();
    document.getElementById("username").innerHTML = username;
    
    window.onbeforeunload = function () {
		wialon.core.Session.getInstance().logout();
	};
    // get Driver scorecrd report by default
  }
  
  function initSdk(){
    console.log("Initializing SDK");
    var url = getHtmlVar("baseUrl") || getHtmlVar("HostUrl");
    console.log("url: " + url);
    if (!url)
      return;
    var user = getHtmlVar("user") || "";
    var sid = getHtmlVar("sid");
    var authHash = getHtmlVar("authHash");
  
    wialon.core.Session.getInstance().initSession(url);
    if(authHash){
      console.log("logging in with authHash");
      wialon.core.Session.getInstance().loginAuthHash(authHash, login);
    }else{
      console.log("logging in with sid");
      wialon.core.Session.getInstance().duplicate(sid, user, true, login);
    }
  }
//Fetch all Units
var fetchUnits = function(){
    var sess = wialon.core.Session.getInstance(); // get instance of current Session

    sess.loadLibrary("itemIcon"); // load Icon Library	
    sess.loadLibrary("itemCustomFields"); //IMPORTANT! for loading custom fields needed loaded library "itemCustomFields"

    var flags = wialon.util.Number.or(wialon.item.Item.dataFlag.base,  wialon.item.Unit.dataFlag.lastMessage, wialon.item.Item.dataFlag.customFields, wialon.item.Item.dataFlag.adminFields);


    var all_units = [];
    
    sess.updateDataFlags( // load items to current session
    [{type: "type", data: "avl_unit", flags: flags, mode: 0}], // Items specification
    function (code) { // updateDataFlags callback
        if (code) { console.log(wialon.core.Errors.getErrorText(code)); return; } // exit if error code
        // get loaded 'avl_unit's items  
        var units = sess.getItems("avl_unit");
        if (!units || !units.length){ console.log("Units not found"); return; } // check if units found
        var dt = $("#vlr-tbl").dataTable().api();
        for (var i = 0; i< units.length; i++){ // construct Select object using found units
          var u = units[i]; // current unit in cycle
        //   console.log(u);
        var u_site_name = "unknown";
        var u_site_id = "unknown";
        var u_year = "unknown";
        var u_make = "unknown";
        var u_model ="unknown";
        var u_vhl_vin = "unknown";
          var  cusFields = _.values(u.getCustomFields());
          if(_.size(cusFields) > 0){
              _.each(cusFields,function(cField, index, list){
                if(cField.n = "Site Name") u_site_name = cField.v;
                else if(cField.n = "Site ID") u_site_id = cField.v;
                else if(cField.n = "Vehicle Year") u_year = cField.v;
                else if(cField.n = "Vehicle Make") u_make = cField.v;
                else if(cField.n = "Vehicle Model") u_model = cField.v;
                else if(cField.n = "Vehicle VIN") u_vhl_vin = cField.v;
              });
            
          }
          var u_name = u.getName();
          var u_time = 'unknown';
          var u_address = 'unknown';
          var u_pos = u.getPosition();
          console.log(u_pos);
          if(u_pos){
            u_time = wialon.util.DateTime.formatTime(u_pos.t);
            // wialon.util.Gis.getLocations([{lon:u_pos.x, lat:u_pos.y}], function(code, address){ 
            //     if (code) { console.log(wialon.core.Errors.getErrorText(code)); return; } // exit if error code
            //     u_address = address; // print message to log
            // });
          }
         
          var unit = {
              "id": i+1,
              "icon_url": u.getIconUrl(32),
              "transporter_id": u.getId(), 
              "license_number": u_name, 
              "vin": u_vhl_vin, 
              "year_mke_model": u_year + "/" + u_make + "/" + u_model, 
              "site_name": u_site_name, 
              "site_id": u_site_id,
              "ivms_id": u.getUniqueId(),
              "last_gps_conn": u_time,
              "last_trip_dt": u_time
            };
          all_units.push(unit);
          var vhlTemp = _.template($("#vlr-data").html());
          dt.row.add($(vhlTemp({"vhl": unit})));
         }
         dt.row(0).remove().draw();
        //  dt.draw();  
        //  var vhlTemp = _.template($("#vlr-data").html());
        //  $("#vlr-tbl").children("tbody").html(vhlTemp({"vehicles": all_units}));  
      }
   );
};

var fetchDrivers = function(){
    var sess = wialon.core.Session.getInstance(); // get instance of current Session

    sess.loadLibrary("resourceDrivers"); // load Icon Library	
    sess.loadLibrary("itemCustomFields"); //IMPORTANT! for loading custom fields needed loaded library "itemCustomFields"
    // flags to specify what kind of data should be returned

    var flags = wialon.util.Number.or(wialon.item.Item.dataFlag.base, wialon.item.Resource.dataFlag.drivers, wialon.item.Resource.dataFlag.driverUnits, wialon.item.Item.dataFlag.customFields);

    sess.updateDataFlags( // load items to current session
        [{type: "type", data: "avl_resource", flags: flags, mode: 0}], // Items specification
        function (code) { // updateDataFlags callback
            if (code) { console.log(wialon.core.Errors.getErrorText(code)); return; } // exit if error code
            // get loaded 'avl_unit's items  
            var ress = sess.getItems("avl_resource");
            console.log("***************resources**********");
            console.log(ress);
            console.log("***************resources**********");
            if (!ress || !ress.length){ console.log("No Resources found"); return; } // check if resources were found
            var dt = $("#dlr-tbl").dataTable().api();
            for (var i = 0; i< ress.length; i++){ 
                var d_res = ress[i];
                var d_res_name = d_res.getName();
                var drivers = _.values(d_res.getDrivers());
                console.log("res: " + d_res_name);

                if(_.size(drivers) > 0){
                    for (var j = 0; j< drivers.length; j++){ 
                        var dr = drivers[j];
                        console.log("--------dr-------------------");
                        console.log(dr);
                        var d_name = dr.n;
                        var d_site_name = "unknown";
                        var d_site_id = "unknown";
                        var d_license = "unknown";
                        var d_license_expiry = "unknown";
                        // var cusFields = _.values(dr.getCustomFields());
                        // if(_.size(cusFields) > 0){
                        //     _.each(cusFields,function(cField, index, list){
                        //         if(cField.n = "Site Name") d_site_name = cField.v;
                        //         else if(cField.n = "Site ID") d_site_id = cField.v;
                        //         else if(cField.n = "License ID") d_license = cField.v;
                        //         else if(cField.n = "License Expiry") d_license_expiry = cField.v;
                        //     });
                        // }
                        var driver = {
                            "id": j+1,
                            // "icon_url": d.getDriverImageUr(32),
                            "icon_url": null,
                            "transporter_id": d_res_name, 
                            "name": d_name, 
                            "driver_id": dr.id, 
                            "driver_license": d_license, 
                            "site_name": d_site_name, 
                            "site_id": d_site_id,
                            "license_expiry": d_license_expiry
                            };
                        // console.log("driver one");
                        // console.log(driver);
                        var dlrTemp = _.template($("#dlr-data").html());
                        dt.row.add($(dlrTemp({"drv": driver}))); 
                    }
                }
            }   
            dt.row(0).remove().draw();         
    });
};

var getDriverScoreFactors = function(){
    console.log("loading");
};

var vlrReport = function(){
    var cTitles = _.template($("#vlr-cols").html());
    $("#rpt-table").empty();
    $("#rpt-table").html(cTitles);
    $('#vlr-tbl').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'csv', 
            {
                extend: 'excelHtml5',
                title: 'Vehicles List Report'
            },
            'pdf', 
            'print'
        ]
    });
    fetchUnits();
};

var dlrReport = function(){
    var cTitles = _.template($("#dlr-cols").html());
    $("#rpt-table").empty();
    $("#rpt-table").html(cTitles);
    $('#dlr-tbl').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'csv', 
            {
                extend: 'excelHtml5',
                title: 'Drivers List Report'
            },
            'pdf', 
            'print'
        ]
    });

    fetchDrivers();
};

var dscReport = function(){
    var cTitles = _.template($("#dsc-cols").html());
    $("#rpt-table").empty();
    $("#rpt-table").html(cTitles);
    $('#dsc-tbl').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'csv', 
            {
                extend: 'excelHtml5',
                title: 'Drivers Score Card'
            },
            'pdf', 
            'print'
        ],
        "columnDefs": [
            {
                "targets": [ 3 ],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [ 4 ],
                "visible": false
            }
        ]
    });

    getDriverScoreFactors();
};


// Appropriate report templates
var loadReportTemplate = function(rTemp){
    console.log(rTemp);
    if(rTemp == "t-dlr"){
        dlrReport();
    }else if(rTemp == "t-vlr"){
        vlrReport();
    }
    else if(rTemp == "t-dsc"){
        dscReport();
    }
    //--first load template with a progress bar then update it with info fetched if any
};

var onLoad = function(){
    // load wialon.js
	// var url = getHtmlVar("baseUrl") || getHtmlVar("hostUrl") || "https://hst-api.wialon.com";
    loadScript("https://hst-api.wialon.com/wsdk/script/wialon.js", initSdk);
   
};


$(document).ready( function () {
    onLoad();
    
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

 
    loadReportTemplate("t-dsc");

} );