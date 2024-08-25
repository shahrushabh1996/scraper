const cheerio = require("cheerio");
const axios = require("axios");
const fs = require('fs');
const mongoose = require('mongoose');
let db;
// const axiosRetry = require('axios-retry').default;

const uri = "mongodb+srv://rushabhparallels2024:GtfsPq8RbJLzKJOM@cluster0.ehh3etb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connectMongoDB() {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('Connected to MongoDB');

  db = mongoose.connection;
}

// // Apply the retry middleware to axios
// axiosRetry(axios, {
//   retries: 3, // Number of retries
//   retryDelay: (retryCount) => {
//     return retryCount * 1000; // Exponential backoff: 1s, 2s, 3s
//   },
//   retryCondition: (error) => {
//     // Retry on status code 429
//     return error.response && error.response.status === 429;
//   },
// });

module.exports.query = async (queryObject) => {
  await connectMongoDB();
  const query = new Query(queryObject);
  return query.getJobs();
};

//transfers object values passed to our .query to an obj we can access
function Query(queryObj) {
  //query vars
  this.host = queryObj.host || "www.linkedin.com";

  //api handles strings with spaces by replacing the values with %20
  this.keyword = queryObj.keyword?.trim().replace(" ", "+") || "";
  this.location = queryObj.location?.trim().replace(" ", "+") || "";
  this.dateSincePosted = queryObj.dateSincePosted || "";
  this.jobType = queryObj.jobType || "";
  this.remoteFilter = queryObj.remoteFilter || "";
  this.salary = queryObj.salary || "";
  this.experienceLevel = queryObj.experienceLevel || "";
  this.sortBy = queryObj.sortBy || "";
  //internal variable
  this.limit = Number(queryObj.limit) || 0;
  this.start = queryObj.start || 0;
}

/*
 *
 *
 * Following get Functions act as object literals so the query can be constructed with the correct parameters
 *
 *
 */
Query.prototype.getDateSincePosted = function () {
  const dateRange = {
    "past month": "r2592000",
    "past week": "r604800",
    "24hr": "r86400",
  };
  return dateRange[this.dateSincePosted.toLowerCase()] ?? "";
};

Query.prototype.getExperienceLevel = function () {
  const experienceRange = {
    internship: "1",
    "entry level": "2",
    associate: "3",
    senior: "4",
    director: "5",
    executive: "6",
  };
  return experienceRange[this.experienceLevel.toLowerCase()] ?? "";
};
Query.prototype.getJobType = function () {
  const jobTypeRange = {
    "full time": "F",
    "full-time": "F",
    "part time": "P",
    "part-time": "P",
    contract: "C",
    temporary: "T",
    volunteer: "V",
    internship: "I",
  };
  return jobTypeRange[this.jobType.toLowerCase()] ?? "";
};
Query.prototype.getRemoteFilter = function () {
  const remoteFilterRange = {
    "on-site": "1",
    "on site": "1",
    remote: "2",
    hybrid: "3",
  };
  return remoteFilterRange[this.remoteFilter.toLowerCase()] ?? "";
};
Query.prototype.getSalary = function () {
  const salaryRange = {
    40000: "1",
    60000: "2",
    80000: "3",
    100000: "4",
    120000: "5",
  };
  return salaryRange[this.salary.toLowerCase()] ?? "";
};

/*
 * EXAMPLE OF A SAMPLE QUERY
 * https://www.linkedin.com/jobs/search/?f_E=2%2C3&f_JT=F%2CP&f_SB2=1&f_TPR=r2592000&f_WT=2%2C1&geoId=90000049&keywords=programmer&location=Los%20Angeles%20Metropolitan%20Area
 * Date Posted (Single Pick)	        f_TPR
 * Job Type (Multiple Picks)	        f_JT
 * Experience Level(Multiple Picks)	    f_E
 * On-Site/Remote (Multiple Picks)	    f_WT
 * Salary (Single Pick)	                f_SB2
 *
 */
Query.prototype.url = function (start) {
  let query = `https://${this.host}/jobs-guest/jobs/api/seeMoreJobPostings/search?`;
  if (this.keyword !== "") query += `keywords=${this.keyword}`;
  if (this.location !== "") query += `&location=${this.location}`;
  if (this.getDateSincePosted() !== "")
    query += `&f_TPR=${this.getDateSincePosted()}`;
  if (this.getSalary() !== "") query += `&f_SB2=${this.getSalary()}`;
  if (this.getExperienceLevel() !== "")
    query += `&f_E=${this.getExperienceLevel()}`;
  if (this.getRemoteFilter() !== "") query += `&f_WT=${this.getRemoteFilter()}`;
  if (this.getJobType() !== "") query += `&f_JT=${this.getJobType()}`;
  query += `&start=${start}`;
  if (this.sortBy == "recent" || this.sortBy == "relevant") {
    let sortMethod = "R";
    if (this.sortBy == "recent") sortMethod = "DD";
    query += `&sortBy=${sortMethod}`;
  }
  return encodeURI(query);
};

