import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Split() {
  const [split, setSplit] = useState([]);
  const [editSplitId, setEditSplitId] = useState(null);

  // fetch splits from api
  useEffect(() => {
    axios.get('http://localhost:3000/api/splits')
      .then(response => setSplit(response.data))
      .catch(error => console.error('error fetching splits:', error));
  }, []);

  // add or update a split
  const handleSplitSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newSplit = {
      name: form.name.value,
      amount: parseFloat(form.amount.value),
      date: form.date.value,
      people: parseInt(form.people.value),
    };

    if (editSplitId) {
      // update existing split
      axios.put(`http://localhost:3000/api/splits/${editSplitId}`, newSplit)
        .then(response => {
          setSplit(split.map(s => (s._id === editSplitId ? response.data : s)));
          alert(`split updated: ${response.data.name}, each person pays $${(response.data.amount / response.data.people).toFixed(2)}`);
          form.reset();
          setEditSplitId(null);
        })
        .catch(error => console.error('error updating split:', error));
    } else {
      // add new split
      axios.post('http://localhost:3000/api/splits/add', newSplit)
        .then(response => {
          setSplit([...split, response.data]);
          alert(`split added: ${response.data.name}, each person pays $${(response.data.amount / response.data.people).toFixed(2)}`);
          form.reset();
        })
        .catch(error => console.error('error adding split:', error));
    }
  };

  // delete a split
  const handleDeleteSplit = (id) => {
    axios.delete(`http://localhost:3000/api/splits/${id}`)
      .then(() => {
        setSplit(split.filter(s => s._id !== id));
        alert('split deleted successfully.');
      })
      .catch(error => console.error('error deleting split:', error));
  };

  // edit a split
  const handleEditSplit = (s) => {
    setEditSplitId(s._id);
    const form = document.querySelector('form');
    form.name.value = s.name;
    form.amount.value = s.amount;
    form.date.value = new Date(s.date).toISOString().split('T')[0];
    form.people.value = s.people;
  };

  return (
    <div>
      <h1><center>Split</center></h1>

      {/* form for adding or updating a split */}
      <form onSubmit={handleSplitSubmit}>
        <h2>{editSplitId ? 'edit split' : 'Add'}</h2>
        <label>
           Name:
          <input type="text" name="name" placeholder="enter name" required />
        </label>
        <br />
        <label>
          Total Amount:
          <input
            type="number"
            name="amount"
            step="0.01"
            placeholder="enter total amount"
            required
          />
        </label>
        <br />
        <label>
          Date:
          <input type="date" name="date" required />
        </label>
        <br />
        <label>
          Number of People:
          <input
            type="number"
            name="people"
            placeholder="enter number of people"
            min="1"
            required
          />
        </label>
        <br />
        <button type="submit">{editSplitId ? 'update split' : 'Add'}</button>
      </form>

      {/* display split list */}
      <h2><center>Split List</center></h2>
<ul>
  {split.length === 0 && <li>Empty !</li>}
  {split.length > 0 && split.map((s) => {
    // Convert the date field to a Date object
    const formattedDate = new Date(s.date).toLocaleDateString('en-GB'); // Formats 'on' date

    return (
      <li key={s._id}>
        <strong>Name:</strong> {s.name}, <strong>Amount:</strong> {s.amount}, <strong>Each Pays: $</strong> {(s.amount / s.people).toFixed(2)},<strong>On:</strong> {formattedDate}, <strong>Number of People:</strong> {s.people}
        <button onClick={() => handleEditSplit(s)}>Edit</button>
        <button onClick={() => handleDeleteSplit(s._id)}>Delete</button>
      </li>
    );
  })}
</ul>

    </div>
  );
}

export default Split;
