"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./MobileCampaign.module.css";
import NewsletterForm from "./NewsletterForm";
import ProductCard from "@/components/ProductCard";
import { collections, money } from "@/data/products";

export default function Home({products}){
 const root=useRef(null);
 const [storyIndex,setStoryIndex]=useState(0);
 useLayoutEffect(()=>{
  let context;let cancelled=false;
  Promise.all([import("gsap"),import("gsap/ScrollTrigger")]).then(([{gsap},{ScrollTrigger}])=>{
   if(cancelled)return;gsap.registerPlugin(ScrollTrigger);
   context=gsap.context(()=>{
    const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(!reduce && matchMedia("(min-width:901px)").matches)gsap.timeline({defaults:{ease:"power3.out"}}).from(".hero-bg",{clipPath:"inset(0 100% 0 0)",duration:.45}).from(".hero-kicker,.drop-index",{opacity:0,y:10,duration:.25},"<.16").from(".hero-line span",{yPercent:105,duration:.62,stagger:.07},"<").from(".hero-product",{opacity:0,scale:1.035,rotate:1,duration:.7},"<.1").from(".hero-meta,.hero-actions,.scroll-cue",{opacity:0,y:12,stagger:.05,duration:.3},"<.2");
    const mm=gsap.matchMedia();
    mm.add("(min-width:901px) and (pointer:fine) and (prefers-reduced-motion:no-preference)",()=>{
     const hero=root.current.querySelector(".hero");
     const shoeX=gsap.quickTo(".hero-product","x",{duration:.45,ease:"power2.out"});const shoeY=gsap.quickTo(".hero-product","y",{duration:.45,ease:"power2.out"});const titleX=gsap.quickTo(".hero-title","x",{duration:.6,ease:"power2.out"});
     const move=event=>{const box=hero.getBoundingClientRect();const x=event.clientX/box.width-.5;const y=(event.clientY-box.top)/box.height-.5;shoeX(x*10);shoeY(y*6);titleX(x*-4)};
     hero.addEventListener("pointermove",move,{passive:true});return()=>hero.removeEventListener("pointermove",move);
    });
    mm.add("(min-width:901px) and (prefers-reduced-motion:no-preference)",()=>{
     gsap.to(".hero-meta,.hero-actions,.hero-kicker,.scroll-cue",{opacity:0,y:-10,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"40% top",scrub:true}});
     const track=root.current.querySelector(".collection-track");gsap.to(track,{x:()=>Math.min(0,-(track.scrollWidth-innerWidth+60)),ease:"none",scrollTrigger:{trigger:".collections",start:"top top",end:"+=1200",pin:true,scrub:.35,invalidateOnRefresh:true}});
    });
   },root);
  });
  return()=>{cancelled=true;context?.revert()};
 },[]);
 const flagship=products[0];
 const storyShoes=[
  {product:products.find(product=>product.slug==="studio-runner-oxblood")||flagship,image:"/assets/products/studio-runner-oxblood/studio-runner-cutout.png"},
  {product:products.find(product=>product.slug==="aether-01")||products[1]||flagship,image:"/assets/products/aether-01/aether-01-cutout.png"},
  {product:products.find(product=>product.slug==="court-vision")||products[2]||flagship,image:"/assets/products/court-vision/court-vision-cutout.png"},
  {product:products.find(product=>product.slug==="air-frame")||products[3]||flagship,image:"/assets/products/air-frame/air-frame-cutout.png"}
 ];
 useEffect(()=>{const timer=setInterval(()=>setStoryIndex(index=>(index+1)%storyShoes.length),3000);return()=>clearInterval(timer)},[storyShoes.length]);
 if(!flagship)return <main className="catalog-page"><h1>The next drop is coming.</h1></main>;
 const storyShoe=storyShoes[storyIndex];
 return <main ref={root} className="home-page">
  <section className={styles.campaign} aria-labelledby="mobile-campaign-title"><div className={styles.topline}><span>ARCHIVE / DROP 001</span><span>FW26</span></div><h1 id="mobile-campaign-title" className={styles.headline}>OWN THE<span>STREET.</span></h1><div className={styles.photograph}><Image src={flagship.images[0]} alt={`${flagship.name}, ${flagship.colorway}`} fill sizes="(max-width:900px) 115vw, 1px" loading="eager"/></div><div className={styles.purchase}><div className={styles.product}><div><span>THE EVERYDAY, RECONSIDERED.</span><h2>{flagship.name}</h2><p>{flagship.colorway}</p></div><strong>{money(flagship.price)}</strong></div><Link href={`/product/${flagship.slug}`} className={styles.shop}>Explore the runner <span aria-hidden="true">↗</span></Link><Link href="/shop" className={styles.browse}>Discover all sneakers <span aria-hidden="true">→</span></Link></div></section>
  <section className={`hero ${styles.desktop}`}><div className="hero-bg"/><div className="hero-kicker">ARCHIVE / DROP 001<br/>FW26</div><h1 className="hero-title"><span className="hero-line"><span>OWN THE</span></span><span className="hero-line outline"><span>STREET.</span></span></h1><Image className="hero-product" src={flagship.images[0]} alt={`${flagship.name}, ${flagship.colorway}`} fill priority sizes="100vw"/><div className="hero-meta"><span>{flagship.name}</span><span>{flagship.colorway}</span><span>{money(flagship.price)}</span></div><div className="hero-actions"><p>CURATED FOOTWEAR<br/>FOR THE NEXT MOVE.</p><Link className="cta light" href={`/product/${flagship.slug}`}>Explore the runner <span>↗</span></Link><Link className="text-link" href="/new-drops">Shop the drop</Link></div><div className="drop-index">01 <span/> 04</div><div className="scroll-cue">Scroll <i/> Discover</div></section>
  <div className="ticker"><div>NEW DROPS — ICONIC SILHOUETTES — EVERYDAY MOVEMENT — LIMITED RELEASES — NEW DROPS — ICONIC SILHOUETTES —</div></div>
  <section className="drops"><div className="section-intro"><div><span className="section-no">01 / NEW ARRIVALS</span><h2>JUST<br/><em>DROPPED.</em></h2></div><p>A sharp edit of this week’s most considered silhouettes. Built to wear now, and long after the noise moves on.</p></div><div className="home-products">{products.slice(0,4).map((product,i)=><ProductCard product={product} index={i} key={product.slug}/>)}</div><div className="women-row-head"><span className="section-no">WOMEN / NEW SEASON</span><Link href="/women">View women’s rotation ↗</Link></div><div className="home-products women-products">{products.filter(product=>product.gender==="Women").slice(0,4).map((product,i)=><ProductCard product={product} index={i+4} key={product.slug}/>)}</div><Link className="cta dark all-products" href="/shop">View all sneakers <span>↗</span></Link></section>
  <section className="feature-story"><div className="story-copy"><span className="section-no">02 / {storyShoe.product.name.toUpperCase()}</span><h2>BUILT FOR<br/>DAILY<br/><em>MOVEMENT.</em></h2><p>{storyShoe.product.description}</p><Link className="cta dark" href={`/product/${storyShoe.product.slug}`}>Explore the shoe <span>↗</span></Link><div className="story-pagination" aria-label="Featured shoe"><span>0{storyIndex+1}</span><i><b style={{width:`${(storyIndex+1)*25}%`}}/></i><span>04</span></div></div><div className="story-shoe" key={storyShoe.product.slug}><Image src={storyShoe.image} alt={`${storyShoe.product.name}, ${storyShoe.product.colorway}`} fill sizes="(max-width: 900px) 100vw, 62vw" priority={storyIndex===0}/></div><div className="callout one"><b>01</b><span>LAYERED<br/>CONSTRUCTION</span></div><div className="callout two"><b>02</b><span>SCULPTED<br/>CUSHIONING</span></div></section>
  <section className="collections"><div className="collection-head"><span className="section-no">03 / FIND YOUR ROTATION</span><h2>SHOP BY<br/>INSTINCT.</h2></div><div className="collection-track">{collections.slice(1).map((collection,i)=><Link href={`/collections/${collection.slug}`} className="collection-card" key={collection.slug}><span>0{i+1}</span><Image src={collection.image} alt={`${collection.name} collection`} fill sizes="60vw"/><h3>{collection.name.toUpperCase()}</h3><b>Explore ↗</b></Link>)}</div></section>
  <section className="brand-statement"><span>ARCHIVE / SUPPLY</span><h2>LESS HYPE.<br/><em>MORE FORM.</em></h2><p>A fictional independent footwear archive built to demonstrate how commerce and culture can move together.</p><Link href="/about">Read our story ↗</Link></section>
  <section className="newsletter"><span>DROP NOTES / NO SPAM</span><h2>GET THE NEXT<br/><em>DROP FIRST.</em></h2><NewsletterForm source="homepage"/></section>
 </main>
}
