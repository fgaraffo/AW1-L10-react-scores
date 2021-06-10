import { Form, Table, Button } from "react-bootstrap";
import { useState, useContext } from "react";
import { iconDelete, iconEdit } from './icons';
import dayjs from 'dayjs';

import { PrivacyMode, EditMode } from './createContexts';

function ExamTable(props) {
    const [exams, setExams] = useState([...props.exams]);
    const [showForm, setShowForm] = useState(false);

    const deleteExams = (coursecode) => {
        setExams((exs) => exs.filter((ex) => ex.coursecode !== coursecode));
    };

    const addExam = (exam) => {
        setExams((oldExams) => [...oldExams, exam]);
        //setExams((oldExams) => oldExams.concat(exam));
    };

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
                        exams.map((ex) =>
                            <ExamRow exam={ex}
                                examName={props.courses.filter((c) => c.coursecode === ex.coursecode)[0].name}
                                deleteExam={deleteExams}
                                key={ex.coursecode}>
                            </ExamRow>
                        )}
                </tbody>
            </Table>
            {showForm ?
                <ExamForm courses={props.courses}
                    addExam={(exam) => { addExam(exam); setShowForm(false); }}
                    cancel={() => setShowForm(false)} /> :
                <Button variant='success' onClick={() => setShowForm(true)}>Add</Button>}
        </>
    );
};

function ExamRow(props) {
    return (
        <tr>
            <ExamRowData examName={props.examName} exam={props.exam}/>
            {/* ---------- CONTEXT PRIMO METODO, Consumer + callback ---------- */}
            <EditMode.Consumer>{editable => editable ? 
                <RowControl deleteExam={props.deleteExam} exam={props.exam}/> : 
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
            </> );
};

function RowControl(props) {
    return (
        <td>
            {iconEdit} / <span onClick={() => props.deleteExam(props.exam.coursecode)}>{iconDelete}</span>
        </td>
    );
};

function ExamForm(props) {
    const [course, setCourse] = useState('');
    const [score, setScore] = useState(30);
    const [date, setDate] = useState(dayjs());

    const handleSubmit = (event) => {
        event.preventDefault();
        const exam = { coursecode: course, score: score, date: date };
        props.addExam(exam);
    }

    return (
        <Form>
            <Form.Group controlId='selectedCourse'>
                <Form.Label>Course</Form.Label>
                <Form.Control as='select' defaultValue='' value={course} onChange={(ev) => setCourse(ev.target.value)}>
                    <option hidden disabled value=''>choose...</option>
                    {props.courses.map(c => <option key={c.coursecode} value={c.coursecode}>{c.name}</option>)}
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='selectedScore'>
                <Form.Label>Score</Form.Label>
                <Form.Control type='number' min={18} max={31} value={score} onChange={(ev) => setScore(ev.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='selectedDate'>
                <Form.Label>Date</Form.Label>
                <Form.Control type='date' value={date.format('YYYY-MM-DD')} onChange={ev => setDate(dayjs(ev.target.value))} />
            </Form.Group>
            <Button onClick={handleSubmit}>Save</Button>
            <Button variant='secondary' onClick={props.cancel}>Cancel</Button>
        </Form>
    );
};

export default ExamTable;

/* ALTERNATIVE IMPLEMENTATION, WITH "NATIVE" HTML CONTROLS (WITHOUT BOOTSTRAP) */
/*
function ExamForm_native(props) {
    const [course, setCourse] = useState('');
    const [score, setScore] = useState(30);
    const [date, setDate] = useState(dayjs());

    const handleSubmit = (event) => {
        event.preventDefault();
        const exam = { coursecode: course, score: score, date: date };
        props.addExam(exam);
    };

    return (
        <form>
            <span style={{ display: 'inline-block', width: '5em' }}>Course:</span>
            <select value={course} onChange={ev => setCourse(ev.target.value)}>
                {props.courses.map(course => <option key={course.coursecode} value={course.coursecode}>{course.name}</option>)}
            </select><br />
            <span style={{ display: 'inline-block', width: '5em' }}>Score:</span>
            <input type='number' min={18} max={31} value={score} onChange={ev => setScore(ev.target.value)} /><br />
            <span style={{ display: 'inline-block', width: '5em' }}>Date:</span>
            <input type='date' value={date.format('YYYY-MM-DD')} onChange={ev => setDate(dayjs(ev.target.value))} /><br />
            <button onClick={handleSubmit}>Save</button> <button onClick={props.cancel}>Cancel</button>
        </form >
    )
*/