const express = require("express");
const app = express();
const fs = require("fs");

const users = require("./MOCK_DATA.json");

require("dotenv").config();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`🚀 ~ Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "🫡 Welcome!" });
});

//All Users
app.get("/api/users", (req, res) => {
  res.status(200).json({
    message: "✅ success",
    count: users.length,
    users: users,
  });
});

//Users with dynamic ID
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const u = users.filter((us) => {
    return us.id === id;
  });
  if (u.length > 0) {
    res.status(200).json({ message: `✅ Fetched User`, id: id, user: u });
  } else {
    res.status(404).json({ message: `❌ User not found`, id: id });
  }
});

//Create New User
app.post("/api/users", (req, res) => {
  const { first_name, last_name, email, gender } = req.body;
  const id = users.length + 1;

  if (!first_name || !last_name || !email || !gender) {
    return res.status(400).json({ message: `All fields are required` });
  }

  users.push({
    id: id,
    first_name: first_name,
    last_name: last_name,
    email: email,
    gender: gender,
  });

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) {
      return res.status(500).json({ message: "❌ Failed to create user" });
    }
    res.status(201).json({
      message: "✅ User created successfully",
      id: id,
    });
  });
});

//Update User
app.put("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const { first_name, last_name, email, gender } = req.body;
  const u = users.findIndex((us) => {
    return us.id === id;
  });
  if (u === -1) {
    return res.status(404).json({ message: `�� User not found`, id: id });
  }
  users[u].first_name = first_name || users[u].first_name;
  users[u].last_name = last_name || users[u].last_name;
  users[u].email = email || users[u].email;
  users[u].gender = gender || users[u].gender;
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to update user" });
    }
    res.status(200).json({ message: "User updated successfully", id: id });
  });
});

//Delete User
app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const u = users.findIndex((user) => user.id === id);
  if (u === -1) {
    return res.json({ message: `User with ${id} was not found` });
  }
  users.splice(u, 1);
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to delete user" });
    }
    res
      .status(200)
      .json({ message: `User with id ${id} deleted successfully` });
  });
});
