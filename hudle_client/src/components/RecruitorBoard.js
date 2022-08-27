import React, { useState, useEffect } from "react";

import AuthService from "../services/auth.service";
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Moment from 'react-moment';

const RecruiterBoard = () => {
  const [createdJobs, setCreatedJobs] = useState([]);
  const [checkJobApplicants, setCheckJobApplicants] = useState([]);
  const [checkJob, setCheckJob] = useState(false);
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
   getCreatedJobs();
  }, []);

  const getCreatedJobs = () => {
    axios.get(`http://localhost:8080/api/getCreatedJobs/`+currentUser.id)
    .then(res => {
        const data = res.data;
        setCreatedJobs(data)
    }).catch(e => {
        console.log("e");
    });
  }

  const openJob = (jobId) =>{
    axios.get(`http://localhost:8080/api/openJob/`+currentUser.id)
    .then(res => {
        const data = res.data;
        setCreatedJobs(data)
    }).catch(e => {
        console.log("e");
    });
  }

  const checkApplicantForJobId = (jobId)=>{
    axios.get(`http://localhost:8080/api/checkApplicantsForJob/`+jobId)
    .then(res => {
        const data = res.data;
        setCheckJob(true)
        setCheckJobApplicants(data)
    }).catch(e => {
        console.log("e");
    });
  }

  const changeCandidateStatus = (jobId,candidateId,status)=>{
    axios.post(`http://localhost:8080/api/changeCandidateStatus`,{'jobId':jobId,'candidateId':candidateId,'status':status})
    .then(res => {
        const data = res.data;
        checkApplicantForJobId(jobId)
      }).catch(e => {
        console.log("e");
    });
  }

  const archiveJob = (jobId) =>{
    axios.post(`http://localhost:8080/api/archiveJob/`+jobId)
    .then(res => {
        const data = res.data;
        getCreatedJobs()
      }).catch(e => {
        console.log("e");
    });
  }

  return (
    <div className="container">
      {checkJob?
      <Row xs={1} md={1} className="g-4 m-4">
      {checkJobApplicants.map((job, idx) => (
          <Col>
              <Card className='clickableCard' id={job.id} >
                  <Card.Body>
                      <div><Button className="mx-auto" onClick={()=>setCheckJob(false)} variant="success">Back</Button></div>
                      <Row className="text-center"><h3>{job.jobPreference.job_title}</h3></Row>
                      <ListGroup variant="flush">
                          <ListGroup.Item><h6>Organization: {job.organization}</h6></ListGroup.Item>
                          <ListGroup.Item>Description: {job.description}</ListGroup.Item>
                          <ListGroup.Item>Required skills: {job.skill.map((skill,id)=>(<>{(job.skill.length-1)===id?skill.skill_title:skill.skill_title+`, `}</>))}</ListGroup.Item>
                          <ListGroup.Item>Salary: Rs.{job.salary}</ListGroup.Item>
                          <ListGroup.Item>Created at: <Moment date={job.createdAt} format="DD-MM-YYYY" /></ListGroup.Item>
                        </ListGroup>
                  </Card.Body>
                  <Card.Body>
                    <Row className="text-center my-2"><h3>Applicants</h3></Row>
                    <Row className="m-3">{job.profile.length === 0?"Applications are not available yet.":null}</Row>
                    <Row xs={1} md={3} className="g-4 m-4">
                    {job.profile.map((profile, idx) => (
                        <Col>
                            <Card className='clickableCard' id={profile.id} >
                                <Card.Body>
                                  <ListGroup variant="flush">
                                    <ListGroup.Item>Name: {profile.full_name}</ListGroup.Item>
                                    <ListGroup.Item>Education: {profile.educations}</ListGroup.Item>
                                    <ListGroup.Item>
                                    Skills:
                                    <br></br>
                                     {profile.skill && profile.skill.map((skill,id)=>(<>{(profile.skill.length-1)===id?skill.skill_title:skill.skill_title+`, `}</>))}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                    Job Preferences:
                                    <br></br>
                                      {profile.jobPreference && profile.jobPreference.map((job,id)=>(<>{(profile.jobPreference.length-1)===id?job.job_title:job.job_title+`, `}</>))}
                                    </ListGroup.Item>
                                    <ListGroup.Item>Resume Link: {profile.resume_link}</ListGroup.Item>
                                  </ListGroup>

                                </Card.Body>
                                <Card.Body>
                                  <Row className="text-center">
                                    {profile.job_profile_mapping.status === 'Accepted'?
                                     <Col>
                                        <Button variant="success">Accepted</Button>
                                      </Col>
                                    :profile.job_profile_mapping.status === 'Rejected'?
                                      <Col>
                                        <Button variant="danger">Rejected</Button>
                                      </Col>
                                    :
                                    <>
                                    <Col>
                                      <Button variant="success" onClick={()=>changeCandidateStatus(job.id,profile.id,'Accepted')}>Accept</Button>
                                    </Col>
                                    <Col>
                                      <Button variant="danger" onClick={()=>changeCandidateStatus(job.id,profile.id,'Rejected')}>Reject</Button>
                                    </Col>
                                    </>
                                    }
                                  </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                    </Row>
                  </Card.Body>
              </Card>
          </Col>
      ))}
      </Row>
      :
      <>
      {createdJobs.length>0?
      <Row xs={1} md={3} className="g-4 m-4">
        {createdJobs.map((job, idx) => (
            <Col>
                <Card className='clickableCard' id={job.id} >
                    <Card.Body>
                        <Row className="text-center"><h5>{job.jobPreference.job_title}</h5></Row>
                        <ListGroup variant="flush">
                          <ListGroup.Item>Organization: {job.organization}</ListGroup.Item>
                          <ListGroup.Item>Description: {job.description}</ListGroup.Item>
                          <ListGroup.Item>Salary: Rs.{job.salary}</ListGroup.Item>
                          <ListGroup.Item>Created at: <Moment date={job.createdAt} format="DD-MM-YYYY" /></ListGroup.Item>
                        </ListGroup>
                        <Row className="text-center mt-4">
                          {job.isArchived?
                          <Col>
                            <Button variant="danger">Archived</Button>
                          </Col>
                          :
                          <>
                          <Col>
                            <Button onClick={()=>checkApplicantForJobId(job.id)}>Check Applicants</Button>
                          </Col>
                          <Col>
                            <Button variant="danger" onClick={()=>archiveJob(job.id)}>Archive</Button>
                          </Col>
                          </>
                          }
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        ))}
        </Row>
        : 
        <Row>
          Oops! no jobs to Display..
          Please Create jobs!
        </Row>
      }
      </>
        }
    </div>
  );
};

export default RecruiterBoard;
