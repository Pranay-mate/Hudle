const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.profile = require("../models/profile.model.js")(sequelize, Sequelize);
db.job = require("../models/jobs.model.js")(sequelize, Sequelize);
db.skill = require("../models/skill.model.js")(sequelize, Sequelize);
db.jobPreference = require("../models/jobPreference.model.js")(sequelize, Sequelize);

db.skill_mapping = require("../models/skill_mapping.model.js")(sequelize, Sequelize);
db.jobPreference_mapping = require("../models/jobPreference_mapping.model.js")(sequelize, Sequelize);
db.skill_job_mapping = require("../models/skill_job_mapping.model.js")(sequelize, Sequelize);
db.job_profile_mapping = require("../models/job_profile_mapping.model.js")(sequelize, Sequelize);
db.skill_jobPreference_mapping = require("../models/skill_JobPreference_mapping.model.js")(sequelize, Sequelize);

db.ROLES = [1,2];

db.profile.belongsTo(db.user, {foreignKey: 'candidate_id'}); 
db.user.hasOne(db.profile, {foreignKey: 'candidate_id'});

//many-to-many skill-profile
db.skill.belongsToMany(db.profile, {
  through: "skill_mapping",
  as: "profile",
  foreignKey: "skill_id",
});

db.profile.belongsToMany(db.skill, {
  through: "skill_mapping",
  as: "skill",
  foreignKey: "profile_id",
});


//smany-to-many skill-job
db.skill.belongsToMany(db.job, {
  through: "skill_job_mapping",
  as: "job",
  foreignKey: "skill_id",
});

db.job.belongsToMany(db.skill, {
  through: "skill_job_mapping",
  as: "skill",
  foreignKey: "job_id",
});

//many-to-many jobPreference profile
db.jobPreference.belongsToMany(db.profile, {
  through: "jobPreference_mapping",
  as: "profile",
  foreignKey: "jobPreference_id",
});

db.profile.belongsToMany(db.jobPreference, {
  through: "jobPreference_mapping",
  as: "jobPreference",
  foreignKey: "profile_id",
});

//many-to-many job-profile
db.job.belongsToMany(db.profile, {
  through: "job_profile_mapping",
  as: "profile",
  foreignKey: "job_id",
});

db.profile.belongsToMany(db.job, {
  through: "job_profile_mapping",
  as: "job",
  foreignKey: "profile_id",
});

//many-to-many skill-jobPreference
db.skill.belongsToMany(db.jobPreference, {
  through: "skill_jobPreference_mapping",
  as: "jobPreference",
  foreignKey: "skill_id",
});

db.jobPreference.belongsToMany(db.skill, {
  through: "skill_jobPreference_mapping",
  as: "skill",
  foreignKey: "job_id",
});

//one-to-one job with jobTitle(jobPref)
db.job.belongsTo(db.jobPreference, {foreignKey: 'title'}); 
db.jobPreference.hasOne(db.job, {foreignKey: 'title'});


