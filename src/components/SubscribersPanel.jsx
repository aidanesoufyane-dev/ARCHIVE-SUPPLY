"use client";
import {useEffect,useState} from "react";
import styles from "./Newsletter.module.css";

export default function SubscribersPanel(){
 const [query,setQuery]=useState(""),[page,setPage]=useState(1),[refresh,setRefresh]=useState(0),[data,setData]=useState(null),[error,setError]=useState("");
 useEffect(()=>{
  const controller=new AbortController();
  const timer=setTimeout(()=>{fetch(`/api/newsletter?q=${encodeURIComponent(query)}&page=${page}`,{cache:"no-store",signal:controller.signal}).then(async response=>{const body=await response.json();if(!response.ok)throw Error(body.error);return body}).then(setData).catch(problem=>{if(problem.name!=="AbortError")setError(problem.message)})},200);
  return()=>{clearTimeout(timer);controller.abort()};
 },[query,page,refresh]);
 function reload(){setData(null);setError("");setRefresh(n=>n+1)}
 return <section className={styles.panel}><header className={styles.toolbar}><div><h2>Newsletter subscribers</h2><p>{data?`${data.total} ${query?"matching ":""}subscribers`:"Drop notes / Email list"}</p></div><button onClick={reload}>Refresh subscribers</button></header><label className={styles.search}>Search email<input type="search" value={query} onChange={event=>{setQuery(event.target.value);setPage(1);setData(null);setError("")}} placeholder="Find a subscriber"/></label>{error?<p role="alert">{error}</p>:!data?<p role="status">Loading subscribers…</p>:<><ul className={styles.list}>{data.subscribers.map(subscriber=><li key={subscriber._id}><div><strong>{subscriber.email}</strong><small>Signed up from {subscriber.source}</small></div><time dateTime={subscriber.createdAt}>{new Date(subscriber.createdAt).toLocaleString()}</time></li>)}</ul>{!data.total&&<p>{query?"No matching emails.":"No subscribers yet. Newsletter signups will appear here."}</p>}<div className={styles.pager}><button disabled={page<=1} onClick={()=>{setPage(p=>p-1);setData(null)}}>Previous</button><span>Page {data.page} of {data.pages}</span><button disabled={page>=data.pages} onClick={()=>{setPage(p=>p+1);setData(null)}}>Next</button></div></>}</section>;
}
