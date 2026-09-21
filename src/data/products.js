const studio = ["/assets/products/studio-runner-oxblood/01-main.png","/assets/products/studio-runner-oxblood/02-rear.png","/assets/products/studio-runner-oxblood/03-top.png","/assets/products/studio-runner-oxblood/04-detail.png"];
const aetherGallery = ["/assets/products/aether-01/01-main.png","/assets/products/aether-01/02-rear.png","/assets/products/aether-01/03-top.png","/assets/products/aether-01/04-detail.png"];
const courtGallery = ["/assets/products/court-vision/01-main.png","/assets/products/court-vision/02-rear.png","/assets/products/court-vision/03-top.png","/assets/products/court-vision/04-detail.png"];
const airGallery = ["/assets/products/air-frame/01-main.png","/assets/products/air-frame/02-rear.png","/assets/products/air-frame/03-top.png","/assets/products/air-frame/04-detail.png"];
const aether = aetherGallery[0];
const court = courtGallery[0];
const air = airGallery[0];

const make = (id, slug, name, collection, category, colorway, price, image, extra={}) => ({
  id, slug, name, brand:"ARCHIVE/SUPPLY", collection, category, colorway, price,
  description:"A considered everyday silhouette balancing layered construction, comfortable proportions and a confident street profile.",
  sizes:[{size:39,stock:3},{size:40,stock:5},{size:41,stock:0},{size:42,stock:6},{size:43,stock:4},{size:44,stock:2},{size:45,stock:0}],
  stock:20, featured:false, new:false, images:[image,image,image,image], material:"Mesh / suede", upper:"Layered construction", sole:"Cushioned rubber", fit:"True to size", ...extra
});

export const products = [
  make("p01","studio-runner-oxblood","Studio Runner","Studio","Lifestyle","Oxblood / Bone",194,studio[0],{featured:true,new:true,images:studio,description:"Our flagship daily runner: tactile suede, open mesh and a sculpted platform tuned for long routes through the city."}),
  make("p02","aether-01","Aether 01","New Drops","Running","Oxblood / Bone",188,aether,{new:true,images:aetherGallery}),
  make("p03","court-vision","Court Vision","Retro","Basketball","Acid / Graphite",160,court,{featured:true,new:true,images:courtGallery}),
  make("p04","air-frame","Air Frame","Performance","Running","Cobalt / Chalk",210,air,{featured:true,images:airGallery}),
  make("p05","aether-clay","Aether Clay","Everyday","Lifestyle","Clay / Ecru",178,aether,{images:aetherGallery}),
  make("p06","court-static","Court Static","Retro","Basketball","Lime / Carbon",165,court,{originalPrice:190,images:courtGallery}),
  make("p07","air-frame-night","Air Frame Night","Performance","Running","Midnight / Slate",218,air,{new:true,images:airGallery}),
  make("p08","studio-runner-bone","Studio Runner Bone","Studio","Lifestyle","Bone / Charcoal",194,studio[2],{images:studio}),
  make("p09","aether-merlot","Aether Merlot","New Drops","Lifestyle","Merlot / Sand",185,aether,{new:true,images:aetherGallery}),
  make("p10","field-runner","Field Runner","Performance","Running","Cobalt / Stone",205,air,{images:airGallery}),
];

export const collections = [
  {slug:"new-drops",name:"New Drops",statement:"The newest forms in the Archive.",image:aether},
  {slug:"studio",name:"Studio",statement:"Everyday silhouettes, deliberately resolved.",image:studio[0]},
  {slug:"retro",name:"Retro",statement:"Court proportions viewed from now.",image:court},
  {slug:"everyday",name:"Everyday",statement:"Built for the route without a finish line.",image:studio[2]},
  {slug:"performance",name:"Performance",statement:"Technical comfort without the noise.",image:air},
];

export const getProduct = slug => products.find(product => product.slug === slug);
export const money = value => new Intl.NumberFormat("en-IE",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(value);
