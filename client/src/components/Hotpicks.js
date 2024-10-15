import React, { useEffect, useState, useRef } from 'react';
import { Carousel, Card, Spin, Button, Empty } from 'antd';
import axios from 'axios';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
const URL = process.env.REACT_APP_API_URL;
const Hotpicks = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchSelectedCandidates = async () => {
      try {
        const response = await axios.get(`${URL}/candidate/Onboarded`);
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
    <div className='hotpicks'>
    <h1 style={{margin:'10px 20px', fontSize:'20px' }}>HOT PICKS</h1><br/>
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
          <Carousel ref={carouselRef} dots={false} slidesToShow={3} slidesToScroll={3} infinite={false}>
            {selectedCandidates.map(candidate => (
              <div key={candidate._id} >
                <Card
                  title={<h2>{candidate.fullName}</h2>}
                  className="card-hover"
                  style={{ padding:'5px', width: '220px', height:'220px', margin: '10px 20px 10px 20px', textTransform: 'capitalize', borderRadius: '10px',
                          boxShadow: '0px 1px 2px rgb(38, 39, 130)', }}
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
