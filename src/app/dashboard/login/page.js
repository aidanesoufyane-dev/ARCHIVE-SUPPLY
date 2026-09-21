"use client";
import { useState } from "react";

export default function AdminLogin(){
 const [key,setKey]=useState("");const [error,setError]=useState("");const [busy,setBusy]=useState(false);
 async function submit(event){event.preventDefault();setBusy(true);setError("");try{const response=await fetch("/api/admin-session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accessKey:key})});const body=await response.json();if(response.ok)location.assign(body.path);else{setError(body.error||"Unable to sign in");setBusy(false)}}catch{setError("Unable to connect. Please try again.");setBusy(false)}}
 return <main className="admin-login"><form onSubmit={submit}><span>PRIVATE WORKSPACE</span><h1>Control<br/><em>room.</em></h1><label htmlFor="access-key">Admin access key</label><input id="access-key" type="password" value={key} onChange={e=>setKey(e.target.value)} autoComplete="current-password" required/><button disabled={busy}>{busy?"Checking…":"Enter workspace ↗"}</button>{error&&<p role="alert">{error}</p>}</form></main>
}
