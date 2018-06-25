/// Global event handlers
var callbacks = {};
var timeToSeconds = function(hms_time){
    var t = hms_time.split(':');
    var seconds = (+t[0]) * 3600 + (+t[1]) * 60 + (+t[2]); 
    return seconds;

}
var getTransporterFromUnitName = function(unit_name){
    if(!unit_name) return;
    start = unit_name.indexOf("(");
    end = unit_name.indexOf(")");
    transporter = unit_name.slice(start+1, end);
    unit_license = unit_name.slice(0, start);
    return {"transporter":transporter, "unit_license": unit_license }
}
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

    // get Driver scorecrd report by default
    window.setTimeout(function(){ $("#rTemplates").val("Drivers_Score_Card").trigger('change');}, 2000);
    
    window.onbeforeunload = function () {
		wialon.core.Session.getInstance().logout();
	};
    
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

var executeReport = function(unit) {
    console.log("inside execReport");
    var sess = wialon.core.Session.getInstance();
    var res_id = sess.getCurrUser().getAccountId();
    var unit_id = unit.u_id;
    res_id = 15452548;
    unit_id = 14092777;
    console.log("res_id: " + res_id);
    console.log("unit_id : " + unit_id);
    var t_to = sess.getServerTime();
    var t_from = t_to - parseInt(604800, 10);
    t_from = 1521849600;
    t_to = 1529884740;
    console.log("t_to :" + t_to);
    console.log("t_from :" + t_from);

    var t_penalty = 0;
    var t_score  = 0;
    var d_name = "unknown";
    var d_lic = "unknown";
    var d_site_name = "unknown";
    var ovs_c = 0;
    var ovs_p = 0;
    var hacc_c = 0;
    var hacc_p = 0;
    var hbrk_c = 0;
    var hbrk_p = 0;
    var drt_m = 0;
    var drvt_p = 0;
    var rst_p = 0;
    
    
	// General batch
	var params = [
    {"svc": 'report/exec_report', "params":{"reportResourceId": res_id,"reportTemplateId": 48,"reportObjectId": unit_id,"reportObjectSecId":0,"interval": {"flags": 0,"from": t_from,"to": t_to}}},
    {"svc": "report/select_result_rows","params": {"tableIndex": 0,"config": {"type": 'range',"data": {"from": 0,"to": 0xFFFF,"level": 1,"rawValues": 1}}}}, 
	{"svc": "report/select_result_rows","params": {"tableIndex": 1,"config": {"type": 'range',"data": {"from": 0,"to": 0xFFFF,"level": 1,"rawValues": 1}}}},
    {"svc": "report/cleanup_result","params": {}}];
    
    var params2 = [
        {"svc": "report/exec_report", "params": {"reportResourceId": 15452548,"reportTemplateId": 48,"reportObjectId": 14092777,"reportObjectSecId":0,"interval": {"flags": 0,"from": 1521849600,"to": 1529884740}}},
        {"svc": "report/get_result_rows", "params": {"tableIndex":0,"indexFrom":0,"indexTo":3}},
        {"svc": "report/get_result_rows", "params": {"tableIndex":1,"indexFrom":0,"indexTo":3}},
        {"svc": 'report/cleanup_result','params': {}}];

	wialon.core.Remote.getInstance().remoteCall('core/batch', params, function (code, obj) {
        console.log("obj outside");
        console.log(code);
        console.log(obj);
        console.log("obj out end");
		// if (code === 0 && obj && obj.length && obj.length == 4 && !('error' in obj[0]) && ('reportResult' in obj[0])) {

        if (code === 0 && obj && obj.length && !('error' in obj[0]) && ('reportResult' in obj[0]) && obj[0].reportResult.tables.length > 0) {
            console.log("report successful see obj below");
            console.log(obj);
            if(!('error' in obj[1])){ // process Eco Driving parameters 
                eco_rows = obj[1];
                console.log("eco driving params");
                for (var r=0; r < eco_rows.length; r++){
                    var violation = eco_rows[r].c[0].t;
                    console.log(violation);
                    if(violation == "Harsh Acceleration"){
                        hacc_c = eco_rows[r].c[2].t;
                        hacc_p = eco_rows[r].c[1].t;
                        t_penalty += hacc_p;
                    }else if(violation == "Harsh Braking"){
                        hbrk_c = eco_rows[r].c[2].t;
                        hbrk_p = eco_rows[r].c[1].t;
                        t_penalty += hbrk_p;
                    }

                }
            }

            if(!('error' in obj[2])){ // process Over Speeding parameters 
                ovs_rows = obj[2];
                console.log("over speeding durations");
                for (var v=0; v < ovs_rows.length; v++){
                    t_sec = timeToSeconds(ovs_rows[v].c[1].t);
                    console.log(t_sec);
                    ovs_c++;
                    ovs_p += parseInt(t_sec/60);
                    t_penalty += ovs_p;
                }
            }

            t_score = (t_penalty/unit.mileage)*100;

            console.log("ovs count :" + ovs_c);
            console.log("ovs pnalty :" + ovs_p);
            console.log("hacc count :" + hacc_c);
            console.log("hacc pnalty :" + hacc_p);
            console.log("hbrk count :" + hbrk_c);
            console.log("hbrk pnalty :" + hbrk_p);
            console.log("total pnalty :" + t_penalty);

            var dsc = {
                "id": unit.row_id+1,
                "transporter_id":unit.tp_id,
                "drv_name": d_name,
                "drv_lic": d_lic,
                "tot_mileage": unit.mileage,
                "site_name":d_site_name,
                "hbrk_penalty": hbrk_p,
                "hbrk_occur": hbrk_c,
                "hacc_penalty": hacc_p,
                "hacc_occur": hacc_c,
                "ovs_penlty": ovs_p,
                "ovs_duration": ovs_c,
                "drvtime_penalty": drvt_p,
                "drvtime_mins": drt_m,
                "resting_penalty": rst_p,
                "score": t_score
            }
            var dscTemp = _.template($("#dsc-data").html());
            dt.row.add($(dscTemp({"dsc": dsc})));
            if(unit.row_id == 0) dt.row(0).remove();
            dt.draw();
		}
	});
};

