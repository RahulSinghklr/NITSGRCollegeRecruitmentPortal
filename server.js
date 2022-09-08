const express=require("express");
const ejs =require("ejs");
const bodyParser=require("body-parser");
const { createServer } = require("http");
const app=express();
const http=require('http').createServer(app)
const Port = process.env.PORT || 4000 ;
const mongoose=require('mongoose');
const { stringify } = require("querystring");
const { v4: uuidv4 }=require('uuid');
const { profile } = require("console");
const { param } = require("express/lib/request");
const json2xls=require('json2xls');
const fs=require('fs');
http.listen(Port);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine','ejs');
//mongodbdatabase

var DataModule=require('./Modules/Database');
const User=DataModule.User;
const Applicant=DataModule.Applicant;
User();
Applicant();

//CREATING GET REQUEST FOR MY WEBSITE
const Get=require('./Modules/GetRoutes');
Get(app);

/*CREATING ROUTES FOR ALL POST REQUESTS*/
app.post('/',async function(req,res){
    const COMITTEUSERNAME=req.body.Username;
   const COMITTEUSERPASSWORD=req.body.Password;

  var ComitteUserData= await User.find({Username:COMITTEUSERNAME, Password:COMITTEUSERPASSWORD})
  if(ComitteUserData.length===0){
  
    res.redirect('/login/'+`${COMITTEUSERNAME}`+'/'+`${COMITTEUSERPASSWORD}`);

  }
  else{
  const DEPARTMENTCOMITTEMEMBER=ComitteUserData[0].Department;
  const UserName=ComitteUserData[0].Username;
// // console.log(ComitteUserData);
 //// console.log(DEPARTMENTCOMITTEMEMBER);


var APPLDATAS=await Applicant.find({'APPlPERSONALDETAILS.DEPTNAME':DEPARTMENTCOMITTEMEMBER});


var ASSTPROFF=[];
var ASSTPROFF10=[];
var ASSTPROFF11=[];
var ASSTPROFF12=[];
var ASSOPROFF=[];
var PROFF=[];
for(var i=0; i<APPLDATAS.length; i++){
    if(APPLDATAS[i].APPlPERSONALDETAILS.POSTNAME==="Assistant Professor"){
      ASSTPROFF.push(APPLDATAS[i]);
      if(APPLDATAS[i].APPlPERSONALDETAILS.Level==='L10'){
           ASSTPROFF10.push(APPLDATAS[i]);
      }
      if(APPLDATAS[i].APPlPERSONALDETAILS.Level==='L11'){
        ASSTPROFF11.push(APPLDATAS[i]);
   }
   if(APPLDATAS[i].APPlPERSONALDETAILS.Level==='L12'){
    ASSTPROFF12.push(APPLDATAS[i]);
}
    }
    if(APPLDATAS[i].APPlPERSONALDETAILS.POSTNAME==="Associate Professor"){
        ASSOPROFF.push(APPLDATAS[i]);
      }
      if(APPLDATAS[i].APPlPERSONALDETAILS.POSTNAME==="Professor"){
        PROFF.push(APPLDATAS[i]);
      }
}
var Key=uuidv4()

var TOSHOWAPLUNDERREVIEWONAPLPAGE=ComitteUserData[0].UnderReviewAppl.length;
var TOSHOWAPLREVIEWONAPLPAGE=ComitteUserData[0].Reviewed.length;
res.render('comitte',{ComitteMember:COMITTEUSERNAME,Branch:DEPARTMENTCOMITTEMEMBER,TotalAPL:APPLDATAS.length,TotalASTPAPL:ASSTPROFF.length,TotalASOPAPL:ASSOPROFF.length,TotalPAPL:PROFF.length,
Level10APL:ASSTPROFF10.length,Level11APL:ASSTPROFF11.length,Level12APL:ASSTPROFF12.length,UnderReview:TOSHOWAPLUNDERREVIEWONAPLPAGE,ReviewedData:TOSHOWAPLREVIEWONAPLPAGE,DifKey:Key})


app.post('/'+`${COMITTEUSERNAME}`+'/home'+'/'+`${Key}`,function(req,res){
  var TOSHOWAPLUNDERREVIEWONAPLPAGE2=ComitteUserData[0].UnderReviewAppl.length;
var TOSHOWAPLREVIEWONAPLPAGE2=ComitteUserData[0].Reviewed.length;
  res.render('comitte',{ComitteMember:COMITTEUSERNAME,Branch:DEPARTMENTCOMITTEMEMBER,TotalAPL:APPLDATAS.length,TotalASTPAPL:ASSTPROFF.length,TotalASOPAPL:ASSOPROFF.length,TotalPAPL:PROFF.length,
    Level10APL:ASSTPROFF10.length,Level11APL:ASSTPROFF11.length,Level12APL:ASSTPROFF12.length,UnderReview:TOSHOWAPLUNDERREVIEWONAPLPAGE2,ReviewedData:TOSHOWAPLREVIEWONAPLPAGE2,DifKey:Key})
    
})

//Remarks Saving
app.post('/'+`${COMITTEUSERNAME}`+'/Remarks/save/'+`${Key}`, async function(req,res){
  globalThis.REMARK= await req.body.remark;
  globalThis.AplId=await req.body.AplID;
  globalThis.Point=await req.body.Points;
 // console.log(Point);
await Applicant.updateOne({APPLID:req.body.AplID},{Remarks:REMARK})
await Applicant.updateOne({APPLID:req.body.AplID},{Points:Point})
  res.redirect('/'+`${COMITTEUSERNAME}`+'/'+`${req.body.type}`+'/'+`${Key}`);
/*only to get check if this work*/
  

app.get('/'+`${COMITTEUSERNAME}`+'/applications/'+`${Key}`,async function(req,res){
  APPLDATAS.forEach(function(user){
  if(user.APPLID==AplId){
    user.Remarks=REMARK;
    user.Points=Point;
  }
})
  res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:APPLDATAS,DifKey:Key, Type:'applications'});
})
app.get('/'+`${COMITTEUSERNAME}`+'/assistantprofessor/'+`${Key}`,function(req,res){
  ASSTPROFF.forEach(function(user){
    if(user.APPLID==AplId){
      user.Remarks=REMARK;
      user.Points=Point;
    }
  })
    res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:ASSTPROFF,DifKey:Key, Type:'assistantprofessor'});
  })
app.get('/'+`${COMITTEUSERNAME}`+'/level10/'+`${Key}`,function(req,res){
  ASSTPROFF10.forEach(function(user){
    if(user.APPLID==AplId){
      user.Remarks=REMARK;
      user.Points=Point;
    }
  })
    res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:ASSTPROFF10,DifKey:Key, Type:'level10'});
  })
  
  app.get('/'+`${COMITTEUSERNAME}`+'/level11/'+`${Key}`,function(req,res){
    ASSTPROFF11.forEach(function(user){
      if(user.APPLID==AplId){
        user.Remarks=REMARK;
        user.Points=Point;
      }
    })
    res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:ASSTPROFF11,DifKey:Key, Type:'level11'});
  })
  app.get('/'+`${COMITTEUSERNAME}`+'/level12/'+`${Key}`,function(req,res){
    ASSTPROFF12.forEach(function(user){
      if(user.APPLID==AplId){
        user.Remarks=REMARK;
        user.Points=Point;
      }
    })
    res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:ASSTPROFF12,DifKey:Key, Type:'level12'});
  })
  app.get('/'+`${COMITTEUSERNAME}`+'/associateprofessor/'+`${Key}`,function(req,res){
    ASSOPROFF.forEach(function(user){
      if(user.APPLID==AplId){
        user.Remarks=REMARK;
        user.Points=Point;
      }
    })
    res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:ASSOPROFF,DifKey:Key, Type:'associateprofessor'});
  })
  app.get('/'+`${COMITTEUSERNAME}`+'/professor/'+`${Key}`,function(req,res){
    PROFF.forEach(function(user){
      if(user.APPLID==AplId){
        user.Remarks=REMARK;
        user.Points=Point;
      }
    })
    res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:PROFF,DifKey:Key, Type:'professor'});
  })

  app.get('/'+`${COMITTEUSERNAME}`+'/UnderReviewed/'+`${Key}`,function(req,res){
    var underReviewedDataArray=ComitteUserData[0].UnderReviewAppl;
    var UnderReviewDataToShowArray=[];
   // console.log(underReviewedDataArray);
  for(var i=0; i<APPLDATAS.length; i++){
    for(var j=0; j<underReviewedDataArray.length; j++){
      if(APPLDATAS[i].APPLID==underReviewedDataArray[j]){
        UnderReviewDataToShowArray.push(APPLDATAS[i]);
      }
    }
  }
    APPLDATAS.forEach(function(user){
      if(user.APPLID==AplId){
        user.Remarks=REMARK;
        user.Points=Point;
      }
    })

    res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:UnderReviewDataToShowArray,DifKey:Key, Type:'UnderReviewed'});
  })

})








