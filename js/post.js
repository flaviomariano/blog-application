var id = window.location.search.split('id=')[1];
var xhr = new XMLHttpRequest();

document.addEventListener("DOMContentLoaded", function (event) {

    getPosts();
    document.getElementById('add-comment').addEventListener('submit', insertNewComment, true);

});

var getPosts = function () {

    xhr.open('GET', 'http://localhost:9001/posts/' + id);
    xhr.send(null);

    xhr.onreadystatechange = function () {
        var DONE = 4;
        var OK = 200;
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                var post = JSON.parse(xhr.responseText),
                    formattedPost = formatPost(post);

                if (formattedPost) {
                    document.getElementById("post-container").insertAdjacentHTML("afterbegin", formattedPost);

                    loadComments(id);
                } else {
                    document.getElementById("post-container").insertAdjacentHTML("afterbegin", "Post doesn't exist");
                }
            } else {
                console.log('Error: ' + xhr.status);
            }
        }
    };
}

var insertNewComment = function (event) {
    event.preventDefault();

    var current_date = new Date(),
        formatted_date = current_date.getFullYear() + "-" + (current_date.getMonth() + 1) + "-" + current_date.getDate(),
        comment_author = document.getElementById('author').value,
        comment_content = document.getElementById('content').value,
        comment = {
            user: comment_author,
            date: formatted_date,
            postId: id,
            content: comment_content
        }

    xhr.open('POST', 'http://localhost:9001/posts/' + id + '/comments');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(
        comment
    ));

    document.getElementById("comments-container").insertAdjacentHTML("afterbegin", formatComment(comment));
    if (document.getElementById("empty-comments").length != 0) {
        document.getElementById("empty-comments").style.display = 'none';
    }
}


var loadComments = function (id) {
    xhr.open('GET', 'http://localhost:9001/posts/' + id + '/comments');
    xhr.send(null);

    xhr.onreadystatechange = function () {
        var DONE = 4;
        var OK = 200;
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                var comments = JSON.parse(xhr.responseText),
                    formatted_comments = "";

                if (comments.length > 0) {
                    comments.sort(function (a, b) {
                        return new Date(b.date) - new Date(a.date);
                    });

                    comments.forEach(comment => {
                        formatted_comments += formatComment(comment);
                    });

                    document.getElementById("comments-container").insertAdjacentHTML("afterbegin", formatted_comments);
                } else {
                    document.getElementById("comments-container").insertAdjacentHTML("afterbegin", "<div id='empty-comments'>No comments for this post. Add the first comment</div>");
                }

                document.getElementById("loading-container").style.display = 'none';
            } else {
                console.log('Error: ' + xhr.status);
            }
        }
    };
}

var formatPost = function (post) {
    if (Object.keys(post).length !== 0 && post.constructor === Object) {
        var post_HTML = '<div class="container"><article>';
        post_HTML += '<h1>' + (post.title ? post.title : 'untitled') + '</h1>';
        post_HTML += '<ul class="post-info">';
        post_HTML += '<li>' + (post.author ? 'author: ' + post.author : 'no author') + '</li>';
        post_HTML += '<li>' + (post.publish_date ? '<time datetime="' + post.publish_date + '">' + post.publish_date + '</time>' : 'no post date') + '</li>';
        post_HTML += '</ul>';
        post_HTML += '<p class="post-description">' + (post.description ? post.description : 'no post description') + '</p>';
        post_HTML += '<div class="post-content">' + (post.content ? post.content : 'no post content') + '</div>';
        post_HTML += '</article></div>'

        return post_HTML;
    } else {
        return false;
    }
}

var formatComment = function (comment) {
    if (Object.keys(comment).length !== 0 && comment.constructor === Object) {
        var comment_HTML = '<div class="container pt-0"><article>';

        comment_HTML += '<ul class="post-info">';
        comment_HTML += '<li>' + (comment.user ? 'Comment username: ' + comment.user : 'no user') + '</li>';
        comment_HTML += '<li>' + (comment.date ? '<time datetime="' + comment.date + '">' + comment.date + '</time>' : 'no comment date') + '</li>';
        comment_HTML += '</ul>';
        comment_HTML += '<p>' + (comment.content ? 'Comment: ' + comment.content : 'no comment content') + '</p>';

        comment_HTML += '</article></div>'

        return comment_HTML;
    } else {
        return false;
    }
}
