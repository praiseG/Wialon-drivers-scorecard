/// Global event handlers
var callbacks = {};

// Add more Error codes from Wialon Documentation
var errorCodes = {
    "1": "Invalid session",
    "2": "Invalid service name",
    "3": "Invalid result",
    "4": "Invalid input",
    "5": "Error performing request",
    "6": "Unknown error",
    "7": "Access denied",
    "8": "Invalid user name or password",
    "9": "Authorization server is unavailable",
    "10": "Reached limit of concurrent requests",
    "1001": "No messages for selected interval",
    "1003": "Only one request is allowed at the moment",
    "1004": "Limit of messages has been exceeded",
    "1005": "Execution time has exceeded the limit",
    "1011": "Your IP has changed or session has expired"
};

var timeToSeconds = function(hms_time){
    if(!hms_time) return;
    var t = hms_time.split(':');
    var seconds = (+t[0]) * 3600 + (+t[1]) * 60 + (+t[2]); 
    return seconds;
};

var strToDate = function(sdate, end_of_day){
    if(!sdate) return null;
    var s_date = sdate.split(".");
    if(end_of_day) return moment(s_date[2] + "-" + s_date[1] + "-" + s_date[0], "YYYY-MM-DD").endOf('day').format();
    return moment(s_date[2] + "-" + s_date[1] + "-" + s_date[0], "YYYY-MM-DD").startOf('day').format();
};

//Date/DtePicker functions
var showPickerFields = function(){
    //pick variables from cookie
    // 1-Setup Picker Fields, 2-Hide Picker Display, 3-Show Picker Fields
    var rDates = Cookies.getJSON("rDates");
    console.log(rDates);
    var fromDate = moment(rDates.fDate).format("DD.MM.YYYY");
    var toDate = moment(rDates.tDate).format("DD.MM.YYYY");
    //---Time Picker JS-----
    $("#fromDate").val(fromDate);
    $("#toDate").val(toDate);
    $("#fromDate").datepicker({'dateFormat': "dd.mm.yy", 'maxDate': "+1d"});
    $("#toDate").datepicker({'dateFormat': "dd.mm.yy", 'maxDate': "+1d"});
  
    $(".picker-display").hide();
    $(".picker-fields").show();
};

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
};

var setCookies =  function(k,v){
    ck = Cookies.get(k);
    if(ck != null){
        Cookies.remove(k)
    }
    Cookies.set(k,v);
};

var getDates = function(target){
    // sets the date &   type of clicked/selected button in a coookie
    setCookies("period", target);
    if(target == "tDate"){
        var minDate = moment().startOf('day');
        var maxDate = moment().endOf('day');
        var sDate = minDate.format("DD.MM.YYYY");
        setCookies("rDates", {fDate: minDate.format(), tDate: maxDate.format()});
        setCookies("selDates", sDate);
        showPickerDisplays(target,sDate);
    }else if (target == "yDate"){
        var minDate = moment().subtract(1, 'days').startOf('day');
        var maxDate = moment().subtract(1, 'days').endOf('day');
        var sDate =  minDate.format("DD.MM.YYYY");
        setCookies("rDates", {fDate: minDate.format(), tDate: maxDate.format()});
        setCookies("selDates", sDate);
        showPickerDisplays(target,sDate); 
    }else if(target == "wDate"){
        var minDate = moment().subtract(1, 'weeks').startOf('week');
        var maxDate = moment().subtract(1, 'weeks').endOf('week');
        var sDate = minDate.format("DD.MM.YYYY") + "-" + maxDate.format("DD.MM.YYYY");
        setCookies("rDates", {fDate: minDate.format(), tDate: maxDate.format()});
        setCookies("selDates", sDate);
        showPickerDisplays(target,sDate); 
    }else if (target == "mDate"){
        var minDate = moment().subtract(1, 'months').startOf('month');
        var maxDate = moment().subtract(1, 'months').endOf('month');
        var sDate = minDate.format("DD.MM.YYYY") + "-" + maxDate.format("DD.MM.YYYY");
        setCookies("rDates", {fDate: minDate.format(), tDate: maxDate.format()});
        setCookies("selDates", sDate);
        showPickerDisplays(target, sDate); 
    }else if (target == "cDate"){
        showPickerFields();
        Cookies.remove("selDates");
        // Cookies.remove("rDates");
    }
};

var getNextDate =  function(){
    // gets next date when right arrow/carret is clicked
    var active_tab = $("#dTargets label.active");
    var active_id = active_tab.children("input").prop("id");
    if(active_id == 'yDate'){
        var rDates = Cookies.getJSON("rDates");
        var minDate = moment(rDates.fDate).add(1, 'days');
        var maxDate = moment(rDates.tDate).add(1, 'days');
        var dToday = moment().startOf('day');
        var sDate = minDate.format("DD.MM.YYYY");
        setCookies("rDates", {fDate: minDate.format(), tDate: maxDate.format()});
        setCookies("selDates", sDate);
        showPickerDisplays(active_id,sDate);
        console.log("min = today;" + minDate + "=" + dToday);
        if(minDate.isSame(dToday)){
            active_tab.removeClass("active");
            $("#tDate").parent("label").addClass("active");
        }
    }else if(active_id == 'wDate'){
        var rDates = Cookies.getJSON("rDates");
        var tf = moment(rDates.fDate).add(1, 'weeks');
        var tt = moment(rDates.tDate).add(1, 'weeks');
        var dTEnd = moment().endOf('day');
        var dTStart = moment().startOf('day');
        console.log("tf tt:" + tf.format() + " " + tt.format() );
        if(tf.isBefore(dTStart) || tf.isSame(dTStart)){
            var minDate = tf;
            var maxDate = tt.isAfter(dTEnd) ? dTEnd : tt;
            var sDate = minDate.format("DD.MM.YYYY") + "-" + maxDate.format("DD.MM.YYYY");
            setCookies("rDates", {fDate: minDate.format(), tDate: maxDate.format()});
            setCookies("selDates", sDate);
            showPickerDisplays(active_id,sDate); 
        }
    }else if(active_id == 'mDate'){
        var rDates = Cookies.getJSON("rDates");
        var tf = moment(rDates.fDate).add(1, 'months').startOf('month');
        var tt = moment(rDates.tDate).add(1, 'months').endOf('month');
        var dTEnd = moment().endOf('day');
        var dTStart = moment().startOf('day');
        console.log("tf tt:" + tf.format() + " " + tt.format() );
        if(tf.isBefore(dTStart) || tf.isSame(dTStart)){
            var minDate = tf;
            var maxDate = tt.isAfter(dTEnd) ? dTEnd : tt;
            var sDate = minDate.format("DD.MM.YYYY") + "-" + maxDate.format("DD.MM.YYYY");
            setCookies("rDates", {fDate: minDate.format(), tDate: maxDate.format()});
            setCookies("selDates", sDate);
            showPickerDisplays(active_id,sDate); 
        }
    }
    console.log(active_id);
};

