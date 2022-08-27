const db = require("../models");
const config = require("../config/auth.config");
const { skill, job_profile_mapping } = require("../models");
const User = db.user;
const Skill = db.skill
const Profile = db.profile;
const JobPreference = db.jobPreference;
const Skill_mapping = db.skill_mapping;
const JobPreference_mapping = db.jobPreference_mapping;
const Job = db.job;
const Job_profile_mapping = db.job_profile_mapping;

const Op = db.Sequelize.Op;

exports.candidateBoard = (req, res) => {
  res.status(200).send("candidateBoard Content.");
};

exports.recruiterBoard = async (req, res) => {
  res.status(200).send("recruiterBoard Content.");
};

//common functions
exports.getSkills = async (req,res)=>{

  let skills = await Skill.findAll()
  .then(skills => {
    res.status(200).send(skills);
  })
  .catch(err => {
      res.status(500).send({ message: err.message });
  });
}

exports.getJobPreferences = async (req,res)=>{

  let jobPreference = await JobPreference.findAll()
  .then(jobPreferences => {
    res.status(200).send(jobPreferences);
  })
  .catch(err => {
      res.status(500).send({ message: err.message });
  });
}





// candidate functions
exports.getCandidateProfile = async (req,res)=>{
  const { candidateId } = req.params;

  await Profile.findOne({ where: {candidate_id:candidateId} ,  include: [{model: Skill,as: "skill"}, {model:JobPreference,as:'jobPreference'}] })
  .then(profile => {
      res.status(200).send(profile);
  })
  .catch(err => {
      res.status(500).send({ message: err.message });
  });
}

exports.addCandidateProfile = async (res,req)=>{
  let candidateData = res.body.data;
 
  Profile.create({full_name:candidateData.full_name,educations:candidateData.educations,resume_link:candidateData.resume_link,candidate_id:candidateData.candidate_id})
  .then(profile => {
    let profileId = profile.id;
    candidateData.skills.forEach(async (skill) => {
      await addSkills(profile.id, skill.id)
    })
    return profileId
  }).then(profileId => {
    candidateData.job_preferences.forEach(async (job) => {
      await addJobs(profileId, job.id)
    })
  })
  .then(res => {
    req.status(200).send({ message: "Profile created successfully!" });
  })
  .catch(err => {
      req.status(500).send({ message: err.message });
  });
}

exports.updateCandidateProfile = async (res,req)=>{
  const { profileId } = res.params;

  let candidateData = res.body.data;
  let profile = await Profile.update({full_name:candidateData.full_name,educations:candidateData.educations,resume_link:candidateData.resume_link}, {
    where: {
      id: profileId
    }
  })
  .then(profile => {
    Skill_mapping.destroy({
      where: {
        profile_id: profileId
      },
      force: true
    });
    candidateData.skills.forEach(async (skill) => {
      await addSkills(profileId, skill.id)
    })
  }).then(profile => {
    JobPreference_mapping.destroy({
      where: {
        profile_id: profileId
      },
      force: true
    });
    candidateData.job_preferences.forEach(async (job) => {
      await addJobs(profileId, job.id)
    })
  })
  .then(res => {
    req.status(200).send({ message: "Profile updated successfully!" });
  })
  .catch(err => {
      req.status(500).send({ message: err.message });
  });
}

exports.getJobsforCandidate = async (req,res)=>{
  let candidateData = req.body;

  let skillsTitleId = [];
  candidateData.skill.forEach((skill)=>skillsTitleId.push(skill.id))
  let jobPreferenceId = [];
  candidateData.jobPreference.forEach((prefJob)=>jobPreferenceId.push(prefJob.id))

  let jobs = await Job.findAll({where:{isArchived:false},include: [{model: Skill,as: "skill"},{model: Profile,as: "profile"},{model: JobPreference,as: "jobPreference"}], order: [['createdAt', 'DESC']]})
  .then(jobs => {
    // Profile Matching Algorithm
      jobs.forEach( async (job,jobId)=>{
        if(jobPreferenceId.includes(job.jobPreference.id)){
          let currJob = job;
          jobs.splice(jobId,1)
          await jobs.unshift(currJob);
        }
        job.skill.forEach(async(skill,skillId)=>{
          if(skillsTitleId.includes(skill.id)){
            let currJob = job;
            jobs.splice(jobId,1)
            await jobs.unshift(currJob);
          }
        })
      })
    return jobs
  })
  .then(jobs => {
    res.status(200).send(jobs);
  })
  .catch(err => {
      res.status(500).send({ message: err.message });
  });
}

exports.applyJob = async (req,res)=>{
  let applicationData = req.body;
  await Job_profile_mapping.findAll({where:{'job_id':applicationData.jobId,'profile_id':applicationData.profileId}})
  .then(jobs => {
    if(jobs.length >0){
      res.status(200).send({ message: "Job already applied" });
    }else{
      Job_profile_mapping.create({'job_id':applicationData.jobId,'profile_id':applicationData.profileId})
    }
  })
  .then(jobs => {
    res.status(200).send({ message: "Job applied successfully!" });
  })
  .catch(err => {
      res.status(500).send({ message: err.message });
  });
}

