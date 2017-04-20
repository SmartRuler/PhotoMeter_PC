var points = [];
var metricPerPixel;
var refLen;
var lineLen;
var img;
$(document).ready(function (){
	var canvas = $("#picCanvas")[0];
	var cxt = canvas.getContext('2d');
	//var canvas = document.getElementById("picCanvas");
	//var cxt = canvas.getContext("2d");
	
	cxt.strokeStyle = "#f00";
	cxt.lineWidth = 3;
	cxt.font="bold 15px Arial";
	cxt.fillStyle="#058";
	img = new Image();
	
	Init(canvas);
	drawLines();
	$("#iptfileupload").change(function (){
		staInit();
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        if (typeof FileReader === 'undefined') {
            alert('Your browser does not support FileReader...');
            return;
        }
        var reader = new FileReader();

        reader.onload = function (e) {    
			
            img.src = this.result;
            img.onload = function () {
            cxt.drawImage(img, 0, 0,canvas.width,canvas.height);
			console.log(img.width,img.height);
			console.log(canvas.width,canvas.height);
            }
        }
        reader.readAsDataURL(document.getElementById(this.id).files[0]);
        
		
	});
	
	$(".form-control").change(function (){
		var refObject=$(".form-control").find("option:selected").val();
		
		if(refObject === "8.5"||refObject ==="2.5"){
			$("#reflen").val(refObject);
			$("#reflen").attr("disabled","disabled");
		}
		else{
			$("#reflen").removeAttr("disabled");		
			
			$("#reflen").focus();
		}
	});
	
	$("#cal").click(function (){
		if(points.length<2){
			alert("Please choose reference in picture");
		}
		else{
			lineLen = calReferLine(canvasToPicX(points[0].x),canvasToPicY(points[0].y),
									canvasToPicX(points[1].x),canvasToPicY(points[1].y));
			
			refLen = $("#reflen").val();
			if(refLen == 0 ||refLen == undefined || isNaN(refLen) ){
				alert("Please enter reference length");
			}
			else{
				cxt.fillText(refLen,(points[0].x + points[1].x) / 2 ,(points[0].y + points[1].y) / 2 );
			}
			  
			metricPerPixel = lineLen / refLen;  
		}
	});
	$("#res").click(function (){
		staInit();
		cxt.clearRect(0, 0, canvas.width, canvas.height);
		
		cxt.drawImage(img, 0, 0,canvas.width,canvas.height);
   
		
	});
	$("#sav").click(function (){
		
		Canvas2Image.saveAsJPEG(canvas, canvas.width, canvas.height);
	});
		
	
});
function Init(c){
	picInit(c);
	staInit();
}
function picInit(c){
    var cxt = c.getContext("2d");
    img.src = "1.jpg";
    img.onload = function () {
		cxt.drawImage(img, 0, 0,c.width,c.height);
		console.log(c.width,c.height);
    }
}
function staInit(){
	points = [];
	metricPerPixel = 0;
	
	var refInit =$(".form-control").val(0);
	var refObject=$(".form-control").find("option:selected").val();
		
		if(refObject === "8.5"||refObject ==="2.5"){
			$("#reflen").val(refObject);
			$("#reflen").attr("disabled","disabled");
		}
		else{
			$("#reflen").removeAttr("disabled");		
			
			$("#reflen").focus();
		}
}
function calReferLine(x1,y1,x2,y2){
	var calX = x2-x1;
	var calY = y2-y1;
	var dist = Math.sqrt(calX * calX + calY * calY);
	return dist;
}

function drawLines(){
	var canvas = document.getElementById("picCanvas");
	var cxt = canvas.getContext("2d");
	
	var moveX,
    moveY,
    toX,
    toY,
	endX,
	endY;
	
	function getCanvasPosX(canvas,e){	
		var rect = canvas.getBoundingClientRect(); 
		return e.clientX - rect.left * (canvas.width / rect.width);

	}
	function getCanvasPosY(canvas,e){
		var rect = canvas.getBoundingClientRect(); 
		return  e.clientY - rect.top * (canvas.height / rect.height);
	}


	canvas.addEventListener('mousedown', function (e) {
		moveX = getCanvasPosX(canvas,e);
		moveY = getCanvasPosY(canvas,e);
		
		
		canvas.addEventListener('mousemove', drawLine);
		points.push({
			x: moveX,
			y: moveY
		});
	
	})
	canvas.addEventListener('mouseup', function (e) {
		endX = getCanvasPosX(canvas,e);
		endY = getCanvasPosY(canvas,e);
		
		points.push({
			x: endX,
			y: endY
		});
		
		for(var i=3;i<points.length;i+=2){	
				cxt.fillText((calReferLine(canvasToPicX(points[i-1].x),canvasToPicY(points[i-1].y),
											canvasToPicX(points[i].x),canvasToPicY(points[i].y)) / metricPerPixel).toFixed(2) , 
											(points[i-1].x + points[i].x) / 2 ,(points[i-1].y + points[i].y) / 2 );
			}
			
	
		
		
		canvas.removeEventListener('mousemove', drawLine);
	
	})

	function drawLine(e) {
		toX = getCanvasPosX(canvas,e);
		toY = getCanvasPosY(canvas,e);
	
		cxt.clearRect(0, 0, canvas.width, canvas.height);		
		cxt.drawImage(img, 0, 0,canvas.width,canvas.height);		
		cxt.beginPath();
		cxt.moveTo(moveX, moveY);
		cxt.lineTo(toX, toY);
		
		for(var i=1;i<points.length;i+=2){
			cxt.moveTo(points[i-1].x,points[i-1].y);
			cxt.lineTo(points[i].x,points[i].y);
			
			if(refLen == 0 ||refLen == undefined || isNaN(refLen) ){
				alert("Please enter reference length");
			}
			else{
				cxt.fillText(refLen,(points[0].x + points[1].x) / 2 ,(points[0].y + points[1].y) / 2 );
				
				if(i>=3){
				cxt.fillText((calReferLine(canvasToPicX(points[i-1].x),canvasToPicY(points[i-1].y),
											canvasToPicX(points[i].x),canvasToPicY(points[i].y)) / metricPerPixel).toFixed(2) , 
										(points[i-1].x + points[i].x) / 2 ,(points[i-1].y + points[i].y) / 2 );
			}
			}		
	
		}	
		cxt.closePath();
		cxt.stroke();	
	}}

function canvasToPicX(m){
	var wPicToCan = 300 / img.width;
		
	var mCanToPic = m / wPicToCan;
		
	return mCanToPic;
} 
function canvasToPicY(n){		
	var hPicToCan = 400 / img.height;
	
	var nCanToPic = n / hPicToCan;
		
	return nCanToPic;
} 