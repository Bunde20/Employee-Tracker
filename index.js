// Dependencies
const connection = require("./config/connection.js");
const inquirer = require("inquirer");
const mysql = require("mysql2");

connection.connect(function (err) {
  if (err) throw err;
  console.log("You are connected to the DataBase");
  start();
});

// List of questions to ask the user
function start() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Exit",
        ],
      },
    ])
    .then((res) => {
      const choice = res.action;
      if (choice.includes("View all")) {
        let query = "";
        if (choice === "View all departments") {
          query = "SELECT * FROM departments";
        }
        if (choice === "View all roles") {
          query = "SELECT * FROM roles";
        }
        if (choice === "View all employees") {
          query = "SELECT * FROM employees";
        }
        viewAllFunction(query);
      }
      if (choice.includes("Add")) {
        if (choice === "Add a department") {
          addDepartment();
          if (choice === "Add a role") {
          }
          if (choice === "Add an employee") {
          }
        }
      }
    
    });
}

const viewAllFunction = (query) => {
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What is the name of the department?",
      },
    ])
    .then((res) => {
      connection.query("INSERT INTO departments SET ?", {
        department_name: res.departmentName,
      });
      console.log("added");
      start();
    });
};