exports.getAppliedJobs = async (req,res)=>{
  let {candidateId} = req.params;
  await Job.findAll({where:{"$profile.job_profile_mapping.profile_id$":candidateId},include: [{model: Skill,as: "skill"},{model: Profile,as: "profile"},{model: JobPreference,as: "jobPreference"}], order: [['updatedAt', 'DESC']]})
  .then(jobs => {
    res.status(200).send(jobs);
  })
  .catch(err => {
      res.status(500).send({ message: err.message });
  });
}







//recruiter functions
exports.addJob = async (req,res)=>{
  let jobData = req.body.data;
  await Job.create({organization:jobData.organization,title:jobData.title.id,description:jobData.description,isArchived: jobData.isArchived,salary: jobData.salary,created_by: jobData.created_by, recruiter_id: jobData.recruiter_id})
  .then(job => {
    let jobId = job.id;
    jobData.requiredSkills.forEach(async (skill) => {
      await addJobSkills(jobId, skill.id)
    })
  })
  .then(job => {
    res.status(200).send({ message: "Job added successfully!" });
  })
  .catch(err => {
      res.status(500).send({ message: err.message });
  });
}

exports.getCreatedJobs = async (req,res)=>{
  let {recruiter_id} = req.params;
  await Job.findAll({where:{recruiter_id:recruiter_id},include: [{model: Skill,as: "skill"},{model: JobPreference,as: "jobPreference"}],order: [['createdAt', 'DESC']]})
  .then(jobs => {
    res.status(200).send(jobs);
  })
  .catch(err => {
      res.status(500).send({ message: err.message });
  });
}

exports.checkApplicantsForJob = async (req,res)=>{
  let {jobId} = req.params;
  await Job.findAll({where:{'id': jobId},include: [{model: Profile,as: "profile",include: [{model: Skill,as: "skill"},{model: JobPreference,as: "jobPreference"}]},{model: Skill,as: "skill"},{model: JobPreference,as: "jobPreference"}],  order: [[{model: Profile,as: "profile"}, 'createdAt', 'DESC']]})
  .then(jobs => {
    res.status(200).send(jobs);
  })
  .catch(err => {
      res.status(500).send({ message: err.message });
  });
}

exports.changeCandidateStatus = async (req,res)=>{
  let statusData = req.body;
  let job_profile_mapping = await Job_profile_mapping.update({status:statusData.status}, {
    where:{job_id: statusData.jobId,profile_id:statusData.candidateId}
  })
  .then(jobs => {
     Job.findAll({where:{'id': statusData.jobId},include: [{model: Profile,as: "profile",include: [{model: Skill,as: "skill"}]}]})
  })
  .then(jobs => {
    res.status(200).send(jobs);
  })
  .catch(err => {
      res.status(500).send({ message: err.message });
  });
}

exports.archiveJob = async (req,res)=>{
  let {jobId} = req.params;
  let job = await Job.update({isArchived:true}, {
    where:{id: jobId}
  })
  .then(jobs => {
    res.status(200).send({ message: "Job archived successfully!" });
  })
  .catch(err => {
      res.status(500).send({ message: err.message });
  });
}





// common functions
function addSkills(ProfileId, skillId){
  return Profile.findByPk(ProfileId)
    .then((profile) => {
      if (!profile) {
        console.log("Profile not found!");
        return null;
      }
      return Skill.findByPk(skillId).then((skill) => {
        if (!skill) {
          console.log("skill not found!");
          return null;
        }
        profile.addSkill(skill)
        console.log(`>> added skill id=${skill.id} to Profile id=${profile.id}`);
        return profile;
      });
    })
    .catch((err) => {
      console.log(">> Error while adding skill to Profile: ", err);
    });
}


function addJobs(ProfileId, jobId){
  return Profile.findByPk(ProfileId)
    .then((profile) => {
      if (!profile) {
        console.log("Profile not found!");
        return null;
      }
      return JobPreference.findByPk(jobId).then((job) => {
        if (!job) {
          console.log("job pref not found!");
          return null;
        }
        profile.addJobPreference(job)
        console.log(`>> added job id=${job.id} to Profile id=${profile.id}`);
        return profile;
      });
    })
    .catch((err) => {
      console.log(">> Error while adding job pref to Profile: ", err);
    });
}

function addJobSkills(jobId, skillId){
  return Job.findByPk(jobId)
    .then((job) => {
      if (!job) {
        console.log("job not found!");
        return null;
      }
      return Skill.findByPk(skillId).then((skill) => {
        if (!skill) {
          console.log("skill not found!");
          return null;
        }
        job.addSkill(skill)
        console.log(`>> added skill id=${skill.id} to job id=${job.id}`);
        return job;
      });
    })
    .catch((err) => {
      console.log(">> Error while adding skill to Profile: ", err);
    });
}