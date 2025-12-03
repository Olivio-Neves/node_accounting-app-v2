const users = [];
const expenses = [];

let userIdCounter = 1;
let expenseIdCounter = 1;

function getNextUserId() {
  return userIdCounter++;
}

function getNextExpenseId() {
  return expenseIdCounter++;
}

module.exports = {
  users,
  expenses,
  getNextUserId,
  getNextExpenseId,
};