var getPrevDate =  function(){
    var active_tab = $("#dTargets label.active");
    var active_id = active_tab.children("input").prop("id");
    if(active_id == 'tDate'){
        var minDate = moment().subtract(1, 'days').startOf('day');
        var maxDate = moment().subtract(1, 'days').endOf('day');
        var sDate =  minDate.format("DD.MM.YYYY");
        setCookies("rDates", {fDate: minDate.format(), tDate: maxDate.format()});
        setCookies("selDates", sDate);
        showPickerDisplays(active_id,sDate); 
        active_tab.removeClass("active");
        $("#yDate").parent("label").addClass("active");
    }else if(active_id == 'yDate'){
        var rDates = Cookies.getJSON("rDates");
        var minDate = moment(rDates.fDate).subtract(1, 'days');
        var maxDate = moment(rDates.tDate).subtract(1, 'days');
        var sDate =  minDate.format("DD.MM.YYYY");
        setCookies("rDates", {fDate: minDate.format(), tDate: maxDate.format()});
        setCookies("selDates", sDate);
        showPickerDisplays(active_id,sDate);
        console.log("min to max " + minDate + " " + maxDate);
    }else if(active_id == 'wDate'){
        var rDates = Cookies.getJSON("rDates");
        var minDate = moment(rDates.fDate).subtract(1, 'weeks').startOf('week');
        var maxDate = moment(rDates.fDate).subtract(1, 'weeks').endOf('week');
        var sDate = minDate.format("DD.MM.YYYY") + "-" + maxDate.format("DD.MM.YYYY");
        setCookies("rDates", {fDate: minDate.format(), tDate: maxDate.format()});
        setCookies("selDates", sDate);
        showPickerDisplays(active_id,sDate); 
        console.log("min to max " + minDate + " " + maxDate);
    }else if(active_id == 'mDate'){
        var rDates = Cookies.getJSON("rDates");
        var minDate = moment(rDates.fDate).subtract(1, 'months').startOf('month');
        var maxDate = moment(rDates.fDate).subtract(1, 'months').endOf('month');
        var sDate = minDate.format("DD.MM.YYYY") + "-" + maxDate.format("DD.MM.YYYY");
        setCookies("rDates", {fDate: minDate.format(), tDate: maxDate.format()});
        setCookies("selDates", sDate);
        showPickerDisplays(active_id,sDate); 
        console.log("min to max " + minDate + " " + maxDate);
    }
    console.log(active_id);
};


var getDateInterval = function(){
    var rDates = Cookies.getJSON("rDates");
    if(!rDates) return null;
    var t_from = moment(rDates.fDate).unix();
    var t_to = moment(rDates.tDate).unix();
    console.log("intervals:fromDate : toDate =" + t_from + " ====" + t_to);
    return [t_from, t_to];
};

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


var getTransporterFromUnitName = function(unit_name){
    if(!unit_name) return;
    start = unit_name.indexOf("(");
    end = unit_name.indexOf(")");
    transporter = unit_name.slice(start+1, end);
    unit_license = unit_name.slice(0, start);
    return {"transporter":transporter, "unit_license": unit_license }
};

//Fetch all Units
var fetchUnitsRecur = function(u_grp){
    var sess = wialon.core.Session.getInstance();

    sess.loadLibrary("itemIcon");
    sess.loadLibrary("itemCustomFields");
    sess.loadLibrary("itemProfileFields"); 
    sess.loadLibrary("unitDriveRankSettings");
    sess.loadLibrary("unitEvents");
    sess.loadLibrary("unitTripDetector");
    sess.loadLibrary("unitSensors");
    

    var flags = wialon.util.Number.or(wialon.item.Item.dataFlag.base,  wialon.item.Unit.dataFlag.lastMessage, wialon.item.Unit.dataFlag.sensors, wialon.item.Item.dataFlag.customFields, wialon.item.Item.dataFlag.adminFields, wialon.item.Item.dataFlag.customProps, wialon.item.Item.dataFlag.guid, 256, 8388608, 131072, 524288, 8192, 4096, 1048576);
    
    sess.updateDataFlags( 
        [{type: "type", data: "avl_unit", flags: flags, mode: 0},
        {type: "type", data: "avl_unit_group", flags: flags, mode: 0}],
        function (code) { 
            console.log("codefu " + code);
            if (code) { console.log(wialon.core.Errors.getErrorText(code)); return; } 
            var units = sess.getItems("avl_unit");
            units = wialon.util.Helper.filterItems(units, wialon.item.Item.accessFlag.execReports);
            if (!units || !units.length){ console.log("Units not found"); return; } 
            console.log("units hereee orig");
            console.log(units);
            var dt = $("#vlr-tbl").dataTable().api();
            var a_units = [];
            var ug_html = "";
            if(u_grp){
                var grp = sess.getItem(u_grp);
                console.log("selected group item ");
                console.log(grp);
                if (!grp){ console.log("Selected Unit Groups not found"); return; }     
                var gunits = grp.getUnits();
                var gname = grp.getName();
                
                if(gunits.length){
                    console.log("looping through group units");
                    _.each(units,function(unt, index, list){
                        var id = unt.getId();
                        if(_.contains(gunits,id)) a_units.push(unt);
                    });
                }else{
                    dt.row(0).remove().draw();
                }
            }else{
                var unit_grps = sess.getItems("avl_unit_group");
                console.log("unit Groups");
                console.log(unit_grps);
                if (!unit_grps || !unit_grps.length){ console.log("No Unit Groups found"); return; } 
                ug_html += '<option class="select-option" id="" selected>All Units</option>';
                _.each(unit_grps,function(ug, index, list){
                    var gname = ug.getName();
                    // console.log(gname);
                    if(gname != "Camera Units"){
                        var gid = ug.getId();
                        var gunits = ug.getUnits();
                        ug_html += '<option class="select-option" id="'+ gid + '">' + gname +'</option>';
                    }
                    a_units = units;
                });
            }
            if(ug_html){
                $("#groups-list").empty();
                $("#groups-list").html(ug_html);
            }
            if(a_units.length){
                // for (var i = 0, p = 0; i< a_units.length; i++, p++){
                    console.log("inside a_u loop");
                var row_id = 0;
                var loadUnit = function (n){
                    if(n < a_units.length){
                        console.log("inside if1 ");
                        var u = a_units[n];
                        var u_name = u.getName();
                        // devType = u.getDeviceTypeId();
                        if(!(u_name.endsWith("(Cam)")) && !(u_name.endsWith("(Eco Driving)")) && !(u_name.startsWith("inspector.wiatag"))){
                            console.log("inside if2 ");
                            var igH = u.getMessageParams();
                            console.log("message params===" + u_name);
                            console.log(igH);
                            var t_to = sess.getServerTime();
                            var t_from = t_to - parseInt(604800, 10);

                                                  
                            var u_site_name = "unknown";
                            var u_site_id = "unknown";
                            var u_year = "unknown";
                            var u_make = "unknown";
                            var u_model ="unknown";
                            var u_vhl_vin = "unknown";
                            var  cusFields = _.values(u.getCustomFields());
                    
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
                            if(u_pos) u_time = wialon.util.DateTime.formatTime(u_pos.t);

                            var u_dets = getTransporterFromUnitName(u_name);
                            var tp_id = u_dets["transporter"];
                            var u_lic = u_dets["unit_license"];
                            var unit = {
                                "id": row_id++,
                                "icon_url": u.getIconUrl(32),
                                "transporter_id": tp_id, 
                                "license_number": u_lic, 
                                "vin": u_vhl_vin, 
                                "year_mke_model": u_year + "/" + u_make + "/" + u_model, 
                                "site_name": u_site_name, 
                                "site_id": u_site_id,
                                "ivms_id": u.getUniqueId(),
                                "last_gps_conn": u_time,
                                "last_trip_dt": u_time
                            };
                            var vhlTemp = _.template($("#vlr-data").html());
                            u.getIgnitionHistory(3, 1, t_to, 0, 'Ignition', function(code, data) {
                                if(code == 0 && !('error' in data))
                                console.log("ignition history" + u.getName());
                                console.log(code, data);
                                var igh = data[0];
                                console.log(igh);
                                dt.row.add($(vhlTemp({"vhl": unit})));
                                if(n == 0){dt.row(0).remove().draw();}else{dt.draw();}
                                loadUnit(n+1);
                            });
                            
                        }else {loadUnit(n+1);}//end if2

                    }//end if1
                }//end recur
                loadUnit(0);
            }
    });
};

