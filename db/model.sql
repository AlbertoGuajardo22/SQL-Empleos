USE modulo12;

CREATE TABLE Departments(
    ID VARCHAR(255) primary KEY,
    name VARCHAR(255) NOT NULL
)

CREATE TABLE Roles(
    ID VARCHAR(255) primary KEY,
    name VARCHAR(255) NOT null,
    department VARCHAR(255),
    CONSTRAINT fk_department FOREIGN KEY (department) REFERENCES Departments(id) ON DELETE SET NULL
)

CREATE TABLE Employees(
    ID VARCHAR(255) primary KEY,
    name VARCHAR(255) NOT null,
    lastName VARCHAR(255) NOT null,
    role VARCHAR(255),
    manager VARCHAR(255),
    CONSTRAINT fk_role FOREIGN KEY (role) REFERENCES Roles(id) ON DELETE SET null,
    CONSTRAINT fk_manager FOREIGN KEY (manager) REFERENCES Employees(id) ON DELETE SET NULL
)


select 
	r.id as roleid,
	r.name as  roleName,
	r.salary  as roleSalary,
	d.name as departmentName
	from roles r 
	inner join departments d on r.department = d.ID 
	
	
select 
	e.id as id,
	e.name as name,
	e.lastName as lastName ,
    r.name as roleName,
	r.salary as salary ,
	d.name as department,
	e2.name as managerName,
	e2.lastName as managerLastName
	from employees e 
	left join roles r on e.`role` = r.ID 
	left join departments d on r.department = d.ID 
	left join employees e2 on e.manager = e2.ID 