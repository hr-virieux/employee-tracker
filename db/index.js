const connection = require('./connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Define department, role, and employee retrieval functions
async function getDepartments() {
    const [rows] = await connection.query('SELECT * FROM department');
    return rows;
}

async function getRoles() {
    const [rows] = await connection.query('SELECT * FROM role');
    return rows;
}

async function getEmployees() {
    const [rows] = await connection.query('SELECT * FROM employee');
    return rows;
}

// Function to add a new department
async function addDepartment(departmentName) {
    const [result] = await connection.query('INSERT INTO department (name) VALUES (?)', [departmentName]);
    return result.insertId;
}

// Function to add a new role
async function addRole(roleTitle, roleSalary, departmentId) {
    const [result] = await connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [roleTitle, roleSalary, departmentId]);
    return result.insertId;
}

// Function to add a new employee
async function addEmployee(firstName, lastName, roleId, managerId) {
    const [result] = await connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
    return result.insertId;
}

// Function to update an employee
async function updateEmployeeRole(employeeId, roleId) {
    const [result] = await connection.query(
        'UPDATE employee SET role_id = ? WHERE id = ?',
        [roleId, employeeId]
    );
    return result.affectedRows;
}

// Function to create a new user with a hashed password
async function createUser(username, password) {
    const hash = await bcrypt.hash(password, saltRounds);
    const [result] = await connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
    return result.insertId;
}

// Function to verify a user's password
async function verifyUser(username, password) {
    const [users] = await connection.query('SELECT password FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
        return false; // User not found
    }
    const user = users[0];
    return await bcrypt.compare(password, user.password);
}

module.exports = {
    getDepartments,
    getRoles,
    getEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    createUser,
    verifyUser
};
