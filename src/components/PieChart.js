import React, { useEffect, useState } from 'react';

const PieChartComponent = ({ month }) => {
    const [pieChartData, setPieChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // To handle errors if any

    useEffect(() => {
        // Hardcoded data for now
        const data = [
            { _id: "Category 1", count: 10 },
            { _id: "Category 2", count: 20 },
            { _id: "Category 3", count: 30 },
            { _id: "Category 4", count: 40 },
            { _id: "Category 5", count: 50 },
        ];

        try {
            if (Array.isArray(data) && data.length > 0) {
                // Transform the data into a usable structure
                const transformedData = data.map((item, index) => ({
                    name: item._id || `Category ${index + 1}`,
                    value: item.count || 0,
                }));

                setPieChartData(transformedData);
            }
        } catch (error) {
            setError('Error processing data');
            console.error('Error processing pie chart data:', error);
        } finally {
            setLoading(false);
        }
    }, [month]);

    return (
        <div>
            <h2>Category Distribution</h2>
            {loading ? (
                <p>Loading chart data...</p>
            ) : error ? (
                <p>{error}</p> // Display error message if something goes wrong
            ) : pieChartData.length > 0 ? (
                <div>
                    <p>Data is available. Render a static or other chart here.</p>
                    {/* You can place the PieChart or other chart rendering component here */}
                </div>
            ) : (
                <p>No data available for the selected month.</p>
            )}
        </div>
    );
};

export default PieChartComponent;