//Data insert statements
db.skill.bulkCreate([
  {
      "id": 1,
      "skill_title": "python"
  },
  {
      "id": 2,
      "skill_title": "MLT"
  },
  {
      "id": 3,
      "skill_title": "statistical modeling"
  },
  {
      "id": 4,
      "skill_title": "machine learning"
  },
  {
      "id": 5,
      "skill_title": "IT Skills"
  },
  {
      "id": 6,
      "skill_title": "advanced analytics"
  },
  {
      "id": 7,
      "skill_title": "scala"
  },
  {
      "id": 8,
      "skill_title": "statistics"
  },
  {
      "id": 9,
      "skill_title": "Data Science"
  },
  {
      "id": 10,
      "skill_title": "Machine learning"
  },
  {
      "id": 11,
      "skill_title": "Python"
  },
  {
      "id": 12,
      "skill_title": "Azure"
  },
  {
      "id": 13,
      "skill_title": "BiqQuery"
  },
  {
      "id": 14,
      "skill_title": "GCP"
  },
  {
      "id": 15,
      "skill_title": "PySpark"
  },
  {
      "id": 16,
      "skill_title": "tensorflow"
  },
  {
      "id": 17,
      "skill_title": "data analysis"
  },
  {
      "id": 18,
      "skill_title": "aws"
  },
  {
      "id": 19,
      "skill_title": "azure"
  },
  {
      "id": 20,
      "skill_title": "Machine Learning"
  },
  {
      "id": 21,
      "skill_title": "Big Data"
  },
  {
      "id": 22,
      "skill_title": "Computer science"
  },
  {
      "id": 23,
      "skill_title": "Computer vision"
  },
  {
      "id": 24,
      "skill_title": "deep learning"
  },
  {
      "id": 25,
      "skill_title": "Java"
  },
  {
      "id": 26,
      "skill_title": "Software Development"
  },
  {
      "id": 27,
      "skill_title": "Testing"
  },
  {
      "id": 28,
      "skill_title": "Node.js"
  },
  {
      "id": 29,
      "skill_title": "HTML"
  },
  {
      "id": 30,
      "skill_title": "CSS"
  },
  {
      "id": 31,
      "skill_title": "Hibernate"
  },
  {
      "id": 32,
      "skill_title": "Spark"
  },
  {
      "id": 33,
      "skill_title": "S3"
  },
  {
      "id": 34,
      "skill_title": "lambda"
  },
  {
      "id": 35,
      "skill_title": "Athena"
  },
  {
      "id": 36,
      "skill_title": "AWS"
  },
  {
      "id": 37,
      "skill_title": "Cloud"
  },
  {
      "id": 38,
      "skill_title": "AirFlow"
  },
  {
      "id": 39,
      "skill_title": "BigQuery"
  },
  {
      "id": 40,
      "skill_title": "GCS"
  },
  {
      "id": 41,
      "skill_title": "Kafka"
  },
  {
      "id": 42,
      "skill_title": "Shell script"
  },
  {
      "id": 43,
      "skill_title": "RDBMS"
  },
  {
      "id": 44,
      "skill_title": "PowerShell"
  },
  {
      "id": 45,
      "skill_title": "Azure Data Factory"
  },
  {
      "id": 46,
      "skill_title": "PaaS"
  },
  {
      "id": 47,
      "skill_title": "MDM"
  },
  {
      "id": 48,
      "skill_title": "SaaS"
  },
  {
      "id": 49,
      "skill_title": "IaaS"
  },
  {
      "id": 50,
      "skill_title": "Azure Data Lake"
  },
  {
      "id": 51,
      "skill_title": "JavaScript"
  },
  {
      "id": 52,
      "skill_title": "NoSQL"
  },
  {
      "id": 53,
      "skill_title": "Cloud Computing"
  },
  {
      "id": 54,
      "skill_title": "Full Stack"
  },
  {
      "id": 55,
      "skill_title": "SQL"
  },
  {
      "id": 56,
      "skill_title": "Java EE"
  },
  {
      "id": 57,
      "skill_title": "JMS"
  },
  {
      "id": 58,
      "skill_title": "Core Java"
  },
  {
      "id": 59,
      "skill_title": "JUnit"
  },
  {
      "id": 60,
      "skill_title": "Weblogic"
  },
  {
      "id": 61,
      "skill_title": "JPA"
  },
  {
      "id": 62,
      "skill_title": "JSON"
  },
  {
      "id": 63,
      "skill_title": "SOAP"
  },
  {
      "id": 64,
      "skill_title": "C"
  },
  {
      "id": 65,
      "skill_title": "Six Sigma"
  },
  {
      "id": 66,
      "skill_title": "PMP"
  },
  {
      "id": 67,
      "skill_title": ".NET"
  },
  {
      "id": 68,
      "skill_title": "Oracle"
  },
  {
      "id": 69,
      "skill_title": "assembly language"
  },
  {
      "id": 70,
      "skill_title": "Real Time Operating Systems"
  },
  {
      "id": 71,
      "skill_title": "ajax"
  },
  {
      "id": 72,
      "skill_title": "javascript"
  },
  {
      "id": 73,
      "skill_title": "php"
  },
  {
      "id": 74,
      "skill_title": "erp"
  },
  {
      "id": 75,
      "skill_title": "website"
  },
  {
      "id": 76,
      "skill_title": "development"
  },
  {
      "id": 77,
      "skill_title": "software development"
  },
  {
      "id": 78,
      "skill_title": "module"
  },
  {
      "id": 79,
      "skill_title": "mca"
  },
  {
      "id": 80,
      "skill_title": "application development"
  },
  {
      "id": 81,
      "skill_title": "application"
  },
  {
      "id": 82,
      "skill_title": "web"
  },
  {
      "id": 83,
      "skill_title": "programming"
  },
  {
      "id": 84,
      "skill_title": "java"
  },
  {
      "id": 85,
      "skill_title": "mongodb"
  },
  {
      "id": 86,
      "skill_title": "spring"
  },
  {
      "id": 87,
      "skill_title": "jms"
  },
  {
      "id": 88,
      "skill_title": "HR"
  },
  {
      "id": 89,
      "skill_title": "Human Resource Management"
  },
  {
      "id": 90,
      "skill_title": "Placement Coordination"
  },
  {
      "id": 91,
      "skill_title": "recruitment executive"
  },
  {
      "id": 92,
      "skill_title": "recruitment officer"
  },
  {
      "id": 93,
      "skill_title": "ngular JS"
  },
  {
      "id": 94,
      "skill_title": "ibernate"
  },
  {
      "id": 95,
      "skill_title": "ore Java"
  },
  {
      "id": 96,
      "skill_title": "echnical Leader"
  },
  {
      "id": 97,
      "skill_title": "echnical"
  },
  {
      "id": 98,
      "skill_title": "avascript"
  },
  {
      "id": 99,
      "skill_title": "pring"
  },
  {
      "id": 100,
      "skill_title": "Query"
  },
  {
      "id": 101,
      "skill_title": "S framework"
  },
  {
      "id": 102,
      "skill_title": "Angularjs"
  },
  {
      "id": 103,
      "skill_title": "DOM"
  },
  {
      "id": 104,
      "skill_title": "Computer Science"
  },
  {
      "id": 105,
      "skill_title": "Javascript"
  },
  {
      "id": 106,
      "skill_title": "Spring"
  },
  {
      "id": 107,
      "skill_title": "Ajax"
  },
  {
      "id": 108,
      "skill_title": "html"
  },
  {
      "id": 109,
      "skill_title": "sql server"
  },
  {
      "id": 110,
      "skill_title": "jquery"
  },
  {
      "id": 111,
      "skill_title": "soa"
  },
  {
      "id": 112,
      "skill_title": "oop"
  },
  {
      "id": 113,
      "skill_title": "english"
  },
  {
      "id": 114,
      "skill_title": "proactive"
  },
  {
      "id": 115,
      "skill_title": "asp net c"
  },
  {
      "id": 116,
      "skill_title": "XML"
  },
  {
      "id": 117,
      "skill_title": "rest"
  },
  {
      "id": 118,
      "skill_title": "Prototype"
  },
  {
      "id": 119,
      "skill_title": "technical"
  },
  {
      "id": 120,
      "skill_title": "developing"
  },
  {
      "id": 121,
      "skill_title": "application architecture"
  },
  {
      "id": 122,
      "skill_title": "SDLC"
  },
  {
      "id": 123,
      "skill_title": "jQuery"
  },
  {
      "id": 124,
      "skill_title": "Web services"
  },
  {
      "id": 125,
      "skill_title": "design"
  },
  {
      "id": 126,
      "skill_title": "Web designing"
  },
  {
      "id": 127,
      "skill_title": "architecture"
  },
  {
      "id": 128,
      "skill_title": "applications"
  },
  {
      "id": 129,
      "skill_title": "Performance management"
  },
  {
      "id": 130,
      "skill_title": "Analytical"
  },
  {
      "id": 131,
      "skill_title": "Design development"
  },
  {
      "id": 132,
      "skill_title": "Conceptualization"
  },
  {
      "id": 133,
      "skill_title": "Continuous improvement"
  },
  {
      "id": 134,
      "skill_title": "Sales support"
  },
  {
      "id": 135,
      "skill_title": "Recruitment"
  },
  {
      "id": 136,
      "skill_title": "MySQL"
  },
  {
      "id": 137,
      "skill_title": "Struts"
  },
  {
      "id": 138,
      "skill_title": "Database"
  },
  {
      "id": 139,
      "skill_title": "JSF"
  },
  {
      "id": 140,
      "skill_title": "Wordpress"
  },
  {
      "id": 141,
      "skill_title": "Flex"
  },
  {
      "id": 142,
      "skill_title": "CMS"
  },
  {
      "id": 143,
      "skill_title": "PHP"
  },
  {
      "id": 144,
      "skill_title": "Joomla"
  },
  {
      "id": 145,
      "skill_title": "Html5"
  },
  {
      "id": 146,
      "skill_title": "Bootstrap"
  },
  {
      "id": 147,
      "skill_title": "Node.Js"
  },
  {
      "id": 148,
      "skill_title": "JQuery"
  },
  {
      "id": 149,
      "skill_title": "Core PHP"
  },
  {
      "id": 150,
      "skill_title": "ERP"
  },
  {
      "id": 151,
      "skill_title": "Succession Planning"
  },
  {
      "id": 152,
      "skill_title": "MIS"
  },
  {
      "id": 153,
      "skill_title": "Reports"
  },
  {
      "id": 154,
      "skill_title": "Talent Management"
  },
  {
      "id": 155,
      "skill_title": "Human Resources"
  },
  {
      "id": 156,
      "skill_title": "HR Policies"
  },
  {
      "id": 157,
      "skill_title": "Talent Acquisition"
  },
  {
      "id": 158,
      "skill_title": "Staffing"
  },
  {
      "id": 159,
      "skill_title": "ESIC"
  },
  {
      "id": 160,
      "skill_title": "Security management"
  },
  {
      "id": 161,
      "skill_title": "Monitoring"
  },
  {
      "id": 162,
      "skill_title": "Talent Acquisition Executive"
  },
  {
      "id": 163,
      "skill_title": "Housekeeping management"
  },
  {
      "id": 164,
      "skill_title": "Process documentation"
  },
  {
      "id": 165,
      "skill_title": "Statutory compliance"
  },
  {
      "id": 166,
      "skill_title": "Excel"
  },
  {
      "id": 167,
      "skill_title": "Administration"
  },
  {
      "id": 168,
      "skill_title": "Selenium"
  },
  {
      "id": 169,
      "skill_title": "Test scripts"
  },
  {
      "id": 170,
      "skill_title": "TDD"
  },
  {
      "id": 171,
      "skill_title": "Test scenarios"
  },
  {
      "id": 172,
      "skill_title": "Test cases"
  },
  {
      "id": 173,
      "skill_title": "JIRA"
  },
  {
      "id": 174,
      "skill_title": "QA"
  },
  {
      "id": 175,
      "skill_title": "Regression testing"
  },
  {
      "id": 176,
      "skill_title": "Software testing"
  },
  {
      "id": 177,
      "skill_title": "React.js"
  },
  {
      "id": 178,
      "skill_title": "IT skills"
  },
  {
      "id": 179,
      "skill_title": "Promises"
  },
  {
      "id": 180,
      "skill_title": "Mysql"
  },
  {
      "id": 181,
      "skill_title": "Redux"
  },
  {
      "id": 182,
      "skill_title": "Mongodb"
  },
  {
      "id": 183,
      "skill_title": "express"
  }
]);

