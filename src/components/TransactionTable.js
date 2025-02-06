import React, { useState, useEffect } from 'react';
import { fetchTransactions } from '../services/api';
import "./Transaction.css";

const TransactionTable = ({ month }) => {
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [search, setSearch] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            if (!month) return;
            try {
                const data = await fetchTransactions(month, page, perPage, search);
                setTransactions(data.transactions || []);
                setTotalPages(data.pagination?.totalPages || 1);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        fetchData();
    }, [month, page, search]);

    return (
        <div className="transaction-dashboard">
            <h2>Transaction Dashboard</h2>

            <div className="controls">
                <input
                    type="text"
                    value={search}
                    placeholder="Search transaction"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <table className="transaction-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td>{transaction.id}</td>
                                <td>{transaction.title}</td>
                                <td>{transaction.description}</td>
                                <td>${transaction.price.toFixed(2)}</td>
                                <td>{transaction.category}</td>
                                <td>{transaction.sold ? 'Yes' : 'No'}</td>
                                <td>
                                    <img src={transaction.image} alt={transaction.title} className="transaction-image" />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No transactions found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>Next</button>
            </div>
        </div>
    );
};

export default TransactionTable;
