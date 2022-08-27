import React, { useState, useEffect } from "react";

import AuthService from "../services/auth.service";
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Moment from 'react-moment';

const AppliedJobs = () => {
  const [allJobs, setAllJobs] = useState([]);
  const candidateProfile = AuthService.candidateProfile();
  useEffect(() => {
    getAppliedJobs();
  }, []);

  const getAppliedJobs = () =>{
    if(candidateProfile && candidateProfile.id !== ''){
        axios.get(`http://localhost:8080/api/getAppliedJobs/`+candidateProfile.id)
        .then(res => {
            const data = res.data;
            setAllJobs(data)
        }).catch(e => {
            console.log("e");
        });
    }
  }

  return (
    <div className="container">
      {allJobs.length>0?
      <Row xs={1} md={3} className="g-4 m-4">
        {allJobs.map((job, idx) => (
            <Col>
                <Card className='clickableCard' id={job.id} >
                    <Card.Body>
                        <Row className="text-center"><h5>{job.organization}</h5></Row>
                        <ListGroup variant="flush">
                          <ListGroup.Item><h6>Title: {job.jobPreference.job_title}</h6></ListGroup.Item>
                          <ListGroup.Item>Description: {job.description}</ListGroup.Item>
                          <ListGroup.Item>Required skills: {job.skill.map((skill,id)=>(<>{(job.skill.length-1)===id?skill.skill_title:skill.skill_title+`, `}</>))}</ListGroup.Item>
                          <ListGroup.Item>Salary: Rs.{job.salary}</ListGroup.Item>
                          <ListGroup.Item>Created at: <Moment date={job.createdAt} format="DD-MM-YYYY" /></ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                    <Card.Body>
                      <Row className="text-center">
                        <Col>
                          {job.isArchived?
                            <Button variant="danger">Job Closed</Button>
                          :job.profile[0].job_profile_mapping.status === 'Accepted'?
                            <Col>
                               <Button variant="success">Accepted</Button>
                             </Col>
                           :job.profile[0].job_profile_mapping.status === 'Rejected'?
                             <Col>
                               <Button variant="danger">Rejected</Button>
                             </Col>
                          :<Button variant="primary">{job.profile[0].job_profile_mapping.status}</Button>
                          }
                        </Col>
                      </Row>
                    </Card.Body>
                </Card>
            </Col>
        ))}
        </Row>
        :
        <Row>
          You have not applied to any job yet.
        </Row>
      }
    </div>
  );
};

export default AppliedJobs;