db.jobPreference.bulkCreate([
  {id:'1',job_title:'Senior Data Scientist'},
  {id:'2',job_title:'Senior Data Scientist'},
  {id:'3',job_title:'Data Scientist'},
  {id:'4',job_title:'Data Scientist'},
  {id:'5',job_title:'Java Full Stack Developer'},
  {id:'6',job_title:'Tech Lead/Architect'},
  {id:'7',job_title:'Tech Lead / POD Lead'},
  {id:'8',job_title:'Tech Lead - Azure'},
  {id:'9',job_title:'Full Stack Developer - Machine Learning'},
  {id:'10',job_title:' Back End Java Developer'},
  {id:'11',job_title:' IT Security Head '},
  {id:'12',job_title:' Software Development / Software Engineer'},
  {id:'13',job_title:' Senior Java Developer'},
  {id:'14',job_title:' Placement Officer,'},
  {id:'15',job_title:'Java Full Stack Technical Lead'},
  {id:'16',job_title:' Java with AngularJS and Spring'},
  {id:'17',job_title:' Senior .NET Developer'},
  {id:'18',job_title:'Web Services also experienced in AngularJS'},
  {id:'19',job_title:' HR - Talent scout specialist'},
  {id:'20',job_title:' React.js Developer'},
  {id:'21',job_title:' Senior Laravel Developer'},
  {id:'22',job_title:' Technical Lead'},
  {id:'23',job_title:' HR Fresher trainee'},
  {id:'24',job_title:' HR Executive'},
  {id:'25',job_title:' Test Automation Engineer'},
  {id:'26',job_title:'Software tester/ QA'},
  {id:'27',job_title:'React developer'},
  {id:'28',job_title:'MERN stack developer'}]);

