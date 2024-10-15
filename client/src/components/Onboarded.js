import React, { useState, useEffect } from 'react';
import { List, Avatar, Spin, Alert } from 'antd';
import axios from 'axios';
const URL = process.env.REACT_APP_API_URL;
const OnboardedCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${URL}/candidate/Onboarded`);
        const onboardedCandidates = response.data.filter(candidate => candidate.status === 'Onboarded');
       
        const sortedCandidates = onboardedCandidates.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
        setCandidates(sortedCandidates.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setError('Failed to fetch candidates');
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) {
    return <Spin tip="Loading candidates..." />;
  }

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div>
      <center><h1>New EnFusians Onboarded</h1></center>
      <List
        itemLayout="horizontal"
        dataSource={candidates}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.avatarUrl} />}
              title={<span style={{ textTransform: 'capitalize' }}>{item.fullName}, {item.position} from {item.currentLocation}</span>}
            />
            <div style={{ float: 'right', marginRight: '20px', color: 'grey' }}>
              On {formatDate(item.joiningDate)}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default OnboardedCandidates;
