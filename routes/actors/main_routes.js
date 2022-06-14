const express = require("express");
const app = express();
const studentRoutes = require("./student_routes");
const teacherRoutes = require("./teacher_routes");
const userRoutes = require("./user_routes");

app.use("/student", studentRoutes);
app.use("/user", userRoutes);
//app.use("/teacher", teacherRoutes);

module.exports = app;