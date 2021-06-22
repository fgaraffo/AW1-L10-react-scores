import { Col, Row } from 'react-bootstrap';
import { LogoutButton } from './LoginComponents';

function AppTitle(props) {

  return (
    <Row>
      <Col>
        <h1>Your Exams</h1>
      </Col>      
     {props.loggedIn ? <LogoutButton logout={props.logout}/> : <></>}      
    </Row>
  );
}

export default AppTitle;