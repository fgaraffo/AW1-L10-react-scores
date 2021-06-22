import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import './App.css';
import AppTitle from './AppTitle';
import { PrivacyMode, EditMode } from './createContexts';
import { ExamTable, ExamForm } from './ExamComponents';
import { LoginForm } from './LoginComponents';
import API from './API';

function App() {

  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [privacy, setPrivacy] = useState(false);
  const [editable, setEditable] = useState(true);
  const [dirty, setDirty] = useState(true);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(()=> {
    const checkAuth = async() => {
      try {
        // here you have the user info, if already logged in
        // TODO: store them somewhere and use them, if needed
        await API.getUserInfo();
        setLoggedIn(true);
        console.log('1')
      } catch(err) {
        console.error(err.error);
        console.log('2');
      }
    };
    checkAuth();
  }, []);

  // Carica i COURSES
  useEffect( () => {
    const getCourses = async () => {
      const courses = await API.getAllCourses();
      setCourses(courses);
      setDirty(true);
      console.log('3');
    }
    if (loggedIn)
    getCourses().catch(err => {
      setErrorMsg("Impossible to load your courses! Please, try again later...");
      console.error(err);
    });;;
  }, [loggedIn]);

  // Carica gli EXAMS
  useEffect( () => {
    const getExams = async () => {
      const exams = await API.getAllExams();
      setExams(exams);
      console.log('4');
      //setDirty(false); // ANCHE QUI VA BENE

    }
    if (courses.length && dirty){
      console.log('5');
      setErrorMsg("")
      getExams().then( () => { console.log('6'); setLoading(false); setDirty(false); }).catch(err => {
        setErrorMsg(`Impossible to load your exams! Please, try again later...`);
        console.error(err);
        console.log('7');
      });}
  }, [courses.length, dirty]);
  
  const examCodes = exams.map(exam => exam.coursecode);

  const addExam = (exam) => {
    exam.status = 'added';
    setExams((oldExams) => [...oldExams, exam]);
    API.addExam(exam).then( () => { setDirty(true) }).catch(err => handleErrors(err) );
  };

  const deleteExam = (coursecode) => {
    //setExams((exs) => exs.filter((ex) => ex.coursecode !== coursecode));
    setExams( oldExams => {
      return oldExams.map( ex => {
        if (ex.coursecode === coursecode)
          return {...ex, status: 'deleted'};
        else
          return ex;
      })
    })
    API.deleteExam(coursecode).then( () => { setDirty(true) }).catch(err => handleErrors(err) );
  };

  const updateExam = (exam) => {
    setExams(oldExams => {
      return oldExams.map(ex => {
        if (ex.coursecode === exam.coursecode)
          return { coursecode: exam.coursecode, score: exam.score, date: exam.date, status: 'updated' };
        else
          return ex;
      });
    });
    API.updateExam(exam).then( () => { setDirty(true) }).catch(err => handleErrors(err) );

  }

  const handleErrors = (err) => {
    if(err.errors) // ??
      setMessage(err.errors[0].msg + ': ' + err.errors[0].param);
    else
      setMessage(err.error);

    setDirty(true);
  }

  /* Controlla che esame non sia già presente
  const checkExam = (course) => {
    if (exams.filter( ex => ex.coursecode === course).length === 0)
        return true;
    else
        return false;
};
*/

const doLogIn = async (credentials) => {
  try {
    const user = await API.logIn(credentials);
    setLoggedIn(true);
    setMessage({msg: `Welcome, ${user}!`, type: 'success'});
  } catch(err) {
    setMessage({msg: err, type: 'danger'});
  }
}

const doLogOut = async () => {
  await API.logOut();
  setLoggedIn(false);
  setLoading(true);
  // clean up everything
  setCourses([]);
  setExams([]);
  console.log('prova');
}
/*
{loggedIn ? <LogoutButton logout={doLogOut} /> : <Redirect to="/login" />}



*/
return (
  <Router>
    <Container className='App'>
      <AppTitle loggedIn={loggedIn} logout={doLogOut}/>   
      <Switch>
      <Route path="/login" render={() => 
          <>{loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn}/> }</>
        }/>
        <Route path="/add" render={() => <>
          {!loggedIn && <Redirect to="/login" />}
          <ExamForm courses={courses.filter(course => !examCodes.includes(course.coursecode))}
            addOrUpdateExam={addExam} /> </>} />
        <Route path="/update" render={() => <>          
           {!loggedIn && <Redirect to="/login" />}
          <ExamForm courses={courses}
            addOrUpdateExam={updateExam} /> </>} />
        <Route path='/' render={() =>
          <>
            {!loggedIn && <Redirect to="/login" />}
            <Row>
               {errorMsg && <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert>}
           </Row>

           {message && <Row>
         <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
      </Row> }

           { loading ? <Row><span> 🕗 Please wait, loading your exams... 🕗 </span></Row> :           
            <>
            <Row>
            <Col align='right'>
            <Button variant='secondary' onClick={() => setPrivacy(p => !p)}>{privacy ? 'View' : 'Hide'}</Button>
            <Button variant='secondary' onClick={() => setEditable(e => !e)}>{editable ? 'Read' : 'Edit'}</Button>
          </Col>
          </Row>
            <Row>
              <Col>
                <PrivacyMode.Provider value={privacy}>
                  <EditMode.Provider value={editable}>
                    <ExamTable exams={exams} courses={courses} deleteExam={deleteExam} />
                  </EditMode.Provider>
                </PrivacyMode.Provider>
              </Col>
            </Row></>}
          </>
        } />
      </Switch>
    </Container>
  </Router>
);
}

export default App;