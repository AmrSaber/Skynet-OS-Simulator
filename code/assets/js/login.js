var g = 17;
var n = 10**9+7;

if(localStorage.getItem("isLogedin") == "1") location.replace("Desktop.html");

$(function(){
    
    $('#user_name').focus();
    $('#user_name, #password').val('');
    
    $('#loginBtn').click(function(){
        var userName = hash($('#user_name').val());
        var password = hash($('#password').val());
        
        if(userName == 76771714 && password == 252083110){
            //Login Code here
            localStorage.setItem("isLogedin", "1");
            location.replace("Desktop.html");
        }else{
            alert("Wrong username or password");
            $('#user_name, #password').val('');
            $("#user_name").focus();
        }
    });
    
    $('#password').keypress(function(e){
        if(e.which == 13){
            $("#loginBtn").click();
        }
    });
    document.addEventListener('contextmenu', event => event.preventDefault());
});

function hash(str){
    var g = 17, n = 10**9+7;
    var x = 1;
    for(var i = 0 ; i < str.length ; ++i){
        x *= (str[i].charCodeAt(0) + i + 7);
        x %= n;
    }
    return power(g, x, n);
}

function power(base, e, mod){
    if(!e) return 1;
    if(e & 1) return (base * power((base * base)%mod, e>>1, mod)%mod)%mod;
    return power((base * base)%mod, e>>1, mod)%mod;
}
