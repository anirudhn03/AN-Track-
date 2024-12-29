import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Expense from './components/expense';
import Split from './components/split';
import Task from './components/task';

function App() {
    return (
        <Router>
            <div>
                <h1><center>AN Track</center></h1>

                {/* Navigation Bar */}
                <nav>
                    <ul>
                        <li><NavLink to="/expense" activeClassName="active-link">Expense</NavLink></li>
                        <li><NavLink to="/split" activeClassName="active-link">Split</NavLink></li>
                        <li><NavLink to="/task" activeClassName="active-link">Task</NavLink></li>
                    </ul>
                </nav>

                {/* Page Routes */}
                <Routes key={location.pathname}>
    <Route 
        path="/" 
        element={
            <div>
                <h2 style={{ textAlign: 'center' }}>Welcome to AN Track!</h2>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <h3>ORGANIZE. TRACK. ACHIEVE !</h3>
                </div>
            </div>
        } 
    />
    <Route path="/expense" element={<Expense />} />
    <Route path="/split" element={<Split />} />
    <Route path="/task" element={<Task />} />
</Routes>
            </div>
        </Router>
    );
}

export default App;