//Fetch all Units
var fetchUnits = function(u_grp){
    var sess = wialon.core.Session.getInstance();

    sess.loadLibrary("itemIcon");
    sess.loadLibrary("itemCustomFields");
    sess.loadLibrary("itemProfileFields"); 
    sess.loadLibrary("unitDriveRankSettings");
    sess.loadLibrary("unitEvents");
    sess.loadLibrary("unitTripDetector");
    sess.loadLibrary("unitSensors");
    

    var flags = wialon.util.Number.or(wialon.item.Item.dataFlag.base,  wialon.item.Unit.dataFlag.lastMessage, wialon.item.Unit.dataFlag.sensors, wialon.item.Item.dataFlag.customFields, wialon.item.Item.dataFlag.adminFields, wialon.item.Item.dataFlag.customProps, wialon.item.Item.dataFlag.guid, 256, 8388608, 131072, 524288, 8192, 4096, 1048576);
    
    sess.updateDataFlags( 
        [{type: "type", data: "avl_unit", flags: flags, mode: 0},
        {type: "type", data: "avl_unit_group", flags: flags, mode: 0}],
        function (code) { 
            console.log("codefu " + code);
            if (code) { console.log(wialon.core.Errors.getErrorText(code)); return; } 
            var units = sess.getItems("avl_unit");
            units = wialon.util.Helper.filterItems(units, wialon.item.Item.accessFlag.execReports);
            if (!units || !units.length){ console.log("Units not found"); return; } 
            console.log("units hereee orig");
            console.log(units);
            var dt = $("#vlr-tbl").dataTable().api();
            var a_units = [];
            var ug_html = "";
            if(u_grp){
                var grp = sess.getItem(u_grp);
                console.log("selected group item ");
                console.log(grp);
                if (!grp){ console.log("Selected Unit Groups not found"); return; }     
                var gunits = grp.getUnits();
                var gname = grp.getName();
                
                if(gunits.length){
                    console.log("looping through group units");
                    _.each(units,function(unt, index, list){
                        var id = unt.getId();
                        if(_.contains(gunits,id)) a_units.push(unt);
                    });
                }else{
                    dt.row(0).remove().draw();
                }
            }else{
                var unit_grps = sess.getItems("avl_unit_group");
                console.log("unit Groups");
                console.log(unit_grps);
                if (!unit_grps || !unit_grps.length){ console.log("No Unit Groups found"); return; } 
                ug_html += '<option class="select-option" id="" selected>All Units</option>';
                _.each(unit_grps,function(ug, index, list){
                    var gname = ug.getName();
                    // console.log(gname);
                    if(gname != "Camera Units"){
                        var gid = ug.getId();
                        var gunits = ug.getUnits();
                        ug_html += '<option class="select-option" id="'+ gid + '">' + gname +'</option>';
                    }
                    a_units = units;
                });
            }
            if(ug_html){
                $("#groups-list").empty();
                $("#groups-list").html(ug_html);
            }
            if(a_units.length){
                for (var i = 0, p = 0; i< a_units.length; i++, p++){
                var u = a_units[i];
                var u_name = u.getName();
                // devType = u.getDeviceTypeId();
                if(u_name.endsWith("(Cam)") || u_name.endsWith("(Eco Driving)") || u_name.startsWith("inspector.wiatag")){ p--; continue;}
                // console.log(u);
                if(u.getTripsHistory()){
                    console.log("trips history here");
                    console.log(u.getTripsHistory());
                    console.log("trips hist here");
                }
                if(u.getCurrentTrip()){
                    console.log("trips here");
                    console.log(u.getCurrentTrip());
                    console.log("trips here");
                }
                // // var igH = u.getIgnitionHistory(1, 1527973200, 1530565200);
                // var igH = u.getMessageParams();
                // console.log("message params===" + u_name);
                // console.log(igH);
                var t_to = sess.getServerTime();
                var t_from = t_to - parseInt(604800, 10);
                (function(cln){
                    u = a_units[cln];
                    u.getIgnitionHistory(3, 3, t_to, 0, 'Ignition', function(error, result) {
                        console.log("ignition history" + u.getName());
                        console.log(error, result);
                    });
                })(i);
                // console.log("igH===");
                // console.log(igH);
                // console.log("driver activity");
                // console.log(u.getDriverActivitySettings());
                // console.log(u.getAdminFields());
                var u_site_name = "unknown";
                var u_site_id = "unknown";
                var u_year = "unknown";
                var u_make = "unknown";
                var u_model ="unknown";
                var u_vhl_vin = "unknown";
                var  cusFields = _.values(u.getCustomFields());
                // console.log("custom fields");
                // console.log(cusFields);
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
                    "id": p+1,
                    "icon_url": u.getIconUrl(32),
                    "transporter_id": tp_id, 
                    "license_number": u_lic, 
                    "vin": u_vhl_vin, 
                    "year_mke_model": u_year + "/" + u_make + "/" + u_model, 
                    "site_name": u_site_name, 
                    "site_id": u_site_id,
                    "ivms_id": u.getUniqueId(),
                    "last_gps_conn": u_time,
                    "last_trip_dt": u_time
                };
                var vhlTemp = _.template($("#vlr-data").html());
                dt.row.add($(vhlTemp({"vhl": unit})));
                }
                dt.row(0).remove().draw();
            }
    });
};

//Fetch All Drivers
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
            console.log("***************resource heres**********");
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

