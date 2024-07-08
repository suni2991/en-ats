import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

const VacanciesChart = () => {
  const [vacanciesData, setVacanciesData] = useState([]);
  const targetDate = '2024-05-10'; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/vacancies-by-date'); 
        setVacanciesData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Transform data for Recharts
  const chartData = vacanciesData.map(item => ({
    date: new Date(item._id).toLocaleDateString(), // Format the date as needed
    vacancies: item.vacancies
  }));

  return (
    <div>
      <h2>No.of vacancies posted on a Day</h2>
      <BarChart width={300} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="vacancies" fill="#8884d8" barSize={30} />
        <ReferenceLine x={targetDate} stroke="red" label="Target Date" />
      </BarChart>
    </div>
  );
};

export default VacanciesChart;
