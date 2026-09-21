import mongoose from "mongoose";

const subscriberSchema=new mongoose.Schema({
 email:{type:String,required:true,trim:true,lowercase:true,maxlength:254},
 source:{type:String,enum:["homepage","footer"],required:true},
 consentVersion:{type:String,default:"drop-notes-v1"},
},{timestamps:true,collection:"newsletter_subscribers"});
// Deterministic email key prevents duplicates even before indexes are built.
subscriberSchema.add({_id:{type:String,required:true}});
export default mongoose.models.Subscriber||mongoose.model("Subscriber",subscriberSchema);