var loadUnitScoreCard = function(s_uid){
    console.log("score Unit: " + s_uid);
     // process the unit - // append results to new table and ---// display x on the element data ---// remove it from holder array---//remove progress rotation 
     var uQueue = JSON.parse(localStorage.getItem("unit_squeue"));
     var Qcounter = parseInt(localStorage.getItem("queue-counter"));
     var uid = s_uid;
     if(!uid && uQueue.length) uid = uQueue[0];
     if(uid){
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
                console.log("code  " + code);
                if (code) { console.log(wialon.core.Errors.getErrorText(code)); return; } 
                var u = sess.getItem(uid);
                console.log(u);
                if (!u){ console.log("Unit not found"); return; } 
               
                var dt = $("#dsc-tbl-single").dataTable().api();
                var res_id = sess.getCurrUser().getAccountId();
                res_id = 15452548;

                 //getset time interval
                var d_intervals = getDateInterval();
                var t_to = d_intervals[1];
                var t_from = d_intervals[0];
                console.log("t_to :" + t_to);
                console.log("t_from :" + t_from);

                var u_name = u.getName();
                var u_dets = getTransporterFromUnitName(u_name);
                var tp_id = u_dets["transporter"];
                var u_lic = u_dets["unit_license"];

                var t_penalty = 0;
                var t_score  = 0;
                var d_name = "unknown";
                var d_lic = "unknown";
                var u_site_name = "unknown";
                var ovs_c = "00:00:00";
                var ovs_p = 0;
                var hacc_c = 0;
                var hacc_p = 0;
                var hbrk_c = 0;
                var hbrk_p = 0;
                var drt_m = 0;
                var drvt_p = 0;
                var rst_p = 0;
                var s_color = null;
                var t_mileage = 0;

                var  cusFields = _.values(u.getCustomFields());
                // console.log("custom fields");
                // console.log(cusFields);
                if(_.size(cusFields) > 0){
                    _.each(cusFields,function(cField, index, list){
                    if(cField.n == "Site Name") u_site_name = cField.v;
                    });
                }

                // General batch params
                var params = [
                    {"svc": 'report/exec_report', "params":{"reportResourceId": res_id,"reportTemplateId": 48,"reportObjectId": uid,"reportObjectSecId":0,"interval": {"flags": 0,"from": t_from,"to": t_to}}},
                    {"svc": "report/select_result_rows","params": {"tableIndex": 0,"config": {"type": 'range',"data": {"from": 0,"to": 0xFFFF,"level": 1,"rawValues": 1}}}}, 
                    {"svc": "report/select_result_rows","params": {"tableIndex": 1,"config": {"type": 'range',"data": {"from": 0,"to": 0xFFFF,"level": 1,"rawValues": 1}}}},
                    {"svc": "report/select_result_rows","params": {"tableIndex": 2,"config": {"type": 'range',"data": {"from": 0,"to": 0xFFFF,"level": 1,"rawValues": 1}}}},
                    {"svc": "report/cleanup_result","params": {}}];
                
                //execute and process report
                wialon.core.Remote.getInstance().remoteCall('core/batch', params, function (code, obj) {
                    console.log("code obj: " + code);
                    console.log(obj);
                    if (code === 0 && obj && obj.length && !('error' in obj[0]) && ('reportResult' in obj[0]) && obj[0].reportResult.tables.length > 0) {
                        console.log("report successful see obj below");
                        console.log(obj); // process these results well
                        var r_tables = obj[0].reportResult.tables;
                        for (var q = 0; q < r_tables.length; q++ ){
                            if( (r_tables[q].name == "unit_ecodriving") && !('error' in obj[q+1])){ // process Eco Driving parameters 
                                var eco_rows = obj[q+1];
                                for (var r=0; r < eco_rows.length; r++){
                                    var violation = eco_rows[r].c[0].t;
                                    // console.log(violation);
                                    if(violation == "Harsh Acceleration"){
                                        hacc_c = eco_rows[r].c[3].t;
                                        hacc_p = eco_rows[r].c[2].t;
                                        t_penalty += parseInt(hacc_p);
                                    }else if(violation == "Harsh Braking"){
                                        hbrk_c = eco_rows[r].c[3].t;
                                        hbrk_p = eco_rows[r].c[2].t;
                                        t_penalty += parseInt(hbrk_p);
                                    }

                                    if((d_name == "unknown") && eco_rows[r].c[4].t){
                                        d_name = eco_rows[r].c[4].t;
                                    }
                                }
                                console.log("eco driving penalty total " + t_penalty);
                            }else if( (r_tables[q].name == "unit_speedings") && !('error' in obj[q+1])){ 
                                if((d_name == "unknown") && r_tables[q].total[1]){
                                    d_name = r_tables[q].total[1];
                                }
                                ovs_c = r_tables[q].total[0];
                                var t_sec = timeToSeconds(ovs_c);
                                ovs_p = Math.trunc(parseFloat(t_sec/60));;
                                t_penalty += ovs_p;
                                console.log("Speeding penalty total " + t_penalty);
                            }else if( (r_tables[q].name == "unit_trips") && !('error' in obj[q+1])){ // process Trips parameters 
                                var t_mil = (r_tables[q].total[0]).split(" ");
                                t_mileage = t_mil[0]; 
                                console.log("Total Mileage : " + t_mileage);
                            }
                        }
                        
                        t_score = Math.round((t_penalty/t_mileage)*100);
                        if(0 <= t_score && t_score <= 2 ){ s_color = "green";}
                        else if(2 < t_score && t_score <= 5 ){s_color = "yellow";}
                        else if(t_score > 5){ s_color = "red";}
                        
            
                        console.log("ovs count :" + ovs_c);
                        console.log("ovs pnalty :" + ovs_p);
                        console.log("hacc count :" + hacc_c);
                        console.log("hacc pnalty :" + hacc_p);
                        console.log("hbrk count :" + hbrk_c);
                        console.log("hbrk pnalty :" + hbrk_p);
                        console.log("total pnalty :" + t_penalty);
                        console.log("s_color ;" + s_color);
            
                        var dsc = {
                            "id": Qcounter,
                            "uid": uid,
                            "s_color": s_color,
                            "transporter_id":tp_id,
                            "drv_name": d_name,
                            "vehicle_license": u_lic,
                            "drv_lic": d_lic,
                            "tot_mileage": t_mileage.toLocaleString('en'),
                            "site_name":u_site_name,
                            "hbrk_penalty": hbrk_p,
                            "hbrk_occur": hbrk_c,
                            "hacc_penalty": hacc_p,
                            "hacc_occur": hacc_c,
                            "ovs_penlty": ovs_p.toLocaleString('en'),
                            "ovs_duration": ovs_c,
                            "drvtime_penalty": drvt_p,
                            "drvtime_mins": drt_m,
                            "resting_penalty": rst_p,
                            "score": t_score
                        }
                        var dscSTemp = _.template($("#dsc-data-single").html());
                        dt.row.add($(dscSTemp({"dsc": dsc})));
                        dt.draw();
                        $("#unit-list").find("#" + uid).children(".spinner-3d").hide();
                        uQueue = _.without(uQueue, uid);
                        localStorage.setItem("unit_squeue",JSON.stringify(uQueue));
                        localStorage.setItem("queue-counter",Qcounter+1);

                    }else if(code == 0 && obj[0].reportResult.tables.length == 0){
                        $("#unit-list").find("#" + uid).children(".spinner-3d").hide();
                        uQueue = _.without(uQueue, uid);
                        localStorage.setItem("unit_squeue",JSON.stringify(uQueue));
                        new PNotify({
                            text: 'No Data Found for Unit' + u_name,
                            type: 'error'
                        });
                    }else{
                        new PNotify({
                            title: 'Oh No',
                            text: errorCodes[code],
                            type: 'error'
                        });
                        // alert(errorCodes[code]);
                    }
                });
        });
     } 
};