db.skill_jobPreference_mapping.bulkCreate([
  {
      "job_id": 1,
      "skill_id": 1
  },
  {
      "job_id": 1,
      "skill_id": 2
  },
  {
      "job_id": 1,
      "skill_id": 4
  },
  {
      "job_id": 1,
      "skill_id": 5
  },
  {
      "job_id": 1,
      "skill_id": 6
  },
  {
      "job_id": 1,
      "skill_id": 7
  },
  {
      "job_id": 1,
      "skill_id": 8
  },
  {
      "job_id": 2,
      "skill_id": 9
  },
  {
      "job_id": 2,
      "skill_id": 10
  },
  {
      "job_id": 2,
      "skill_id": 11
  },
  {
      "job_id": 2,
      "skill_id": 12
  },
  {
      "job_id": 2,
      "skill_id": 13
  },
  {
      "job_id": 2,
      "skill_id": 14
  },
  {
      "job_id": 2,
      "skill_id": 15
  },
  {
      "job_id": 2,
      "skill_id": 16
  },
  {
      "job_id": 3,
      "skill_id": 1
  },
  {
      "job_id": 3,
      "skill_id": 4
  },
  {
      "job_id": 3,
      "skill_id": 9
  },
  {
      "job_id": 3,
      "skill_id": 17
  },
  {
      "job_id": 3,
      "skill_id": 18
  },
  {
      "job_id": 3,
      "skill_id": 19
  },
  {
      "job_id": 4,
      "skill_id": 5
  },
  {
      "job_id": 4,
      "skill_id": 11
  },
  {
      "job_id": 4,
      "skill_id": 9
  },
  {
      "job_id": 4,
      "skill_id": 20
  },
  {
      "job_id": 4,
      "skill_id": 21
  },
  {
      "job_id": 4,
      "skill_id": 22
  },
  {
      "job_id": 4,
      "skill_id": 23
  },
  {
      "job_id": 4,
      "skill_id": 24
  },
  {
      "job_id": 5,
      "skill_id": 5
  },
  {
      "job_id": 5,
      "skill_id": 25
  },
  {
      "job_id": 5,
      "skill_id": 26
  },
  {
      "job_id": 5,
      "skill_id": 27
  },
  {
      "job_id": 5,
      "skill_id": 28
  },
  {
      "job_id": 5,
      "skill_id": 29
  },
  {
      "job_id": 5,
      "skill_id": 30
  },
  {
      "job_id": 5,
      "skill_id": 31
  },
  {
      "job_id": 6,
      "skill_id": 32
  },
  {
      "job_id": 6,
      "skill_id": 11
  },
  {
      "job_id": 6,
      "skill_id": 33
  },
  {
      "job_id": 6,
      "skill_id": 34
  },
  {
      "job_id": 6,
      "skill_id": 35
  },
  {
      "job_id": 6,
      "skill_id": 36
  },
  {
      "job_id": 6,
      "skill_id": 5
  },
  {
      "job_id": 6,
      "skill_id": 37
  },
  {
      "job_id": 7,
      "skill_id": 38
  },
  {
      "job_id": 7,
      "skill_id": 39
  },
  {
      "job_id": 7,
      "skill_id": 40
  },
  {
      "job_id": 7,
      "skill_id": 41
  },
  {
      "job_id": 7,
      "skill_id": 25
  },
  {
      "job_id": 7,
      "skill_id": 42
  },
  {
      "job_id": 7,
      "skill_id": 43
  },
  {
      "job_id": 7,
      "skill_id": 11
  },
  {
      "job_id": 8,
      "skill_id": 44
  },
  {
      "job_id": 8,
      "skill_id": 45
  },
  {
      "job_id": 8,
      "skill_id": 12
  },
  {
      "job_id": 8,
      "skill_id": 46
  },
  {
      "job_id": 8,
      "skill_id": 47
  },
  {
      "job_id": 8,
      "skill_id": 48
  },
  {
      "job_id": 8,
      "skill_id": 49
  },
  {
      "job_id": 8,
      "skill_id": 50
  },
  {
      "job_id": 9,
      "skill_id": 25
  },
  {
      "job_id": 9,
      "skill_id": 51
  },
  {
      "job_id": 9,
      "skill_id": 20
  },
  {
      "job_id": 9,
      "skill_id": 52
  },
  {
      "job_id": 9,
      "skill_id": 53
  },
  {
      "job_id": 9,
      "skill_id": 54
  },
  {
      "job_id": 9,
      "skill_id": 36
  },
  {
      "job_id": 9,
      "skill_id": 55
  },
  {
      "job_id": 10,
      "skill_id": 56
  },
  {
      "job_id": 10,
      "skill_id": 57
  },
  {
      "job_id": 10,
      "skill_id": 58
  },
  {
      "job_id": 10,
      "skill_id": 59
  },
  {
      "job_id": 10,
      "skill_id": 29
  },
  {
      "job_id": 10,
      "skill_id": 61
  },
  {
      "job_id": 10,
      "skill_id": 62
  },
  {
      "job_id": 10,
      "skill_id": 63
  },
  {
      "job_id": 10,
      "skill_id": 55
  },
  {
      "job_id": 11,
      "skill_id": 64
  },
  {
      "job_id": 11,
      "skill_id": 11
  },
  {
      "job_id": 11,
      "skill_id": 65
  },
  {
      "job_id": 11,
      "skill_id": 66
  },
  {
      "job_id": 11,
      "skill_id": 67
  },
  {
      "job_id": 11,
      "skill_id": 29
  },
  {
      "job_id": 11,
      "skill_id": 51
  },
  {
      "job_id": 11,
      "skill_id": 55
  },
  {
      "job_id": 11,
      "skill_id": 68
  },
  {
      "job_id": 11,
      "skill_id": 69
  },
  {
      "job_id": 11,
      "skill_id": 70
  },
  {
      "job_id": 12,
      "skill_id": 71
  },
  {
      "job_id": 12,
      "skill_id": 72
  },
  {
      "job_id": 12,
      "skill_id": 73
  },
  {
      "job_id": 12,
      "skill_id": 74
  },
  {
      "job_id": 12,
      "skill_id": 75
  },
  {
      "job_id": 12,
      "skill_id": 76
  },
  {
      "job_id": 12,
      "skill_id": 77
  },
  {
      "job_id": 12,
      "skill_id": 78
  },
  {
      "job_id": 12,
      "skill_id": 79
  },
  {
      "job_id": 12,
      "skill_id": 80
  },
  {
      "job_id": 12,
      "skill_id": 81
  },
  {
      "job_id": 12,
      "skill_id": 82
  },
  {
      "job_id": 12,
      "skill_id": 83
  },
  {
      "job_id": 13,
      "skill_id": 84
  },
  {
      "job_id": 13,
      "skill_id": 85
  },
  {
      "job_id": 13,
      "skill_id": 31
  },
  {
      "job_id": 13,
      "skill_id": 86
  },
  {
      "job_id": 13,
      "skill_id": 87
  },
  {
      "job_id": 14,
      "skill_id": 88
  },
  {
      "job_id": 14,
      "skill_id": 89
  },
  {
      "job_id": 14,
      "skill_id": 90
  },
  {
      "job_id": 14,
      "skill_id": 91
  },
  {
      "job_id": 14,
      "skill_id": 92
  },
  {
      "job_id": 15,
      "skill_id": 25
  },
  {
      "job_id": 15,
      "skill_id": 31
  },
  {
      "job_id": 15,
      "skill_id": 58
  },
  {
      "job_id": 15,
      "skill_id": 105
  },
  {
      "job_id": 15,
      "skill_id": 106
  },
  {
      "job_id": 15,
      "skill_id": 148
  },
  {
      "job_id": 16,
      "skill_id": 102
  },
  {
      "job_id": 16,
      "skill_id": 30
  },
  {
      "job_id": 16,
      "skill_id": 58
  },
  {
      "job_id": 16,
      "skill_id": 103
  },
  {
      "job_id": 16,
      "skill_id": 105
  },
  {
      "job_id": 16,
      "skill_id": 29
  },
  {
      "job_id": 16,
      "skill_id": 106
  },
  {
      "job_id": 16,
      "skill_id": 107
  },
  {
      "job_id": 17,
      "skill_id": 72
  },
  {
      "job_id": 17,
      "skill_id": 108
  },
  {
      "job_id": 17,
      "skill_id": 71
  },
  {
      "job_id": 17,
      "skill_id": 110
  },
  {
      "job_id": 17,
      "skill_id": 111
  },
  {
      "job_id": 17,
      "skill_id": 112
  },
  {
      "job_id": 17,
      "skill_id": 113
  },
  {
      "job_id": 17,
      "skill_id": 114
  },
  {
      "job_id": 17,
      "skill_id": 115
  },
  {
      "job_id": 18,
      "skill_id": 29
  },
  {
      "job_id": 18,
      "skill_id": 116
  },
  {
      "job_id": 18,
      "skill_id": 107
  },
  {
      "job_id": 18,
      "skill_id": 117
  },
  {
      "job_id": 18,
      "skill_id": 118
  },
  {
      "job_id": 18,
      "skill_id": 119
  },
  {
      "job_id": 18,
      "skill_id": 120
  },
  {
      "job_id": 18,
      "skill_id": 62
  },
  {
      "job_id": 18,
      "skill_id": 121
  },
  {
      "job_id": 18,
      "skill_id": 122
  },
  {
      "job_id": 18,
      "skill_id": 72
  },
  {
      "job_id": 18,
      "skill_id": 123
  },
  {
      "job_id": 18,
      "skill_id": 124
  },
  {
      "job_id": 18,
      "skill_id": 84
  },
  {
      "job_id": 18,
      "skill_id": 81
  },
  {
      "job_id": 18,
      "skill_id": 82
  },
  {
      "job_id": 18,
      "skill_id": 125
  },
  {
      "job_id": 18,
      "skill_id": 126
  },
  {
      "job_id": 18,
      "skill_id": 127
  },
  {
      "job_id": 18,
      "skill_id": 128
  },
  {
      "job_id": 20,
      "skill_id": 123
  },
  {
      "job_id": 20,
      "skill_id": 136
  },
  {
      "job_id": 20,
      "skill_id": 137
  },
  {
      "job_id": 20,
      "skill_id": 105
  },
  {
      "job_id": 20,
      "skill_id": 138
  },
  {
      "job_id": 20,
      "skill_id": 139
  },
  {
      "job_id": 21,
      "skill_id": 136
  },
  {
      "job_id": 21,
      "skill_id": 140
  },
  {
      "job_id": 21,
      "skill_id": 105
  },
  {
      "job_id": 21,
      "skill_id": 141
  },
  {
      "job_id": 21,
      "skill_id": 142
  },
  {
      "job_id": 21,
      "skill_id": 143
  },
  {
      "job_id": 21,
      "skill_id": 29
  },
  {
      "job_id": 21,
      "skill_id": 62
  },
  {
      "job_id": 21,
      "skill_id": 144
  },
  {
      "job_id": 21,
      "skill_id": 107
  },
  {
      "job_id": 22,
      "skill_id": 30
  },
  {
      "job_id": 22,
      "skill_id": 145
  },
  {
      "job_id": 22,
      "skill_id": 136
  },
  {
      "job_id": 22,
      "skill_id": 105
  },
  {
      "job_id": 22,
      "skill_id": 146
  },
  {
      "job_id": 22,
      "skill_id": 62
  },
  {
      "job_id": 22,
      "skill_id": 147
  },
  {
      "job_id": 22,
      "skill_id": 148
  },
  {
      "job_id": 22,
      "skill_id": 149
  },
  {
      "job_id": 22,
      "skill_id": 107
  },
  {
      "job_id": 23,
      "skill_id": 150
  },
  {
      "job_id": 23,
      "skill_id": 151
  },
  {
      "job_id": 23,
      "skill_id": 152
  },
  {
      "job_id": 23,
      "skill_id": 153
  },
  {
      "job_id": 23,
      "skill_id": 154
  },
  {
      "job_id": 23,
      "skill_id": 155
  },
  {
      "job_id": 23,
      "skill_id": 156
  },
  {
      "job_id": 23,
      "skill_id": 135
  },
  {
      "job_id": 23,
      "skill_id": 157
  },
  {
      "job_id": 24,
      "skill_id": 158
  },
  {
      "job_id": 24,
      "skill_id": 159
  },
  {
      "job_id": 24,
      "skill_id": 160
  },
  {
      "job_id": 24,
      "skill_id": 161
  },
  {
      "job_id": 24,
      "skill_id": 162
  },
  {
      "job_id": 24,
      "skill_id": 163
  },
  {
      "job_id": 24,
      "skill_id": 164
  },
  {
      "job_id": 24,
      "skill_id": 165
  },
  {
      "job_id": 24,
      "skill_id": 166
  },
  {
      "job_id": 24,
      "skill_id": 167
  },
  {
      "job_id": 25,
      "skill_id": 168
  },
  {
      "job_id": 25,
      "skill_id": 122
  },
  {
      "job_id": 25,
      "skill_id": 55
  },
  {
      "job_id": 25,
      "skill_id": 22
  },
  {
      "job_id": 25,
      "skill_id": 169
  },
  {
      "job_id": 25,
      "skill_id": 170
  },
  {
      "job_id": 25,
      "skill_id": 171
  },
  {
      "job_id": 25,
      "skill_id": 172
  },
  {
      "job_id": 25,
      "skill_id": 173
  },
  {
      "job_id": 25,
      "skill_id": 133
  },
  {
      "job_id": 26,
      "skill_id": 122
  },
  {
      "job_id": 26,
      "skill_id": 174
  },
  {
      "job_id": 26,
      "skill_id": 22
  },
  {
      "job_id": 26,
      "skill_id": 173
  },
  {
      "job_id": 26,
      "skill_id": 175
  },
  {
      "job_id": 26,
      "skill_id": 176
  },
  {
      "job_id": 26,
      "skill_id": 5
  },
  {
      "job_id": 27,
      "skill_id": 177
  },
  {
      "job_id": 27,
      "skill_id": 178
  },
  {
      "job_id": 27,
      "skill_id": 105
  },
  {
      "job_id": 27,
      "skill_id": 179
  },
  {
      "job_id": 27,
      "skill_id": 180
  },
  {
      "job_id": 27,
      "skill_id": 181
  },
  {
      "job_id": 28,
      "skill_id": 177
  },
  {
      "job_id": 28,
      "skill_id": 178
  },
  {
      "job_id": 28,
      "skill_id": 105
  },
  {
      "job_id": 28,
      "skill_id": 179
  },
  {
      "job_id": 28,
      "skill_id": 182
  },
  {
      "job_id": 28,
      "skill_id": 183
  },
  {
      "job_id": 28,
      "skill_id": 181
  }
]);

db.skill.sync();
db.jobPreference.sync();
db.skill_jobPreference_mapping.sync();

module.exports = db;