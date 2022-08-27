module.exports = (sequelize, Sequelize) => {
    const Job_profile_mapping = sequelize.define("job_profile_mapping", {
      status:{
        type: Sequelize.STRING,
        defaultValue: "Pending"
      }
    });
    return Job_profile_mapping;
  };
  