module.exports = (sequelize, Sequelize) => {
    const JobPreference = sequelize.define("jobPreferences", {
      job_title: {
        type: Sequelize.STRING
      }
    });
  
    return JobPreference;
  };
  