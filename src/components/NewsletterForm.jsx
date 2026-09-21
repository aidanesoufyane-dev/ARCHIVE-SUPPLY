"use client";
import {useId,useState} from "react";
import styles from "./Newsletter.module.css";

export default function NewsletterForm({source="homepage"}){
 const id=useId();const [busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState(false);
 async function submit(event){
  event.preventDefault();if(busy)return;const form=event.currentTarget;const email=new FormData(form).get("email");setBusy(true);setMessage("");setError(false);
  try{const response=await fetch("/api/newsletter",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,source})});const body=await response.json();if(!response.ok)throw Error(body.error||"Unable to subscribe.");setMessage(body.message);form.reset()}catch(problem){setError(true);setMessage(problem.message||"Please try again.")}finally{setBusy(false)}
 }
 return <div className={styles.signup}>{source==="footer"&&<h4>Get the next drop first.</h4>}<form onSubmit={submit} aria-busy={busy}><label className="sr-only" htmlFor={id}>Email address</label><input id={id} name="email" type="email" autoComplete="email" maxLength={254} required placeholder="YOUR EMAIL ADDRESS" aria-describedby={`${id}-consent ${id}-status`}/><button disabled={busy}>{busy?"Joining…":"Join ↗"}</button></form><small id={`${id}-consent`} className={styles.consent}>By joining, you agree to receive drop-news emails.</small><p id={`${id}-status`} role={error?"alert":"status"} className={styles.feedback}>{message}</p></div>;
}
