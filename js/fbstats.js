var total_likes = 0;
var page = 0
var posts = 0
var accessToken;

function addToLikes(response) {
    try {
        for (var i = 0; i < response.data.length; i++) {
            batch += '{"method":"GET", "relative_url":"/' + response.data[i].id + '/likes?summary=true"}, '
        }
        page += 1
        console.log("Page " + page)
        request(response.paging.next, function(err, res, body) {
            console.log(err)
            addToLikes(JSON.parse(body))
        });
    } catch (err) {
        if (err.name == "TypeError") {
            console.log("Finished paging.")
            batch += ']'
            request({
                    method: 'POST',
                    url: 'https://graph.facebook.com',
                    json: {
                        'access_token': accessToken,
                        'batch': batch
                    }
                },
                function(err, res, body) {
                    for (var i = 0; i < body.length; i++) {
                        request = JSON.parse(body[i].body)
                        console.log(request)
                        total_likes += request.summary.total_count
                        posts += 1
                        $('#post_number').text(posts)
                        $('#total_likes_field').text(total_likes)
                    }
                })
        }
    }
}

function countLikes() {
    console.log('Getting post list...');
    total_likes = 0
    posts = 0
    batch = '['
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
        accessToken = response.authResponse.accessToken;
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
