const { JobPostModel } = require("../models/jobpost.model");
const { ApplicationModel } = require("../models/application.model");
const mongoose = require("mongoose");

const getRecruiterDashboard = async (req, res, next) => {
  try {
    const recruiterId = req.user._id;

    // Get total jobs posted
    const totalJobs = await JobPostModel.countDocuments({ recruiterId });

    // Get total applications received
    const totalApplications = await ApplicationModel.aggregate([
      {
        $lookup: {
          from: "jobposts",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        $unwind: "$job",
      },
      {
        $match: {
          "job.recruiterId": new mongoose.Types.ObjectId(recruiterId),
        },
      },
      {
        $count: "total",
      },
    ]);

    // Get applications by status
    const applicationsByStatus = await ApplicationModel.aggregate([
      {
        $lookup: {
          from: "jobposts",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        $unwind: "$job",
      },
      {
        $match: {
          "job.recruiterId": new mongoose.Types.ObjectId(recruiterId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent applications
    const recentApplications = await ApplicationModel.aggregate([
      {
        $lookup: {
          from: "jobposts",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        $unwind: "$job",
      },
      {
        $match: {
          "job.recruiterId": new mongoose.Types.ObjectId(recruiterId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidate",
        },
      },
      {
        $unwind: "$candidate",
      },
      {
        $project: {
          _id: 1,
          status: 1,
          createdAt: 1,
          "job.title": 1,
          "candidate.name": 1,
          "candidate.email": 1,
          "candidate.resume": 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    // Get top performing jobs
    const topJobs = await JobPostModel.aggregate([
      {
        $match: {
          recruiterId: new mongoose.Types.ObjectId(recruiterId),
        },
      },
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "jobId",
          as: "applications",
        },
      },
      {
        $project: {
          title: 1,
          company: 1,
          location: 1,
          jobType: 1,
          applicantsCount: { $size: "$applications" },
          createdAt: 1,
        },
      },
      {
        $sort: { applicantsCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    // Get application trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const applicationTrends = await ApplicationModel.aggregate([
      {
        $lookup: {
          from: "jobposts",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        $unwind: "$job",
      },
      {
        $match: {
          "job.recruiterId": new mongoose.Types.ObjectId(recruiterId),
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalJobs,
        totalApplications: totalApplications[0]?.total || 0,
        applicationsByStatus: applicationsByStatus.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        recentApplications,
        topJobs,
        applicationTrends: applicationTrends.map((trend) => ({
          month: `${trend._id.year}-${trend._id.month}`,
          count: trend.count,
        })),
      },
      msg: "Dashboard data fetched successfully!",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRecruiterDashboard,
};
