var getDates = function(target){
    // sets the date of clicked/selected button
    minDate = null;
    maxDate = null
    if(target == "tDate"){
        minDate = maxDate = Date.today();
        target =  minDate.toString('dd.MM.yyyy');
    }else if (target == "yDate"){
        minDate = maxDate = Date.parse("yesterday");
        target =  minDate.toString('dd.MM.yyyy'); 
    }else if(target == "week"){

    }else if (target == "month"){

    }else if (target == "custom"){

    }
    $("#selDate").val(target);
    // alert("target is " + target); 
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
};

$(document).ready( function () {
    $('#myTable').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'csv', 'excel', 'pdf', 'print'
        ]
    } );


    //---Time Picker JS-----
    $("#fromDate").datepicker();
    $("#toDate").datepicker();

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