app.post('/'+`${COMITTEUSERNAME}`+'/applications/'+`${Key}`,function(req,res){

  res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:APPLDATAS,DifKey:Key, Type:'applications'});
})
app.post('/'+`${COMITTEUSERNAME}`+'/assistantprofessor/'+`${Key}`,function(req,res){
    res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:ASSTPROFF,DifKey:Key, Type:'assistantprofessor'});
  })
app.post('/'+`${COMITTEUSERNAME}`+'/level10/'+`${Key}`,function(req,res){
    res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:ASSTPROFF10,DifKey:Key, Type:'level10'});
  })
  
  app.post('/'+`${COMITTEUSERNAME}`+'/level11/'+`${Key}`,function(req,res){
    res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:ASSTPROFF11,DifKey:Key, Type:'level11'});
  })
  app.post('/'+`${COMITTEUSERNAME}`+'/level12/'+`${Key}`,function(req,res){
    res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:ASSTPROFF12,DifKey:Key, Type:'level12'});
  })
  app.post('/'+`${COMITTEUSERNAME}`+'/associateprofessor/'+`${Key}`,function(req,res){
    res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:ASSOPROFF,DifKey:Key, Type:'associateprofessor'});
  })
  app.post('/'+`${COMITTEUSERNAME}`+'/professor/'+`${Key}`,function(req,res){
    res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:PROFF,DifKey:Key, Type:'professor'});
  })


  //Creating A Excel File Of Data Obtained
  //
  var ConvertingToJsonArray=['applications','assistantprofessor','associateprofessor','level10','level11','level12','professor','UnderReviewed','Reviewed'];
  for(var i=0; i<ConvertingToJsonArray.length; i++){

  app.post('/'+`${COMITTEUSERNAME}`+'/'+`${ConvertingToJsonArray[i]}`+'/JSONFILE/'+`${Key}`,async function(req,res){
    const ExcelDataArray=[];
    var ApplicantDataArray=[];
    if(req.body.TypeOf=='applications'){
      ApplicantDataArray=APPLDATAS;
    } if(req.body.TypeOf=='assistantprofessor'){
      ApplicantDataArray=ASSTPROFF;
    } if(req.body.TypeOf=='associateprofessor'){
      ApplicantDataArray=ASSOPROFF;
    } if(req.body.TypeOf=='level10'){
      ApplicantDataArray=ASSTPROFF10;
    } if(req.body.TypeOf=='level11'){
      ApplicantDataArray=ASSTPROFF11;
    } if(req.body.TypeOf=='level12'){
      ApplicantDataArray=ASSTPROFF12;
    } if(req.body.TypeOf=='professor'){
      ApplicantDataArray=PROFF;
    }if(req.body.TypeOf=='UnderReviewed'){
      console.log(UnderReviewDataToShowArray);
      ApplicantDataArray=UnderReviewDataToShowArray;
  }if(req.body.TypeOf=='Reviewed'){
    console.log(ReviewDataToShowArray);
    ApplicantDataArray=ReviewDataToShowArray;
  }

    console.log(ApplicantDataArray);
    for(var i=0; i<ApplicantDataArray.length; i++){
       var obj={
         APPLICANTID:ApplicantDataArray[i].APPLID,
         APLNAME:ApplicantDataArray[i].APPlPERSONALDETAILS.APLNAME,
         APLPOSTNAME:ApplicantDataArray[i].APPlPERSONALDETAILS.POSTNAME,
         APLLEVEL:ApplicantDataArray[i].APPlPERSONALDETAILS.Level,
         TOTALUGPROJECTSMARKS:ApplicantDataArray[i].Marks.UGMarks,
         TOTALPGDESERTIONMARKS:ApplicantDataArray[i].Marks.PGMarks,
         TOTALPHDTHESISMARKS:ApplicantDataArray[i].Marks.PHDMarks,
         TOTALPATENETMARKS:ApplicantDataArray[i].Marks.PatenetsMarks,
         TOTALSPONSOREDMARKS:ApplicantDataArray[i].Marks.SponsoredMarks,
         TOTALCONSULTANCYMARKS:ApplicantDataArray[i].Marks.ConsultancyMarks,
         TOTALBOOKPUBLICATIONSMARKS:ApplicantDataArray[i].Marks.BookPubMarks,
         TOTALRESEARCHPUBLICATIONSMARKS:ApplicantDataArray[i].Marks.ResPubMarks,
         TOTALCONFERENCEORGANISEDMARKS:ApplicantDataArray[i].Marks.ConferenceOrgMarks,
         TOTALNATIONALPROGRAMORGANIZEDMARKS:ApplicantDataArray[i].Marks.NationalProMarks,
         TOTALOUTREACHACTIVITYMARKS:ApplicantDataArray[i].Marks.OutreachActMarks,
         TOTALADMINISTRATIVEACTIVITIESMARKS:ApplicantDataArray[i].Marks.AdmistrativeMarks,
         TOTALFDP_STTP_STC_WORKSHOPSMARKS:ApplicantDataArray[i].Marks.FssWorkshopMarks,
         TOTALTHEORYTEACHINGMARKS:ApplicantDataArray[i].Marks.TeachingMarks,
         TOTALPROFFETIONALAFFILIATIONSMARKS:ApplicantDataArray[i].Marks.ProFFesionalMarks,
         TOTALPLACEMENTPERCENTAGEMARKS:ApplicantDataArray[i].Marks.PlacementPercMarks,
         TOTALESTOFNEWLABMARKS:ApplicantDataArray[i].Marks.EstOfLabMarks,
         Elgibility:ApplicantDataArray[i].Eligible,
         REMARKS:ApplicantDataArray[i].Remarks,
         TotalPoints:ApplicantDataArray[i].Points,
       }
       ExcelDataArray.push(obj);
    }
  var TypeTOSave=req.body.TypeOf+'.xlsx';
    var xls = json2xls(ExcelDataArray);

    fs.writeFileSync(TypeTOSave, xls, 'binary');

    res.download(TypeTOSave);

  })
  }