Query.prototype.getJobs = async function () {
  let allJobs = [];
  try {
    let parsedJobs,
      resultCount = 1,
      start = this.start,
      jobLimit = this.limit;
      retry = 1;

    while (resultCount > 0 || retry >= 10) {
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            //fetch our data using our url generator with
            //the page to start on
            const { data } = await axios.get(this.url(this.start));
      
            //select data so we can check the number of jobs returned
            const $ = cheerio.load(data);
            const jobs = $("li");
            //if result count ends up being 0 we will stop getting more jobs
            resultCount = jobs.length;
            console.log("I got ", jobs.length, " jobs");
      
            //to get the job data as objects with the desired details
            parsedJobs = await parseJobList(data);
            allJobs.push(...parsedJobs);
      
            console.log(`Parsed Job : ${parsedJobs.length} Total Jobs: ${allJobs.length}`);
            
            // fs.writeFileSync('jobs.json', JSON.stringify(allJobs));
      
            //increment by 25 bc thats how many jobs the AJAX request fetches at a time
            this.start += 10;
      
            //in order to limit how many jobs are returned
            //this if statment will return our function value after looping and removing excess jobs
            if (jobLimit != 0 && allJobs.length > jobLimit) {
              while (allJobs.length != jobLimit) allJobs.pop();
              return allJobs;
            }
        } catch(err) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            retry++;
        }
    }
    //console.log(allJobs)
    return allJobs;
  } catch (error) {
    console.error(error);
    return allJobs;
  }
};
async function parseJobList(jobData) {
  const $ = cheerio.load(jobData);
  const jobs = $("li");
  const jobObjects = [];

  for (let element of jobs) {
    const job = $(element);

    let jobUrl = job.find(".base-card__full-link").attr("href") || "";

    jobUrl = jobUrl.split('?')[0];

    let isNodeJob = "pending";

    // try {
    //   isNodeJob = await geteJobDescription(jobUrl);

    //   if (!isNodeJob) continue;
    // } catch(err) {}

    const position = job.find(".base-search-card__title").text().trim() || "";
    const company =
      job.find(".base-search-card__subtitle").text().trim() || "";
    const location =
      job.find(".job-search-card__location").text().trim() || "";
    const date = job.find("time").attr("datetime") || "";
    const salary =
      job
        .find(".job-search-card__salary-info")
        .text()
        .trim()
        .replace(/\n/g, "")
        .replaceAll(" ", "") || "";
    const companyLogo =
      job.find(".artdeco-entity-image").attr("data-delayed-url") || "";
    const agoTime =
      job.find(".job-search-card__listdate").text().trim() || "";

    const jobObj = {
      createdAt: new Date(),
      position: position,
      company: company,
      location: location,
      date: date,
      agoTime: agoTime,
      salary: salary,
      jobUrl: jobUrl,
      isNodeJob
    };

    // const result = await db.collection('jobs').insertOne(jobObj);
    const result = await db.collection('jobs').updateOne(
      { jobUrl: jobUrl }, // Filter
      { $setOnInsert: { ...jobObj } },           // Update
      { upsert: true }                 // Options
    );

    console.log('Job inserted:', result);


    jobObjects.push(jobObj);
  }

  return jobObjects;
}

module.exports.getJobDescription = async (url) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { data } = await axios.get(url);
  
    const $ = cheerio.load(data);
  
    const element = $('.description__text.description__text--rich').first();
  
    const textContent = element.text().trim().replace(/\s+/g, ' ').toLowerCase();

    return {
        HTML: data,
        isNodeJob: textContent.includes('node')
    }
  } catch(err) {
    console.error(err);
    return {
        isNodeJob: "pending"
    };
  }
}

module.exports.isEasyApply = async (HTML) => {
    try {
        const $ = cheerio.load(HTML);

        let buttonElement = $('.jobs-apply-button--top-card button');

        if (buttonElement) {
            let ariaLabel = buttonElement.attr('aria-label');

            // Check if ariaLabel includes "Easy Apply"
            if (ariaLabel.toLowerCase().includes('easy apply')) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch(err) {
        console.error(err);
        return false;
    }
}

module.exports.sendMessage = async (message) => {
    try {
        const chatId = "5795724192";
        const token = '7341778326:AAHBpVImu2I5M0CAkYMvuBn4KnWnzy6qJwY'; 

        const apiUrl = `https://api.telegram.org/bot${token}`;
        const sendMessageUrl = `${apiUrl}/sendMessage`;

        const params = {
            chat_id: chatId,
            text: message   
        };

        const response = await fetch(sendMessageUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        const result = await response.json();
        if (result.ok) {
            console.log('Message sent successfully');
        } else {
            console.error('Error sending message:', result.description);
        }
    } catch(err) {
        console.error(err);
    }
}

module.exports.employess = async (HTML) => {
    try {
        const $ = cheerio.load(HTML);

        var elements = $('li.job-details-jobs-unified-top-card__job-insight');

        // Iterate over the NodeList and check if any element contains the keyword "employees"
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const text = $(element).text().trim();
            if (text.includes("employees")) {
                const match = text.match(/(\d+)-(\d+)/);
                if (match) {
                    const min = parseInt(match[1], 10);
                    const max = parseInt(match[2], 10);

                    return { min, max };
                }
            }
        }

        return { min: 0, max: 0 };
    } catch(err) {
        console.error(err);
        return { min: 0, max: 0 };
    }
}

