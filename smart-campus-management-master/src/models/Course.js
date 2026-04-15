import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: String,
    category: {
      type: String,
      default: "General"
    },
    thumbnail: {
      type: String,
      default: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
    },
    duration: {
      type: String,
      default: "4 Weeks"
    },
    lessons: {
      type: Number,
      default: 10
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;