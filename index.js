// Dependencies
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// List of questions to ask the user
function start() {
    inquirer    
        .prompt ({
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
              "Add a Manager",
              "Update an employee role",
              "View Employees by Manager",
              "View Employees by Department",
              "Delete Departments | Roles | Employees",
              "View the total utilized budget of a department",
              "Exit",
              ],
          })
}