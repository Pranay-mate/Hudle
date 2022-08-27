import React, { useState, useEffect } from "react";

import AuthService from "../services/auth.service";
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Multiselect from 'multiselect-react-dropdown';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import Moment from 'react-moment';
import ListGroup from 'react-bootstrap/ListGroup';
import { subDays } from 'date-fns';
const CandidateViewJobs = () => {
  const candidateProfile = AuthService.candidateProfile();

  const [allJobs, setAllJobs] = useState([]);
  const [allJobsForFilter, setAllJobsForFilter] = useState([]);
  const [selectedJobPrefValue, setSelectedJobPrefValue] = useState("");
  const [allJobPreferences,setJobPreferences] = useState([]);
  const allSalary =  [{name: '0LPA-1LPA', id: 1},{name: '1LPA-3LPA', id: 2},{name: '3LPA-7LPA', id: 3},{name: '7LPA-10LPA', id: 4},{name: '10LPA-50LPA', id: 5}];
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const [selectedSalary,setSelectedSalary] = useState('')
  const [selectedJobPrefList, setSelectedJobPrefList] = useState([]);


  useEffect(() => {
    getJobPreferences();
    getJobsforCandidate();
  }, []);

  const getJobPreferences = () => {
    axios.get(`http://localhost:8080/api/getJobPreferences`)
    .then(res => {
        const data = res.data;
        setJobPreferences(data)
    }).catch(e => {
        console.log("e");
    });
  }

  const getJobsforCandidate = async() =>{
    if(candidateProfile && candidateProfile.id !== ''){
      await axios.post(`http://localhost:8080/api/getJobsforCandidate`,candidateProfile)
      .then(res => {
          const data = res.data;
          setAllJobs(data)
          setAllJobsForFilter(data)
      }).catch(e => {
          console.log("e");
      });
    }
  }

  const applyJob = (jobId,profileId) =>{
    axios.post(`http://localhost:8080/api/applyJob`,{'jobId':jobId,'profileId':profileId})
    .then(res => {
        const data = res.data;
        getJobsforCandidate();
    }).catch(e => {
        console.log("e");
    });
  }

  const onSelectJobPref = (selectedList, selectedItem)=> {
      setSelectedJobPrefList(selectedList)
  }

  const onRemoveJobPref = (selectedList, removedItem)=> {
      setSelectedJobPrefList(selectedList)
  }

  const onSelectedSalary = (selectedList, selectedItem)=> {
    setSelectedSalary(selectedList)
  }
  const onRemoveSalary = (selectedList, removedItem)=> {
    setSelectedSalary(selectedList)
  }



  const resetFilter = () =>{
    window.location.reload();
  }

  const checkFilter = async () =>{
      await getJobsforCandidate();
      let allJobsData = [...allJobsForFilter];
  
      if(selectedSalary.length!==0){
        let salaryRange = selectedSalary[0].name.match(/\d+/g); 
        allJobsData = allJobsData.filter((job)=>job.salary>=(salaryRange[0]*100000) && job.salary<=(salaryRange[1]*100000));
      }

      if(dateRange[0] !== null && dateRange[1] !== null){
        let startDate = moment(dateRange[0]);
        let endDate = moment(dateRange[1]);
        allJobsData = allJobsData.filter((job)=>{
          let createdAt = moment(job.createdAt);

          if(createdAt.diff(startDate, 'days')===0 && createdAt.diff(endDate, 'days')===0){
            if(createdAt.diff(startDate, 'days') ===0){
              return true
            }else{
              return false
            }
          }
          
          return createdAt.diff(startDate, 'days')>=0 && createdAt.diff(endDate, 'days')<=0
        })
      }
  
      if(selectedJobPrefList.length!==0){
        let jobIds= []
        selectedJobPrefList.forEach( async(jobPref)=>{
          await jobIds.push(jobPref.id)
        })
  
        allJobsData = allJobsData.filter((job)=>jobIds.includes(job.jobPreference.id));
      }
      setAllJobs(allJobsData)

  }

  return (
    <div className="container">
      <Form className="text-center">
      <Row className="filterOptions">
        <Col>
          <Form.Group className="mb-3">
              <Multiselect
              options={allJobPreferences} // Options to display in the dropdown
              selectedValues={selectedJobPrefValue} // Preselected value to persist in dropdown
              onSelect={onSelectJobPref} // Function will trigger on select event
              onRemove={onRemoveJobPref} // Function will trigger on remove event
              displayValue={"job_title"} // Property name to display in the dropdown options
              placeholder="Job Preference"
              />
          </Form.Group>
        </Col>
        <Col>
        <DatePicker
          className="date-picker"
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
          }}
          isClearable={true}
          maxDate={subDays(new Date(), 1)}
          placeholderText="Select Date Range"
        />
        </Col>
        <Col>
          <Form.Group>
              <Multiselect
              options={allSalary} // Options to display in the dropdown
              selectedValues={selectedSalary} // Preselected value to persist in dropdown
              onSelect={onSelectedSalary} // Function will trigger on select event
              onRemove={onRemoveSalary} // Function will trigger on remove event
              displayValue={"name"} // Property name to display in the dropdown options
              placeholder="Select Salary"
              singleSelect
              />
          </Form.Group>
        </Col>
        <Col>
          <Button className="mx-1" onClick={()=>resetFilter()}>Reset</Button>
          <Button className="mx-1" onClick={()=>checkFilter()}>Search</Button>
        </Col>
      </Row>
      </Form>
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
                          {job.profile.filter((prof)=>prof.id === candidateProfile.id).length > 0? 
                          <Button variant="outline-success">Applied</Button>
                          :
                          <Button variant="success" onClick={()=>applyJob(job.id,candidateProfile.id)}>Apply</Button>
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
          No jobs available!
        </Row>
        }
    </div>
  );
};

export default CandidateViewJobs;