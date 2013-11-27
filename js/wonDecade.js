var actualTracking;

function obtainQuery(trackingNumber) {

	var producto = "";
	var pais = "AR";
	var action = "oidn";
	var startString = trackingNumber.substring(0, 2).toUpperCase();

	var ondnp = new Array("CU", "SU", "EU", "PU");
	var ondnc = new Array("CC", "CD", "CL", "CM", "CO", "CP", "DE", "DI", "EC",
						  "EE", "EO", "EP", "GC", "GD", "GE", "GF", "GO", "GR", "GS", "IN",
						  "IS", "JP", "OL", "PP", "RD", "RR", "SL", "SP", "SR", "ST", "TC",
						  "TL", "UP");
	var ondi = new Array("EE", "CX", "RR", "XP", "XX", "XR");

	if ($.inArray(startString, ondnp) >= 0) {
		action = "ondnp";
	} else {
		if ($.inArray(startString, ondnc) >= 0) {
			action = "ondnc";
			producto = trackingNumber.substring(0,2);
			pais =  trackingNumber.substring(trackingNumber.length-2,trackingNumber.length);
		}else { 
			if ($.inArray(startString, ondi) >= 0) {
				action = "ondi";
			}else{ 
				//Si es todo numeros
				if (/^\d+$/.test(trackingNumber)) {
					// FIXME ACA puede ser onpa y ondng
				}
			}
		}
	}
	
	
	var query = {
		id : trackingNumber,
		action : action,
		producto: producto,
		pais : pais
	};

	return query;
}

function parseResult(result) {
	
	result = $.trim(result);
	
	var scriptIndex = result.indexOf("<script");
	result = result.substring(0, scriptIndex);
	result = result.replace("alert-info", "alert-danger");
	result = result.replace("badge", "label label-success");
	result = result.replace('<a class="close" data-dismiss="alert">&times;</a>','');
	
	result = result.replace('<button class="span3 btn" onclick="PrintElem(','');
	result = result.replace("'resultado')","");
	result = result.replace('">Imprimir</button>','');
	
	return result;
}

function swingOnDecade() {
	$('#decadeSwing').show();
}

function swingOffDecade() {
	$('#decadeSwing').hide();
}

function errorAlert(message){
	var alertError = $("<div />").addClass("bs-callout bs-callout-danger");
		alertError.append($("<h4 />").html("Error en la consulta"));
		alertError.append($("<p />").html(message));
	$("#decadeResults").html(alertError);

}

function infoAlert(message){
	var alertInfo = $("<div />").addClass("bs-callout bs-callout-info");
		alertInfo.append($("<button />").addClass("close ganar-decada-affix-a-remove").attr('title','Dejar de seguir').html("&times;"));
		alertInfo.append($("<h4 />").html("Encontramos tu paquete =)"));
		alertInfo.append($("<p />").html(message));
	$("#decadeResults").html(alertInfo);

}

function swingCfk(){
    errorAlert('Esto significa que el servidor del Correo no nos di&oacute; una respuesta; generalmente debido a la insuficiencia de recursos, no puede atender tantas consultas.'+
    		   '<br /> <strong>No desesperes</strong>, es frecuente que Correo Argentino peque por no brindar el servicio. <br /> Intent&aacute; las veces que quieras hasta que funcione.-'+
    		   '<br /> <br /> Adem&aacute;s, puede ser que el n&uacute;mero que ingresaste o bien no existe, o todav&iacute;a no ha impactado en los servidores');
    $("#decadeResults").append($("<img />").addClass("img-circle img-responsive").attr("src","img/error.jpeg"));
}

