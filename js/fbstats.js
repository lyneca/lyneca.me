var total_likes = 0;
var page = 0
var post = 0

function addToLikes(response) {
    try {
        for (var i = 0; i < response.data.length; i++) {
            FB.api(
                '/' + response.data[i].id + '/likes',
                'GET', {
                    'summary': 'true'
                },
                function(response) {
                    total_likes += response.summary.total_count
                    $('#post_number').text(post)
                    $('#total_likes_field').text(total_likes)
                }
            );
        }
        page += 1
        console.log("Page " + page)
        http.get({
            url: response.paging.next,
            onload: function() {
                addToLikes(JSON.parse(this.responseText))
            }
        });
    } catch (err) {
        if (err.name == "TypeError") {
            console.log("Finished paging.")
        }
    }
}

function countLikes() {
    console.log('Getting post list...');

    FB.api(
        '/me/posts/',
        'GET', {
            "limit": "275",
            "fields": "id"
        },
        addToLikes
    );
}


function statusChangeCallback(response) {
    if (response.status === 'connected') {
        console.log("Connected.");
        countLikes();
        $(this).animate({
            backgroundColor: '#3b9859'
        }, 200);
    } else if (response.status === 'not_authorized') {
        document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
    } else {
        document.getElementById('status').innerHTML = 'Please log ' +
            'into Facebook to use this app.';
    }
}

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId: '163056174189679',
        cookie: true,
        xfbml: true,
        version: 'v2.8'
    });
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });

};
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
