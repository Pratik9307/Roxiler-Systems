import { useEffect, useState } from 'react';
import { fetchStatistics } from '../services/api'; // Adjust the import path as needed

const StatisticsComponent = ({ month }) => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getStatistics = async () => {
            try {
                setLoading(true);
                const data = await fetchStatistics(month);
                setStatistics(data);
            } catch (err) {
                setError(err.message || "Error fetching statistics");
            } finally {
                setLoading(false);
            }
        };

        getStatistics();
    }, [month]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Statistics for {new Date(2021, month - 1).toLocaleString('default', { month: 'long' })}</h2>
            <p>Total Sales: ${statistics.totalSalesAmount}</p>
            <p>Total Sold Items: {statistics.totalSoldItems}</p>
            <p>Total Unsold Items: {statistics.totalUnsoldItems}</p>
        </div>
    );
};

export default StatisticsComponent;
