// Dependencies
const connection = require('./config/connection.js');
const inquirer = require('inquirer');
const mysql = require('mysql2');

connection.connect(function (err) {
  if (err) throw err;
  console.log('You are connected to the DataBase');
  start();
});

// List of questions to ask the user
function start() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      },
    ])
    .then((res) => {
      const choice = res.action;
      if (choice === 'View all departments') {
        viewAllDepartments();
      }
      if (choice === 'View all roles') {
        viewAllRoles();
      }
      if (choice === 'View all employees') {
        viewAllEmployees();
      }
      if (choice === 'Add a department') {
        addDepartment();
      }
      if (choice === 'Add a role') {
        addRole();
      }
      if (choice === 'Add an employee') {
        addEmployee();
      }
      if (choice === 'Update an employee role') {
        updateEmployeeRole();
      }
      if (choice === 'Exit') {
        connection.end();
      }
    });
}

function viewAllDepartments() {
  const query = 'SELECT * FROM departments';
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewAllRoles() {
  const query = 'SELECT * FROM roles';
  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    start();
  });
}

function viewAllEmployees() {
  const query = `SELECT employees.id, CONCAT(employees.first_name, " ", employees.last_name) AS employee, roles.title, departments.department_name, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON manager.id = employees.manager_id;`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department?',
      },
    ])
    .then((res) => {
      const query = 'INSERT INTO departments SET ?';
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

const departmentChoices = ['engineering', 'sales', 'legal', 'finance'];

function addRole() {
  connection.query('SELECT * FROM departments', async function (err, data) {
    const departments = data.map((department) => {
      return { name: department.department_name, value: department.id };
    });
    console.log(departments);
    const res = await inquirer.prompt([
      {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the role?',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?',
      },
      {
        type: 'list',
        name: 'department',
        message: 'Which department does the role belong to?',
        choices: departments,
      },
    ]);
    const query = 'INSERT INTO roles SET ?';
    connection.query(
      query,
      {
        title: res.roleName,
        salary: res.salary,
        department_id: res.department,
      },
      (error, res) => {
        if (error) throw error;
        console.log(`Added ${res.roleName} to the database`);
        start();
      }
    );
  });
}

function addEmployee() {
  connection.query('SELECT * FROM roles', async function (err, data) {
    const roles = data.map((role) => {
      return { name: role.title, value: role.id };
    });
    connection.query(
      'SELECT * FROM employees',
      async function (employeeErr, employeeData) {
        const employees = employeeData.map((employee) => {
          return {
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          };
        });
        console.log(employees);
        console.log([{ name: 'No Manager', value: null }, ...employees]);
        const res = await inquirer.prompt([
          {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
          },
          {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
          },
          {
            type: 'list',
            name: 'roleId',
            message: "What is the employee's role?",
            choices: roles,
          },
          {
            type: 'list',
            name: 'managerId',
            message: "Who is the employee's manager?",
            choices: [{ name: 'No Manager', value: null }, ...employees],
          },
        ]);
        const query = 'INSERT INTO employees SET ?';
        connection.query(
          query,
          {
            first_name: res.firstName,
            last_name: res.lastName,
            role_id: res.roleId,
            manager_id: res.managerId,
          },
          (error, res) => {
            if (error) throw error;
            console.log(
              `Added ${res.firstName} ${res.lastName} to the database`
            );
            start();
          }
        );
      }
    );
  });
}

function updateEmployeeRole() {
  connection.query(
    'SELECT * FROM employees',
    async function (employeeErr, employeeData) {
      const employees = employeeData.map((employee) => {
        return {
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        };
      });
      console.log(employees);
      const res = await inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: "Which employee's role do you want to update?",
          choices: employees,
        },
      ]);
      const roles = 'SELECT * FROM roles';
      connection.query(roles, async function (err, data) {
        const roles = data.map((role) => {
          return { name: role.title, value: role.id };
        });
        console.log(roles);
        const roleRes = await inquirer.prompt([
          {
            type: 'list',
            name: 'roleId',
            message: "What is the employee's new role?",
            choices: roles,
          },
        ]);
        const query = 'UPDATE employees SET ? WHERE ?';
        connection.query(
          query,
          [
            {
              role_id: roleRes.roleId,
            },
            {
              id: res.employeeId,
            },
          ],
          (error, res) => {
            if (error) throw error;
            console.log(`Updated employee role`);
            start();
          }
        );
      });
    }
  );
}


