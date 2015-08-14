/*
 * Holds all js functions for invoking API
 *
 */
// Constants ------------------------------------------------

var env = 'prod';
//var env = 'local';
//var env = 'prod';
if(env == 'prod'){
    window.oauth_url = 'https://poc-eastpoint.herokuapp.com/oauth/token'
    window.api_url = 'https://poc-eastpoint.herokuapp.com/api/v1/'
    window.app_client_id = 'b32d51cc5d7613b28398e0863681c1b4992375e95a0892da5935aebabc097f61'
    window.app_client_secret = 'c8ae1d60f532584dac3dd97afb27808acf9ffd59d2b586645e5afeb27294c640'
    // comment below for apk generation
   // var device = {model: 'XT1033', platform: 'Android',version: '5.0.2',uuid: 'dd46057341bf77df',cordova: '3.7.0'}
}else if(env=='dev'){
    window.oauth_url = 'http://localhost:3000/oauth/token'
    window.api_url = 'http://localhost:3000/api/v1/'
    window.app_client_id = 'be98e88ea17cdeb06d9aae89bd46fd2a3e16482ffc0f1cf92ec4ee94ebbe09cb'
    window.app_client_secret = '28e973a296232a0a4ba569c0a9972c21a1f0da4771cc272b53f461515d2ec547'
    // for prod same will get from plugin
    var device = {model: 'XT1033', platform: 'Android',version: '5.0.2',uuid: 'dd46057341bf77df',cordova: '3.7.0'}
}

//TODO replace device_token with plugin
var device_token = 'sample-android-device-token-123456'

localStorage.setItem('device_token',device_token)

/*
 *  sessionStorage List =>
 * --------------------------------------------------
 *   1)
 * -------------------------------------------------
 * Local Storage List =>
 *  1) current_user => {email,fname,lname,photo,uid}
 *  2) access_token
 *
 * */

// bootbox error dialog
function errorDialog(title,msg){
    bootbox.dialog({
        message: msg,
        title: title,
        buttons: {
            danger: {
                label: "Ok",
                className: "btn-danger"
            }
        }
    });
}
// success dialog
function successDialog(title,msg){
    bootbox.dialog({
        message: msg,
        title: title,
        buttons: {
            danger: {
                label: "Ok",
                className: "btn-success"
            }
        }
    });
}

// Get access token
function getAccessToken() {
    if(typeof(localStorage.getItem('access_token')) == "undefined" || localStorage.getItem('access_token') == null || localStorage.getItem('access_token') == '') {
        $.ajax({
            url: window.oauth_url,
            type: 'post',
            data: {
                'grant_type': "client_credentials", 'client_id': window.app_client_id,
                'client_secret': window.app_client_secret
            },
            beforeSend: function () {
                console.log('getting access_token..')
            },
            success: function (data) {
                localStorage.setItem('access_token', data.access_token)
                afterInitializeRedirect()
            },
            error: function (xhr, textStatus, errorThrown) {
                var error_obj = $.parseJSON(xhr.responseText)
                console.log(error_obj)
                errorDialog(error_obj.error, error_obj.error_description)
            }
        })
    }else{
        afterInitializeRedirect()
    }
    return
}

function afterInitializeRedirect(){
    if(localStorage['current_user']){
       window.location.href = "home.html"
    }else{
        window.location.href = "authentication.html"
    }
}


// Get device Info
function getDeviceInfo(){
    d_model = device.model//'model1'
    d_cordova = device.cordova //'cordova 1'
    d_platform = device.platform
    d_uuid =  device.uuid
    d_version = device.version
    var content="";
    content += "<div>";
    content += "<strong>Device Model:</strong>    "+ d_model +"<br/>";
    content += "<strong>Device Cordova:</strong>  "+ d_cordova +"<br/>";
    content += "<strong>Device Platform:</strong> "+ d_platform +"<br/>";
    content += "<strong>Device UUID:</strong>     "+ d_uuid +"<br/>";
    content += "<strong>Device Version:</strong>  "+ d_version +"<br/>";
    content += "<\/div>";
    bootbox.dialog({
        title: "Your Device Info",
        message: content,
        buttons: {
            danger: {
                label: "Ok",
                className: "btn-success"
            }
        }
    });
}

window.addEventListener('load', function() {
    console.log('invoked fastclick')
    new FastClick(document.body);
}, false);


function showAjaxSpinner(){
    spinner = new Spinner({color:'#000000', lines: 12,top: '40%'}).spin(document.body);
    $("body").css({"opacity": "0.5"});
    $('.loading-box').show()
}

function hideAjaxSpinner(){
    spinner.stop();
    $("body").removeAttr('style');
   // $('.loading-box').hide()
}




