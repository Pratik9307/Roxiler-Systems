import React, { useState } from 'react';
import './App.css';
import TransactionTable from './components/TransactionTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const App = () => {
    const [month, setMonth] = useState(1); // Default month set to January (1)

    const handleMonthChange = (e) => {
        const selectedMonth = parseInt(e.target.value, 10);
        setMonth(selectedMonth);
    };

    return (
        <div className="app-container">
            <h1 className="app-title">MERN Stack Transactions</h1>

            <div className="month-selector">
                <label>Select Month: </label>
                <select value={month} onChange={handleMonthChange} className="month-dropdown">
                    {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {new Date(2021, i).toLocaleString('default', { month: 'long' })}
                        </option>
                    ))}
                </select>
            </div>

            <Statistics month={month} />
            <TransactionTable month={month} />
            <BarChart month={month} />
            <PieChart month={month} />
        </div>
    );
};

export default App;

