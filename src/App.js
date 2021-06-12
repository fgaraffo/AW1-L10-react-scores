import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import { fakeCourses, fakeExams } from './FakeData';
import AppTitle from './AppTitle';
import { PrivacyMode, EditMode } from './createContexts';
import { ExamTable, ExamForm } from './ExamComponents'

function App() {

  const [exams, setExams] = useState([...fakeExams]);
  const [privacy, setPrivacy] = useState(false);
  const [editable, setEditable] = useState(true);

  const examCodes = exams.map(exam => exam.coursecode);
  
  const addExam = (exam) => {
    setExams((oldExams) => [...oldExams, exam]);
    //setExams((oldExams) => oldExams.concat(exam));
  };

  const updateExam = (exam) => {
    setExams(oldExams => {
      return oldExams.map(ex => {
        if (ex.coursecode === exam.coursecode)
          return {coursecode: exam.coursecode, score: exam.score, date: exam.date};
        else
          return ex;
      });
    });
  }

  const deleteExam = (coursecode) => {
    setExams((exs) => exs.filter((ex) => ex.coursecode !== coursecode));
  };

  const checkExam = (course) => {
    if (exams.filter( ex => ex.coursecode === course).length === 0)
        return true;
    else
        return false;
};

  return (
    <Router>
      <Container className='App'>
        <Row>
          <AppTitle />
          <Col align='right'>
            <Button variant='secondary' onClick={() => setPrivacy(p => !p)}>{privacy ? 'View' : 'Hide'}</Button>
            <Button variant='secondary' onClick={() => setEditable(e => !e)}>{editable ? 'Read' : 'Edit'}</Button>
          </Col>
        </Row>
        <Switch>
        <Route path="/add" render={() => 
         <ExamForm courses={fakeCourses.filter(course => !examCodes.includes(course.coursecode))} 
                  addOrUpdateExam={addExam} 
                  checkExam={checkExam} /> }/>
        <Route path="/update" render={() => 
          <ExamForm courses={fakeCourses} 
                    addOrUpdateExam={updateExam} checkExam={checkExam}/> }/>
        <Route path='/' render={ () => 
           <Row>
             <Col>
               <PrivacyMode.Provider value={privacy}>
                 <EditMode.Provider value={editable}>
                   <ExamTable exams={fakeExams} courses={fakeCourses} deleteExam={deleteExam}/>
                  </EditMode.Provider>
                </PrivacyMode.Provider>
              </Col>
            </Row>} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;