import Course from "../models/Course.js";

// create course
export const createCourse = async (req, res) => {
  try {
    const { title, description, category, thumbnail, duration, lessons } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      thumbnail,
      duration,
      lessons,
      instructor: req.user.id
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .populate("students", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// enroll in course
export const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.students.includes(req.user.id)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.students.push(req.user.id);
    await course.save();

    res.json({ message: "Enrolled successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seed courses
export const seedCourses = async (req, res) => {
  try {
    const courses = [
      {
        title: "Full Stack Web Development",
        description: "Master React, Node.js, and MongoDB with industry best practices.",
        category: "Computer Science",
        duration: "12 Weeks",
        lessons: 45,
        thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80"
      },
      {
        title: "Data Structures & Algorithms",
        description: "Ace your coding interviews with deep dives into DSA.",
        category: "Programming",
        duration: "8 Weeks",
        lessons: 32,
        thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80"
      },
      {
        title: "Artificial Intelligence Essentials",
        description: "Learn the fundamentals of Machine Learning and Neural Networks.",
        category: "Technology",
        duration: "10 Weeks",
        lessons: 28,
        thumbnail: "https://images.unsplash.com/photo-1555255707-c07966488a7b?w=800&q=80"
      },
      {
        title: "Cyber Security Fundamentals",
        description: "Protect systems and networks from digital attacks.",
        category: "Security",
        duration: "6 Weeks",
        lessons: 18,
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
      },
      {
        title: "UI/UX Design Masterclass",
        description: "Design beautiful and functional user interfaces using Figma.",
        category: "Design",
        duration: "4 Weeks",
        lessons: 15,
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"
      },
      {
        title: "Cloud Computing with AWS",
        description: "Deploy and manage scalable applications on Amazon Web Services.",
        category: "Cloud",
        duration: "8 Weeks",
        lessons: 24,
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
      }
    ];

    // Delete existing courses and insert new ones (optional, let's just insert)
    // await Course.deleteMany({});
    
    // Assign current user as instructor for seeded courses
    const seeded = courses.map(c => ({ ...c, instructor: req.user.id }));
    const result = await Course.insertMany(seeded);
    
    res.json({ message: "Courses seeded successfully", count: result.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};