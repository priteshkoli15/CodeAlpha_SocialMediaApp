let currentUser = JSON.parse(localStorage.getItem("user"));

function createPost(){

    fetch("/post",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            username: currentUser.name,
            content: document.getElementById("postContent").value
        })
    })
    .then(res => res.json())
    .then(data => {

        alert(data.message);

        location.reload();
    });
}

function loadPosts(){

    fetch("/posts")
    .then(res => res.json())
    .then(posts => {

        const postsDiv = document.getElementById("posts");

        postsDiv.innerHTML = "";

        posts.forEach(post => {

            postsDiv.innerHTML += `
            
            <div class="card">

                <h3>${post.username}</h3>

                <p>${post.content}</p>

                <button onclick="likePost(${post.id})">
                    ❤️ ${post.likes}
                </button>

                <br><br>

                <input id="comment-${post.id}" placeholder="Comment">

                <button onclick="commentPost(${post.id})">
                    Comment
                </button>

                <div>
                    ${post.comments.map(c => `<p>💬 ${c}</p>`).join("")}
                </div>

            </div>
            `;
        });
    });
}

function likePost(id){

    fetch(`/like/${id}`,{
        method:"POST"
    })
    .then(() => loadPosts());
}

function commentPost(id){

    const comment =
        document.getElementById(`comment-${id}`).value;

    fetch(`/comment/${id}`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            comment
        })
    })
    .then(() => loadPosts());
}

loadPosts();