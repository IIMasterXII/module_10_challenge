// import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer'

connectToDb();

interface Department {
    id: number;
    department_name: string;
}

interface Role {
    id: number;
    title: string;
    salary: number;
    department_id: number;
}

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    role_id: number;
    manager_id: number;
}

async function getDepartmentData(): Promise<Department[]> {
    try{
        const result = await pool.query<Department>(`SELECT * FROM department`);
        return result.rows;
    } catch(err) {
        return [];
    }

}

async function getRoleData(): Promise<Role[]> {
    try{
        const result = await pool.query<Role>(`SELECT * FROM role`);
        return result.rows;
    } catch(err) {
        return [];
    }
}

async function getEmployeeData(): Promise<Employee[]> {
    try{
        const result = await pool.query<Employee>(`SELECT * FROM employee`);
        return result.rows;
    } catch(err) {
        return [];
    }
}

function addDepartment(){
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the new department name:',
        },
    ])
    .then((answer) => {
        try {
            pool.query('INSERT INTO department (department_name) VALUES ($1)',[answer.departmentName]);
            console.log(`'${answer.departmentName}' Department added successfully.`);
        } catch (err) {
            console.error('Error adding department:', err);
        }
        askQuestion();
    })
}

async function addRole(){
    const result = await getDepartmentData();

    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'Enter the new role name:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the new role salary:',
        },
        {
            type: 'list',
            name: 'department',
            message: 'Select a department:',
            choices: result.map(department => department.department_name),
          },
    ]);

    const selectedDepartment = result.find(department => department.department_name === answer.department);

    try {
        await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',[answer.roleName, answer.salary, selectedDepartment?.id]);
        console.log(`'${answer.roleName}' added successfully.`);
    } catch (err) {
        console.error('Error adding role:', err);
    }

    askQuestion();
}

async function addEmployee(){
    const roles = await getRoleData();
    const employees = await getEmployeeData();

    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the new employees first name:',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the new employees last name:',
        },
        {
            type: 'list',
            name: 'role',
            message: 'Select a role:',
            choices: roles.map(role => role.title),
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Select a manager:',
            choices: employees.map(employee => employee.last_name + ', ' + employee.first_name),
        },
    ]);

    const selectedRole = roles.find(role => role.title === answer.role);
    const selectedManager = employees.find(employee => employee.last_name + ', ' + employee.first_name === answer.manager);

    try {
        await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',[answer.firstName, answer.lastName, selectedRole?.id, selectedManager?.id]);
        console.log(`Employee added successfully.`);
    } catch (err) {
        console.error('Error adding role:', err);
    }

    askQuestion();
}

async function updateEmployee(){
    const roles = await getRoleData();
    const employees = await getEmployeeData();

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Select an Employee:',
            choices: employees.map(employee => employee.last_name + ', ' + employee.first_name),
        },
        {
            type: 'list',
            name: 'role',
            message: 'Select a role:',
            choices: roles.map(role => role.title),
        },
    ]);

    const selectedRole = roles.find(role => role.title === answer.role);
    const selectedEmployee = employees.find(employee => employee.last_name + ', ' + employee.first_name === answer.employee);

    try {
        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2',[selectedRole?.id, selectedEmployee?.id]);
        console.log(`Employee added successfully.`);
    } catch (err) {
        console.error('Error adding role:', err);
    }

    askQuestion();
}

async function askQuestion(){
    const answer = await inquirer.prompt([
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
    let result = null;
      switch (answer.action) {
        case 'View all departments':
          result = await getDepartmentData();
          console.table(result)
          askQuestion();
          break;
        case 'View all roles':
          result = await getRoleData()
          console.table(result)
          askQuestion();
          break;
        case 'View all employees':
          result = await getEmployeeData()
          console.table(result)
          askQuestion();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployee();
          break;
        case 'Exit':
          pool.end();
          return
      }
}

async function main() {
    askQuestion();
}

main().catch(console.error);
