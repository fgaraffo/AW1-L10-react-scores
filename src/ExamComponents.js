import { Form, Table, Button, Alert } from "react-bootstrap";
import { useState, useContext } from "react";
import { Link, Redirect, useLocation } from 'react-router-dom';
import { iconDelete, iconEdit } from './icons';
import dayjs from 'dayjs';

import { PrivacyMode, EditMode } from './createContexts';

function ExamTable(props) {

    return (
        <>       
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
                    {
                        props.exams.map((ex) =>
                            <ExamRow exam={ex}
                                examName={ props.courses.filter( c => c.coursecode === ex.coursecode )[0].name }
                                deleteExam={props.deleteExam}
                                key={ex.coursecode}>
                            </ExamRow>
                        )}
                </tbody>
            </Table>
            <Link to='/add'><Button variant='success'>Add</Button></Link>
        </>
    );
};

function ExamRow(props) {
    return (
        <tr>
            <ExamRowData examName={props.examName} exam={props.exam} />
            {/* ---------- CONTEXT PRIMO METODO, Consumer + callback ---------- */}
            <EditMode.Consumer>{editable => editable ?
                <RowControl deleteExam={props.deleteExam} exam={props.exam} /> :
                <td><i>disabled</i></td>}
            </EditMode.Consumer>
        </tr>);
};

function ExamRowData(props) {
    /* ---------- CONTEXT SECONDO METODO, useContext ---------- */
    let privacyMode = useContext(PrivacyMode);
    return (
        <>
            <td>{props.examName}</td>
            <td>{privacyMode ? 'X' : props.exam.score}</td>
            <td>{privacyMode ? 'X' : props.exam.date.format('DD/MM/YYYY')}</td>
        </>);
};

function RowControl(props) {
    return (
        <td>
            <Link to={{ pathname: '/update', state: { exam: props.exam, examDate: props.exam.date.format('YYYY-MM-DD') }}}>
                {iconEdit}</Link> / <span onClick={() => { props.deleteExam(props.exam.coursecode) }}>{iconDelete}</span>
        </td>
    );
};

function ExamForm(props) {
    const location = useLocation();
    const [course, setCourse] = useState(location.state ? location.state.exam.coursecode : '');
    const [score, setScore] = useState(location.state ? location.state.exam.score : 30);
    const [date, setDate] = useState(location.state ? location.state.examDate : dayjs().format('YYYY-MM-DD'));
    const [error, setError] = useState(''); //false
    const [submitted, setSubmitted] = useState(false);
    //   const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        //FORM VALIDATION
        //&& props.checkExam(course) 
        if (course !== '' && score <= 31 && score >= 18) {
            const exam = { coursecode: course, score: score, date: dayjs(date) };
            props.addOrUpdateExam(exam);
            setSubmitted(true);
            // setValidated(true);
        }
        else if (course === '') { setError('Scegliere un corso dalla lista.'); }
    //  else if (!props.checkExam(course)) { setError(`Il corso ${course} è già presente.`); }
        else if (score >= 31 || score <= 18) { setError(`Voto ${score} non valido. Inserire un voto compreso tra 18 e 31.`); }
        // setValidated(true);
    };

    // noValidate validated={validated} 

    return (submitted ? <Redirect to="/" /> :
        <>
            {error ? <Alert variant="danger" onClose={() => setError(false)} dismissible>{error}</Alert> : false}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId='selectedCourse'>
                    <Form.Label>Course</Form.Label>
                    <Form.Control as='select' value={course} onChange={(ev) => setCourse(ev.target.value)}
                        isValid={course !== '' /*  && props.checkExam(course)  */}
                        disabled={location.state}
                        required>
                        <option hidden disabled value=''>choose...</option>
                        {props.courses.map(c => <option key={c.coursecode} value={c.coursecode}>{c.name}</option>)}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        Il corso è già presente nella lista.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId='selectedScore' >
                    <Form.Label>Score</Form.Label>
                    <Form.Control type='number' min={18} max={31} value={score} onChange={(ev) => setScore(ev.target.value)}
                        isValid={score <= 31 && score >= 18}
                        isInvalid={score > 31 || score < 18}
                        required />
                    <Form.Control.Feedback type="invalid">
                        Il voto deve essere compreso tra 18 e 30.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId='selectedDate'>
                    <Form.Label>Date</Form.Label>
                    <Form.Control type='date' value={date} onChange={ev => setDate(ev.target.value)} />
                </Form.Group>
                <Button onClick={handleSubmit}>Save</Button>
                <Link to='/'><Button variant='secondary'>Cancel</Button></Link>
            </Form>
        </>
    );
};

export { ExamTable, ExamForm };