var clearReportResult = function() {
    console.log("inside clear report  result");
    var sess = wialon.core.Session.getInstance();
    
	wialon.core.Remote.getInstance().remoteCall('report/cleanup_result', {}, function (code, obj) {
       
        if(code){ console.log(wialon.core.Errors.getErrorText(code)); return; }
        console.log("clear code");
        console.log(code);
	});
};
//Fetch all Units

var fetchUnits = function(){
    var sess = wialon.core.Session.getInstance();

    sess.loadLibrary("itemIcon");
    sess.loadLibrary("itemCustomFields");
    sess.loadLibrary("itemProfileFields"); 
    sess.loadLibrary("unitDriveRankSettings");
    sess.loadLibrary("unitEvents");
    sess.loadLibrary("unitTripDetector");


    var flags = wialon.util.Number.or(wialon.item.Item.dataFlag.base,  wialon.item.Unit.dataFlag.lastMessage, wialon.item.Item.dataFlag.customFields, wialon.item.Item.dataFlag.adminFields, wialon.item.Item.dataFlag.customProps, wialon.item.Item.dataFlag.guid, 256, 8388608, 131072, 524288, 8192);

  
    sess.updateDataFlags( 
    [{type: "type", data: "avl_unit", flags: flags, mode: 0}], 
    function (code) { 
        console.log("codefu " + code);
        if (code) { console.log(wialon.core.Errors.getErrorText(code)); return; } 
        var units = sess.getItems("avl_unit");
        units = wialon.util.Helper.filterItems(units, wialon.item.Item.accessFlag.execReports);
        if (!units || !units.length){ console.log("Units not found"); return; } 
        console.log("units hereee orig");
        console.log(units);
        var dt = $("#vlr-tbl").dataTable().api();
        for (var i = 0; i< units.length; i++){
        var u = units[i];
        var u_name = u.getName();
        // devType = u.getDeviceTypeId();
        if(u_name.endsWith("(Cam)")) continue;
        // console.log(u);
        if(u.getTripsHistory()){
            console.log("trips history here");
            console.log(u.getTripsHistory());
            console.log("trips hist here");
        }
        if(u.getCurrentTrip()){
            console.log("trips here");
            console.log(u.getCurrUser());
            console.log("trips here");
        }
        // console.log(u.getAdminFields());
        var u_site_name = "unknown";
        var u_site_id = "unknown";
        var u_year = "unknown";
        var u_make = "unknown";
        var u_model ="unknown";
        var u_vhl_vin = "unknown";
        var  cusFields = _.values(u.getCustomFields());
        console.log("custom fields");
        console.log(cusFields);
        if(_.size(cusFields) > 0){
            _.each(cusFields,function(cField, index, list){
            if(cField.n == "Site Name") u_site_name = cField.v;
            else if(cField.n == "Site ID") u_site_id = cField.v;
            });
        }

        var  profileFields = _.values(u.getProfileFields());
        
        if(_.size(profileFields) > 0){
            _.each(profileFields,function(pField, index, list){
            if(pField.n == "year") u_year = pField.v;
            else if(pField.n == "brand") u_make = pField.v;
            else if(pField.n == "model") u_model = pField.v;
            else if(pField.n == "vin") u_vhl_vin = pField.v;
            });
        
        }
        var u_time = 'unknown';
        var u_address = 'unknown';
        var u_pos = u.getPosition();
        // console.log(u_pos);
        if(u_pos){
        u_time = wialon.util.DateTime.formatTime(u_pos.t);
        // wialon.util.Gis.getLocations([{lon:u_pos.x, lat:u_pos.y}], function(code, address){ 
        //     if (code) { console.log(wialon.core.Errors.getErrorText(code)); return; } // exit if error code
        //     u_address = address; // print message to log
        // });
        }
        var u_dets = getTransporterFromUnitName(u_name);
        var tp_id = u_dets["transporter"];
        var u_lic = u_dets["unit_license"];
        var unit = {
            "id": i+1,
            "icon_url": u.getIconUrl(32),
            "transporter_id": tp_id, 
            "license_number": u_lic, 
            "vin": u_vhl_vin, 
            "year_mke_model": u_year + "/" + u_make + "/" + u_model, 
            "site_name": u_site_name, 
            // "site_id": u.getId(),
            "site_id": u_site_id,
            "ivms_id": u.getUniqueId(),
        //   "ivms_id": u.getDeviceTypeId(),
            "last_gps_conn": u_time,
            "last_trip_dt": u_time
        };
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

    sess.loadLibrary("resourceDrivers");
    sess.loadLibrary("resourceDriverUnits");
    sess.loadLibrary("itemDriver");
    sess.loadLibrary("itemCustomFields"); //IMPORTANT! for loading custom fields needed loaded library "itemCustomFields"
    // flags to specify what kind of data should be returned

    var flags = wialon.util.Number.or(wialon.item.Item.dataFlag.base, wialon.item.Resource.dataFlag.drivers, wialon.item.Resource.dataFlag.driverUnits, wialon.item.Item.dataFlag.customFields, 16384);

    sess.updateDataFlags( // load items to current session
        [{type: "type", data: "avl_resource", flags: flags, mode: 0},{type: "type", data: "avl_unit", flags: flags, mode: 0}], // Items specification
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
                console.log("reports");
                // console.log(d_res.getReports());
                if(_.size(drivers) > 0){
                    for (var j = 0; j< drivers.length; j++){ 
                        var dr = drivers[j];
                        var d_name = dr.n;
                        var d_id = dr.id;
                        console.log("--------dr-------------------");
                        console.log(dr);
                        var d_site_name = "unknown";
                        var d_site_id = "unknown";
                        var d_ivms_id = "unknown";
                        var d_license = "unknown";
                        var d_license_expiry = "unknown";
                        var d_tp_id = "N/A";
                        if(dr.bu){
                            console.log("driver Units");
                            var unit_h = sess.getItem(dr.bu);
                            var u_dets = getTransporterFromUnitName(unit_h.getName());
                            d_tp_id = u_dets["transporter"];
                            console.log(dr.bu);
                            console.log(unit_h);
                            console.log("Units after");
                        }
                        var cusFields = dr.jp;
                        // console.log("cusf");
                        // console.log(cusFields);
                        // console.log(_.size(cusFields));
                        // console.log(_.has(cusFields, "Site Name"));
                        if(_.size(cusFields) > 0){
                            if(_.has(cusFields, "Site Name")) d_site_name = cusFields["Site Name"];
                            if(_.has(cusFields, "IVMS ID")) d_ivms_id = cusFields["IVMS ID"];
                            if(_.has(cusFields, "Site ID")) d_site_id = cusFields["Site ID"];
                            if(_.has(cusFields, "License ID")) d_license = cusFields["License ID"];
                            if(_.has(cusFields, "License Expiry")) d_license_expiry = cusFields["License Expiry"];
                            console.log("site_name in:" +  d_site_name);
                        }
                        console.log("site_name out:" +  d_site_name);
                        var driver = {
                            "id": j+1,
                            // "icon_url": d.getDriverImageUr(32),
                            "icon_url": null,
                            "transporter_id": d_tp_id, 
                            "name": d_name, 
                            "driver_id": d_ivms_id, 
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

function getTableValue(data) { // calculate ceil value
	if (typeof data == "object")
		if (typeof data.t == "string") return data.t; else return "";
	else return data;
}

var getDriverScoreFactors2 = function(){
    console.log("drivers score card here");
}
var getDriverScoreFactors3 = function(){
    var sess = wialon.core.Session.getInstance(); // get instance of current Session

    var res_flags = wialon.item.Item.dataFlag.base | wialon.item.Resource.dataFlag.reports;
	var unit_flags = wialon.util.Number.or(wialon.item.Item.dataFlag.base,  wialon.item.Unit.dataFlag.lastMessage, wialon.item.Item.dataFlag.customFields, wialon.item.Item.dataFlag.adminFields, wialon.item.Item.dataFlag.customProps, wialon.item.Item.dataFlag.guid, 256, 8388608, 131072, 524288, 8192);
	
	sess.loadLibrary("resourceReports"); // load Reports Library
	sess.updateDataFlags( // load items to current session
		[{type: "type", data: "avl_resource", flags:res_flags , mode: 0}, 
         {type: "type", data: "avl_unit", flags: unit_flags, mode: 0},
         {type: "type", data: "avl_unit_group", flags: unit_flags, mode: 0}], 
		function (code) { 
			if (code) { console.log(wialon.core.Errors.getErrorText(code)); return; } 

            var ress = sess.getItems("avl_resource");
            var ugs = sess.getItems("avl_unit_group");
            if (!ugs || !ress.length){ console.log("No Unit Groups found"); return; } 
            
			if (!ress || !ress.length){ console.log("No Resources found"); return; } 
            
            var res = ress[0];
            console.log("resource hereeeeeeeeeee");
            console.log(res);
                console.log("all unit groups");
            console.log(ugs);
            console.log("all resources");
            var ug_id = null;
            for(var i=0; i < ugs.length; i++){
                if(ugs[i].getName() == ".All Units (LH UG)"){
                    ug_id = ugs[i].getId();
                    console.log("ug name");
                    console.log(ugs[i].getName());
                    console.log("ug_id in :" + ug_id);
                }
            }
            console.log("ug_id out :" + ug_id);
            if(!ug_id){alert("No Unit Group found"); return;}
            var template = res.getReport(49);
            
            var to_t = sess.getServerTime(); 
            var from_t = to_t - parseInt(7776000, 10); //3 months interval
            var interval = { "from": from_t, "to": to_t, "flags": wialon.item.MReport.intervalFlag.absolute };

            // res.execReport(template, ug_id, ug_id, interval, 
            //     function(code, data) {
            //         console.log("works till here");
            //         console.log(data);
            //     if(code){ console.log(wialon.core.Errors.getErrorText(code)); return; }
            //     if(data.getTables().length){ // exit if no tables obtained
            //         console.log("report data here");
            //         console.log(data);
            //     }
            // });
            var dt = $("#dsc-tbl").dataTable().api();
			var units = sess.getItems("avl_unit"); 
			if (!units || !units.length){ console.log("Units not found"); return; } 
			// for (var i = 0; i< units.length; i++){
            //     var unit = units[i];
                var unit = units[2];
                u_name = unit.getName();
                var u_dets = getTransporterFromUnitName(u_name);
                var tp_id = u_dets["transporter"];
                var u_mileage = unit.getMileageCounter();
                var drv_name = "N/A";
                var drv_lic = "N/A";
                var tot_mileage = "N/A";
                var site_name = "N/A";
                var hbrk_penalty = "N/A";
                var hbrk_occur = "N/A";
                var hacc_penalty = "N/A";
                var hacc_occur = "N/A";

                var ovs_penlty = "N/A";
                var ovs_duration = "N/A";
                var drvtime_penalty = "N/A";
                var drvtime_mins = "N/A";
                var resting_penalty = "N/A";
                var t_score = "N/A";

                console.log("rep unit");
                console.log(unit);
                var u_id = unit.getId();
                window.setTimeout(function() {
                    res.execReport(template, u_id, 0, interval, 
                        function(code, data) {
                            if(code){ console.log(wialon.core.Errors.getErrorText(code)); return; }
                            var tables = data.getTables();
                            if(tables.length){ // exit if no tables obtained
                                console.log("report data here");
                                console.log(data);
                                for(var i=0; i < tables.length; i++){
                                    var html = "<b>"+ tables[i].label +"-" + u_name +"</b><div class='wrap'><table style='width:100%'>";
                                    
                                    var headers = tables[i].header;
                                    html += "<tr>"; 
                                    for (var j=0; j<headers.length; j++) 
                                        html += "<th>" + headers[j] + "</th>";
                                    html += "</tr>"; 
                                    data.getTableRows(i, 0, tables[i].rows, 
                                        qx.lang.Function.bind( function(html, code, rows) { 
                                            if (code) {console.log(wialon.core.Errors.getErrorText(code)); return;} 
                                            for(var j in rows) { // cycle on table rows
                                                // if (typeof rows[j].c == "undefined") continue; 
                                                html += "<tr"+(j%2==1?" class='odd' ":"")+">"; 
                                                for (var k = 0; k < rows[j].c.length; k++) // 
                                                    html += "<td>" + getTableValue(rows[j].c[k]) + "</td>";
                                                html += "</tr>";
                                            }
                                            html += "</table>";
                                            // $("#reprt-data-sc").empty();
                                            $("#reprt-data-sc").html(html +"</div><br />");
                                        }, this, html)
                                    );
                                }
                                // var html = "";
                                // for(var j=0; j < tables.length; j++){
                                //     console.log("tHeader : " + tables[j].label);
                                //     data.getTableRows(i, 0, tables[j].rows, // get Table rows
                                //         qx.lang.Function.bind( function(html, code, rows) { 
                                //             console.log("rows here");
                                //             console.log(rows);
                                //             if (code) {console.log(wialon.core.Errors.getErrorText(code)); return;}
                                //             for(var r in rows) {
                                //                 console.log("row here");
                                //                 console.log(r);
                                //                 // for (var k = 0; k < rows[r].c.length; k++){
                                //                 //     console.log("")
                                //                 // }
                                //             }
                                //         }, this, html)
                                //     );
                                // }
                            }
                            
                    });
                }, 1000);
            //     clearReportResult();
            //     var dsc = {
            //         "id": i+1,
            //         "transporter_id":tp_id,
            //         "drv_name": drv_name,
            //         "drv_lic": drv_lic,
            //         "tot_mileage": u_mileage,
            //         "site_name":site_name,
            //         "hbrk_penalty": hbrk_penalty,
            //         "hbrk_occur": hbrk_occur,
            //         "hacc_penalty": hacc_penalty,
            //         "hacc_occur": hacc_occur,
            //         "ovs_penlty": ovs_penlty,
            //         "ovs_duration": ovs_duration,
            //         "drvtime_penalty": drvtime_penalty,
            //         "drvtime_mins": drvtime_mins,
            //         "resting_penalty": resting_penalty,
            //         "score": t_score
            //     }
            //     var dscTemp = _.template($("#dsc-data").html());
            //     dt.row.add($(dscTemp({"dsc": dsc})));
            //     if(i == 0) dt.row(0).remove();
            //     dt.draw();
            // // }// end units for
            // dt.row(0).remove().draw();
	});   
};

//Fetch all Units
var getDriverScoreFactors = function(){
    console.log("in Driver Score Card");
    var sess = wialon.core.Session.getInstance(); // get instance of current Session

    sess.loadLibrary("itemIcon"); // load Icon Library	
    sess.loadLibrary("itemCustomFields"); //IMPORTANT! for loading custom fields needed loaded library "itemCustomFields"
    sess.loadLibrary("itemProfileFields"); //IMPORTANT! for loading custom fields needed loaded library "itemProfileFields"
    sess.loadLibrary("unitDriveRankSettings");
    sess.loadLibrary("unitEvents");
    sess.loadLibrary("unitTripDetector");

    // var flags = wialon.util.Number.or(wialon.item.Item.dataFlag.base,  wialon.item.Unit.dataFlag.lastMessage, wialon.item.Item.dataFlag.customFields, wialon.item.Item.dataFlag.adminFields, wialon.item.Item.dataFlag.customProps, wialon.item.Item.dataFlag.guid, 256, 8388608, 131072, 524288, 8192);

    var flags = wialon.util.Number.or(wialon.item.Item.dataFlag.base,  wialon.item.Unit.dataFlag.lastMessage, wialon.item.Item.dataFlag.customFields, wialon.item.Item.dataFlag.adminFields, wialon.item.Item.dataFlag.customProps, wialon.item.Item.dataFlag.guid, 256, 8388608, 131072, 524288, 8192);

  
    sess.updateDataFlags( 
    [{type: "type", data: "avl_unit", flags: flags, mode: 0}], 
    function (code) { 
        console.log("codefu " + code);
        if (code) { console.log(wialon.core.Errors.getErrorText(code)); return; } 
        var units = sess.getItems("avl_unit");
        units = wialon.util.Helper.filterItems(units, wialon.item.Item.accessFlag.execReports);
        if (!units || !units.length){ console.log("Units not found"); return; } 
        console.log(units);
        var dt = $("#dsc-tbl").dataTable().api();
        // for (var i = 0; i< units.length; i++){ 
        //     var u = units[i]; 
            var u = units[2]; 
            var u_name = u.getName();
            var u_dets = getTransporterFromUnitName(u_name);
            var tp_id = u_dets["transporter"];
            var u_mileage = u.getMileageCounter();
            // var unit = {
            //     "row_id": 0,
            //     "tp_id": tp_id,
            //     "mileage": u_mileage,
            //     "u_name": u_name,
            //     "u_id": u.getId()
            // };
            // console.log("executing Report");
            // executeReport(unit);
            var res_id = sess.getCurrUser().getAccountId();
            var unit_id = u.getId();
            res_id = 15452548;
            unit_id = 14092777;
            console.log("res_id: " + res_id);
            console.log("unit_id : " + unit_id);
            var t_to = sess.getServerTime();
            var t_from = t_to - parseInt(604800, 10);
            t_from = 1521849600;
            t_to = 1529884740;
            console.log("t_to :" + t_to);
            console.log("t_from :" + t_from);
            var row_id = 0;

            var t_penalty = 0;
            var t_score  = 0;
            var d_name = "unknown";
            var d_lic = "unknown";
            var d_site_name = "unknown";
            var ovs_c = 0;
            var ovs_p = 0;
            var hacc_c = 0;
            var hacc_p = 0;
            var hbrk_c = 0;
            var hbrk_p = 0;
            var drt_m = 0;
            var drvt_p = 0;
            var rst_p = 0;
            var s_color = null;
            
            // General batch params
            var params = [
            {"svc": 'report/exec_report', "params":{"reportResourceId": res_id,"reportTemplateId": 48,"reportObjectId": unit_id,"reportObjectSecId":0,"interval": {"flags": 0,"from": t_from,"to": t_to}}},
            {"svc": "report/select_result_rows","params": {"tableIndex": 0,"config": {"type": 'range',"data": {"from": 0,"to": 0xFFFF,"level": 1,"rawValues": 1}}}}, 
            {"svc": "report/select_result_rows","params": {"tableIndex": 1,"config": {"type": 'range',"data": {"from": 0,"to": 0xFFFF,"level": 1,"rawValues": 1}}}},
            {"svc": "report/cleanup_result","params": {}}];

            //execute and process report
            wialon.core.Remote.getInstance().remoteCall('core/batch', params, function (code, obj) {
                console.log("obj outside");
                console.log(code);
                console.log(obj);
                console.log("obj out end");
                // if (code === 0 && obj && obj.length && obj.length == 4 && !('error' in obj[0]) && ('reportResult' in obj[0])) {
        
                if (code === 0 && obj && obj.length && !('error' in obj[0]) && ('reportResult' in obj[0]) && obj[0].reportResult.tables.length > 0) {
                    console.log("report successful see obj below");
                    console.log(obj);
                    if(!('error' in obj[1])){ // process Eco Driving parameters 
                        eco_rows = obj[1];
                        console.log("eco driving params");
                        for (var r=0; r < eco_rows.length; r++){
                            var violation = eco_rows[r].c[0].t;
                            console.log(violation);
                            if(violation == "Harsh Acceleration"){
                                hacc_c = eco_rows[r].c[2].t;
                                hacc_p = eco_rows[r].c[1].t;
                                t_penalty += parseInt(hacc_p);
                            }else if(violation == "Harsh Braking"){
                                hbrk_c = eco_rows[r].c[2].t;
                                hbrk_p = eco_rows[r].c[1].t;
                                t_penalty += parseInt(hbrk_p);
                            }
        
                        }
                    }
        
                    if(!('error' in obj[2])){ // process Over Speeding parameters 
                        ovs_rows = obj[2];
                        console.log("over speeding durations");
                        for (var v=0; v < ovs_rows.length; v++){
                            t_sec = timeToSeconds(ovs_rows[v].c[1].t);
                            console.log(t_sec);
                            ovs_c++;
                            ovs_p += parseInt(t_sec/60);
                            t_penalty += ovs_p;
                        }
                    }
        
                    t_score = Math.round((t_penalty/u_mileage)*100);
                    if(0 <= t_score <= 2 ) s_color="green";
                    else if(2 < t_score <= 5 ) s_color="yellow";
                    else if(t_score > 5) s_color="red";
                    
        
                    console.log("ovs count :" + ovs_c);
                    console.log("ovs pnalty :" + ovs_p);
                    console.log("hacc count :" + hacc_c);
                    console.log("hacc pnalty :" + hacc_p);
                    console.log("hbrk count :" + hbrk_c);
                    console.log("hbrk pnalty :" + hbrk_p);
                    console.log("total pnalty :" + t_penalty);
        
                    var dsc = {
                        "id": row_id+1,
                        "s_color": s_color,
                        "transporter_id":tp_id,
                        "drv_name": d_name,
                        "drv_lic": d_lic,
                        "tot_mileage": u_mileage.toLocaleString('en') ,
                        "site_name":d_site_name,
                        "hbrk_penalty": hbrk_p,
                        "hbrk_occur": hbrk_c,
                        "hacc_penalty": hacc_p,
                        "hacc_occur": hacc_c,
                        "ovs_penlty": ovs_p,
                        "ovs_duration": ovs_c,
                        "drvtime_penalty": drvt_p,
                        "drvtime_mins": drt_m,
                        "resting_penalty": rst_p,
                        "score": t_score
                    }
                    var dscTemp = _.template($("#dsc-data").html());
                    console.log("template here");
                    console.log(dscTemp);
                    dt.row.add($(dscTemp({"dsc": dsc})));
                    if(row_id == 0) dt.row(0).remove();
                    dt.draw();
                }
            });

        // end for loop for units}
    });
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
    console.log("in vlrReports");
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
                title: 'Drivers List Report',
                // modifier : {
                //     order : 'index', // 'current', 'applied',
                //     page : 'all', // 'all', 'current'
                //     search : 'none' // 'none', 'applied', 'removed'
                // },
                // exportOptions: {
                //     columns: [ 2, 3, 4, 5, 6, 7, 8]
                // }
            },
            'pdf', 
            'print',
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
                "targets": [ 5 ],
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
        // $(".picker-display", ".picker-fields ").hide();
        dlrReport();
    }else if(rTemp == "t-vlr"){
        console.log("in vlrTempsecton");
        // $(".picker-display", ".picker-fields").hide();
        vlrReport();
    }
    else if(rTemp == "t-dsc"){
        // $(".picker-display", ".picker-fields").show();
        dscReport();
    }
};

var onLoad = function(){
    // load wialon.js
	// var url = getHtmlVar("baseUrl") || getHtmlVar("hostUrl") || "https://hst-api.wialon.com";
    loadScript("https://hst-api.wialon.com/wsdk/script/wialon.js", initSdk);
    // initSdk();
   

    // loadReportTemplate("t-vlr");
    // vlrReport();
};


$(document).ready( function () {
        
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

    onLoad();

} );