import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

//import dayjs from 'dayjs';
import ExamTable from './ExamComponents'

import { fakeCourses, fakeExams } from './FakeData';
import AppTitle from './AppTitle';
import { useState } from 'react';

import { PrivacyMode, EditMode } from './createContexts';

function App() {

  const [privacy, setPrivacy] = useState(false);
  const [editable, setEditable] = useState(true);

  return (
    <Container className='App'>
      <Row>
        <AppTitle />
        <Col align='right'>
          <Button variant='secondary' onClick={ () => setPrivacy( p => !p )}>{privacy ? 'View' : 'Hide'}</Button>
          <Button variant='secondary' onClick={ () => setEditable( e => !e )}>{editable ? 'Read' : 'Edit'}</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <PrivacyMode.Provider value={privacy}>
            <EditMode.Provider value={editable}>
              <ExamTable exams={fakeExams} courses={fakeCourses} />
            </EditMode.Provider>
          </PrivacyMode.Provider>
        </Col>
      </Row>
    </Container>
  );
}

export default App;

/*

<Table striped bordered hover>
<thead>
  <tr>
    <th>Exam</th>
    <th>Score</th>
    <th>Date</th>
    <th>Actions</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Information systems security</td>
    <td>28</td>
    <td>01/03/2021</td>
    <td>{iconEdit} {iconDelete}</td>
  </tr>
  <tr>
    <td>Data Science and Database Technology</td>
    <td>29</td>
    <td>03/06/2021</td>
    <td>{iconEdit} {iconDelete}</td>
  </tr>
  <tr>
    <td>Software Engineering</td>
    <td>18</td>
    <td>24/05/2021</td>
    <td>{iconEdit} {iconDelete}</td>
  </tr>
  <tr>
    <td>Web Applications I</td>
    <td>24</td>
    <td>21/06/2021</td>
    <td>{iconEdit} {iconDelete}</td>
  </tr>
</tbody>
</Table>

*/