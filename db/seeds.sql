USE company_db;

INSERT INTO department (name) VALUES 
('Engineering'), ('Human Resources'), ('Sales'), ('Marketing');

INSERT INTO role (title, salary, department_id) VALUES 
('Engineer', 80000, 1), ('HR Manager', 65000, 2), ('Sales Lead', 74000, 3), ('Marketer', 70000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Smith', 1, NULL), ('Jane', 'Doe', 2, NULL), ('Jim', 'Beam', 3, 1), ('Joe', 'Blow', 4, 2);
