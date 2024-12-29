import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Expense() {
  const [expense, setExpense] = useState([]);
  const [editExpenseId, setEditExpenseId] = useState(null);

  // Fetch expense data
  useEffect(() => {
    axios.get('http://localhost:3000/api/expenses')
      .then(response => {
        console.log('Fetched Expenses:', response.data); // Debugging the response
        setExpense(response.data);
      })
      .catch(error => console.error('Error fetching expenses:', error));
  }, []);

  // Add or update expense
  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newExpense = {
      name: form.name.value,
      amount: parseFloat(form.amount.value),
      date: form.date.value,
      budget: parseFloat(form.budget.value),
      budgetdue: form.budgetdue.value,
    };

    const totalExpense = expense.reduce((sum, exp) => sum + exp.amount, 0) + newExpense.amount;
    if (new Date(newExpense.date) <= new Date(newExpense.budgetdue)){
      if (totalExpense >= newExpense.budget * 0.8) {
        window.alert(" You're close to exceeding your budget limit !!");
      }
      else if (totalExpense >= newExpense.budget) {
        alert(" You've exceeded your budget limit! Please review your expenses.");
      }
    }

    if (editExpenseId) {
      // Update existing expense
      axios.put(`http://localhost:3000/api/expenses/${editExpenseId}`, newExpense)
        .then(response => {
          setExpense(expense.map(e => (e._id === editExpenseId ? response.data : e)));
          alert(`Expense updated: ${response.data.name} for $${response.data.amount}`);
          form.reset();
          setEditExpenseId(null);
        })
        .catch(error => console.error('Error updating expense:', error));
    } else {
      // Add new expense
      axios.post('http://localhost:3000/api/expenses/add', newExpense)
        .then(response => {
          setExpense([...expense, response.data]);
          alert(`Expense added: ${response.data.name} for $${response.data.amount}`);
          form.reset();
        })
        .catch(error => console.error('Error adding expense:', error));
    }
  };

  // Delete expense
  const handleDeleteExpense = (id) => {
    axios.delete(`http://localhost:3000/api/expenses/${id}`)
      .then(() => {
        setExpense(expense.filter(e => e._id !== id));
        alert('Expense deleted successfully.');
      })
      .catch(error => console.error('Error deleting expense:', error));
  };

  // Edit expense
  const handleEditExpense = (e) => {
    setEditExpenseId(e._id);
    const form = document.querySelector('#expenseForm');
    form.budget.value = e.budget;
    form.name.value = e.name;
    form.amount.value = e.amount;
    form.date.value = new Date(e.date).toISOString().split('T')[0];
    form.budgetdue.value = new Date(e.budgetdue).toISOString().split('T')[0]; 
  };

  return (
    <div>
      <h1><center>Expense</center></h1>

      <form id="expenseForm" onSubmit={handleExpenseSubmit}>
        <h3>{editExpenseId ? "Edit Expense" : "Add Expense"}</h3>
        <label>Budget: <input type="number" name="budget" step="0.01" placeholder="Enter budget" required /></label><br />
        <label>Name: <input type="text" name="name" placeholder="Enter name" required /></label><br />
        <label>Amount: <input type="number" name="amount" step="0.01" placeholder="Enter amount" required /></label><br />
        <label>Date: <input type="date" name="date" required /></label><br />
        <label>Due: <input type="date" name="budgetdue" required /></label><br />
        <button type="submit">{editExpenseId ? "Update Expense" : "Add Expense"}</button>
      </form>

      <ul>
        <h2>Expense List</h2>
        {expense.length === 0 && <li>No Expense Available !</li>}
        {expense.map((e) => (
          <li key={e._id}>
            <strong>{e.name}</strong> - ${e.amount} <strong>On:</strong> {new Date(e.date).toLocaleDateString('en-GB')} <br />
            <strong>Budget:</strong> ${e.budget}, <strong>Due:</strong> {new Date((e.budgetdue)).toLocaleDateString('en-GB')} 
            <button onClick={() => handleEditExpense(e)}>Edit</button>
            <button onClick={() => handleDeleteExpense(e._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Expense;
