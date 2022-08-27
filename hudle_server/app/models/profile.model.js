module.exports = (sequelize, Sequelize) => {
    const Profile = sequelize.define("profiles", {
      full_name: {
        type: Sequelize.STRING
      },
      educations: {
        type: Sequelize.STRING
      },
      skills: {
        type: Sequelize.JSON
      },
      job_preferences: {
        type: Sequelize.JSON
      },
      resume_link: {
        type: Sequelize.STRING
      }
    });
    return Profile;
  };
  