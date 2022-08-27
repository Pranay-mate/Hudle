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

const CandidateProfile = () => {
  const currentUser = AuthService.getCurrentUser();
  const [validated, setValidated] = useState(false);
  const [selectedSkillValue, setSelectedSkillValue] = useState("");
  const [selectedJobPrefValue, setSelectedJobPrefValue] = useState("");
  const [fullName, setFullName] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [education, setEducation] = useState("");
  const [selectedSkillsList, setSelectedSkillsList] = useState([]);
  const [selectedJobPrefList, setSelectedJobPrefList] = useState([]);
  const [message,setMessage] = useState('')
  const [candidateProfileData,setCandidateProfile] = useState('')
  const [updateProfile,setUpdateProfile] = useState(true);
  const [allSkills,setSkills] = useState([]);
  const [allJobPreferences,setJobPreferences] = useState([]);
  
  useEffect(() => {
    getCandidateProfile();
    getSkills();
    getJobPreferences();
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
            localStorage.setItem("profile_data", JSON.stringify(res.data));
            setUpdateProfile(false)
            setCandidateProfile(data)
            setFullName(res.data.full_name)
            setEducation(res.data.educations)
            setResumeLink(res.data.resume_link)
            setSelectedSkillValue(res.data.skill)
            setSelectedSkillsList(res.data.skill)
            setSelectedJobPrefValue(res.data.jobPreference)
            setSelectedJobPrefList(res.data.jobPreference)
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
        setSelectedJobPrefList(selectedList)
    }

    const onRemoveJobPref = (selectedList, removedItem)=> {
        setSelectedJobPrefList(selectedList)
    }
    const addProfile = (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
        }
        
        setValidated(true);
        if(candidateProfileData===''){
            if(selectedSkillsList.length ===0){
                setMessage("Please add atleast one skill.")
                return;
            }
            if(selectedJobPrefList.length ===0){
                setMessage("Please add atleast one job preference.")
                return;
            }
        }

        let data = {'candidate_id':currentUser.id,
                'full_name':fullName,
                'educations':education,
                'skills':selectedSkillsList,
                'job_preferences':selectedJobPrefList,
                'resume_link':resumeLink};
        if(form.checkValidity() && message === '' && candidateProfileData === ''){
            axios.post(`http://localhost:8080/api/addCandidateProfile`,{data})
            .then(res => {
                const data = res.data;
                getCandidateProfile();
            }).catch(e => {
                console.log("e");
            });
        }else{
            axios.post(`http://localhost:8080/api/updateCandidateProfile/`+candidateProfileData.id,{data})
            .then(res => {
                const data = res.data;
                getCandidateProfile();
            }).catch(e => {
                console.log("e");
            });
        }
        window.location.reload();
    }

  return (
    <div className="container">
        <Card >
            <h2 className="text-center mt-4">Profile</h2>
            <Container className="m-4">
            {!updateProfile?
            <>
                <h6>Full Name:</h6>
                <p>{candidateProfileData.full_name}</p>
                <h6>Education:</h6>
                <p>{candidateProfileData.educations}</p>
                <h6>Skills:</h6>
                <p>{candidateProfileData.skill && candidateProfileData.skill.map((skill,id)=>(
                    <>
                    {candidateProfileData.skill.length-1===id?skill.skill_title:skill.skill_title+`, `}
                    </>
                ))}</p>
                <h6>Job Preference:</h6>
                <p>{candidateProfileData.jobPreference && candidateProfileData.jobPreference.map((job,id)=>(
                    <>
                    {candidateProfileData.jobPreference.length-1===id?job.job_title:job.job_title+`, `}
                    </>
                ))}</p>
                <h6>Resume Link:</h6>
                <p>{candidateProfileData.resume_link}</p>
                <Button onClick={()=>openForm()}>Update</Button>
            </>
            :
            <Form className="m-4"  noValidate validated={validated} onSubmit={(e)=>addProfile(e)}>
                <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" placeholder="Full Name" id="full-name" value={fullName} onChange={(e)=>setFullName(e.target.value)} required />
                    <Form.Control.Feedback type="invalid">
                    Please add a full name.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Education</Form.Label>
                    <Form.Control type="text" placeholder="Education" id="education" value={education} onChange={(e)=>setEducation(e.target.value)} required />
                    <Form.Control.Feedback type="invalid">
                    Please add a education.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Skills</Form.Label>
                    <Multiselect
                    options={allSkills} // Options to display in the dropdown
                    selectedValues={selectedSkillValue} // Preselected value to persist in dropdown
                    onSelect={onSelectSkill} // Function will trigger on select event
                    onRemove={onRemoveSkill} // Function will trigger on remove event
                    displayValue={"skill_title"} // Property name to display in the dropdown options
                    placeholder="Skills"
                    required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Job Preference</Form.Label>
                    <Multiselect
                    options={allJobPreferences} // Options to display in the dropdown
                    selectedValues={selectedJobPrefValue} // Preselected value to persist in dropdown
                    onSelect={onSelectJobPref} // Function will trigger on select event
                    onRemove={onRemoveJobPref} // Function will trigger on remove event
                    displayValue={"job_title"} // Property name to display in the dropdown options
                    placeholder="Job Preference"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Resume Link</Form.Label>
                    <Form.Control type="text" placeholder="Resume Link" id="resume-link" value={resumeLink} onChange={(e)=>setResumeLink(e.target.value)} required />
                    <Form.Control.Feedback type="invalid">
                    Please add a resume link.
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
    </div>
  );
};

export default CandidateProfile;
