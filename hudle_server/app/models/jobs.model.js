module.exports = (sequelize, Sequelize) => {
    const Job = sequelize.define("jobs", {
        recruiter_id: {
        type: Sequelize.INTEGER
      },
      organization:{
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      required_skills: {
        type: Sequelize.JSON
      },
      isArchived: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      applied_profiles: {
        type: Sequelize.JSON
      },
      positions: {
        type: Sequelize.INTEGER
      },
      salary: {
        type: Sequelize.STRING
    },
        created_by:{
        type: Sequelize.STRING
      }
    });
  
    return Job;
  };
  