// const axios = require('axios');
// const Transaction = require('../models/Transaction');

// // Third-party API URL
// const THIRD_PARTY_API_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

// // Controller function to fetch and initialize the database
// const initializeDatabase = async (req, res) => {
//     try {
//         // Fetch the data from the third-party API
//         const response = await axios.get(THIRD_PARTY_API_URL);
//         const data = response.data;

//         // Clear the existing collection (optional: only if you want to remove old data)
//         await Transaction.deleteMany({});

//         // Insert the fetched data into the database
//         await Transaction.insertMany(data);

//         res.status(200).json({ message: 'Database initialized with seed data successfully' });
//     } catch (error) {
//         console.error('Error initializing the database:', error);
//         res.status(500).json({ message: 'Failed to initialize the database', error });
//     }
// };

// module.exports = { initializeDatabase };


const Transaction = require('../models/Transaction');

const listTransactions = async (req, res) => {
    try {
        const { month, page = 1, perPage = 10, search = '' } = req.query;

        // Ensure the month is provided
        if (!month || isNaN(month)) {
            return res.status(400).json({ message: "Month parameter is required and must be a valid number." });
        }

        const monthInt = parseInt(month, 10);

        if (monthInt < 1 || monthInt > 12) {
            return res.status(400).json({ message: "Invalid month provided. Please provide a value between 1 and 12." });
        }

        const searchRegex = new RegExp(search, 'i');

        // Convert the provided month into a date range
        const startOfMonth = new Date(2021, monthInt - 1, 1);
        const endOfMonth = new Date(2021, monthInt, 0);

        const query = {
            dateOfSale: { $gte: startOfMonth, $lte: endOfMonth },
        };

        if (search) {
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
            ];

            if (!isNaN(search)) {
                query.$or.push({ price: Number(search) });
            }
        }

        // Fetch transactions with pagination
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        const totalRecords = await Transaction.countDocuments(query);

        res.status(200).json({
            transactions,
            pagination: {
                page: parseInt(page),
                perPage: parseInt(perPage),
                totalPages: Math.ceil(totalRecords / perPage),
                totalRecords,
            }
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};

module.exports = { listTransactions };

const getStatistics = async (req, res) => {
    try {
        let { month } = req.query;
        if (!month) return res.status(400).json({ message: "Month is required" });

        month = parseInt(month, 10);
        if (isNaN(month) || month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid month value" });
        }

        const startOfMonth = new Date();
        startOfMonth.setMonth(month - 1, 1);  // Set the month, but keep the current year
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(startOfMonth.getMonth() + 1, 0);  // Set to the last day of the selected month

        console.log('Start of Month:', startOfMonth);
        console.log('End of Month:', endOfMonth);

        // Aggregate statistics (total sales amount, sold items, unsold items)
        const totalSales = await Transaction.aggregate([
            { 
                $match: { 
                    dateOfSale: { 
                        $gte: startOfMonth, 
                        $lte: endOfMonth 
                    } 
                }
            },
            {
                $group: {
                    _id: null,
                    totalSalesAmount: { $sum: "$price" },
                    totalSoldItems: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
                    totalUnsoldItems: { $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] } }
                }
            }
        ]);

        // Send the response with the aggregated data
        res.status(200).json(totalSales[0] || {
            totalSalesAmount: 0,
            totalSoldItems: 0,
            totalUnsoldItems: 0
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ message: 'Error fetching statistics', error });
    }
};



// Get price range data for a bar chart
const getPriceRangeData = async (req, res) => {
    try {
        const { month } = req.query;

        // Define the start and end date of the month
        const startOfMonth = new Date(2021, month - 1, 1);
        const endOfMonth = new Date(2021, month, 0);

        // Define price ranges
        const priceRanges = [
            { range: '0-100', min: 0, max: 100 },
            { range: '101-200', min: 101, max: 200 },
            { range: '201-300', min: 201, max: 300 },
            { range: '301-400', min: 301, max: 400 },
            { range: '401-500', min: 401, max: 500 },
            { range: '501-600', min: 501, max: 600 },
            { range: '601-700', min: 601, max: 700 },
            { range: '701-800', min: 701, max: 800 },
            { range: '801-900', min: 801, max: 900 },
            { range: '901-above', min: 901, max: Infinity }
        ];

        // Aggregation to calculate number of items in each price range
        const priceData = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startOfMonth, $lte: endOfMonth } } },
            {
                $facet: priceRanges.reduce((facets, range) => {
                    facets[range.range] = [
                        { $match: { price: { $gte: range.min, $lte: range.max } } },
                        { $count: "count" }
                    ];
                    return facets;
                }, {})
            }
        ]);

        res.status(200).json(priceData);
    } catch (error) {
        console.error('Error fetching price range data:', error);
        res.status(500).json({ message: 'Error fetching price range data', error });
    }
};

// Get category data for a pie chart
const getCategoryData = async (req, res) => {
    try {
        const { month } = req.query;

        // Define the start and end date of the month
        const startOfMonth = new Date(2021, month - 1, 1);
        const endOfMonth = new Date(2021, month, 0);

        // Aggregation to calculate number of items per category
        const categoryData = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startOfMonth, $lte: endOfMonth } } },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json(categoryData);
    } catch (error) {
        console.error('Error fetching category data:', error);
        res.status(500).json({ message: 'Error fetching category data', error });
    }
};

module.exports = {
    listTransactions,
    getStatistics,
    getPriceRangeData,
    getCategoryData
};
