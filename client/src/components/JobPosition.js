// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

// const JobPositionPieChart = () => {
//   const [vacanciesData, setVacanciesData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('/vacancies-by-position');
//         setVacanciesData(response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];

//   // Check if vacanciesData is empty or null
//   if (!vacanciesData || vacanciesData.length === 0) {
//     return <div>No data available</div>;
//   }

//   // Transform data for Recharts
//   const chartData = vacanciesData.map((item, index) => ({
//     name: item.position || `Position ${index + 1}`, // Fallback if position is missing
//     value: item.vacancies || 0, // Fallback to 0 vacancies if not provided
//   }));

//   return (
//     <div>
//       <h2>Vacancies Pie Chart</h2>
//       <PieChart width={800} height={400}>
//         <Pie
//           dataKey="value"
//           data={chartData}
//           cx="50%"
//           cy="50%"
//           outerRadius={150}
//           fill="#8884d8"
//           label
//         >
//           {chartData.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//           ))}
//         </Pie>
//         <Tooltip />
//         <Legend />
//       </PieChart>
//     </div>
//   );
// };

// export default JobPositionPieChart;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

const JobPositionPieChart = () => {
  const [vacanciesData, setVacanciesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/vacancies-by-position');
        setVacanciesData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];

  // Check if vacanciesData is empty or null
  if (!vacanciesData || vacanciesData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h2>Vacancies Pie Chart</h2>
      <PieChart width={400} height={400}>
        <Pie
          dataKey="value"
          data={vacanciesData}
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {vacanciesData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default JobPositionPieChart;

