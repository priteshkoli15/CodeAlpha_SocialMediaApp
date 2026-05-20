const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

function readUsers() {
    return JSON.parse(fs.readFileSync("users.json"));
}

function writeUsers(data) {
    fs.writeFileSync("users.json", JSON.stringify(data, null, 2));
}

function readPosts() {
    return JSON.parse(fs.readFileSync("posts.json"));
}

function writePosts(data) {
    fs.writeFileSync("posts.json", JSON.stringify(data, null, 2));
}

// REGISTER
app.post("/register", (req, res) => {

    const users = readUsers();

    users.push({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        followers: []
    });

    writeUsers(users);

    res.json({ message: "Registered Successfully" });
});

// LOGIN
app.post("/login", (req, res) => {

    const users = readUsers();

    const user = users.find(
        u =>
            u.email === req.body.email &&
            u.password === req.body.password
    );

    if(user){
        res.json({ success: true, user });
    } else {
        res.json({ success: false });
    }
});

// CREATE POST
app.post("/post", (req, res) => {

    const posts = readPosts();

    posts.push({
        id: Date.now(),
        username: req.body.username,
        content: req.body.content,
        likes: 0,
        comments: []
    });

    writePosts(posts);

    res.json({ message: "Post Added" });
});

// GET POSTS
app.get("/posts", (req, res) => {

    const posts = readPosts();

    res.json(posts.reverse());
});

// LIKE POST
app.post("/like/:id", (req, res) => {

    const posts = readPosts();

    const post = posts.find(
        p => p.id == req.params.id
    );

    if(post){
        post.likes++;
    }

    writePosts(posts);

    res.json({ message: "Liked" });
});

// COMMENT
app.post("/comment/:id", (req, res) => {

    const posts = readPosts();

    const post = posts.find(
        p => p.id == req.params.id
    );

    if(post){
        post.comments.push(req.body.comment);
    }

    writePosts(posts);

    res.json({ message: "Comment Added" });
});

// FOLLOW USER
app.post("/follow", (req, res) => {

    const users = readUsers();

    const user = users.find(
        u => u.email === req.body.email
    );

    if(user){
        user.followers.push(req.body.follower);
    }

    writeUsers(users);

    res.json({ message: "Followed User" });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});