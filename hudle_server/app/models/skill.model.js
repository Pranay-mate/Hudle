module.exports = (sequelize, Sequelize) => {
    const Skill = sequelize.define("skills", {
      skill_title: {
        type: Sequelize.STRING
      }
    });
  
    return Skill;
  };
  