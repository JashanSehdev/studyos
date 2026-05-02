import mongoose from "mongoose";
import { Assignment } from "../models/assignment.model.js";

//Get all assignment for loggedIn user
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      user_id: new mongoose.Types.ObjectId(req.userId),
    }).sort({ due_date: 1 });
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createAssignment = async (req, res) => {
  const { title, subject, due_date, priority } = req.body;
  try {
    const assignment = await Assignment.create({
      user_id: new mongoose.Types.ObjectId(req.userId),
      title,
      subject,
      due_date,
      priority,
    });
    res.status(200).json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateAssignment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid assignment ID" });
  }

  try {
    const { title, subject, due_date, priority, status } = req.body;

    const updatedAssignment = await Assignment.findOneAndUpdate(
      {
        user_id: new mongoose.Types.ObjectId(req.userId),
        _id: new mongoose.Types.ObjectId(id),
      },
      {
        title,
        subject,
        due_date,
        priority,
        status,
      },
      { returnDocument: 'after' },
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: " Assignment not found" });
    }
    res.json(updatedAssignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteAssignment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid assignment ID" });
  }

  try {
    const deleted = await Assignment.findOneAndDelete({
      user_id: new mongoose.Types.ObjectId(req.userId),
      _id: new mongoose.Types.ObjectId(id)
    });

    if (!deleted) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json({ message: "Assignment Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
