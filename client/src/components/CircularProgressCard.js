import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Progress } from "antd";
import useAuth from "../hooks/useAuth";
const URL = process.env.REACT_APP_API_URL;
const CircularProgressCard = ({ job }) => {
  const [onboardedCount, setOnboardedCount] = useState(0);
  const { token } = useAuth();
  useEffect(() => {
    const fetchOnboardedCount = async () => {
      try {
        const response = await axios.get(
          `${URL}/candidate/onboarded/${job.position}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOnboardedCount(response.data.length);
      } catch (error) {
        console.error("Error fetching onboarded candidates:", error);
      }
    };

    fetchOnboardedCount();
  }, [job.position]);

  const progressPercent = (onboardedCount / job.vacancies) * 100;

  const gradientStrokeColor = {
    "0%": "#faf739",
    "40%": "rgb(186, 17, 164)",
    "60%": "#00B4D2",
    "100%": "#1A2763",
  };

  return (
    <Card
      bordered={false}
      style={{

        backgroundColor: '#FFFF',
        height: '140px',
        width: 'auto',
        textAlign: 'center',
        marginBottom: '30px',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'

      }}
    >
      <div>
        <Progress
          type="circle"
          percent={progressPercent}
          format={() => `${onboardedCount}/${job.vacancies}`}
          strokeColor={gradientStrokeColor}
          size={80}
        />
        <p style={{ paddingTop: '10px'}} >Fulfilled Till now</p>
      </div>
    </Card>
  );
};

export default CircularProgressCard;
