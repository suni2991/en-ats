import React, { useEffect, useState, useRef } from 'react';
import { Carousel, Card, Spin, Button, Empty } from 'antd';
import axios from 'axios';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const Hotpicks = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchSelectedCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:5040/candidate/Onboarded');
        const selectedCandidates = response.data.reverse()
          .filter(candidate => candidate.status === 'Onboarded')
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
    <div className='hotpicks' style={{ position: 'relative' }}>
    <h1 style={{margin:'10px', fontSize:'22px' }}>HOT PICKS</h1><br/>
      {loading ? (
        <Spin size="large" />
      ) : selectedCandidates.length ? (
        <div>
          <Button
            type="primary"
            shape="circle"

            icon={<LeftOutlined />}
            onClick={prev}
            style={{ position: 'absolute', top: '50%', left: '0', background:'#00B4D2', transform: 'translateY(-50%)', zIndex: 1 }}
          />
          <Carousel ref={carouselRef} dots={false} slidesToShow={4} slidesToScroll={4} infinite={false}>
            {selectedCandidates.map(candidate => (
              <div key={candidate._id}>
                <Card
                  title={<h2>{candidate.fullName}</h2>}
                  className="card-hover"
                  style={{ padding:'5px', width: 220, margin: '0px 20px 0px 20px', textTransform: 'capitalize', borderRadius: '1px',
                boxShadow: '0px 2px 4px rgb(38, 39, 130)', }}

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
            style={{ position: 'absolute', top: '50%', right: '0',background:'#00B4D2', transform: 'translateY(-50%)', zIndex: 1 }}
          />
        </div>
      ) : (
        <Empty description="No selected candidates available" />
      )}
    </div>
  );
};

export default Hotpicks;
