import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setBallPosition } from "./store/slices/ballSlice";
import { RootState, AppDispatch } from "./store";
import MapComponent from "./components/MapComponent";
import { calculateDistance } from "./utils";
import { Position, StatusLog } from "./types";

import "./App.scss"; // Import your SCSS file

function App() {
  const dispatch: AppDispatch = useDispatch();
  const ballPosition = useSelector(
    (state: RootState) => state.ball.ballPosition
  );
  const [isGoalFetched, setIsGoalFetched] = useState(false);
  const [goalPosition, setGoalPosition] = useState<Position>({
    lat: null,
    lng: null,
  });
  const [statusLogs, setStatusLogs] = useState<StatusLog[]>([
    { title: "Initialize Game", subTitle: "Game is initializing..." },
  ]);
  const [darkMode, setDarkMode] = useState(false);
  const addStatusLog = (title: string, subTitle: string) => {
    setStatusLogs([...statusLogs, { title, subTitle }]);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Initialze ball and goal data.
  useEffect(() => {
    const fetchGoalPosition = async () => {
      try {
        addStatusLog(
          "Getting Location from Server",
          "Data received. Navigate to your goal!"
        );
        const response = await fetch("http://localhost:8080/generate-goal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ballPosition: { lat: ballPosition.lat, lng: ballPosition.lng },
          }),
        });
        if (!response.ok) {
          throw new Error("Response not ok");
        }
        const data = await response.json();
        if (
          data.goalPosition &&
          data.goalPosition.length === 2 &&
          data.goalPosition[0] !== 0 &&
          data.goalPosition[1] !== 0
        ) {
          setGoalPosition({
            lat: data.goalPosition[1],
            lng: data.goalPosition[0],
          });
        }
      } catch (error) {
        console.error("Error fetching goal position:", error);
      }
    };

    if (
      !isGoalFetched &&
      ballPosition.lat !== null &&
      ballPosition.lng !== null
    ) {
      fetchGoalPosition();
      setIsGoalFetched(true);
    }
  }, [ballPosition, isGoalFetched]);

  // Check for goal reach
  useEffect(() => {
    const checkGoalReach = async () => {
      try {
        const response = await fetch("http://localhost:8080/check-goal-reach", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ballPosition, goalPosition }),
        });
        if (!response.ok) {
          throw new Error("Response not ok");
        }
        const data = await response.json();
        if (data.isGoalReached) {
          alert("GOAL!");
        } else if (data.message) {
          console.log(data.message); // or handle this message in another way
        }
      } catch (error) {
        console.error("Error checking goal reach:", error);
      }
    };

    checkGoalReach();
  }, [ballPosition, goalPosition]);

  // testing...
  const handleKeyPress = (event: KeyboardEvent) => {
    let newLat = ballPosition.lat;
    let newLng = ballPosition.lng;
    const step = 0.0001; // Adjust the step size for movement

    switch (event.key) {
      case "ArrowUp":
        newLat += step;
        break;
      case "ArrowDown":
        newLat -= step;
        break;
      case "ArrowLeft":
        newLng -= step;
        break;
      case "ArrowRight":
        newLng += step;
        break;
      default:
        return; // Ignore other keys
    }

    dispatch(setBallPosition({ lat: newLat, lng: newLng }));
  };

  // Real-time user tracking
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [ballPosition, dispatch]);

  // Real-time tracking of user's location
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        dispatch(
          setBallPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        );
      },
      (error) => {
        console.error("Error getting location", error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [dispatch]);

  // Proximity check function
  useEffect(() => {
    if (goalPosition.lat !== null && goalPosition.lng !== null) {
      const distance = calculateDistance(ballPosition, goalPosition);
      if (distance < 10) {
        addStatusLog("Goal Reached", "Congratulations, you reached the goal!");
      }
    }
  }, [ballPosition, goalPosition]);

  // Reversed logs
  const reversedLogs = [...statusLogs].reverse();

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="top-bar">
        <span>
          Current Position: {ballPosition.lat}, {ballPosition.lng}
        </span>
        <div className="dark-mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? "🌙" : "☀️"}
        </div>
      </div>
      <div className="menu">
        <h1>Navigation Challenge</h1>
      </div>
      <MapComponent ballPosition={ballPosition} goalPosition={goalPosition} />
      <div className="status-logs">
        <h2>Status Logs</h2>
        <ul>
          {reversedLogs.map((log, index) => (
            <li key={index}>
              <h3>{log.title}</h3>
              <p>{log.subTitle}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