var loadGroupScoreCard = function(resid, ugid, units){
    console.log("inside group report");
    console.log("res - gid :" + resid + " " + ugid);
    if(!resid || !ugid || !units){ console.log("no resource or ugidor units"); return;}
    console.log(units);
    var sess = wialon.core.Session.getInstance(); 
    sess.loadLibrary("resourceReports"); // load Reports Library

    var dt = $("#dsc-tbl").dataTable().api();
    var row_id = 1;
    //getset time interval
    var d_intervals = getDateInterval();
    var t_to = d_intervals[1];
    var t_from = d_intervals[0];
    console.log("intervals :" + t_to + " " + t_from);
    
    console.log("configs here");
    console.log(resid);
    console.log(ugid);
    console.log(t_from);
    console.log(t_to);


    var params=[{"svc": "report/exec_report", "params": {"reportResourceId": resid,"reportTemplateId": 49,"reportObjectId": ugid,"reportObjectSecId":0,"interval": {"flags": 0,"from": t_from,"to": t_to}}},{"svc": "report/select_result_rows", "params": {"tableIndex": 0,"config": {"type": "range","data": {"from": 0,"to": 0xFFFF,"level": 4,"rawValues": 0}}}},{"svc": "report/select_result_rows", "params": {"tableIndex": 1,"config": {"type": "range","data": {"from": 0,"to": 0xFFFF,"level": 4,"rawValues": 0}}}},{"svc": "report/select_result_rows", "params": {"tableIndex": 2,"config": {"type": "range","data": {"from": 0,"to": 0xFFFF,"level": 4,"rawValues": 0}}}},{"svc": "report/cleanup_result","params": {}}];

    //execute and process report
    wialon.core.Remote.getInstance().remoteCall('core/batch', params, function (code, obj) {
        console.
        log(code);
        console.log(obj);
        if (code === 0 && obj && obj.length && !('error' in obj[0]) && ('reportResult' in obj[0]) && obj[0].reportResult.tables.length > 0) {
            console.log("report successful");
            console.log(units);
            var z_scores = [];
            //run through each unit and check its vaue in the table
            for (var n = 0; n < units.length; n++){
                var unit = units[n];
                var t_penalty = 0;
                var t_score  = 0;
                var d_name = "unknown";
                var d_lic = "unknown";
                var u_lic = "unknown";
                var d_lic = "unknown";
                var tp_name = "unknown";
                var u_site_name = "unknown";
                var ovs_c = "00:00:00";
                var ovs_p = 0;
                var ovs_d = 0;
                var hacc_c = 0;
                var hacc_p = 0;
                var hbrk_c = 0;
                var hbrk_p = 0;
                var drt_m = 0;
                var drvt_p = 0;
                var rst_p = 0;
                var s_color = null;
                var t_mileage = 0;
                uf_name = unit.getName();
                // console.log("unit =>" + uf_name);
                var u_dets = getTransporterFromUnitName(uf_name);
                tp_name = u_dets["transporter"];
                u_lic = u_dets["unit_license"];

                var  cusFields = _.values(unit.getCustomFields());    
                if(_.size(cusFields) > 0){
                    _.each(cusFields,function(cField, index, list){
                    if(cField.n == "Site Name") u_site_name = cField.v;
                    });
                }
                //loop through all tables and get the unit scores
                r_tables = obj[0].reportResult.tables;
                for (var tb=0; tb < r_tables.length; tb++){
                    //process ecodriving violations
                    if((r_tables[tb].name == "unit_group_ecodriving") && !('error' in obj[tb+1])){
                        var eco_rows = obj[tb+1];
                        for (var rw=0; rw < eco_rows.length; rw++){
                            if(eco_rows[rw].c[0] == uf_name){
                                console.log("uf_name=" + uf_name);
                                var vlns = eco_rows[rw].r;
                                console.log(vlns);
                                for (var e=0; e < vlns.length; e++){
                                    if(vlns[e].c[1] == "Harsh Acceleration"){
                                        hacc_c += parseInt(vlns[e].c[3]);
                                        hacc_p += parseInt(vlns[e].c[2]);
                                    }else if(vlns[e].c[1] == "Harsh Braking"){
                                        hbrk_c += parseInt(vlns[e].c[3]);
                                        hbrk_p += parseInt(vlns[e].c[2]);
                                    }
                                    if((d_name == "unknown") && vlns[e].c[4]){
                                        d_name = vlns[e].c[4];
                                    }
                                }
                                t_penalty += hbrk_p + hacc_p;
                                console.log("t_pena eco:" + t_penalty);
                            }
                        }
                    }else if((r_tables[tb].name == "unit_group_speedings") && !('error' in obj[tb+1])){ //process speeding violations
                        var ovs_rows = obj[tb+1];
                        for (var rw=0; rw < ovs_rows.length; rw++){
                            if(ovs_rows[rw].c[0] == uf_name){
                                console.log("uf_name=" + uf_name);
                                ovs_c = ovs_rows[rw].c[1];
                                ovs_d = timeToSeconds(ovs_c);
                                ovs_p = Math.trunc(parseFloat(ovs_d/60));
                                t_penalty += ovs_p;
                                console.log("t_pena ovs:" + t_penalty);
                                if((d_name == "unknown") && ovs_rows[rw].c[2]){
                                    d_name = ovs_rows[rw].c[2];
                                }
                            }
                        }
                    }else if((r_tables[tb].name == "unit_group_trips") && !('error' in obj[tb+1])){//process driving/resting violations
                        var trp_rows = obj[tb+1];
                        for (var rw=0; rw < trp_rows.length; rw++){
                            if(trp_rows[rw].c[0] == uf_name){
                                var t_mil = (trp_rows[rw].c[1]).split(" ");
                                t_mileage = t_mil[0]; 
                                console.log("Total Mileage for unit : " + t_mileage);

                                if((d_name == "unknown") && trp_rows[rw].c[6]){
                                    d_name = trp_rows[rw].c[6];
                                }
                            }
                        }
                    }      
                }
                        
                if(!(hacc_c == 0 && hbrk_c == 0 && ovs_d == 0) && t_mileage != 0){
                    //load report
                    t_score = Math.round((t_penalty/t_mileage)*100);
                    if(0 <= t_score && t_score <= 2 ){ s_color = "green";}
                    else if(2 < t_score && t_score <= 5 ){s_color = "yellow";}
                    else if(t_score > 5){ s_color = "red";}
                        
                    console.log("ovs count :" + ovs_c);
                    console.log("ovs pnalty :" + ovs_p);
                    console.log("ovs secs :" + ovs_d);
                    console.log("hacc count :" + hacc_c);
                    console.log("hacc pnalty :" + hacc_p);
                    console.log("hbrk count :" + hbrk_c);
                    console.log("hbrk pnalty :" + hbrk_p);
                    console.log("total pnalty :" + t_penalty);
                    console.log("total mileage :" + t_mileage);
                    var dsc = {
                        "id": row_id++,
                        "s_color": s_color,
                        "transporter_id":tp_name,
                        "drv_name": d_name,
                        "drv_lic": d_lic,
                        "tot_mileage": t_mileage.toLocaleString('en') ,
                        "vehicle_license": u_lic,
                        "site_name":u_site_name,
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
                }else{
                    z_scores.push({
                        "s_color": "green",
                        "transporter_id":tp_name,
                        "drv_name": d_name,
                        "drv_lic": d_lic,
                        "tot_mileage": t_mileage.toLocaleString('en') ,
                        "vehicle_license": u_lic,
                        "site_name":u_site_name,
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
                    });
                }
            }
            if(z_scores.length > 0){
                _.each(z_scores, function(scr, index, list){
                    scr["id"] = row_id++;
                    var dscTemp = _.template($("#dsc-data").html());
                    dt.row.add($(dscTemp({"dsc": scr})));
                });
            }
            dt.row(0).remove().draw();
        }else if(code == 0 && obj[0].reportResult.tables.length == 0){
            new PNotify({
                text: 'No Data Found for Selected Interval',
                type: 'error'
            });
        }else{
            alert(errorCodes[code]);
        }

    });
};

var fetchScores = function(u_grp, interval_changed){
    var sess = wialon.core.Session.getInstance(); // get instance of current Session

    var res_flags = wialon.item.Item.dataFlag.base | wialon.item.Resource.dataFlag.reports;
	var unit_flags = wialon.util.Number.or(wialon.item.Item.dataFlag.base,  wialon.item.Unit.dataFlag.lastMessage, wialon.item.Item.dataFlag.customFields, wialon.item.Item.dataFlag.adminFields, wialon.item.Item.dataFlag.customProps, wialon.item.Item.dataFlag.guid, 256, 8388608, 131072, 524288, 8192);
	
    sess.loadLibrary("resourceReports"); // load Reports Library
    sess.loadLibrary("itemCustomFields");
    sess.loadLibrary("itemProfileFields"); 
	sess.updateDataFlags( // load items to current session
		[{type: "type", data: "avl_resource", flags:res_flags , mode: 0}, 
         {type: "type", data: "avl_unit", flags: unit_flags, mode: 0},
         {type: "type", data: "avl_unit_group", flags: unit_flags, mode: 0}], 
		function (code) { 
			if (code) { console.log(wialon.core.Errors.getErrorText(code)); return; } 

            var ress = sess.getItems("avl_resource");
            var units = sess.getItems("avl_unit");
            var units_nav = "";
            var lsug = []; 
            var ug_html = "";
            var ugrpt_id = null;
            var res_id = null;
            var t_units = 0;
            var dtu = $("#units-tbl").dataTable().api();
            var utbl_drawn = false;
            var a_units = [];

            if (!units || !units.length){ console.log("No Units found"); return; } 
            if (!ress || !ress.length){ console.log("No Resources found"); return; } 
            res_id = ress[0].getId();
            // res_id = 15452548;
            
            console.log("units");
            console.log(units);
            console.log("resources ==here");
            console.log(ress);
            // get the ug_resource from the resources list and store it in localStorage

            // get and store all drivers under this reource in localStorage
            // get all units under this account and store them in local storage for later reference
            // loop through all unit groups, store them and their units in localstorage and load them in their dropdown select
            // load only units from the .All units ug unit groupin the unit_ist
            // get and display only the scorecard report for only the .All units 

            console.log("group selected :" + u_grp);

            //---Action--------
            //populting unit groups and storing them and their units in localstorage
            console.log("a_units outside group loop");
            console.log(a_units);
            a_units = [];
            if(u_grp){
                console.log("a_units inside selected group");
                console.log(a_units);
                var grp = sess.getItem(u_grp);
                console.log("selected group item ");
                console.log(grp);
                if (!grp){ console.log("Selected Unit Groups not found"); return; }     
                ugrpt_id = u_grp;
                var gunits = grp.getUnits();
                var gname = grp.getName();
                // if(!interval_changed){
                console.log("looping through group units");
                _.each(units,function(unt, index, list){
                    var id = unt.getId();
                    if(_.contains(gunits,id)) a_units.push(unt);
                });
                // }
            }else{
                var unit_grps = sess.getItems("avl_unit_group");
                if (!unit_grps || !unit_grps.length){ console.log("No Unit Groups found"); return; }     
                console.log("unit_grps here");
                console.log (unit_grps);
                _.each(unit_grps,function(ug, index, list){
                    var gname = ug.getName();
                    var gunits = ug.getUnits();
                    // console.log(gname);
                    if(gname != "Camera Units" && gunits.length){
                        var gid = ug.getId();                       
                        if(gname == ".All Units (LH UG)"){ 
                            ugrpt_id = gid;
                            ug_html += '<option class="select-option" id="'+ gid + '" selected>' + gname +'</option>';
                            _.each(units,function(unt, index, list){
                                var id = unt.getId();
                                if(_.contains(gunits,id)) a_units.push(unt);
                            });
                        }else{
                            ug_html += '<option class="select-option" id="'+ gid + '">' + gname +'</option>';
                        }
                    }
                   
                });
            }
            if(ug_html){
                $("#groups-list").empty();
                $("#groups-list").html(ug_html);
            }

            if(a_units.length && !interval_changed){
                console.log("loading units html");
                //populting unit list and storing them in localstorage
                _.each(a_units,function(unt, index, list){
                    //  console.log("index " + index);
                    var uname = unt.getName();
                    if(!(uname.endsWith("(Cam)")) && !(uname.endsWith("(Eco Driving)")) && !(uname.startsWith("inspector.wiatag"))){
                        var uid = "" + unt.getId();
                        var uTmpl = _.template($("#u-list-data").html());
                        dtu.row.add($(uTmpl({"unt": {"uid": uid, "uname": uname}})));
                        if(!utbl_drawn) utbl_drawn = true;
                        dtu.draw();
                    }
                });
                if(utbl_drawn){
                    dtu.row(0).remove().draw();
                    utbl_drawn = false;
                }
            }
            
            console.log("loding report now");
            loadGroupScoreCard(res_id, ugrpt_id, a_units);
        });
};

var getDriverScoreFactors = function(){
    console.log("in Driver Score Card");
    var sess = wialon.core.Session.getInstance(); 

    sess.loadLibrary("itemIcon");
    sess.loadLibrary("itemCustomFields");
    sess.loadLibrary("itemProfileFields");
    sess.loadLibrary("unitDriveRankSettings");
    sess.loadLibrary("unitEvents");
    sess.loadLibrary("unitTripDetector");

    var flags = wialon.util.Number.or(wialon.item.Item.dataFlag.base,  wialon.item.Unit.dataFlag.lastMessage, wialon.item.Item.dataFlag.customFields, wialon.item.Item.dataFlag.adminFields, wialon.item.Item.dataFlag.customProps, wialon.item.Item.dataFlag.guid, 256, 8388608, 131072, 524288, 8192);

    //getset time interval
    var d_intervals = getDateInterval();

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
        var res_id = sess.getCurrUser().getAccountId();
        res_id = 15452548;
        // for (var i = 0, p = 0; i< units.length; i++){ 
        //     (function(i){
        var calculateScores = function(i){
            console.log("inside ca scores");
            if(i < units.length){
                var u = units[i]; 
                // var u = units[2]; 
                var u_name = u.getName();
                console.log("unit =========================" + u_name);
                if(!(u_name.endsWith("(Cam)"))){ 
                    var u_dets = getTransporterFromUnitName(u_name);
                    var tp_id = u_dets["transporter"];
                    var u_lic = u_dets["unit_license"];
                    var u_mileage = u.getMileageCounter();
                   
                    var unit_id = u.getId();
                    // console.log("res_id: " + res_id);
                    // console.log("unit_id : " + unit_id);
                    // var t_to = sess.getServerTime();
                    // var t_from = t_to - parseInt(604800, 10);
                    var t_to = d_intervals[1];
                    var t_from = d_intervals[0];
                    // t_from = 1521849600;
                    // t_to = 1529884740;
                    console.log("t_to :" + t_to);
                    console.log("t_from :" + t_from);

                    var t_penalty = 0;
                    var t_score  = 0;
                    var d_name = "unknown";
                    var d_lic = "unknown";
                    var u_site_name = "unknown";
                    var ovs_c = "00:00:00";
                    var ovs_p = 0;
                    var hacc_c = 0;
                    var hacc_p = 0;
                    var hbrk_c = 0;
                    var hbrk_p = 0;
                    var drt_m = 0;
                    var drvt_p = 0;
                    var rst_p = 0;
                    var s_color = null;
                    var t_mileage = 0;

                    var  cusFields = _.values(u.getCustomFields());
                    // console.log("custom fields");
                    // console.log(cusFields);
                    if(_.size(cusFields) > 0){
                        _.each(cusFields,function(cField, index, list){
                        if(cField.n == "Site Name") u_site_name = cField.v;
                        else if(cField.n == "Driver License ID") d_lic = cField.v;
                        });
                    }
                    
                    // General batch params
                    var params = [
                    {"svc": 'report/exec_report', "params":{"reportResourceId": res_id,"reportTemplateId": 48,"reportObjectId": unit_id,"reportObjectSecId":0,"interval": {"flags": 0,"from": t_from,"to": t_to}}},
                    {"svc": "report/select_result_rows","params": {"tableIndex": 0,"config": {"type": 'range',"data": {"from": 0,"to": 0xFFFF,"level": 1,"rawValues": 1}}}}, 
                    {"svc": "report/select_result_rows","params": {"tableIndex": 1,"config": {"type": 'range',"data": {"from": 0,"to": 0xFFFF,"level": 1,"rawValues": 1}}}},
                    {"svc": "report/select_result_rows","params": {"tableIndex": 2,"config": {"type": 'range',"data": {"from": 0,"to": 0xFFFF,"level": 1,"rawValues": 1}}}},
                    {"svc": "report/cleanup_result","params": {}}];

                    //execute and process report
                    wialon.core.Remote.getInstance().remoteCall('core/batch', params, function (code, obj) {
                        console.log("code remote: " + code);
                        console.log(obj);
                        if (code === 0 && obj && obj.length && !('error' in obj[0]) && ('reportResult' in obj[0]) && obj[0].reportResult.tables.length > 0) {
                            console.log("report successful see obj below");
                            console.log(obj); // process these results well
                            var r_tables = obj[0].reportResult.tables;
                            for (var q = 0; q < r_tables.length; q++ ){
                                if( (r_tables[q].name == "unit_ecodriving") && !('error' in obj[q+1])){ // process Eco Driving parameters 
                                    var eco_rows = obj[q+1];
                                    for (var r=0; r < eco_rows.length; r++){
                                        var violation = eco_rows[r].c[0].t;
                                        // console.log(violation);
                                        if(violation == "Harsh Acceleration"){
                                            hacc_c = eco_rows[r].c[2].t;
                                            hacc_p = eco_rows[r].c[1].t;
                                            t_penalty += parseInt(hacc_p);
                                        }else if(violation == "Harsh Braking"){
                                            hbrk_c = eco_rows[r].c[2].t;
                                            hbrk_p = eco_rows[r].c[1].t;
                                            t_penalty += parseInt(hbrk_p);
                                        }

                                        if((d_name == "unknown") && eco_rows[r].c[3].t){
                                            d_name = ovs_rows[r].c[3].t;
                                        }
                                    }
                                    console.log("eco driving penalty total " + t_penalty);
                                }else if( (r_tables[q].name == "unit_speedings") && !('error' in obj[q+1])){ // process Over Speeding parameters 
                                    // var ovs_rows = obj[q+1];
                                    // var t_sec = 0;
                                    // // console.log("over speeding durations");
                                    // for (var v=0; v < ovs_rows.length; v++){
                                    //     var u_dur = ovs_rows[v].c[1].t;
                                    //     t_sec += timeToSeconds(u_dur);
                                    //     // console.log(t_sec);
                                    //     // ovs_c++;
                                    // }
                                    // ovs_p += parseInt(t_sec/60);
                                    // t_penalty += ovs_p;
                                    // ovs_c = (new Date).clearTime().addSeconds(t_sec).toString('H:mm:ss');
                                    var ovs_rows = obj[q+1];
                                    for (var v=0; v < ovs_rows.length; v++){
                                        if((d_name == "unknown") && ovs_rows[v].c[1].t){
                                            d_name = ovs_rows[v].c[1].t;
                                            break;
                                        }
                                    }
                                    ovs_c = r_tables[q].total[0];
                                    var t_sec = timeToSeconds(ovs_c);
                                    ovs_p += Math.trunc(parseFloat(t_sec/60));;
                                    t_penalty += ovs_p;
                                    console.log("Speeding penalty total " + t_penalty);
                                }else if( (r_tables[q].name == "unit_trips") && !('error' in obj[q+1])){ // process Trips parameters 
                                    var t_mil = (r_tables[q].total[0]).split(" ");
                                    t_mileage = t_mil[0]; 
                                    console.log("Total Mileage : " + t_mileage);
                                }
                            }
                            
                            t_score = Math.round((t_penalty/t_mileage)*100);
                            if(0 <= t_score && t_score <= 2 ){ s_color = "green";}
                            else if(2 < t_score && t_score <= 5 ){s_color = "yellow";}
                            else if(t_score > 5){ s_color = "red";}
                            
                
                            console.log("ovs count :" + ovs_c);
                            console.log("ovs pnalty :" + ovs_p);
                            console.log("hacc count :" + hacc_c);
                            console.log("hacc pnalty :" + hacc_p);
                            console.log("hbrk count :" + hbrk_c);
                            console.log("hbrk pnalty :" + hbrk_p);
                            console.log("total pnalty :" + t_penalty);
                            console.log("s_color ;" + s_color);
                
                            var dsc = {
                                "id": i+1,
                                "s_color": s_color,
                                "transporter_id":tp_id,
                                "drv_name": d_name,
                                "vehicle_license": u_lic,
                                "drv_lic": d_lic,
                                "tot_mileage": t_mileage.toLocaleString('en'),
                                "site_name":u_site_name,
                                "hbrk_penalty": hbrk_p,
                                "hbrk_occur": hbrk_c,
                                "hacc_penalty": hacc_p,
                                "hacc_occur": hacc_c,
                                "ovs_penlty": ovs_p.toLocaleString('en'),
                                "ovs_duration": ovs_c,
                                "drvtime_penalty": drvt_p,
                                "drvtime_mins": drt_m,
                                "resting_penalty": rst_p,
                                "score": t_score
                            }
                            var dscTemp = _.template($("#dsc-data").html());
                            dt.row.add($(dscTemp({"dsc": dsc})));
                            if(i==0) dt.row(0).remove();
                            dt.draw();
                            // p++;
                        } //end of if
                        calculateScores(i+1);
                    });
                }else{ 
                    // p--; 
                    calculateScores(i+1);
                }
            }
        };   
        //     })(i) //end of closure
        // }// end of forloop
        // dt.row(0).remove().draw();
        calculateScores(0);
    });
};

