const express = require("express");
const Settings = require("../model/SettingsModel");
const { authenticate } = require("../middleware/CheckAuthMiddleware");

const settingsRouter = express.Router();

settingsRouter.post("/saveData", async (req, res) => {
  try {
    console.log("Received request data:", req.body); // Log request data

    const {
      category,
      topic,
      numberOfQuestions
    } = req.body;

    // Check if topic and category are provided
    let settingsData;
    if (topic && category) {
      const existingTopic = await Settings.findOne({ topic, category });
     
      if (existingTopic) {
        console.log("Duplicate entry detected.");
        return res.status(409).json({ message: "Duplicate entry detected." });
      } else {
        settingsData = new Settings({
          category,
          topic,
          numberOfQuestions,
        });
  
        settingsData = await settingsData.save();
        return res.status(201).json(settingsData);
      }
    } 

  } catch (error) {
    console.error("Error processing request:", error);
    if (error.code === 11000) {
      res.status(409).json({ message: "Duplicate entry detected." });
    } else {
      res.status(500).json({ message: "Error processing request", error: error.message });
    }
  }
});

settingsRouter.get("/getData", async (req, res) => {
  try {
    const data = await Settings.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

settingsRouter.get("/topics/:category", async (req, res) => {
  const { category } = req.params;
  // console.log("category Hi.");
  
  try {
    let topics;
    if (category === "Assessment") {
      topics = await Settings.find({ category: "Assessment" }).select(
        "topic category"
      );
    } 
   

    // Send the topics as a response
    res.status(200).json({ topics });
  } catch (err) {
    // Handle errors if any
    console.error("Error fetching topics:", err);
    res.status(500).json({ error: "Error fetching topics" });
  }
});

//get Topic by Id
settingsRouter.get("/topics/id/:topicId", async (req, res) => {
  const {topicId } = req.params;

  try {
    // Find the topic based on category and topicId
    const topic = await Settings.findOne({_id: topicId,});
    console.log("Hi");
    console.log(topic);
    
    if (topic) {
      // Respond with the found topic
      res.status(200).json({ message: "Topic fetched successfully", data: topic });
    } else {
      // Respond with a not found message if no topic is found
      res.status(404).json({ message: "Topic not found" });
    }
  } catch (error) {
    // Handle any errors
    console.error("Error fetching topic:", error);
    res.status(500).json({
      message: "An error occurred while fetching the topic",
      error: error.message,
    });
  }
});


// Update topic data
settingsRouter.put(
  "/topics/:category/:topicId",
  
  async (req, res) => {
    const updateData = req.body;
    const { category, topicId } = req.params;
    console.log("Hi");
    console.log(updateData);
    try {
      const checkTopic = await Settings.findOne({
        category: category,
        _id: topicId,
      });
      console.log("checkTopic ", checkTopic);
      if (checkTopic) {
        console.log("Topic Found");
        const updatedTopic = await Settings.findOneAndUpdate(
          {
            _id: topicId,
            category: category,
            topic: checkTopic.topic,
          },
          {
            $set: updateData,
          }
        );
        res
          .status(200)
          .json({ message: "Topic updated successfully", data: updatedTopic });
      } else {
        console.log("Topic Not Found");
        res.status(500).json({ message: "Topic Not Found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching topics",
        error: error,
      });
      // process.exit(0);
    }
  }
);

settingsRouter.delete("/topics/:category/:topicId", async (req, res) => {
  const { category, topicId } = req.params;
  try {
    const result = await Settings.findOneAndDelete({
      category: category,
      _id: topicId,
    });
    res
      .status(200)
      .json({ message: "data deleted successfully", data: result });
  } catch (error) {
    console.log("error ", error);
    res
      .status(500)
      .json({ message: "error while deleting data", error: error });
  }
});



module.exports = settingsRouter;