//Testing All Routes TO Reduce The Size Of The Code
//ROUTES AFTER USER LOGIN TO OUR PAGE

//Routing of Comitte Member to What he want to See.

app.post('/'+`${COMITTEUSERNAME}`+'/UnderReviewed/'+`${Key}`,function(req,res){
  var underReviewedDataArray=ComitteUserData[0].UnderReviewAppl;
  globalThis.UnderReviewDataToShowArray=[];
 // console.log(underReviewedDataArray);
for(var i=0; i<APPLDATAS.length; i++){
  for(var j=0; j<underReviewedDataArray.length; j++){
    if(APPLDATAS[i].APPLID==underReviewedDataArray[j]){
      UnderReviewDataToShowArray.push(APPLDATAS[i]);
    }
  }
}
  res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:UnderReviewDataToShowArray,DifKey:Key,Type:'UnderReviewed'});
})



//Routing of Comitte Member to What he want to See.
app.post('/'+`${COMITTEUSERNAME}`+'/Reviewed/'+`${Key}`,function(req,res){
  var ReviewedDataArray=ComitteUserData[0].Reviewed;
 globalThis.ReviewDataToShowArray=[];
for(var i=0; i<APPLDATAS.length; i++){
  for(var j=0; j<ReviewedDataArray.length; j++){
    if(APPLDATAS[i].APPLID==ReviewedDataArray[j]){
      ReviewDataToShowArray.push(APPLDATAS[i]);
    }
  }
}
  res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:ReviewDataToShowArray,DifKey:Key,Type:'Reviewed'});
})



 // Review Route.

 app.post('/'+`${COMITTEUSERNAME}`+'/Reviewed'+'/profile/'+`${Key}`, function(req,res){
  var APLPROID=req.body.Cached;
  var PROFILEOFAPL;

        for(var j=0; j<APPLDATAS.length; j++){
         
            if(APPLDATAS[j].APPLID==APLPROID){
              PROFILEOFAPL= APPLDATAS[j];
              break;
            }
           
          }

  res.render('profile',{APPLPROFILEDATA:PROFILEOFAPL,ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,DifKey:Key,TypeRemark:'Reviewed'});

})


