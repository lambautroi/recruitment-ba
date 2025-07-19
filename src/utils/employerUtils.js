const Employer = require("../models/employerModel");
const Job = require("../models/jobModel");

/**
 * Cập nhật số lượng job cho một employer
 * @param {String} employerId - ID của employer
 */
const updateEmployerJobCount = async (employerId) => {
    try {
        const jobCount = await Job.countDocuments({
            employer_id: employerId,
            status: "active"
        });
        
        await Employer.findByIdAndUpdate(employerId, {
            num_job: jobCount
        });
        
        console.log(`Updated job count for employer ${employerId}: ${jobCount}`);
    } catch (error) {
        console.error("Error updating employer job count:", error);
    }
};

/**
 * Cập nhật số lượng job cho tất cả employers
 */
const updateAllEmployerJobCounts = async () => {
    try {
        const employers = await Employer.find({});
        
        for (const employer of employers) {
            const jobCount = await Job.countDocuments({
                employer_id: employer._id,
                status: "active"
            });
            
            await Employer.findByIdAndUpdate(employer._id, {
                num_job: jobCount
            });
        }
        
        console.log("Updated job counts for all employers");
    } catch (error) {
        console.error("Error updating all employer job counts:", error);
    }
};

module.exports = {
    updateEmployerJobCount,
    updateAllEmployerJobCounts
};
