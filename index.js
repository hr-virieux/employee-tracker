const inquirer = require('inquirer');
const db = require('./db');
const bcrypt = require('bcrypt');
require('console.table');

async function mainMenu() {
    try {
        const answer = await inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Quit'
            ],
        });

        switch (answer.action) {
            case 'View All Departments':
                await viewAllDepartments();
                break;
            case 'View All Roles':
                await viewAllRoles();
                break;
            case 'View All Employees':
                await viewAllEmployees();
                break;
            case 'Add Department':
                await addDepartment();
                break;
            case 'Add Role':
                await addRole();
                break;
            case 'Add Employee':
                await addEmployee();
                break;
            case 'Update Employee Role':
                await updateEmployeeRoleFunction();
                break;
            case 'Quit':
                console.log('Goodbye!');
                process.exit();
                break;
            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    } catch (err) {
        console.error(`Error: ${err.message}`);
    } finally {
        console.log("Restarting menu...");
        setTimeout(mainMenu, 500);
    }
}

async function viewAllDepartments() {
    const departments = await db.getDepartments();
    console.table(departments);
}

async function viewAllRoles() {
    const roles = await db.getRoles();
    console.table(roles);
}

async function viewAllEmployees() {
    const employees = await db.getEmployees();
    console.table(employees);
}

async function addDepartment() {
    const { name } = await inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'What is the name of the new department?'
        }
    ]);
    await db.addDepartment(name);
    console.log(`Added new department: ${name}`);
}

async function addRole() {
    const departments = await db.getDepartments();
    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const roleData = await inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'What is the title of the new role?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary for this role?'
        },
        {
            name: 'department_id',
            type: 'list',
            message: 'Which department does this role belong to?',
            choices: departmentChoices
        }
    ]);

    await db.addRole(roleData.title, roleData.salary, roleData.department_id);
    console.log(`Added new role: ${roleData.title}`);
}

async function addEmployee() {
    const roles = await db.getRoles();
    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const managers = await db.getEmployees();
    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    managerChoices.unshift({ name: 'None', value: null });

    const employeeData = await inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'What is the employee\'s first name?'
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'What is the employee\'s last name?'
        },
        {
            name: 'role_id',
            type: 'list',
            message: 'What is the employee\'s role?',
            choices: roleChoices
        },
        {
            name: 'manager_id',
            type: 'list',
            message: 'Who is the employee\'s manager?',
            choices: managerChoices
        }
    ]);

    await db.addEmployee(employeeData.first_name, employeeData.last_name, employeeData.role_id, employeeData.manager_id);
    console.log(`Added new employee: ${employeeData.first_name} ${employeeData.last_name}`);
}

async function updateEmployeeRoleFunction() {
    const employees = await db.getEmployees();
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const roles = await db.getRoles();
    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { employeeId, roleId } = await inquirer.prompt([
        {
            name: 'employeeId',
            type: 'list',
            message: 'Which employee\'s role do you want to update?',
            choices: employeeChoices
        },
        {
            name: 'roleId',
            type: 'list',
            message: 'Which role do you want to assign to the selected employee?',
            choices: roleChoices
        }
    ]);

    await db.updateEmployeeRole(employeeId, roleId);
    console.log('Employee\'s role updated successfully');
}

mainMenu();