var vlrReport = function(gid){
    var cTitles = _.template($("#vlr-cols").html());
    $(".date-displays").hide();
    $("#unit-groups").show();
    $("#rpt-table, #unit-list, #unit-scores" ).empty();
    $("#rpt-table").html(cTitles);
    $('#vlr-tbl').DataTable( {
        "pageLength": 12,
        "language": {
            "emptyTable": "No Units Found",
            "search": "_INPUT_",
            "searchPlaceholder": "Search..."
          },
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
    fetchUnits(gid);
    // fetchUnitsRecur(gid);QV7337997528
};

var dlrReport = function(){
    var cTitles = _.template($("#dlr-cols").html());
    $(".date-displays").hide();
    $("#unit-groups").hide();
    $("#rpt-table, #unit-list, #unit-scores" ).empty();
    $("#rpt-table").html(cTitles);
    $('#dlr-tbl').DataTable( {
        "pageLength": 12,
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
        ],
        "language": {
            "search": "_INPUT_",
            "searchPlaceholder": "Search..."
        }
    });

    fetchDrivers();
};

var dscReport = function(gid, interval_changed){
    var cTitles = _.template($("#dsc-cols").html());
    $(".date-displays").show();
    $(".picker-fields").hide();
    // $("#groups-list").empty();
    $("#unit-groups").show();
    $("#rpt-table").empty();
    $("#unit-score").empty();
    if(!interval_changed){
        var uTitles = _.template($("#u-list-cols").html());
        $("#unit-list").empty();
        $("#unit-list").html(uTitles);
        $('#units-tbl').DataTable({
            "scrollY":   "350px",
            "scrollCollapse": true,
            "paging":         false,
            "language": {
                "search": "_INPUT_",
                "searchPlaceholder": "Search..."
            }
        });
    }
    $("#unit-scores").html(cTitles);
    $('#dsc-tbl').DataTable({
        "language": {
            "emptyTable": "No data available for selected interval"
          },
        dom: 'Bfrtip',
        buttons: [
            'csv', 
            {
                extend: 'excelHtml5',
                title: 'Drivers Score Card',
                exportOptions: {
                    columns: ':visible'
                }
            },
            'pdf', 
            'print',
            'colvis'
        ],
        "language": {
            "search": "_INPUT_",
            "searchPlaceholder": "Search..."
        }
        // "columnDefs": [
        //     {
        //         "targets": [ 3 ],
        //         "visible": false,
        //         "searchable": false
        //     },
        //     {
        //         "targets": [ 5 ],
        //         "visible": false
        //     }
        // ]
    });
  
    fetchScores(gid, interval_changed);

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
};

var loadActiveReport = function(){
    var rTmp = Cookies.get("sTemp");
    var gid = parseInt($("#groups-list").find(":selected").prop('id'));
    console.log("selected report:" + rTmp);
    console.log(gid);
    if(rTmp == "t-dsc"){
        dscReport(gid, true);
    } 
};

var login = function(code){
    console.log("Code: " + code);
    if(code){
      alert("Login Error");
      return;
    }
    var username = wialon.core.Session.getInstance().getCurrUser().getName();
    document.getElementById("username").innerHTML = username;

    // get Driver scorecrd report by default
    window.setTimeout(function(){ $("#rTemplates").val("Drivers_Score_Card").trigger('change');}, 2000);
    // window.setTimeout(function(){ $("#rTemplates").val("Vehicles_List_Report").trigger('change');}, 2000);
    
    window.onbeforeunload = function () {
		wialon.core.Session.getInstance().logout();
	};
    
};
  
var initSdk = function(){
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
};

var onLoad = function(){
    // load wialon.js
	// var url = getHtmlVar("baseUrl") || getHtmlVar("hostUrl") || "https://hst-api.wialon.com";
    loadScript("https://hst-api.wialon.com/wsdk/script/wialon.js", initSdk);

};


$(document).ready( function () {
    localStorage.removeItem("unit_squeue");
    localStorage.removeItem("queue-counter");
    moment.tz.setDefault("Africa/Kampala");

    var aTarget = $(".active").children("input").prop("id");
    getDates(aTarget);
    //--Get Dates/ranges of clicked period buttons and display them accordingly
    $("#dTargets label").on('click',function(){
        var target = $(this).children("input").prop("id");
        getDates(target);
        //load selected report template with new date interval
        // if(target != "cDate") loadActiveReport();
    });

    $("#rTemplates").change(function(){
        var rTmp = $(this).find(":selected");
        var sTitle= rTmp.text();
        var sTemp = rTmp.prop('id');
        $("#reportTitle").text(sTitle);
        setCookies("sTemp", sTemp);
        loadReportTemplate(sTemp);
    });

    $("#groups-list").change(function(){
        var gid = parseInt($(this).find(":selected").prop('id'));
        console.log("gid after parse");
        console.log(gid);
        var rTmp = $("#rTemplates").find(":selected").prop('value');
        // alert("group list changed at :" + gid + "-" + rTmp);
        if(rTmp == "Drivers_Score_Card") {
            dscReport(gid);    
        }else if (rTmp == "Vehicles_List_Report") {
            vlrReport(gid);
        }
    });

    $("#cusBtn").click(function(){
        var t_from = $("#fromDate").val();
        var t_to = $("#toDate").val();
        if(!t_from || !t_to) alert("Select fromDate and toDate");
        var minDate = strToDate(t_from);
        var maxDate = strToDate(t_to,true);
        setCookies("rDates", {fDate: minDate, tDate: maxDate});
        console.log("t_from + t_to : " + minDate + " " + maxDate);
        // getDateInterval();
        //load report of selected/active template  and active unit group if its  vlr or dsc
        loadActiveReport();
    });

    $("#dBtn").click(function(){     
        loadActiveReport();
    });

    $("#nextDate").click(function(){     
        getNextDate();
    });

    $("#prevDate").click(function(){     
        getPrevDate();
    });

    $("#unit-list").on("click", ".units-arrow", function(){
        var id = parseInt($(this).parent("td").prop("id"));
        console.log("selected id:fa-id" + id );
        $(this).hide(); //disable/remove the arrow
        $(this).siblings("span").show(); //show progress rotation/spinner
        if(!($("#dsc-tbl-single").length)){  // Empty the unit-scores and Load new Datatable for individual scores
            console.log("initialised here");
            $("#unit-scores").empty();
            var uTitles = _.template($("#dsc-cols-single").html());
            $("#unit-scores").html(uTitles);
            $("#dsc-tbl-single").DataTable( {
                "language": {
                    "emptyTable": "Loading Data..",
                    "search": "_INPUT_",
                    "searchPlaceholder": "Search..."
                },
                dom: 'Bfrtip',
                buttons: [
                    'csv', 
                    {
                        extend: 'excelHtml5',
                        title: 'Drivers Score Card',
                        exportOptions: {
                            columns: ':visible'
                        }
                    },
                    'pdf', 
                    'print',
                    'colvis'
                ]
            });
        }
        // if unitQueueArray doesnt exist in local storage- create it
        if(!localStorage.getItem("unit_squeue")) {
            localStorage.setItem("unit_squeue",JSON.stringify([]));
            localStorage.setItem("queue-counter",1);
        }
        var uQueue = JSON.parse(localStorage.getItem("unit_squeue"));

        // acheck if the processqueueArray is empty : if yes, add it to the array and proceed to score else add it to the process array.
        uQueue.push(id);
        localStorage.setItem("unit_squeue",JSON.stringify(uQueue));
              
        console.log("uQueue =====");
        console.log(uQueue);

        if(uQueue.length == 1) loadUnitScoreCard(id);
    });

    $("#unit-scores").on("click", ".remove-u", function(){
        var row_id = parseInt($(this).closest("tr").index());
        var uid = parseInt($(this).closest("tr").prop("id"));
        var dt = $("#dsc-tbl-single").dataTable().api();
        console.log("you clicked row id :" + row_id);
        if(typeof row_id !== "undefined"){
            dt.row(row_id).remove().draw();
            $("#unit-list").find("#"+uid).children(".units-arrow").show();
        }

    });
    onLoad();

} );