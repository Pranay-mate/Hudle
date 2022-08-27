const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.get("/candidate",[authJwt.verifyToken, authJwt.isCandidate],controller.candidateBoard);
  app.get("/recruiter",[authJwt.verifyToken, authJwt.isRecruiter],controller.recruiterBoard);
  
  // common routes
  app.get("/api/getSkills",controller.getSkills);
  app.get("/api/getJobPreferences",controller.getJobPreferences);

  // candidate routes
  app.post("/api/addCandidateProfile",controller.addCandidateProfile);
  app.get("/api/getCandidateProfile/:candidateId",controller.getCandidateProfile);
  app.post("/api/updateCandidateProfile/:profileId",controller.updateCandidateProfile);
  app.post("/api/getJobsforCandidate",controller.getJobsforCandidate)
  app.post("/api/applyJob",controller.applyJob)
  app.get("/api/getAppliedJobs/:candidateId",controller.getAppliedJobs)

  // recruiter routes
  app.post("/api/addJob",controller.addJob);
  app.get("/api/getCreatedJobs/:recruiter_id",controller.getCreatedJobs)
  app.post("/api/archiveJob/:jobId",controller.archiveJob)
  app.get("/api/checkApplicantsForJob/:jobId",controller.checkApplicantsForJob)
  app.post("/api/changeCandidateStatus",controller.changeCandidateStatus)
  
};
