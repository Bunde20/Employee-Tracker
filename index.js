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
        } else if (choice === "Add a department") {
        addDepartment();
        } else if (choice === "Add a role") {
        addRole();
        } else if (choice === "Add an employee") {
        addEmployee();
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

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What is the name of the department?",
      },
    ])
    .then((res) => {
      const query = "INSERT INTO departments SET ?";
      connection.query(
        query,
        {
          department_name: res.departmentName,
        },
        (error, res) => {
          if (error) throw error;
          console.log(`Added ${res.departmentName} to the database`);
          start();
        }
      );
    });
}

const departmentChoices = ["engineering", "sales", "legal", "finance"]; 

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleName",
        message: "What is the name of the role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role?",
      },
      {
        type: "list",
        name: "department",
        message: "Which department does the role belong to?",
        choices: departmentChoices,
      },
    ])
    .then((res) => {
      const query = "INSERT INTO roles SET ?";
      connection.query(
        query,
        {
          title: res.roleName,
          salary: res.salary,
          department_id: departmentChoices.indexOf(res.roleDepartment) + 1,
        },
        (error, res) => {
          if (error) throw error;
          console.log(`Added ${res.roleName} to the database`);
          start(); 
        }
      );
    });
}

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
      },
      {
        type: "input",
        name: "roleId",
        message: "What is the employee's role ID?",
      },
      {
        type: "input",
        name: "managerId",
        message: "What is the employee's manager ID?",
      },
    ])
    .then((res) => {
      const query = "INSERT INTO employee SET ?";
      connection.query(
        query,
        {
          first_name: res.firstName,
          last_name: res.lastName,
          role_id: res.role_id,
          manager_id: res.manager_id,
        },
        (error, res) => {
          if (error) throw error;
          console.log(`Added ${res.firstName} ${res.lastName} to the database`);
          start();
        }
      );
    });
};
