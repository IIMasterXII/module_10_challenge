INSERT INTO department (department_name)
VALUES ('Sales'),
       ('Marketing'),
       ('Production');
       
INSERT INTO role (title, salary, department_id)
VALUES ('Sales Manager', 50.00, 001),
       ('Marketing Manager', 60.00, 002),
       ('Production Manager', 40.00, 003),
       ('Sales Rep', 30.00, 001),
       ('Marketer', 40.00, 002),
       ('Worker', 20.00, 003);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Erich', 'Showalter', 001, null),
       ('Reed', 'Richards', 002, null),
       ('Brian', 'Johnson', 003, null),
       ('Susan', 'Stevens', 004, 002),
       ('Bob', 'Smith', 005, 001),
       ('Steve', 'Rogers', 006, 003);