var ProfileSaveStatusTypeArray=['applications','assistantprofessor','associateprofessor','level10','level11','level12','professor','UnderReviewed'];
for(var i=0; i<ProfileSaveStatusTypeArray.length; i++){
  
  app.post('/'+`${COMITTEUSERNAME}`+'/'+`${ProfileSaveStatusTypeArray[i]}`+'/profile/'+`${Key}`, function(req,res){
    var APLPROID=req.body.Cached;
    var PROFILEOFAPL;

          for(var j=0; j<APPLDATAS.length; j++){
           
              if(APPLDATAS[j].APPLID==APLPROID){
                PROFILEOFAPL= APPLDATAS[j];
                break;
              }
             
            }

globalThis.TypeStatedProfileRemarks=req.body.type
    res.render('profile',{APPLPROFILEDATA:PROFILEOFAPL,ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,DifKey:Key,TypeRemark:TypeStatedProfileRemarks});
    var StatusPresentAPPLICATION=PROFILEOFAPL.Status;
app.post('/'+`${COMITTEUSERNAME}`+'/:'+`${req.body.type}`+'/profile/'+`${PROFILEOFAPL.APPLID}`+'/',async function(req,res){
  console.log(TypeStatedProfileRemarks);
 var StateCheck=false;
       await StatusPresentAPPLICATION.forEach(function(state){
          if(state==req.body.PersonalDetails){
               StateCheck=true;
          }
        })
        if(StateCheck==false){
          if(req.body.PersonalDetails!=undefined){
            StatusPresentAPPLICATION.push(Number(req.body.PersonalDetails));
          }
        }
      
      //// console.log(req.body.PersonalDetails)
        //for ug PROJECTS
        if(req.body.PersonalDetails==3){
        var UGProjects=[];
        let UgSum=0;
        if(PROFILEOFAPL.QUALIFICATIONS.APPLUG.APPLUGPROJECTDETAILS!==null){
          for(var i=1; i<=PROFILEOFAPL.QUALIFICATIONS.APPLUG.APPLUGPROJECTDETAILS.length; i++){
            UGProjects.push(Number(req.body[`MarksUG${i}`]));
         }
         for(var i=0; i<UGProjects.length; i++){
          UgSum+=UGProjects[i];
     }
        }
        console.log(UgSum)
       var RUGSum= Math.round((UgSum + Number.EPSILON) * 100) / 100;
       console.log(RUGSum)
          await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.UGMarks':RUGSum});

       PROFILEOFAPL.Marks.UGMarks=RUGSum;
         
      }
          //UGEND

          //PG PROJECTS MARKS
          if(req.body.PersonalDetails==4){
          var PGProjects=[];
          let PgSum=0;
         if(PROFILEOFAPL.QUALIFICATIONS.APPLPG.APPLPGDESERTATIONDETAILS!==null){
          for(var i=1; i<=PROFILEOFAPL.QUALIFICATIONS.APPLPG.APPLPGDESERTATIONDETAILS.length; i++){
            PGProjects.push(Number(req.body[`MarksPG${i}`]));
          }
         
        for(var i=0; i<PGProjects.length; i++){
          PgSum+=PGProjects[i];
        }
      }
    var RPGSum=  Math.round((PgSum + Number.EPSILON) * 100) / 100;
         await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.PGMarks':RPGSum});

      PROFILEOFAPL.Marks.PGMarks=RPGSum;
      }
    //PGENDS
    //PHDMARKS Start
    if(req.body.PersonalDetails==5){
      var PHDProjects=[];
      let PHDSum=0;
      if(PROFILEOFAPL.QUALIFICATIONS.APPLPHD.APPLPHDTHESISSUPERVISEDDETAILS!==null){
      for(var i=1; i<=PROFILEOFAPL.QUALIFICATIONS.APPLPHD.APPLPHDTHESISSUPERVISEDDETAILS.length; i++){
        PHDProjects.push(Number(req.body[`MarksPHD${i}`]));
      }
    // // console.log(PHDProjects);
    for(var i=0; i<PHDProjects.length; i++){
      PHDSum+=PHDProjects[i];
    }
  }
 var RPHDSum= Math.round((PHDSum + Number.EPSILON) * 100) / 100;
     await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.PHDMarks':RPHDSum});

  PROFILEOFAPL.Marks.PHDMarks=RPHDSum;
  }
  //PHDENDS

   //PATENET MARKS Start
   if(req.body.PersonalDetails==6){
    var PatenetMarks=[];
    let PatenetSum=0;
    if(PROFILEOFAPL.APPLPATENETDETAILS!==null){
    for(var i=1; i<=PROFILEOFAPL.APPLPATENETDETAILS.length; i++){
      PatenetMarks.push(Number(req.body[`PatenetMarks${i}`]));
    }
  // // console.log(PHDProjects);
  for(var i=0; i<PatenetMarks.length; i++){
    PatenetSum+=PatenetMarks[i];
  }
}
var RPatenetSum=Math.round((PatenetSum + Number.EPSILON) * 100) / 100;
   await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.PatenetsMarks':RPatenetSum});

PROFILEOFAPL.Marks.PatenetsMarks=RPatenetSum;
}

 //Sponosored MARKS Start
 if(req.body.PersonalDetails==7){
  var Sponsored=[];
  let SponsoredSum=0;
  if(PROFILEOFAPL.APPLSPONCEREDPROJECTSDETAILS!==null){
  for(var i=1; i<=PROFILEOFAPL.APPLSPONCEREDPROJECTSDETAILS.length; i++){
    Sponsored.push(Number(req.body[`SponsoredMarks${i}`]));
  }
// // console.log(PHDProjects);
for(var i=0; i<Sponsored.length; i++){
  SponsoredSum+=Sponsored[i];
}
}
var RSponsoredSum=Math.round((SponsoredSum + Number.EPSILON) * 100) / 100;
 await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.SponsoredMarks':RSponsoredSum});

PROFILEOFAPL.Marks.SponsoredMarks=RSponsoredSum;
}


 //Consultany MARKS Start
 if(req.body.PersonalDetails==8){
  var Consultany=[];
  let ConsultanySum=0;
  if(PROFILEOFAPL.APPLCONSULTANCYPROJECTDETAILS!==null){
  for(var i=1; i<=PROFILEOFAPL.APPLCONSULTANCYPROJECTDETAILS.length; i++){
    Consultany.push(Number(req.body[`ConsultancyMarks${i}`]));
  }
// // console.log(PHDProjects);
for(var i=0; i<Consultany.length; i++){
  ConsultanySum+=Consultany[i];
}
}
var RConsultancySum=Math.round((ConsultanySum + Number.EPSILON) * 100) / 100;
 await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.ConsultancyMarks':RConsultancySum});

PROFILEOFAPL.Marks.ConsultancyMarks=RConsultancySum;
}


 //BookPublication MARKS Start
 if(req.body.PersonalDetails==10){
  var BookPublication=[];
  let BookPublicationSum=0;
  if(PROFILEOFAPL.APPLBOOKPUBLICATIONDETAILS!==null){
  for(var i=1; i<=PROFILEOFAPL.APPLBOOKPUBLICATIONDETAILS.length; i++){
    BookPublication.push(Number(req.body[`BookPublication${i}`]));
  }
// // console.log(PHDProjects);
for(var i=0; i<BookPublication.length; i++){
  BookPublicationSum+=BookPublication[i];
}
}
var RBookPublicationSum=Math.round((BookPublicationSum + Number.EPSILON) * 100) / 100;
 await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.BookPubMarks':RBookPublicationSum});

PROFILEOFAPL.Marks.BookPubMarks=RBookPublicationSum;
}
 //ResearchPublication MARKS Start
 if(req.body.PersonalDetails==9){
  var ResearchPublication=[];
  let ResearchPublicationSum=0;
  if(PROFILEOFAPL.APPLRESEARCHPUBLICATIONSDETAILS!==null){
  for(var i=1; i<=PROFILEOFAPL.APPLRESEARCHPUBLICATIONSDETAILS.length; i++){
    ResearchPublication.push(Number(req.body[`ResearchPublication${i}`]));
  }
// // console.log(PHDProjects);
for(var i=0; i<ResearchPublication.length; i++){
  ResearchPublicationSum+=ResearchPublication[i];
}
}
let RResearchPublicationSum=Math.round((ResearchPublicationSum + Number.EPSILON) * 100) / 100;
 await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.ResPubMarks':RResearchPublicationSum});

PROFILEOFAPL.Marks.ResPubMarks=RResearchPublicationSum;
}

 //Conference MARKS Start
 if(req.body.PersonalDetails==11){
  var Conference=[];
  let ConferenceSum=0;
  if(PROFILEOFAPL.APPLCONFERENEORGANISED!==null){
  for(var i=1; i<=PROFILEOFAPL.APPLCONFERENEORGANISED.length; i++){
    Conference.push(Number(req.body[`Conference${i}`]));
  }
// // console.log(PHDProjects);
for(var i=0; i<Conference.length; i++){
  ConferenceSum+=Conference[i];
}
}
let RConferenceSum=Math.round((ConferenceSum + Number.EPSILON) * 100) / 100;
 await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.ConferenceOrgMarks':RConferenceSum});

PROFILEOFAPL.Marks.ConferenceOrgMarks=RConferenceSum;
}

 //NationalProgramorganised
 if(req.body.PersonalDetails==12){
  var NationalProgramorganised=[];
  let NationalProgramorganisedSum=0;
  if(PROFILEOFAPL.APPLNATIONALPROGRAMORGANISED!==null){
  for(var i=1; i<=PROFILEOFAPL.APPLNATIONALPROGRAMORGANISED.length; i++){
    NationalProgramorganised.push(Number(req.body[`NationalProgramorganised${i}`]));
  }
// // console.log(PHDProjects);
for(var i=0; i<NationalProgramorganised.length; i++){
  NationalProgramorganisedSum+=NationalProgramorganised[i];
}
}
let RNationalProgramorganisedSum=Math.round((NationalProgramorganisedSum + Number.EPSILON) * 100) / 100;
 await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.NationalProMarks':RNationalProgramorganisedSum});

PROFILEOFAPL.Marks.NationalProMarks=RNationalProgramorganisedSum;
}
//OutReachActivity
if(req.body.PersonalDetails==13){
  var OutReachActivity=[];
  let OutReachActivitySum=0;
  if(PROFILEOFAPL.APPLOUTREACHACTIVITY!==null){
  for(var i=1; i<=PROFILEOFAPL.APPLOUTREACHACTIVITY.length; i++){
    OutReachActivity.push(Number(req.body[`OutReachActivity${i}`]));
  }
// // console.log(PHDProjects);
for(var i=0; i<OutReachActivity.length; i++){
  OutReachActivitySum+=OutReachActivity[i];
}
}
let ROutReachActivitySum=Math.round((OutReachActivitySum + Number.EPSILON) * 100) / 100;
 await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.OutreachActMarks':ROutReachActivitySum});

PROFILEOFAPL.Marks.OutreachActMarks=ROutReachActivitySum;
}


//AdministrativeActivity
if(req.body.PersonalDetails==14){
  var AdministrativeActivity=[];
  let AdministrativeActivitySum=0;
  if(PROFILEOFAPL.APPLADMINISTRATIVEACTIVITIES!==null){
  for(var i=1; i<=PROFILEOFAPL.APPLADMINISTRATIVEACTIVITIES.length; i++){
    AdministrativeActivity.push(Number(req.body[`AdministrativeActivity${i}`]));
  }
// // console.log(PHDProjects);
for(var i=0; i<AdministrativeActivity.length; i++){
  AdministrativeActivitySum+=AdministrativeActivity[i];
}
}
let RAdministrativeActivitySum=Math.round((AdministrativeActivitySum + Number.EPSILON) * 100) / 100;
 await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.AdmistrativeMarks':RAdministrativeActivitySum});

PROFILEOFAPL.Marks.AdmistrativeMarks=RAdministrativeActivitySum;
}

//FDPWorkshop
if(req.body.PersonalDetails==15){
  var FDPWorkshop=[];
  let FDPWorkshopSum=0;
  if(PROFILEOFAPL.APPLFDP_STTP_STC_WORKSHOPS!==null){
  for(var i=1; i<=PROFILEOFAPL.APPLFDP_STTP_STC_WORKSHOPS.length; i++){
    FDPWorkshop.push(Number(req.body[`FDPWorkshop${i}`]));
  }
// // console.log(PHDProjects);
for(var i=0; i<FDPWorkshop.length; i++){
  FDPWorkshopSum+=FDPWorkshop[i];
}
}
let RFDPWorkshopSum=Math.round((FDPWorkshopSum + Number.EPSILON) * 100) / 100;
 await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.FssWorkshopMarks':RFDPWorkshopSum});

PROFILEOFAPL.Marks.FssWorkshopMarks=RFDPWorkshopSum;
}


//THeoryTeachingDetails
if(req.body.PersonalDetails==16){
  var THeoryTeachingDetails=[];
  let THeoryTeachingDetailsSum=0;
  if(PROFILEOFAPL.APPLTHEORYTEACHINGDETAILS!==null){
  for(var i=1; i<=PROFILEOFAPL.APPLTHEORYTEACHINGDETAILS.length; i++){
    THeoryTeachingDetails.push(Number(req.body[`THeoryTeachingDetails${i}`]));
  }
  
// // console.log(PHDProjects);
for(var i=0; i<THeoryTeachingDetails.length; i++){
  THeoryTeachingDetailsSum+=THeoryTeachingDetails[i];
}
}
let RTHeoryTeachingDetailsSum=Math.round((THeoryTeachingDetailsSum + Number.EPSILON) * 100) / 100;
 await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.TeachingMarks':RTHeoryTeachingDetailsSum});

PROFILEOFAPL.Marks.TeachingMarks=RTHeoryTeachingDetailsSum;
}

//ProfessionalAffiltation
if(req.body.PersonalDetails==18){
  var ProfessionalAffiltation=[];
  let ProfessionalAffiltationSum=0;
  if(PROFILEOFAPL.APPLPROFFETIONALAFFILIATION!==null){
  for(var i=1; i<=PROFILEOFAPL.APPLPROFFETIONALAFFILIATION.length; i++){
    ProfessionalAffiltation.push(Number(req.body[`ProfessionalAffiltation${i}`]));
  }
  
// // console.log(PHDProjects);
for(var i=0; i<ProfessionalAffiltation.length; i++){
  ProfessionalAffiltationSum+=ProfessionalAffiltation[i];
}
}
let RProfessionalAffiltationSum=Math.round((ProfessionalAffiltationSum + Number.EPSILON) * 100) / 100;
 await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.ProFFesionalMarks':RProfessionalAffiltationSum});

PROFILEOFAPL.Marks.ProFFesionalMarks=RProfessionalAffiltationSum;
}

//PlacementPercentage
if(req.body.PersonalDetails==19){
  var PlacementPercentage=[];
  let PlacementPercentageSum=0;
  if(PROFILEOFAPL.APPLPLACEMENTPERCENTAGE!==null){
  for(var i=1; i<=PROFILEOFAPL.APPLPLACEMENTPERCENTAGE.length; i++){
    PlacementPercentage.push(Number(req.body[`PlacementPercentage${i}`]));
  }
  
// // console.log(PHDProjects);
for(var i=0; i<PlacementPercentage.length; i++){
  PlacementPercentageSum+=PlacementPercentage[i];
}
}
let RPlacementPercentageSum=Math.round((PlacementPercentageSum + Number.EPSILON) * 100) / 100;
 await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.PlacementPercMarks':RPlacementPercentageSum});

PROFILEOFAPL.Marks.PlacementPercMarks=RPlacementPercentageSum;
}

//NewEstablishmentOfLab
if(req.body.PersonalDetails==20){
  var NewEstablishmentOfLab=[];
  let NewEstablishmentOfLabSum=0;
  if(PROFILEOFAPL.APPLESTABLISHMENTOFNEWLAB!==null){
  for(var i=1; i<=PROFILEOFAPL.APPLESTABLISHMENTOFNEWLAB.length; i++){
    NewEstablishmentOfLab.push(Number(req.body[`NewEstablishmentOfLab${i}`]));
  }
  
// // console.log(PHDProjects);
for(var i=0; i<NewEstablishmentOfLab.length; i++){
  NewEstablishmentOfLabSum+=NewEstablishmentOfLab[i];
}
}
let RNewEstablishmentOfLabSum=Math.round((NewEstablishmentOfLabSum + Number.EPSILON) * 100) / 100;
 await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{'Marks.EstOfLabMarks':RNewEstablishmentOfLabSum});

PROFILEOFAPL.Marks.EstOfLabMarks=RNewEstablishmentOfLabSum;
}


//status Till Now
await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{Status:StatusPresentAPPLICATION});
PROFILEOFAPL.Status=StatusPresentAPPLICATION;

//Elgibility Check
if(req.body.elgible){
  var Elgibility=req.body.elgible;
  await Applicant.updateOne({APPLID:PROFILEOFAPL.APPLID},{Eligible:Elgibility});
  PROFILEOFAPL.Eligible=Elgibility;
  if(Elgibility=='No'){
console.log(Elgibility);
    var ApplicantDataArray=[];
    if(TypeStatedProfileRemarks=='applications'){
      ApplicantDataArray=APPLDATAS;
    } if(TypeStatedProfileRemarks=='assistantprofessor'){
      ApplicantDataArray=ASSTPROFF;
    } if(TypeStatedProfileRemarks=='associateprofessor'){
      ApplicantDataArray=ASSOPROFF;
    } if(TypeStatedProfileRemarks=='level10'){
      ApplicantDataArray=ASSTPROFF10;
    } if(TypeStatedProfileRemarks=='level11'){
      ApplicantDataArray=ASSTPROFF11;
    } if(TypeStatedProfileRemarks=='level12'){
      ApplicantDataArray=ASSTPROFF12;
    } if(TypeStatedProfileRemarks=='professor'){
      ApplicantDataArray=PROFF;
    }if(TypeStatedProfileRemarks=='UnderReviewed'){
      ApplicantDataArray=UnderReviewDataToShowArray;
  }
   // res.redirect('/'+`${COMITTEUSERNAME}`+'/'+`${TypeStatedProfileRemarks}`+'/'+`${Key}`);
  app.get('/'+`${COMITTEUSERNAME}`+'/'+`${TypeStatedProfileRemarks}`+'/'+`${Key}`,function(req,res){
    res.render('Applications',{ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,BSArray:ApplicantDataArray,DifKey:Key, Type:TypeStatedProfileRemarks});
  })
  }
}

//Doing The Processes Of UnderReview And Review.

var ReviewedSum=0;
var DataUser=ComitteUserData[0];
//console.log(DataUser);
var ReviewedArray=DataUser.Reviewed;
var UnderReviewedArray=DataUser.UnderReviewAppl;
//console.log(UnderReviewedArray);
StatusPresentAPPLICATION.forEach(function(data){
  ReviewedSum+=data;
})
if(ReviewedSum==210){
 // console.log('It IS Reviewed');
  ReviewedArray.push(Number(APLPROID));
  UnderReviewedArray.remove(Number(APLPROID));
 // console.log(ReviewedArray)
 // console.log(UnderReviewedArray)
 await User.updateOne({Username:COMITTEUSERNAME},{Reviewed:ReviewedArray})
 await User.updateOne({Username:COMITTEUSERNAME},{UnderReviewAppl:UnderReviewedArray})
}else{
  var ReviewCheck=false;
// // console.log(UnderReviewedArray);
  if(UnderReviewedArray.length!=0){
    UnderReviewedArray.forEach(function(userid){
    if(userid==APLPROID){
      ReviewCheck=true;
    }
  })
}
  if(ReviewCheck==false){
    UnderReviewedArray.push(Number(APLPROID));
  }
 //// console.log(UnderReviewedArray);
 await User.updateOne({Username:COMITTEUSERNAME},{UnderReviewAppl:UnderReviewedArray})

}

res.render('profile',{APPLPROFILEDATA:PROFILEOFAPL,ComitteMember:UserName,Branch:DEPARTMENTCOMITTEMEMBER,DifKey:Key,TypeRemark:TypeStatedProfileRemarks});
})
  })
}  
}
})