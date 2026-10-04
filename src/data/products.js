const studio = ["/assets/products/studio-runner-oxblood/01-main.png","/assets/products/studio-runner-oxblood/02-rear.png","/assets/products/studio-runner-oxblood/03-top.png","/assets/products/studio-runner-oxblood/04-detail.png"];
const aetherGallery = ["/assets/products/aether-01/01-main.png","/assets/products/aether-01/02-rear.png","/assets/products/aether-01/03-top.png","/assets/products/aether-01/04-detail.png"];
const courtGallery = ["/assets/products/court-vision/01-main.png","/assets/products/court-vision/02-rear.png","/assets/products/court-vision/03-top.png","/assets/products/court-vision/04-detail.png"];
const airGallery = ["/assets/products/air-frame/01-main.png","/assets/products/air-frame/02-rear.png","/assets/products/air-frame/03-top.png","/assets/products/air-frame/04-detail.png"];
const novaGallery = ["/assets/products/nova-trail/01-main.png","/assets/products/nova-trail/02-rear.png","/assets/products/nova-trail/03-top.png","/assets/products/nova-trail/04-detail.png"];
const axisGallery = ["/assets/products/axis-low/01-main.png","/assets/products/axis-low/02-rear.png","/assets/products/axis-low/03-top.png","/assets/products/axis-low/04-detail.png"];
const pulseGallery = ["/assets/products/pulse-knit/01-main.png","/assets/products/pulse-knit/02-rear.png","/assets/products/pulse-knit/03-top.png","/assets/products/pulse-knit/04-detail.png"];
const orbitGallery = ["/assets/products/orbit-90/01-main.png","/assets/products/orbit-90/02-rear.png","/assets/products/orbit-90/03-top.png","/assets/products/orbit-90/04-detail.png"];
const driftGallery = ["/assets/products/drift-suede/01-main.png","/assets/products/drift-suede/02-rear.png","/assets/products/drift-suede/03-top.png","/assets/products/drift-suede/04-detail.png"];
const lunaGallery = ["/assets/products/luna-court/01-main.png","/assets/products/luna-court/02-rear.png","/assets/products/luna-court/03-top.png","/assets/products/luna-court/04-detail.png"];
const miraGallery = ["/assets/products/mira-runner/01-main.png","/assets/products/mira-runner/02-rear.png","/assets/products/mira-runner/03-top.png","/assets/products/mira-runner/04-detail.png"];
const soleilGallery = ["/assets/products/soleil-70/01-main.png","/assets/products/soleil-70/02-rear.png","/assets/products/soleil-70/03-top.png","/assets/products/soleil-70/04-detail.png"];
const velaGallery = ["/assets/products/vela-knit/01-main.png","/assets/products/vela-knit/02-rear.png","/assets/products/vela-knit/03-top.png","/assets/products/vela-knit/04-detail.png"];
const noaGallery = ["/assets/products/noa-platform/01-main.png","/assets/products/noa-platform/02-rear.png","/assets/products/noa-platform/03-top.png","/assets/products/noa-platform/04-detail.png"];
const aether = aetherGallery[0];
const court = courtGallery[0];
const air = airGallery[0];
const womenSizes = [{size:36,stock:4},{size:37,stock:6},{size:38,stock:7},{size:39,stock:5},{size:40,stock:4},{size:41,stock:2},{size:42,stock:1}];

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
  make("p11","nova-trail","Nova Trail","Trail","Running","Sand / Forest",225,novaGallery[0],{featured:true,new:true,images:novaGallery,material:"Ripstop / suede / mesh",upper:"Utility cage construction",sole:"High-traction lugged rubber",description:"A grounded trail silhouette pairing rugged grip with layered suede, ripstop structure and all-day cushioning."}),
  make("p12","axis-low","Axis Low","Court","Lifestyle","Ivory / Rust",172,axisGallery[0],{new:true,images:axisGallery,material:"Tumbled leather / suede",upper:"Perforated leather construction",sole:"Low-profile gum rubber",description:"A pared-back court shoe shaped in soft leather, rust suede and a slim gum sole for easy daily wear."}),
  make("p13","pulse-knit","Pulse Knit","Performance","Running","Charcoal / Coral",215,pulseGallery[0],{featured:true,new:true,images:pulseGallery,material:"Engineered knit / webbing",upper:"Adaptive knitted construction",sole:"Sculpted foam with rubber pods",description:"A breathable performance runner with adaptive knit support, vivid webbing and a responsive sculpted platform."}),
  make("p14","orbit-90","Orbit 90","Retro","Lifestyle","Silver / Cobalt",198,orbitGallery[0],{featured:true,new:true,images:orbitGallery,material:"Metallic mesh / synthetic",upper:"Layered technical construction",sole:"Sculpted multi-density rubber",description:"A bold retro-future runner balancing metallic mesh, cobalt overlays and a deeply sculpted everyday sole."}),
  make("p15","drift-suede","Drift Suede","Everyday","Lifestyle","Mocha / Ice",176,driftGallery[0],{new:true,images:driftGallery,material:"Suede / leather",upper:"Low-profile suede construction",sole:"Caramel gum rubber",description:"A relaxed terrace profile in rich mocha suede, finished with ice-blue leather and a flexible gum sole."}),
  make("p16","luna-court","Luna Court","Court","Lifestyle","Pearl / Rose",168,lunaGallery[0],{gender:"Women",new:true,featured:true,images:lunaGallery,sizes:womenSizes,material:"Leather / suede",upper:"Streamlined perforated leather",sole:"Translucent honey rubber",description:"A refined low court silhouette balancing pearl leather, dusty rose suede and a softly translucent sole."}),
  make("p17","mira-runner","Mira Runner","Performance","Running","Lavender / Silver",212,miraGallery[0],{gender:"Women",new:true,images:miraGallery,sizes:womenSizes,material:"Technical mesh / metallic synthetic",upper:"Layered breathable construction",sole:"Sculpted responsive foam",description:"A technical runner pairing open lavender mesh with liquid-silver support and stable sculpted cushioning."}),
  make("p18","soleil-70","Soleil 70","Retro","Lifestyle","Butter / Cream",174,soleilGallery[0],{gender:"Women",new:true,images:soleilGallery,sizes:womenSizes,material:"Suede / leather",upper:"Vintage panelled construction",sole:"Low caramel gum rubber",description:"A warm vintage terrace profile in butter suede and cream leather, grounded by a flexible gum sole."}),
  make("p19","vela-knit","Vela Knit","Performance","Running","Sage / Pearl",205,velaGallery[0],{gender:"Women",new:true,featured:true,images:velaGallery,sizes:womenSizes,material:"Engineered knit / synthetic",upper:"Adaptive ribbed knit cage",sole:"Responsive foam with rubber pods",description:"A lightweight performance silhouette with ventilated sage knit, fluid support ribs and responsive cushioning."}),
  make("p20","noa-platform","Noa Platform","Studio","Lifestyle","Burgundy / Rose",196,noaGallery[0],{gender:"Women",new:true,featured:true,images:noaGallery,sizes:womenSizes,material:"Suede / mesh / leather",upper:"Layered mixed-material construction",sole:"Elevated sculpted platform",description:"A confident platform runner layering burgundy suede, rose mesh and an elevated cream sole for daily movement."}),
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
