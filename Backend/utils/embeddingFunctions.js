const { downloadResume, extractTextFromPDF } = require("./getFitScore");

async function getUserText(userData) {
  const filePath = await downloadResume(userData.resume?.url);
  const resumeText = await extractTextFromPDF(filePath);

  let userDetails = `
candidate details
    -name: ${userData.name}
    -email: ${userData.email}
    -about user: ${userData.description}
    -job preferences: 
        - role: ${userData.jobPreferences?.roles?.join(",")}
        - salary expectation: ${userData.jobPreferences.salaryExpectation}
        - location preference: ${userData.jobPreferences.locationPreference}
        - remote preferred: ${userData.jobPreferences.remotePreferred}
        - notice period: ${userData.jobPreferences.noticePeriod}
    -resume text: ${resumeText}
    `;
  return userDetails;
}

async function getJobText(jobData) {
  let jobText = `
Job Details
   -job title: ${jobData.title}
   -description: ${jobData.plainTextDescription}
   -location: ${jobData.location}
   -jobType: ${jobData.jobType}
   -salaryRange: ${jobData.salaryRange.min}-${jobData.salaryRange.max}
   -experience required: ${jobData.experienceRequired.min}-${
    jobData.experienceRequired.max
  }
   -required skills: ${jobData.requiredSkills.join(", ")}
   `;
  return jobText;
}

async function getJobApplicationText(applicationData) {
  let text = `
Application Detials
    -ai match score: ${applicationData.aiFitScore}
    `;
  return text;
}

async function combinedTextForJobApplication({
  userData,
  jobData,
  applicationData,
}) {
  let applicationText = await getJobApplicationText(applicationData);
  let jobText = await getJobText(jobData);
  let userText = await getUserText(userData);

  let text = `
    ${applicationText}
    ${userText}
    ${jobText}
      `;
  return text;
}

module.exports = { getUserText, getJobText, combinedTextForJobApplication };
