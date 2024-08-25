'use strict';

const mongoose = require('mongoose');
const linkedIn = require('./linkedin');
const Crunchbase = require('./crunchbase');

const crunchbase = new Crunchbase();

const uri = "mongodb+srv://rushabhparallels2024:GtfsPq8RbJLzKJOM@cluster0.ehh3etb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let db;

async function connectMongoDB() {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  
    db = mongoose.connection;
}

module.exports.scrapeJobs = async (event) => {
    try {
        const queryOptions = {
            keyword: 'node.js',
            location: 'India',
            dateSincePosted: '24hr'
        };

        await linkedIn.query(queryOptions);
        return;
    } catch(err) {
        console.log(err);
        throw err;
    }
};

module.exports.isNodeJob = async (event) => {
    try {
        await connectMongoDB();

        // Get the start and end of today's date
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Query to find jobs where isNodeJob is 'pending' and createdAt is today
        const query = {
        isNodeJob: 'pending',
        createdAt: {
            $gte: startOfDay,
            $lt: endOfDay
        }
        };

        // Find documents matching the query, limit to 100
        const jobs = await db.collection('jobs').find(query).toArray();

        for (let job of jobs) {
            try {
                const { _id, jobUrl, position, company } = job;

                const { HTML, isNodeJob } = await linkedIn.getJobDescription(jobUrl);

                if (isNodeJob === true) {
                  let { min = 0, max = 0} = linkedIn.employess(HTML);

                  if (max <= 500) {
                    let isEasyApply = linkedIn.isEasyApply(HTML);``

                    linkedIn.sendMessage(`
Title: ${position}\b
Company: ${company}\b
Type: ${isEasyApply ? 'Easy Apply' : 'External'}\b
URL: ${jobUrl}
                    `)
                  }
                }
    
                // Update the document with the specified _id
                const result = await db.collection('jobs').updateOne(
                    { _id },  // Filter by _id
                    { $set: { isNodeJob } } // Update isNodeJob field
                );
    
                console.log(result);
            } catch(err) {
                console.log(err);
            }
        }

        console.log('Jobs found:', jobs);

        return;
    } catch(err) {
        console.log(err);
        throw err;
    }
};

module.exports.crunchbaseCompanies = async (event) => {
    try {
        const waitFor = [15000, 20000, 25000, 30000];

        await crunchbase.connectMongoDB();

        let lastUUID = await crunchbase.lastCompanyid();
    
        let index = 0;
    
        while (lastUUID) {
            const seconds = waitFor[Math.floor(Math.random() * waitFor.length)];

            await new Promise(resolve => setTimeout(resolve, seconds));

            console.log(`Index: ${index} UUID: ${lastUUID}`)

            const data = await crunchbase.fetchCompanies(lastUUID);
    
            const { count, entities = [] } = data;
    
            let { uuid = '' } = entities.at(-1);
    
            const operations = crunchbase.prepareBulkOperation(entities);
    
            await crunchbase.insertCompanies(operations);

            lastUUID = uuid;

            index++;
        }
    } catch(err) {
        console.log(err.response);
        throw err;
    }
};

module.exports.crunchbaseInvestors = async (event) => {
    try {
        const waitFor = [15000, 20000, 25000, 30000];

        await crunchbase.connectMongoDB();

        let lastUUID = await crunchbase.lastInvestorid();
    
        let index = 0;

        while (lastUUID) {
            const seconds = waitFor[Math.floor(Math.random() * waitFor.length)];

            await new Promise(resolve => setTimeout(resolve, seconds));

            console.log(`Index: ${index} UUID: ${lastUUID}`)

            const data = await crunchbase.fetchInvestors(lastUUID);

            const { count, entities = [] } = data;

            let { uuid = '' } = entities.at(-1);

            const operations = crunchbase.prepareBulkOperation(entities);

            await crunchbase.insertInvestors(operations);

            lastUUID = uuid;

            index++;
        }
    } catch(err) {
        console.log(err.response);
        throw err;
    }
}