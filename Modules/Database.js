const mongoose=require('mongoose');


mongoose.connect("mongodb://localhost:27017/Recruitment",{useUnifiedTopology:true,useNewUrlParser:true})

/*schema for comitte members*/

const UserSchema =new mongoose.Schema({
    Username:String,
    Password:String,
    Department:String,
    UnderReviewAppl:Array,
    Reviewed:Array
})

/*schema for Applicants*/
const ApplicantSchema =new mongoose.Schema({
    APPLID:Number,
        APPlPERSONALDETAILS:Object,
         QUALIFICATIONS:{
             APPLUG:{
                APPLUGEDUCATIONALDETAILS:Object,
                APPLUGPROJECTDETAILS:Array,
             },
             APPLPG:{
                 APPLPGEDUCATIONALDETAILS:Object,
                 APPLPGDESERTATIONDETAILS:Array,
             },
             APPLPHD:{
                 APPLPHDDETAILS:Object,
                 APPLPHDTHESISSUPERVISEDDETAILS:Array,

             },
         },
         APPLPATENETDETAILS:Array,
         APPLSPONCEREDPROJECTSDETAILS:Array,
         APPLCONSULTANCYPROJECTDETAILS:Array,
         APPLRESEARCHPUBLICATIONSDETAILS:Array,
         APPLBOOKPUBLICATIONDETAILS:Array,
         APPLCONFERENEORGANISED:Array,
         APPLNATIONALPROGRAMORGANISED:Array,
         APPLOUTREACHACTIVITY:Array,
         APPLADMINISTRATIVEACTIVITIES:Array,
         APPLFDP_STTP_STC_WORKSHOPS:Array,
         APPLTHEORYTEACHINGDETAILS:Array,
         APPLPRESENTEMPLOYER:Array,
         APPLPROFFETIONALAFFILIATION:Array,
         APPLPLACEMENTPERCENTAGE:Array,
         APPLESTABLISHMENTOFNEWLAB:Array,
         Status:Array,
         Remarks:Object,
         Eligible:Object,
         Points:Object,
         Marks:{
           UGMarks:Object,
           PGMarks:Object,
           PHDMarks:Object,
           PatenetsMarks:Object,
           SponsoredMarks:Object,
           ConsultancyMarks:Object,
           BookPubMarks:Object,
           ResPubMarks:Object,
           ConferenceOrgMarks:Object,
           NationalProMarks:Object,
           OutreachActMarks:Object,
           AdmistrativeMarks:Object,
           FssWorkshopMarks:Object,
           TeachingMarks:Object,
           ProFFesionalMarks:Object,
           PlacementPercMarks:Object,
           EstOfLabMarks:Object
         }
})

const User=mongoose.model('recruiter',UserSchema);
const Applicant=mongoose.model('Application',ApplicantSchema);

module.exports={ User, Applicant };
