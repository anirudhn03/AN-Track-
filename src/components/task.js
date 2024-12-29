import React, { useEffect, useState } from 'react';
import axios from 'axios';


function Task() {
  const [task, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);

  // fetch tasks from API and perform user rotation if due date is reached
  useEffect(() => {
    axios.get('http://localhost:3000/api/tasks')
      .then(response => {
        const updatedTasks = response.data.map((task) => {
          const dueDate = new Date(task.due);
          const startDate = new Date(task.date);
          const currentDate = new Date();
          
          if (
            currentDate.getFullYear() === dueDate.getFullYear() &&
            currentDate.getMonth() === dueDate.getMonth() &&
            currentDate.getDate() === dueDate.getDate()
          ) {
            alert(`Task "${task.name}" is due today! It will be updated tomorrow.`);
          }

          // Normalize the dates by setting the time to midnight (00:00:00)
        const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
        const normalizedDueDate = new Date(dueDate.setHours(0, 0, 0, 0));

       if (normalizedCurrentDate > normalizedDueDate) {
        const daysBetween = Math.ceil((dueDate - startDate) / (1000 * 60 * 60 * 24));
        const users = task.users;
        const nextAssignedIndex = (users.indexOf(task.assigned) + 1) % users.length;
  
            // Update the task with the new assigned user and due date
            return {
              ...task,
              assigned: users[nextAssignedIndex],
              date: new Date(startDate.getTime() + daysBetween * 86400000).toISOString(),
              due: new Date(dueDate.getTime() + daysBetween * 86400000).toISOString(),
            };
          }
          return task;
        });
        setTasks(updatedTasks);
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  // add or update a task
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newTask = {
      name: form.name.value,
      assigned: form.assigned.value,
      users: form.users.value.split(',').map(user => user.trim()),
      due: form.due.value,
      date: form.date.value,
    };
    console.log('newTask:', newTask);
    console.log('editTaskId:', editTaskId,typeof editTaskId);

    if (editTaskId) {
      // update existing task
      axios.put(`http://localhost:3000/api/tasks/${editTaskId}`, newTask)
        .then(response => {
          setTasks(task.map(t => (t._id === editTaskId ? response.data : t)));
          alert(`Task updated: ${response.data.name}`);
          form.reset();
          setEditTaskId(null);
        })
        .catch(error => console.error('Error updating task:', error));
    } else {
      // add new task
      axios.post('http://localhost:3000/api/tasks/add', newTask)
        .then(response => {
          // Add the newly created task to the state immediately
          const updatedTasks = [...task, response.data];
    
          // Check if due date is reached and perform user rotation
          updatedTasks.forEach((task) => {
            const dueDate = new Date(task.due);
            const currentDate = new Date();
            const users = task.users;
    
            // Alert if the task is due today
            if (
              currentDate.getFullYear() === dueDate.getFullYear() &&
              currentDate.getMonth() === dueDate.getMonth() &&
              currentDate.getDate() === dueDate.getDate()
            ) {
              alert(`Task "${task.name}" is due today! It will be updated tomorrow.`);
            }
            const normalizedCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));
            const normalizedDueDate = new Date(dueDate.setHours(0, 0, 0, 0));
    
            // If the due date is past, rotate the assigned user and update the due date
            if (normalizedCurrentDate > normalizedDueDate) {
              const nextAssignedIndex = (users.indexOf(task.assigned) + 1) % users.length;
              task.assigned = users[nextAssignedIndex];
              task.due = new Date(dueDate.getTime() + (Math.ceil((dueDate - new Date(task.date)) / (1000 * 60 * 60 * 24))) * 86400000).toISOString();
            }
          });
    
          // Immediately update the task list in the state
          setTasks(updatedTasks);
          alert(`Task ${response.data.name} created`);
          form.reset();
        })
        .catch(error => console.error('Error adding task:', error));
    }
  };
  // delete a task
  const handleDeleteTask = (id) => {
    axios.delete(`http://localhost:3000/api/tasks/${id}`)
      .then(() => {
        setTasks(task.filter(t => t._id !== id));
        alert('Task deleted successfully');
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  // edit a task
  const handleEditTask = (t) => {
    setEditTaskId(t._id);
    const form = document.querySelector('form');
    form.name.value = t.name;
    form.assigned.value = t.assigned;
    form.users.value = t.users.join(', ');
    form.date.value = new Date(t.date).toISOString().split('T')[0];
    form.due.value = new Date(t.due).toISOString().split('T')[0];
  };

  return (
    <div>
      <h1><center>Task</center></h1>

      {/* form for creating or editing a task */}
      <form onSubmit={handleTaskSubmit}>
        <h2>{editTaskId ? 'Edit Task' : 'Add Task'}</h2>
        <label>
          Task Name:
          <input type="text" name="name" placeholder="Enter task name" required />
        </label>
        <br />
        <label>
          Assign To:
          <input type="text" name="assigned" placeholder="Enter assigned user" required />
        </label>
        <br />
        <label>
          Users (comma-separated):
          <input
            type="text"
            name="users"
            placeholder="Enter list of users separated by commas"
            required
          />
        </label>
        <br />
        <label>
          Start Date:
          <input type="date" name="date" required />
        </label>
        <br />
        <label>
          Due Date:
          <input type="date" name="due" required />
        </label>
        <br />
        <button type="submit">{editTaskId ? 'Update Task' : 'Add Task'}</button>
      </form>

      {/* display task list */}
      <h2><center>Task List</center></h2>
      <ul>
        {task.length === 0 && <li>No Tasks Available !</li>}
        {task.length > 0 && task.map((t) => {
          const formattedDate = new Date(t.date).toLocaleDateString('en-GB'); // Formats 'on' date
          const formattedDue = new Date(t.due).toLocaleDateString('en-GB'); // Formats 'due' date

          return (
            <li key={t._id}>
              <strong>Task:</strong> {t.name}, <strong>Assigned To:</strong> {t.assigned}, <strong>On:</strong> {formattedDate}, <strong>Due:</strong> {formattedDue}, <strong>Users:</strong> {t.users.join(', ')}
              <button onClick={() => handleEditTask(t)}>Edit</button>
              <button onClick={() => handleDeleteTask(t._id)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Task;
