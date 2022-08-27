import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";

import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';
import { useNavigate } from 'react-router-dom';

const JobCreationForm = () => {
  let navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const [validated, setValidated] = useState(false);
  const [selectedSkillValue, setSelectedSkillValue] = useState("");
  const [selectedJobPrefValue, setSelectedJobPrefValue] = useState("");
  const [fullName, setFullName] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [education, setEducation] = useState("");
  const [selectedSkillsList, setSelectedSkillsList] = useState([]);
  const [selectedJobPrefList, setSelectedJobPrefList] = useState('');
  const [message,setMessage] = useState('')
  const [candidateProfileData,setCandidateProfile] = useState('')
  const [updateProfile,setUpdateProfile] = useState(true);
  const [allSkills,setSkills] = useState([]);
  const [allJobPreferences,setJobPreferences] = useState([]);

  const [job_description,setJobDescription] = useState('');
  const [Salary,setSalary] = useState('');
  const [organization,setOrganizatioin] = useState('');

  
  useEffect(() => {
    getSkills();
    getJobPreferences();
    getCandidateProfile();
  }, []);

  const openForm = () =>{
    setUpdateProfile(true)
  }

  const getSkills = () => {
    axios.get(`http://localhost:8080/api/getSkills`)
    .then(res => {
        const data = res.data;
        setSkills(data)
    }).catch(e => {
        console.log("e");
    });
  }

  const getJobPreferences = () => {
    axios.get(`http://localhost:8080/api/getJobPreferences`)
    .then(res => {
        const data = res.data;
        setJobPreferences(data)
    }).catch(e => {
        console.log("e");
    });
  }

  const getCandidateProfile = () => {
        axios.get(`http://localhost:8080/api/getCandidateProfile/`+currentUser.id)
        .then(res => {
            const data = res.data;
            if(data !== ''){
                setUpdateProfile(false)
                setCandidateProfile(data)
                setFullName(res.data.full_name)
                setEducation(res.data.educations)
                setResumeLink(res.data.resume_link)
                setSelectedSkillValue(res.data.skill)
                setSelectedJobPrefValue(res.data.jobPreference)
            }
        }).catch(e => {
            console.log("e");
        });
    }
    
    const onSelectSkill = (selectedList, selectedItem)=> {
        setMessage("")
        setSelectedSkillsList(selectedList)
    }
        
    const onRemoveSkill = (selectedList, removedItem)=> {
        setSelectedSkillsList(selectedList)
    }
        
    const onSelectJobPref = (selectedList, selectedItem)=> {
        setMessage("")
        setSelectedJobPrefList(selectedItem)
    }

    const onRemoveJobPref = (selectedList, removedItem)=> {
        setSelectedJobPrefList(selectedList)
    }
    const addJob = (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
        }
        
        setValidated(true)
        if(selectedSkillsList.length ===0){
            setMessage("Please add atleast one skill.")
            return;
        }
        if(selectedJobPrefList ===''){
            setMessage("Please add job title.")
            return;
        }

        setMessage("")

        let data = {'recruiter_id':currentUser.id,
                'organization':organization,
                'title':selectedJobPrefList,
                'description':job_description,
                'requiredSkills':selectedSkillsList,
                'isArchived':false,
                'salary': Salary,
                'created_by':currentUser.email};
        if(form.checkValidity() && message === ''){
            axios.post(`http://localhost:8080/api/addJob`,{data})
            .then(res => {
                const data = res.data;
                navigate("/recruiter");
                window.location.reload();
            }).catch(e => {
                console.log("e");
            });
        }
    }

  return (
    <div className="container">
      <header className="jumbotron">
        <Card>
            <h3 className="text-center">Job Creation</h3>
            <Container>
            {!updateProfile?
            <>
                <h6>Full Name:</h6>
                <p>{candidateProfileData.full_name}</p>
                <h6>Education:</h6>
                <p>{candidateProfileData.educations}</p>
                <h6>Skills:</h6>
                {candidateProfileData.skill && candidateProfileData.skill.map((skill)=>(
                    <p>{skill.skill_title}</p>
                ))}
                <h6>Job Preference:</h6>
                {candidateProfileData.jobPreference && candidateProfileData.jobPreference.map((job)=>(
                    <p>{job.job_title}</p>
                ))}
                <h6>Resume Link:</h6>
                <p>{candidateProfileData.resume_link}</p>
                <Button onClick={()=>openForm()}>Update</Button>
            </>
            :
            <Form className="m-4"  noValidate validated={validated} onSubmit={(e)=>addJob(e)}>
                <Form.Group className="mb-3">
                    <Form.Label>Organization Name</Form.Label>
                    <Form.Control type="text" placeholder="Organization Name" id="Organization-name" value={organization} onChange={(e)=>setOrganizatioin(e.target.value)} required />
                    <Form.Control.Feedback type="invalid">
                    Please add a Organization Name.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Job Title</Form.Label>
                    <Multiselect
                    options={allJobPreferences} // Options to display in the dropdown
                    selectedValues={selectedJobPrefValue} // Preselected value to persist in dropdown
                    onSelect={onSelectJobPref} // Function will trigger on select event
                    onRemove={onRemoveJobPref} // Function will trigger on remove event
                    displayValue={"job_title"} // Property name to display in the dropdown options
                    placeholder="Job Title"
                    singleSelect
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Job Description</Form.Label>
                    <Form.Control  placeholder="Job Description" id="job-Description" value={job_description} onChange={(e)=>setJobDescription(e.target.value)} required />
                    <Form.Control.Feedback type="invalid">
                    Please add a Job Description.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Required Skills</Form.Label>
                    <Multiselect
                    options={allSkills} // Options to display in the dropdown
                    selectedValues={selectedSkillValue} // Preselected value to persist in dropdown
                    onSelect={onSelectSkill} // Function will trigger on select event
                    onRemove={onRemoveSkill} // Function will trigger on remove event
                    displayValue={"skill_title"} // Property name to display in the dropdown options
                    placeholder="Required Skills"
                    required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Salary in Rs.</Form.Label>
                    <Form.Control type="text" placeholder="Salary" id="Salary" value={Salary} onChange={(e)=>setSalary(e.target.value)} required />
                    <Form.Control.Feedback type="invalid">
                    Please add a Salary.
                    </Form.Control.Feedback>
                </Form.Group>
                {message !== '' && (
                      <div className="form-group">
                      <div
                          className={ "alert alert-danger"}
                          role="alert"
                      >
                          {message}
                      </div>
                      </div>
                  )}
                
                <Button type="submit">{candidateProfileData!==''?'Update':'Submit'}</Button>
            </Form>
            }
            </Container>
        </Card>
      </header>
    </div>
  );
};

export default JobCreationForm;