function parseTrackingNumber(trackingNumber){
	trackingNumber = $.trim(trackingNumber);

	trackingNumber = trackingNumber.replace(/#/gi,"");
	trackingNumber = trackingNumber.replace(/\(/gi,"");
	trackingNumber = trackingNumber.replace(/\)/gi,"");
	trackingNumber = trackingNumber.replace(/\s/g, "");
	
	return trackingNumber;
}

function doTheDecade(trackingNumber) {
	
	trackingNumber = parseTrackingNumber(trackingNumber);
	
	if (trackingNumber != ""){
		var query = obtainQuery(trackingNumber);
		
		history.pushState({}, "Intentando hacer trabajar al Correo...", "?id="+trackingNumber);

		$('.ganar-decada-affix-li').each(function(){$(this).removeClass("active");});

		saveTrackingToLocalStorate(trackingNumber);
		swingOnDecade();
		
		$('.ganar-decada').closest('fieldset').attr('disabled', 'true');

		var label = getTrackingLabel(trackingNumber);
		
		//Limpio el modal
		$("#descripcion").val('');
		
		$("#decadeResults").html('');
		
		$.get("action/caQuery.php", query)
				.done(function(data) {
					data = parseResult(data);
					if (!dataValid(data)){
						swingCfk();
						removeSavedTracking(trackingNumber);
					}else{
						try {
							infoAlert("Ac&aacute; ten&eacute;s el resultado de tus env&iacute;os");
							$("#decadeResults").append(data);
							actualTracking = trackingNumber;
							if ( (!label) || (label.length == 0) ){
								$("#descripcionModal").modal('show');
								$("#description").focus();
							}
						} catch (e) {
							swingCfk();
						}
					}
				})
				.fail(function(data) {
					swingCfk();
					removeSavedTracking(trackingNumber);
				})
				.always(function(data) {
					swingOffDecade();
					$('.ganar-decada').closest('fieldset').removeAttr('disabled');
					buildTrackingAffixList();
				});
	}
	return false;
}


function dataValid(data){
	var status = true;
	
	var index_no_result = data.indexOf("No se encontraron resultados");
	
	status = status && (data != "") && (index_no_result == -1);
	
	return status;
}


function buildTrackingAffixList(){
	var actualTrackingsArray = getSavedTrackingsAsArray();
	
	$('.ganar-decada-affix-a-remove').unbind("click");
	
	if (actualTrackingsArray.length > 0){
		var affixUl = $("#usedTrackingList").find('ul');
		$(affixUl).html('');
		for (var i=0; i< actualTrackingsArray.length; i++){
			addTrackingToAffixList(actualTrackingsArray[i]);
		}
	}else{
		$("#usedTrackingList").hide();
	}
	

	$('.ganar-decada-affix').on("click",function(){
		var text = $(this).clone().children().remove().end().text();

		$("#decadeQueryValue").val(text);
		$("#wonDecadeForm").submit();
	});

	$('.ganar-decada-affix-a-remove').on("click",function(){
		removeSavedTrackingAlert(actualTracking);
		$(this).find('li').remove();
		window.location.href = HOST_ADDRESS;
	});	
	
	
	try{
		$("#dgTracking"+actualTracking).parents('li').addClass("active");
	}
	catch(e){
		//Do nothing
	}
	
	
}

function removeSavedTrackingAlert(trackingNumber){
	var confirmed = confirm("Borrar este tracking?");
	
	if (confirmed == true){
		removeSavedTracking(trackingNumber);
		buildTrackingAffixList();
	}

}


function addTrackingToAffixList(trackingNumber, active){
	var affixUl = $("#usedTrackingList").find('ul');
	$("#usedTrackingList").show();

	if ($("#dgTracking"+trackingNumber).length == 0){
		var item = $("<a />").attr("id","dgTracking"+trackingNumber);
		var activeClass="";
		
		item.attr('href','#');
		item.addClass('ganar-decada ganar-decada-affix');
		item.html(trackingNumber);
		
		if (active){
			activeClass = "active";
		}
		
		var trackingLabel = getTrackingLabel(trackingNumber);
		if (trackingLabel){
			item.attr("title",trackingLabel);
			var label = $("<code />").addClass("block").text(trackingLabel);
			item.append(label);
		}
		
		affixUl.append($('<li />').addClass('ganar-decada-affix-li'+" "+activeClass).append(item));
	}else{
		if (active){
			$("#dgTracking"+trackingNumber).parents('li').addClass("active");
		}
	}
}


function trackingExists(trackingNumber){
	var actualTrackings = getSavedTrackings();
	
	var result = false;
	
	if (actualTrackings){
		result = actualTrackings.indexOf(trackingNumber) != -1;
	}

	return result;
	
}

function saveTrackingToLocalStorate(trackingNumber){
	
	var actualTrackings = getSavedTrackings();
	if (actualTrackings){
		if (!trackingExists(trackingNumber)){
			if (Modernizr.localstorage) {
				localStorage["dgTrackingNumbers"] = actualTrackings+","+trackingNumber;
			}else{
				document.cookie = "dgTrackingNumbers="+getCookieData("dgTrackingNumbers")+","+trackingNumber;
			}
		}
	}else{
		if (Modernizr.localstorage){
			localStorage["dgTrackingNumbers"] = ","+trackingNumber;
		}else{
			document.cookie = "dgTrackingNumbers="+","+trackingNumber;
		}
		
	}
	addTrackingToAffixList(trackingNumber,true);
	
	return true;
}

function getSavedTrackings(){
	if (Modernizr.localstorage) {
		return localStorage["dgTrackingNumbers"];
	}else{
		return getCookieData("dgTrackingNumbers");
	}
}

function removeSavedTracking(trackingNumber){
	
	var actualTrackings = getSavedTrackings();
	
	if (Modernizr.localstorage) {
		localStorage["dgTrackingNumbers"] = actualTrackings.replace(","+trackingNumber, ""); 
		localStorage.removeItem(trackingNumber);
	}else{
		//Cookie
		document.cookie = "dgTrackingNumbers=" + getCookieData("dgTrackingNumbers").replace(","+trackingNumber, ""); 
		delete_cookie(trackingNumber);
	}
	
	if (getSavedTrackingsAsArray().length == 0){
		$("#usedTrackingList").hide();
	}
}

function getSavedTrackingsAsArray(){
	var actualTrackings = getSavedTrackings();
	var trackingNumbersArray = [];
	
	if (actualTrackings){
		trackingNumbersArray = actualTrackings.split(",");
	}
	
	return trackingNumbersArray;
}


function saveTrackingLabel(trackingNumber, value){
	value = $.trim(value);
	if (Modernizr.localstorage) {
		localStorage[trackingNumber] = value;
	}else{
		document.cookie = trackingNumber + "=" + value;
	}
	buildTrackingAffixList();
}

function getTrackingLabel(trackingNumber){
	var label;
	if (Modernizr.localstorage) {
		label = localStorage[trackingNumber];
	}else{
		label = getCookieData(trackingNumber);
	}	
	if (label){
		label = $.trim(label);
	}
	
	return label;
}



//Commons

function getCookieData( name ) {
    var pairs = document.cookie.split("; "),
        count = pairs.length, parts; 
    while ( count-- ) {
        parts = pairs[count].split("=");
        if ( parts[0] === name )
            return parts[1];
    }
    return false;
}

var delete_cookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};