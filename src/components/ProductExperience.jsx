"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { money, products } from "@/data/products";
import { useCommerce } from "@/context/CommerceContext";
import ProductCard from "./ProductCard";

const conversions=[[39,6,7,25],[40,6.5,7.5,25.5],[41,7.5,8.5,26],[42,8,9,27],[43,9,10,27.5],[44,9.5,10.5,28],[45,10.5,11.5,29]];

export default function ProductExperience({product}){
 const commerce=useCommerce();
 const [size,setSize]=useState(null);
 const [lightbox,setLightbox]=useState(null);
 const [guide,setGuide]=useState(false);
 useEffect(()=>{const locked=lightbox!==null||guide;document.body.style.overflow=locked?"hidden":"";return()=>{document.body.style.overflow=""}},[lightbox,guide]);
 function buyNow(event){if(!size){event.preventDefault();document.getElementById("sizes")?.focus();return}commerce.add(product,size)}
 return <main className="product-page">
  <div className="product-top">
   <section className="product-gallery" aria-label={`${product.name} gallery`}>
    {product.images.map((src,i)=><button type="button" className={i===0?"gallery-main":"gallery-secondary"} onClick={()=>setLightbox(i)} key={`${src}-${i}`}><Image src={src} alt={`${product.name} view ${i+1}`} fill priority={i===0} sizes="(max-width:900px) 92vw, 62vw"/><span>View +</span></button>)}
   </section>
   <aside className="buy-panel">
    <span>{product.collection} / {product.category}</span><h1>{product.name}</h1><p className="colorway">{product.colorway}</p><strong>{money(product.price)}</strong><p className="product-description">{product.description}</p>
    <div className="size-head" id="sizes" tabIndex="-1"><b>Size / EU</b><button type="button" onClick={()=>setGuide(true)}>Size guide</button></div>
    <div className="size-picker">{product.sizes.map(item=><button type="button" disabled={!item.stock} aria-pressed={size===item.size} className={size===item.size?"selected":""} onClick={()=>setSize(item.size)} key={item.size}>{item.size}</button>)}</div>
    <button className="product-add" disabled={!size} onClick={()=>commerce.add(product,size)}>{size?"Add to bag →":"Select a size"}</button>
    <Link className="buy-now" href={size?"/checkout":"#sizes"} onClick={buyNow}>Buy now</Link>
    <div className="reassurance"><span>Secure checkout</span><span>Shipping calculated at checkout</span><span>14-day demo return policy</span></div>
   </aside>
  </div>
  <section className="product-story"><div><span>PRODUCT / 0{product.id.slice(-1)}</span><h2>BUILT FOR<br/><em>THE EVERYDAY.</em></h2><p>{product.description}</p></div><Image src={product.images[3]} alt={`${product.name} material detail`} width={1200} height={800}/><dl><div><dt>Material</dt><dd>{product.material}</dd></div><div><dt>Upper</dt><dd>{product.upper}</dd></div><div><dt>Sole</dt><dd>{product.sole}</dd></div><div><dt>Fit</dt><dd>{product.fit}</dd></div></dl></section>
  <section className="recommendations"><h2>YOU MAY<br/><em>ALSO LIKE.</em></h2><div>{products.filter(item=>item.slug!==product.slug).slice(0,3).map((item,i)=><ProductCard product={item} index={i} key={item.slug}/>)}</div></section>
  {lightbox!==null&&<div className="lightbox" role="dialog" aria-modal="true" aria-label={`${product.name} image viewer`} onClick={()=>setLightbox(null)}><button type="button" onClick={()=>setLightbox(null)}>Close ×</button><Image onClick={event=>event.stopPropagation()} src={product.images[lightbox]} alt={`${product.name} enlarged view`} fill sizes="100vw"/><span>{String(lightbox+1).padStart(2,"0")} / {String(product.images.length).padStart(2,"0")}</span></div>}
  {guide&&<div className="modal-backdrop" onClick={()=>setGuide(false)}><section className="size-guide" role="dialog" aria-modal="true" aria-labelledby="size-guide-title" onClick={event=>event.stopPropagation()}><button type="button" onClick={()=>setGuide(false)}>Close ×</button><h2 id="size-guide-title">Size guide</h2><table><thead><tr><th>EU</th><th>UK</th><th>US</th><th>CM</th></tr></thead><tbody>{conversions.map(row=><tr key={row[0]}>{row.map(value=><td key={value}>{value}</td>)}</tr>)}</tbody></table><p>Conversions are general guidance. Fit can vary by construction.</p></section></div>}
 </main>
}
