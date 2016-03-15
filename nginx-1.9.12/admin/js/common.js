/**
 * Created by zham on 15-8-7.
 */
var alertWithNgDialog = function(msg,ngDialog){
    if(ngDialog && typeof ngDialog.openConfirm == 'function')
        ngDialog.openConfirm({
            template: 'template/prompt.html',
            controller:'promptCtrl',
            closeByDocument:true,
            closeByEscape:true,
            className: 'ngdialog-theme-plain ngdialog-theme-custom',
            resolve: {
                notice: function(){
                    return msg;
                }
            }
        });
    else alert(msg);
}

var formatDate = function(timestamp) {
    var abbreviatedMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var d = new Date(Number(timestamp)?Number(timestamp):timestamp);
    return abbreviatedMonths[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
};

var alertWithNgDialog = function(msg,ngDialog,time){
    if(ngDialog && typeof ngDialog.openConfirm == 'function')
        ngDialog.openConfirm({
            template: 'template/prompt.html',
            controller:'promptCtrl',
            closeByDocument:true,
            closeByEscape:true,
            className: 'ngdialog-theme-plain ngdialog-theme-custom',
            resolve: {
                notice: function(){
                    return msg;
                },
                time:function(){
                    return time;
                }
            }
        });
    else alert(msg);
}

var addImgeEventListender = function(fileId, imgId) {
    var fileInput= document.getElementById(fileId); 
    var fileImg=document.getElementById(imgId);

    if(typeof FileReader==='undefined'){ 
        fileInput.setAttribute('disabled','disabled'); 
    }else{ 
        fileInput.addEventListener('change',function(fileObj, imgObj){ readFile(fileInput, fileImg); },false);
    }
} 

var readFile = function(fileInputObj, fileImgObj) {
    var file = fileInputObj.files[0];
    if(!/image\/\w+/.test(file.type)){
        $('#remind').text("文件必须为图片！").fadeIn().delay(2000).fadeOut();
        return false; 
    }

    var reader = new FileReader(); 
    reader.readAsDataURL(file); 
    reader.onload = function(e){ 
        fileImgObj.src=this.result;
    } 
    console.log(fileImgObj.src);
    reader.onabort=function(){
        $('#remind').text("上传中断").fadeIn().delay(2000).fadeOut(); 
    }
    reader.onerror=function(){
        $('#remind').text("上传出错").fadeIn().delay(2000).fadeOut(); 
    }
}
