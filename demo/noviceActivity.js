// let URL = "https://m.api.iserious.cn/";//可变的url
let URL;
let accessToken;//登录标识
let successFlag; //充值成功标识 0 未成功 1充值成功

$(document).ready(function(){
    URL = GetQueryString("url");
    accessToken = GetQueryString("accessToken");
    initData();
})
//初始化数据
function initData(){
    // let accessToken = localStorage.getItem("accessToken");
    $.ajax({
        type:'GET',
        url:URL+"mobile/auth/user/newUserTask",
        data:{},
        beforeSend: function(request) {
            request.setRequestHeader("accessToken", accessToken);
       },
        success:function(data){
            let result = data.data;
            setTime(result.regTime);
            setDaysData(result.day4,"receive-four","four-days","four-num");
            setDaysData(result.day5,"receive-five","five-days","five-num");
            setDaysData(result.day6,"receive-six","six-days","six-num");
            setDaysData(result.day7,"receive-seven","seven-days","seven-num");
        }
    })
}
//倒计时启动
function setTime(timeNum){
    let threeDayAfter = timeNum + (72 * 60 * 60 * 1000);
    let nowDate = new Date();
    let nowTime = nowDate.getTime();
    let dixTime = threeDayAfter - nowTime;
    var days = parseInt(dixTime / 1000 / 60 / 60 /24 ); //计算剩余的天数
    var hours = parseInt(dixTime / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时 
    var minutes = parseInt(dixTime / 1000 / 60 % 60, 10);//计算剩余的分钟
    let reduceTime = dixTime/1000;
    reduceTime --;
    if(reduceTime<=0){
        $("#free-time").css("display","none");
        $("#gotoBook").addClass("disable").html("已结束");
        return false;
    }else{
        let timeStr = `
            剩余时间
            <span class="days">`+checkTime(days)+`</span>天
            <span class="hours">`+checkTime(hours)+`</span>时
            <span class="minute">`+checkTime(minutes)+`</span>分
        `;
        setTimeout("setTime("+timeNum+")",1000);
        $("#free-time").html(timeStr);
    }
}
//设置初始数据
let setDaysData = (objData,target1,target2,target3) =>{
    $("#"+target1).html(getDate(objData.receiveTime));
    $("."+target2+" ."+target3).html(objData.dayDiff);
    if(objData.status==0&&objData.dayDiff<=0){
        $("."+target2).removeClass("disable");
        $("."+target2).find("span").eq(1).removeClass("hide");
    }else if(objData.status==0&&objData.dayDiff>0){
        $("."+target2).find("p").eq(0).removeClass("hide");
    }else if(objData.status==1){
        $("."+target2).find("span").eq(0).removeClass("hide");
    }
}
//跳转领取
$(".four-days,.six-days").on("click",function(){
    if($(this).hasClass("disable")){
        let type = $(this).data("type");
        return false;
    }else{
        let type = $(this).data("type");
        getCoinData(type,$(this).data("id"))
    }
})
//领取书券接口
let  getCoinData = (type,target) =>{
    // let accessToken = localStorage.getItem("accessToken");
    $.ajax({
        type:'GET',
        url:URL+"mobile/auth/user/receiveCoupons",
        data:{
            type:type
        },
        beforeSend: function(request) {
            request.setRequestHeader("accessToken", accessToken);
       },
        success:function(data){
            showMask(data.data.getCouponsValue,target,type);
        }
    })
}
//第5天领取补签卷
$(".five-days").on("click",function(){
    if($(this).hasClass("disable")){
        return false;
    }else{
        let type = $(this).data("type");
        getVoucherData(type,$(this).data("id"))
    }
})
//领取补签卷接口
let  getVoucherData = (type,target) =>{
    // let accessToken = localStorage.getItem("accessToken");
    $.ajax({
        type:'GET',
        url:URL+"mobile/auth/user/receiveAddSignCoupons",
        data:{
            type:type
        },
        beforeSend: function(request) {
            request.setRequestHeader("accessToken", accessToken);
       },
        success:function(data){
            console.log(data);
            showMask(data.data.getCouponsValue,target,type);
        }
    })
}
//第7天1元充值
$("#seven-days").on("click",function(){
    if($(this).hasClass("disable")){
        return false;
    }else{
        moneyActivvity();
    }
})
//倒计时处理
function checkTime(i){ //将0-9的数字前面加上0，例1变为01 
    if(i<10){ 
      i = "0" + i; 
    } 
    return i; 
}
//格式化日期
let getDate = sd => {
    let date = new Date(sd);
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
    let D = date.getDate() + '日';
    return M + D 
}
//显示遮罩层内容
let showMask = (num,target,type) =>{
    $(".mask").css("display","block");
    if(type==6){
        $(".activity-content").addClass("remedy-voucher").html(num+"张补签卷");
    }else if(type==5||type==7){
        $(".activity-content").addClass("give-voucher").html(num+"书券");
    }
    // else{
    //     $(".activity-content").addClass("book-voucher").html("100书币+200书券");
    // }
    $("#"+target).addClass("disable").find("span").eq(0).removeClass("hide").siblings().addClass("hide");
}
$(".mask,.close-btn").on("click",function(){
    $(".mask").css("display","none");
    $(".activity-content").removeClass("book-voucher give-voucher remedy-voucher")
})
//去书城
$(".look-book,#gotoBook").on("click",function(){
    goToLookBook();
})
$("#gotoBook").on("click",function(){
    if($(this).hasClass("disable")){
        return false;
    }else{
        goToLookBook();
    }
})
//查询字符串参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
//去书城看书
 function goToLookBook() {
    window.WebViewJavascriptBridge.callHandler(
        'goToBookMall'
        , {'param': '去书城'}
        , function(responseData) {
        }
    );
}
//1元充值拉去IOS充值页面等待回调
function moneyActivvity() {
    window.WebViewJavascriptBridge.callHandler(
        'oneDollarActivity'
        , {'param': '去充值页面'}
        , function(responseData) {
            successFlag = responseData;
            if(successFlag==1){
                //充值成功
                $(".mask").css("display","block");
                $(".activity-content").addClass("book-voucher").html("100书币+200书券");
                $("#seven-days").addClass("disable").find("span").eq(0).removeClass("hide").siblings().addClass("hide");
            }
        }
    );
}

/*这段代码是固定的，必须要放到js中*/
function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
  }

  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
  setupWebViewJavascriptBridge(function(bridge) {
   var uniqueId = 1
   function log(message, data) {
     var log = document.getElementById('log')
     var el = document.createElement('div')
     el.className = 'logLine'
     el.innerHTML = uniqueId++ + '. ' + message + ':<br/>' + JSON.stringify(data)
     if (log.children.length) {
        log.insertBefore(el, log.children[0])
     } else {
       log.appendChild(el)
     }
   }
   /* Initialize your app here */
                                      
   /*JS给ObjC提供公开的API，ObjC端通过注册，就可以在JS端调用此API时，得到回调。ObjC端可以在处理完成后，反馈给JS，这样写就是在载入页面完成时就先调用*/
   bridge.callHandler('goToBookMall', function(responseData) {
     log("JS call ObjC's getUserIdFromObjC function, and js received response:", responseData)
   })

   document.getElementById('blogId').onclick = function (e) {
     log('js call objc: goToBookMall')
     bridge.callHandler('goToBookMall', {'blogURL': 'http://www.henishuo.com'}, function(response) {
                      log('JS got response', response)
                      })
   }
 })
 /*这段代码是固定的，必须要放到js中*/
function setupWebViewJavascriptBridge1(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
  }

  /*与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS*/
  setupWebViewJavascriptBridge1(function(bridge1) {
   var uniqueId = 1
   function log(message, data) {
     var log = document.getElementById('log')
     var el = document.createElement('div')
     el.className = 'logLine'
     el.innerHTML = uniqueId++ + '. ' + message + ':<br/>' + JSON.stringify(data)
     if (log.children.length) {
        log.insertBefore(el, log.children[0])
     } else {
       log.appendChild(el)
     }
   }
   /* Initialize your app here */
                                      
   /*JS给ObjC提供公开的API，ObjC端通过注册，就可以在JS端调用此API时，得到回调。ObjC端可以在处理完成后，反馈给JS，这样写就是在载入页面完成时就先调用*/
   bridge1.callHandler('oneDollarActivity', function(responseData) {
     log("JS call ObjC's getUserIdFromObjC function, and js received response:", responseData)
   })

   document.getElementById('blogId').onclick = function (e) {
     log('js call objc: oneDollarActivity')
     bridge1.callHandler('oneDollarActivity', {'blogURL': 'http://www.henishuo.com'}, function(response) {
                      log('JS got response', response)
                      })
   }
 })