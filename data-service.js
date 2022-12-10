const Sequelize = require('sequelize');

var sequelize = new Sequelize('bsztmjux', 'bsztmjux', 'xr9XEUE-lh2WNKPLccHlk8_WX0mUhuC0', {
    host: 'peanut.db.elephantsql.com', 
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    },
query: { raw: true }
});

//Authentication
sequelize.authenticate()
        .then(()=>console.log("connection success"))
        .catch((err)=>{
            console.log("connection failed.");
            console.log(err);
        }); 

// Creating Employee Model
const Employee = sequelize.define("Employee",{
    employeeNum:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addresCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    matritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
    }, {
        createdAt: false, // disable createdAt
        updatedAt: false // disable updatedAt
});

//Creating Department Model
const Department = sequelize.define("Department",{
    departmentId:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
    }, {
        createdAt: false, // disable createdAt
        updatedAt: false // disable updatedAt
});

//initilize
exports.initialize = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            console.log("connected to database")
            resolve()
        }).catch(err => reject("unable to sync the database"))
    })
};

//get All Employees
exports.getAllEmployees= () => {
    return new Promise((resolve,reject) => {
      Employee.findAll().then((data)=>{
        resolve(data);
      }).catch((err)=>{
        reject( "no results returned");
      });
    });
};

  
//get Employee by Status
exports.getEmployeesByStatus= (status) =>{
    return new Promise((resolve,reject) => {
      Employee.findAll({ where:{status}
      }).then((data)=>{
        resolve(data);
      }).catch((err)=>{
        reject("no results returned");
      });
  });
};

//get Employee by Department
exports.getEmployeesByDepartment= (department) =>{
    return new Promise((resolve,reject) => {
      Employee.findAll({ where:{department}
      }).then((data)=>{
        resolve(data);
      }).catch((err)=>{
        resolve( "no results returned");
      });
    });
};

//get Employee by Manager
exports.getEmployeesByManager= (manager) => {
    return new Promise((resolve,reject)=>{
      Employee.findAll({ where:{employeeManagerNum:manager}
      }).then((data)=>{
        resolve(data);
      }).catch((err)=>{
        reject("no results returned");
      });
    });  
};

//get Employee By Number
exports.getEmployeeByNum=(num) => {
    return new Promise((resolve,reject)=>{
        Employee.findAll({ where:{ employeeNum:num }
        }).then((data)=>{
          resolve(data[0]);
        }).catch((err)=>{
          reject("no results returned");
      });  
  });
};


 //get Department
exports.getDepartments = () => {
    return new Promise((resolve, reject) => {
        Department.findAll().then(data => {
            resolve(data)
          }).catch((err)=>{
            reject("no results returned");
        });  
    });
};

//Add Employee
exports.addEmployee= (employeeData) => {
    return new Promise((resolve,reject) => {
      employeeData.isManager = (employeeData.isManager) ? true : false;
      for(const key in employeeData){
        if(employeeData[key] == '')
        {
          employeeData[key] = null;
        }
      }
      Employee.create({
        firstName:employeeData.firstName,
        lastName:employeeData.lastName,
        email:employeeData.email,
        SSN:employeeData.SSN,
        addressStreet:employeeData.addressStreet,
        addressCity:employeeData.addressCity,
        addressState:employeeData.addressState,
        addressPostal:employeeData.addressPostal,
        maritalStatus:employeeData.maritalStatus,
        isManager:employeeData.isManager,
        employeeManagerNum:employeeData.employeeManagerNum,
        status:employeeData.status,
        department: employeeData.department,
        hireDate:employeeData.hireDate
      }).then(()=>{
        resolve("Employee created successfully");
      }).catch((err)=>{
        reject("unable to create employee");
      });
  });
};


//update Employee
exports.updateEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (const key in employeeData) {
            if (employeeData[key] == '') {
                employeeData[key] = null
            }
        }
        Employee.update({
            employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate,
        }, { where: { employeeNum: employeeData.employeeNum } 
        }).then(()=>{
            resolve("Employee updated successfully");
        }).catch((err)=>{
            reject("unable to update employee");
        });
    });
};

//Add department
exports.addDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        for (const property in departmentData) {
            if (departmentData[property] == '') {
                departmentData[property] = null
            }
        }
        Department.create({
            departmentId: departmentData.departmentId,
            departmentName: departmentData.departmentName
        }).then(() => {
            resolve()
          }).catch((err)=>{
            reject("unable to create department");
        });
    });
};
  
  
  //Update department
  exports.updateDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        for (const property in departmentData) {
            if (departmentData[property] == '') {
                departmentData[property] = null
            }
        }
        Department.update({
            departmentId: departmentData.departmentId,
            departmentName: departmentData.departmentName
        }, { where: { departmentId: departmentData.departmentId }
        }).then(()=>{
            resolve("department updated successfully");
          }).catch((err)=>{
            reject("unable to update department");
        });
    });
};

//Get department by ID
exports.getDepartmentById = (id) => {
    return new Promise((resolve, reject) => {
        Department.findAll({ where: { departmentId: id } }).then(data => {
            resolve(data[0])
          }).catch((err)=>{
            reject("no results returned");
        });
    })
  }
  
  
//Delete employee by Num
exports.deleteEmployeeByNum = (empNum) => {
    return new Promise((resolve, reject) => {
        Employee.destroy({ where: { employeeNum: empNum } 
        }).then(() => {
           resolve()
        }).catch((err)=>{
           reject("no results returned");
        });  
    });
};
  
  