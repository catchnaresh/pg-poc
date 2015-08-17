// Registration --------------
function registerUser(){
    // merge form data with device-info
    var data = $.extend({}, $('#signup-form').serializeHash(), {access_token:  localStorage['access_token']})
    console.log(data)
    $.ajax({
        url: window.api_url+'signup',
        type: 'post',
        data: data,
        beforeSend: function () {  showAjaxSpinner()  },
        success: function (data) {
            console.log(data)
            localStorage.setItem('current_user',JSON.stringify(data.user))
            // replace access token with verified
            current_user = JSON.parse(localStorage.getItem('current_user'))
            console.log(current_user)
            localStorage.setItem('auth_token',data.auth_token)
            localStorage.setItem('auth_email',data.user.email)
            // successDialog('Success',JSON.stringify(data))
            hideAjaxSpinner()
            window.location.href = 'home.html'
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            hideAjaxSpinner()
            errorDialog('Error',error_obj.errors)
        }
    })
}

// SignIn--------------
function signInUser(){
    var data = $.extend({}, $('#signin-form').serializeHash(), {access_token:  localStorage['access_token']})
    $.ajax({
        url: window.api_url+'signin',
        type: 'post',
        data:  data,
        beforeSend: function () {  showAjaxSpinner()  },
        success: function (data) {
            console.log(data)
            localStorage.setItem('current_user',JSON.stringify(data.user))
            // replace access token with verified
            current_user = JSON.parse(localStorage.getItem('current_user'))
            console.log(current_user)
            localStorage.setItem('auth_token',data.auth_token)
            localStorage.setItem('auth_email',data.user.email)
            // successDialog('Success',JSON.stringify(data))
            hideAjaxSpinner()
            window.location.href = 'home.html'
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            hideAjaxSpinner()
            errorDialog('Error',error_obj.errors)
        }
    })
}

// SignOut--------------
function signOutUser(){
    // getAccessToken() // get new access_token
    $.ajax({
        url: window.api_url+'signout',
        type: 'post',
        data: {
            "_method":"delete",
            'access_token':  localStorage['access_token'],
            'email': localStorage.getItem('auth_email'),
            'auth_token': localStorage.getItem('auth_token')
        },
        beforeSend: function () { showAjaxSpinner()  },
        success: function (data) {
            // remove current_user and access_token
            //localStorage.removeItem('current_user')
            localStorage.clear()
           // getAccessToken()// then get new access_token
           // successDialog('Success',data.message)
            hideAjaxSpinner()
            // window.location.href = 'signin.html'
            //$('.login-navbar #sign-out').hide()
            //$('.login-navbar #sign-in').show()
            getAccessToken()
        },
        error: function(xhr,textStatus,errorThrown ) {
            var error_obj = $.parseJSON(xhr.responseText)
            console.log(error_obj)
            hideAjaxSpinner()
            errorDialog('Error',error_obj.errors)
        }
    })
}

function authenticateViaOauth(){
    $('#btn-oauth-fbsignin').on('click',function(e){
        e.preventDefault()
        var provider = $(this).attr('data-provider')
        console.log(provider)
        OAuth.popup(provider)
            .done(function(result) {
                console.log(result)
                //use result.access_token in your API request
                //or use result.get|post|put|del|patch|me methods (see below)
                result.get('/me')
                    .done(function (response) {
                        //this will display "John Doe" in the console
                        console.log(response);
                        $.ajax({
                            url: window.api_url+'oauth/'+provider,
                            type: 'post',
                            data: {
                                'access_token':  localStorage['access_token'],
                                'oauth_token': result.access_token,
                                'name': response.name,
                                'email': response.email,
                                'expires_in': result.expires_in,
                                'uid': response.id
                            },
                            beforeSend: function () { showAjaxSpinner()  },
                            success: function (data) {
                                localStorage.setItem('current_user',JSON.stringify(data.user))
                                // replace access token with verified
                                current_user = JSON.parse(localStorage.getItem('current_user'))
                                console.log(current_user)
                                localStorage.setItem('auth_token',data.auth_token)
                                localStorage.setItem('auth_email',data.user.email)
                                // successDialog('Success',JSON.stringify(data))
                                hideAjaxSpinner()
                                window.location.href = 'home.html'
                            },
                            error: function(xhr,textStatus,errorThrown ) {
                                var error_obj = $.parseJSON(xhr.responseText)
                                console.log(error_obj)
                                hideAjaxSpinner()
                                errorDialog('Error',error_obj.errors)
                            }
                        })
                    })
                    .fail(function (err) {
                        //handle error with err
                    });
            })
            .fail(function (err) {
                console.log('error')
                console.log(err)
                //handle error with err
            });
    })

}

$(document).on('ready',function(){

    // signUp ----------------------------------------------
    $('#signup-form #btn-submit-signup').on('click',function(e){
        e.preventDefault()
       form=  $('#signup-form')
        screen = form.find('input[name="user[screen_name]"]').val()
        email = form.find('input[name="user[email]"]').val()
        psd = form.find('input[name="user[password]"]').val()
        psd_con = form.find('input[name="user[confirm_password]"]').val()
       // terms = form.find('input[name="terms"]') -->  || (!terms.is(':checked'))
        if(screen ==''  || email == '' || psd == '' || psd_con == ''){
            errorDialog('Error','All fields are required')
        }else{
            registerUser()
        }
    })

    // signIn -----------------------------------------------
    $('#signin-form #btn-submit-signin').on('click',function(e){
        e.preventDefault()
        signInUser()
    })

    // signOut ----------------------------------------------

    $('#sign-out').on('click',function(e){
        e.preventDefault()
        signOutUser()
    })




})

