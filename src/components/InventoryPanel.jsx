"use client";
import {useEffect,useState} from "react";
import styles from "./Newsletter.module.css";

export default function InventoryPanel(){
 const [data,setData]=useState(null),[error,setError]=useState(""),[revision,setRevision]=useState(0);
 useEffect(()=>{const controller=new AbortController();fetch("/api/catalog?admin=1",{cache:"no-store",signal:controller.signal}).then(async r=>{const b=await r.json();if(!r.ok)throw Error(b.error);return b.products}).then(setData).catch(e=>{if(e.name!=="AbortError")setError(e.message)});return()=>controller.abort()},[revision]);
 return <section className={styles.panel}><header className={styles.toolbar}><div><h2>Inventory by size</h2><p>Available = on hand − reserved. Delivery deducts stock; cancellation releases it.</p><p>Use Products → Edit to restock. Older open orders reserve stock on their next status update.</p></div><button onClick={()=>{setError("");setData(null);setRevision(n=>n+1)}}>Refresh inventory</button></header>{error?<p role="alert">{error}</p>:!data?<p role="status">Loading inventory…</p>:data.map(product=><section key={product.slug} style={{marginBottom:28}}><h3>{product.name}</h3><p>{product.colorway}</p><div style={{overflowX:"auto"}}><table style={{width:"100%",textAlign:"left",borderCollapse:"collapse",marginTop:12}}><thead><tr>{["EU size","On hand","Reserved","Available"].map(label=><th key={label} style={{padding:10,borderBottom:"1px solid #ccc"}}>{label}</th>)}</tr></thead><tbody>{product.sizes.map(size=><tr key={size.size}>{[size.size,size.stock,size.reserved||0,Math.max(0,size.stock-(size.reserved||0))].map((value,i)=><td key={i} style={{padding:10,borderBottom:"1px solid #e4dfd6"}}>{value}</td>)}</tr>)}</tbody></table></div></section>)}</section>;
}
