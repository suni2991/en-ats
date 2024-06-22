import React, { useEffect, useState, useRef } from 'react';
import { Carousel, Card, Spin, Button } from 'antd';
import axios from 'axios';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const Hotpicks = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchSelectedCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:5040/candidate/status');
        const selectedCandidates = response.data
          .filter(candidate => candidate.status === 'Selected')
          .sort((a, b) => new Date(b.statusUpdateDate) - new Date(a.statusUpdateDate))
          .slice(0, 5);
        setSelectedCandidates(selectedCandidates);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching selected candidates:', error);
        setLoading(false);
      }
    };

    fetchSelectedCandidates();
  }, []);

  const next = () => {
    carouselRef.current.next();
  };

  const prev = () => {
    carouselRef.current.prev();
  };

  return (
    <div style={{ position: 'relative' }}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div>
          <Button
            type="primary"
            shape="circle"
            icon={<LeftOutlined />}
            onClick={prev}
            style={{ position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)', zIndex: 1 }}
          />
          <Carousel ref={carouselRef} dots={false} slidesToShow={4} slidesToScroll={4} infinite={false}>
            {selectedCandidates.map(candidate => (
              <div key={candidate._id}>
                <Card
                  title={candidate.fullName}
                  className="card-hover"
                  style={{ width: 300, margin: '0 auto', textTransform: 'capitalize' }}
                >
                  <p><strong>Position:</strong> {candidate.position}</p>
                  <p><strong>Experience:</strong> {candidate.relevantExperience} Years</p>
                  <p><strong>Location:</strong> {candidate.location}</p>
                  <p><strong>Joining:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>{new Date(candidate.joiningDate).toLocaleDateString()}</span></p>
                </Card>
              </div>
            ))}
          </Carousel>
          <Button
            type="primary"
            shape="circle"
            icon={<RightOutlined />}
            onClick={next}
            style={{ position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)', zIndex: 1 }}
          />
        </div>
      )}
    </div>
  );
};

export default Hotpicks;
