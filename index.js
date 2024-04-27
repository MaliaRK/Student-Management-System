#! /usr/bin/env node
import inquirer from "inquirer";
console.log("\n***STUDENTS MANAGEMENT SYSTEM***\n");
class StudentData {
    Name;
    ID;
    course_enrolled;
    Fees;
    Balance;
    Status;
    constructor(name, id, course_enrolled, fees, balance, status) {
        this.Name = name;
        this.ID = id;
        this.course_enrolled = course_enrolled;
        this.Fees = fees;
        this.Balance = balance;
        this.Status = status;
    }
    addCourse(course) {
        const index = this.course_enrolled.indexOf(course);
        if (index >= 0) {
            console.log("\n---Error: The course you entered is already exist.");
        }
        else {
            this.course_enrolled.push(course);
        }
        ;
    }
    removeCourse(course) {
        const index = this.course_enrolled.indexOf(course);
        if (index !== -1) {
            this.course_enrolled.splice(index, 1);
        }
        ;
        if (index == -1) {
            console.log("\n---Error: The course you entered to remove is not exist.");
        }
        ;
    }
    updateCourse(oldCourse, newCourse) {
        const index = this.course_enrolled.indexOf(oldCourse);
        if (index !== -1) {
            this.course_enrolled[index] = newCourse;
        }
        ;
        if (index == -1) {
            console.log("\n---Error: The course you entered to update is not exist.");
        }
    }
    updateBalance(newBalance) {
        this.Balance = newBalance;
    }
    getDetails() {
        return {
            Name: this.Name,
            ID: this.ID,
            Course: this.course_enrolled.join(","),
            Fees: this.Fees,
            Balance: this.Balance,
            Status: this.Status
        };
    }
}
async function promptStudentData() {
    const dataAnswer = await inquirer.prompt([{
            message: "Enter student name: ",
            type: "input",
            name: "name"
        }]);
    let studentID = ''; // User-input student ID
    const usedIDs = []; // Unique student IDs to prevent duplicates
    while (studentID.length !== 5 || isNaN(Number(studentID)) || usedIDs.includes(studentID)) {
        const ans = await inquirer.prompt({
            message: "Enter valid 5-digit student id: ",
            type: "input",
            name: "id"
        });
        studentID = ans.id;
        if (studentID.length !== 5 || isNaN(Number(studentID)) || usedIDs.includes(studentID)) {
            console.log('\nError: id must be unique and 5 digit long\n');
        }
    }
    ;
    usedIDs.push(studentID);
    const answer = await inquirer.prompt([{
            message: "Enter course enrolled (comma separated): ",
            type: "input",
            name: "course",
            filter: function (value) {
                return value.split(",");
            }
        },
        {
            message: "Enter fees: ",
            type: "number",
            name: "fees"
        },
        {
            message: "Enter remaining balance: ",
            type: "number",
            name: "balance"
        },
        {
            message: "Show current status: ",
            type: "input",
            name: "status"
        }]);
    const student = new StudentData(dataAnswer.name, parseInt(studentID), // Convert id to number
    answer.course, Math.abs(answer.fees), // Ensure fees is positive
    Math.abs(answer.balance), // Ensure balance is positive
    answer.status);
    console.log('\nStudent Details:\n');
    console.log(student.getDetails());
    let action = true; // Flag for additional actions loop
    while (action) {
        const courseAction = await inquirer.prompt({
            message: "Would you like to add, remove and update your course",
            type: "list",
            name: 'CRUD',
            choices: ['add', 'remove', 'update', 'None']
        });
        if (courseAction.CRUD === 'add') {
            const newCourse = await inquirer.prompt({
                message: "Enter course to add: ",
                type: "input",
                name: "course"
            });
            student.addCourse(newCourse.course);
        }
        else if (courseAction.CRUD === 'remove') {
            const remove = await inquirer.prompt({
                message: "Enter course to remove: ",
                type: "input",
                name: "course"
            });
            student.removeCourse(remove.course);
        }
        else if (courseAction.CRUD === 'update') {
            const update = await inquirer.prompt([{
                    message: "Enter current course to update: ",
                    type: 'input',
                    name: 'currentCourse'
                },
                {
                    message: "Enter new course",
                    type: "input",
                    name: "newCourse"
                }
            ]);
            student.updateCourse(update.currentCourse, update.newCourse);
        }
        else if (courseAction.CRUD === 'None') {
            action = false;
        }
        ;
        console.log('\nUpdated student details:\n');
        console.log(student.getDetails());
    }
    ;
}
;
promptStudentData();
