import cors from "cors";
import express from "express";
import * as turf from "@turf/turf";
import { Units } from "@turf/helpers";

const app = express();
app.use(cors());
app.use(express.json());
const port = 8080;

// Generate a random goal coordinate within a 1km radius
app.post("/generate-goal", (req, res) => {
  try {
    const ballPosition = req.body.ballPosition;

    const point = turf.point([ballPosition.lng, ballPosition.lat]);

    const radius = 1; // 1km radius
    const options = { units: "kilometers" as Units };

    // Create a circle using the GeoJSON Point
    const circle = turf.circle(point, radius, options);

    // Generate a random point within the circle
    const randomPoint = turf.randomPoint(1, { bbox: turf.bbox(circle) });

    const goalPosition = randomPoint.features[0].geometry.coordinates;
    res.json({ goalPosition });
  } catch (error) {
    console.error("Error in /generate-goal endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Check if the ball has reached the goal
app.post("/check-goal-reach", (req, res) => {
  try {
    const { ballPosition, goalPosition } = req.body;
    if (goalPosition.lat === null || goalPosition.lng === null) {
      return res.status(400).json({ error: "Invalid goal position" });
    }

    // Convert positions to GeoJSON Points
    const ballPoint = turf.point([ballPosition.lng, ballPosition.lat]);
    const goalPoint = turf.point([goalPosition.lng, goalPosition.lat]);

    // Calculate the distance
    const distance = turf.distance(ballPoint, goalPoint, { units: "meters" });

    if (distance < 10) {
      // Ball is close to the goal, respond with goal reached
      res.json({ isGoalReached: true });
    } else {
      // Ball is not close to the goal, respond with goal not reached
      res.json({ isGoalReached: false });
      console.log("Get closer to the target!"); // Add your console log message here
    }
  } catch (error) {
    console.error("Error in /check-goal-reach endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
