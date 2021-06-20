import dayjs from 'dayjs';

const BASEURL = '/api';

async function getAllExams () {
    const response = await fetch(BASEURL + '/exams');
    const examsJson = await response.json();
    if (response.ok) {
      return examsJson.map( e => ({coursecode: e.code, score: e.score, date: dayjs(e.date)}));
    } else {
      throw examsJson;  // an object with the error coming from the server
    }
  };

async function getAllCourses () {
    const response = await fetch(BASEURL + '/courses');
    const coursesJson = await response.json();
    if (response.ok)
        return coursesJson.map( c => ({coursecode: c.code, name: c.name, CFU: c.CFU}));
    else
        throw coursesJson;

};

//const API = {deleteExam, addExam, updateExam, logIn, logOut, getUserInfo};
const API = { getAllCourses, getAllExams };
export default API;