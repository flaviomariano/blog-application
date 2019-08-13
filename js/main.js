var oldest = 0;
var xhr = new XMLHttpRequest();

document.addEventListener("DOMContentLoaded", function (event) {

    getPosts();

    document.getElementById("sort").addEventListener('change', (event) => {
        oldest = parseInt(event.target.value);
        getPosts();
    });

});

var getPosts = function () {
    xhr.open('GET', 'http://localhost:9001/posts');
    xhr.send(null);

    xhr.onreadystatechange = function () {
        var DONE = 4;
        var OK = 200;
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                var posts = JSON.parse(xhr.responseText),
                    formatted_posts = "";

                posts = sortByDate(posts, oldest);

                posts.forEach(post => {
                    formatted_posts += formatPost(post);
                });

                var posts_container = document.getElementById("posts-container");
                while (posts_container.firstChild) {
                    posts_container.removeChild(posts_container.firstChild);
                }

                posts_container.insertAdjacentHTML("afterbegin", formatted_posts);
                document.getElementById("loading-container").style.display = 'none';
            } else {
                console.log('Error: ' + xhr.status);
            }
        }
    };
}

var formatPost = function (post) {
    var post_HTML = '<div class="container"><article>';
    if (Object.keys(post).length !== 0 && post.constructor === Object) {
        if (post.id != 0) {
            post_HTML += '<a href="/post.html?id=' + post.id + '">';
            post_HTML += post.title ? '<h2>' + post.title + '</h2>' : 'untitled';
            post_HTML += '</a>';
            post_HTML += '<ul class="post-info">';
            post_HTML += '<li>' + (post.author ? 'author: ' + post.author : 'no author') + '</li>';
            post_HTML += '<li>' + (post.publish_date ? '<time datetime="' + post.publish_date + '">' + post.publish_date + '</time>' : 'no post date') + '</li>';
            post_HTML += '</ul>';
            post_HTML += '<p class="post-description">' + (post.description ? post.description : 'no post description') + '</p>';

            post_HTML += '</article></div>';

        }
    } else {
        post_HTML += '<p class="post-description">There was a problem loading this post</p>';
    }
    post_HTML += '</article></div>';
    return post_HTML;
}

var sortByDate = function (posts, oldest) {
    posts.sort(function (a, b) {
        if (oldest) {
            b = a;
            a = b;
        }
        return new Date(b.publish_date) - new Date(a.publish_date);
    });

    return posts;
}