import Attendance from "../models/Attendance.js";

// mark attendance
export const markAttendance = async (req, res) => {
  try {
    const { course, student, status } = req.body;

    const record = await Attendance.create({
      course,
      student,
      status
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get attendance by course
export const getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ course: req.params.courseId })
      .populate("student", "name email")
      .populate("course", "title");

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};