"use client";

import {useEffect,useRef} from "react";
import styles from "./OrderDetails.module.css";

const countries={MA:"Morocco",FR:"France",GB:"United Kingdom",US:"United States"};
const shown=value=>value || "Not provided";

export default function OrderDetails({order,onClose}){
 const dialog=useRef(null);
 useEffect(()=>{
  const element=dialog.current;
  const previous=document.activeElement;
  const overflow=document.body.style.overflow;
  element.showModal();
  document.body.style.overflow="hidden";
  return()=>{element.close();document.body.style.overflow=overflow;previous?.focus()};
 },[]);
 const price=value=>new Intl.NumberFormat("en-IE",{style:"currency",currency:order.currency||"EUR"}).format(value??0);
 const customer=order.customer||{},shipping=order.shipping||{};
 return <dialog ref={dialog} className={styles.dialog} aria-labelledby="order-details-title" onCancel={onClose} onClick={event=>{if(event.target===event.currentTarget)onClose()}}>
  <header className={styles.header}><div><small>ORDER DETAILS</small><h2 id="order-details-title">{order.orderNumber}</h2><p>{order.createdAt?new Date(order.createdAt).toLocaleString():"Date unavailable"}</p></div><button type="button" onClick={onClose} autoFocus aria-label="Close order details">Close ×</button></header>
  <div className={styles.body}>
   <div className={styles.status}><span>Order: <b>{order.status}</b></span><span>Payment: <b>{order.paymentStatus}</b></span><span>{order.paymentMethod==="cod"?"Cash on delivery":shown(order.paymentMethod)}</span></div>
   <div className={styles.columns}>
    <section><h3>Customer</h3><dl><dt>First name</dt><dd>{shown(customer.firstName)}</dd><dt>Last name</dt><dd>{shown(customer.lastName)}</dd><dt>Email</dt><dd>{shown(customer.email)}</dd><dt>Phone number</dt><dd>{shown(customer.phone)}</dd></dl></section>
    <section><h3>Delivery</h3><dl><dt>Street address</dt><dd>{shown(shipping.address)}</dd><dt>City</dt><dd>{shown(shipping.city)}</dd><dt>Postal code</dt><dd>{shown(shipping.postalCode)}</dd><dt>Country</dt><dd>{countries[shipping.country]||shown(shipping.country)}</dd><dt>Delivery method</dt><dd>{shown(shipping.method)}</dd></dl></section>
   </div>
   <section><h3>Delivery note</h3><p className={styles.note}>{order.notes||"No delivery note provided."}</p></section>
   <section><h3>Ordered items</h3><ul className={styles.items}>{(order.items||[]).map((item,index)=><li key={`${item.slug}-${item.size}-${index}`}><div><strong>{item.name}</strong><p>{shown(item.colorway)} · EU {item.size}</p><small>{item.quantity} × {price(item.unitPrice)}</small></div><b>{price(item.quantity*item.unitPrice)}</b></li>)}</ul></section>
   <dl className={styles.totals}><dt>Subtotal</dt><dd>{price(order.subtotal)}</dd><dt>Shipping</dt><dd>{price(order.shippingCost)}</dd><dt>Total</dt><dd><strong>{price(order.total)}</strong></dd></dl>
  </div>
 </dialog>;
}
