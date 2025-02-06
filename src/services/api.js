import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

const validateMonth = (month) => {
    return Number.isInteger(month) && month >= 1 && month <= 12;
};

export const fetchTransactions = async (month, page, perPage, search) => {
    if (!validateMonth(month)) {
        throw new Error("Invalid month parameter");
    }

    const response = await axios.get(`${API_URL}/list`, {
        params: { month, page, perPage, search }
    });
    return response.data;
};




export const fetchBarChartData = async (month) => {
    if (!validateMonth(month)) throw new Error("Invalid month parameter");

    const response = await axios.get(`${API_URL}/bar-chart`, {
        params: { month }
    });
    return response.data;
};

export const fetchPieChartData = async (month) => {
    if (!validateMonth(month)) throw new Error("Invalid month parameter");

    const response = await axios.get(`${API_URL}/pie-chart`, {
        params: { month }
    });
    return response.data;
};

export const fetchStatistics = async (month) => {
    if (!validateMonth(month)) {
        throw new Error("Invalid month parameter");
    }

    // Update the API URL to the correct one
    const response = await axios.get(`${API_URL}/statistics`, {
        params: { month }
    });
    return response.data;
};

