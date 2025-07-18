const faker = require('faker');
const db = require("./db");
const Experience = require('../models/experienceModel');

// Tạo dữ liệu mock cho kinh nghiệm làm việc
const mockExperiences = [
  { experience_level: 'Dưới 1 năm kinh nghiệm' },
  { experience_level: 'Từ 1-2 năm kinh nghiệm' },
  { experience_level: 'Từ 2-3 năm kinh nghiệm' },
  { experience_level: 'Từ 3-4 năm kinh nghiệm' },
  { experience_level: 'Từ 4-5 năm kinh nghiệm' },
  { experience_level: 'Trên 5 năm kinh nghiệm' },
];

Experience.insertMany(mockExperiences)
  .then(() => console.log('Mock experiences inserted'))
  .catch((err) => console.log('Error inserting experiences:', err));
