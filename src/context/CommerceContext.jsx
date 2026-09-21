"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
const CommerceContext=createContext(null);
export function CommerceProvider({children}){
 const [cart,setCart]=useState([]);const [wishlist,setWishlist]=useState([]);const [cartOpen,setCartOpen]=useState(false);const [searchOpen,setSearchOpen]=useState(false);const [hydrated,setHydrated]=useState(false);
 useEffect(()=>{try{setCart(JSON.parse(localStorage.getItem("archive-cart")||"[]"));setWishlist(JSON.parse(localStorage.getItem("archive-wishlist")||"[]"))}finally{setHydrated(true)}},[]);
 useEffect(()=>{if(hydrated)localStorage.setItem("archive-cart",JSON.stringify(cart))},[cart,hydrated]);useEffect(()=>{if(hydrated)localStorage.setItem("archive-wishlist",JSON.stringify(wishlist))},[wishlist,hydrated]);
 const add=(product,size=42)=>{setCart(current=>{const found=current.find(x=>x.slug===product.slug&&x.size===size);return found?current.map(x=>x===found?{...x,quantity:x.quantity+1}:x):[...current,{slug:product.slug,name:product.name,colorway:product.colorway,price:product.price,image:product.images[0],size,quantity:1}]});setCartOpen(true)};
 const update=(slug,size,quantity)=>setCart(current=>quantity<1?current.filter(x=>!(x.slug===slug&&x.size===size)):current.map(x=>x.slug===slug&&x.size===size?{...x,quantity}:x));
 const remove=(slug,size)=>setCart(current=>current.filter(x=>!(x.slug===slug&&x.size===size)));const toggleWishlist=slug=>setWishlist(current=>current.includes(slug)?current.filter(x=>x!==slug):[...current,slug]);
 const clearCart=()=>setCart([]);const count=cart.reduce((n,x)=>n+x.quantity,0);const subtotal=cart.reduce((n,x)=>n+x.price*x.quantity,0);
 const value=useMemo(()=>({cart,wishlist,cartOpen,setCartOpen,searchOpen,setSearchOpen,add,update,remove,clearCart,toggleWishlist,count,subtotal}),[cart,wishlist,cartOpen,searchOpen,count,subtotal]);return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>
}
export const useCommerce=()=>useContext(CommerceContext);
