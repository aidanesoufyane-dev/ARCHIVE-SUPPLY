import mongoose from 'mongoose';
const schema=new mongoose.Schema({slug:{type:String,required:true,unique:true},name:String,price:Number,collection:String,category:String,colorway:String,description:String,images:[String],sizes:[{size:Number,stock:Number,reserved:{type:Number,default:0},_id:false}],published:{type:Boolean,default:true},deleted:{type:Boolean,default:false}},{timestamps:true});
if(mongoose.models.CatalogEntry)mongoose.models.CatalogEntry.schema.path('sizes').schema.add({reserved:{type:Number,default:0}});
export default mongoose.models.CatalogEntry||mongoose.model('CatalogEntry',schema);
