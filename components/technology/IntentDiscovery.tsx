"use client";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Label, ProductImage } from "../Primitives";
const examples = [
  {query:"a light dress for a beach dinner",tokens:["LIGHT","DRESS","BEACH","DINNER","RELAXED"],products:[17,19,14]},
  {query:"something dark for an evening out",tokens:["DARK","EVENING","DRESS","UNDERSTATED"],products:[4,7,16]},
  {query:"blue, easy, and a little unexpected",tokens:["BLUE","RELAXED","DETAIL","WEEKEND"],products:[3,13,9]},
];
export default function IntentDiscovery() {
  const [active,setActive] = useState(0);
  const [stage,setStage] = useState(0);
  const ref=useRef<HTMLDivElement>(null);
  useLayoutEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const ctx=gsap.context(()=>{gsap.fromTo('.concept-token,.concept-product',{y:18,opacity:0},{y:0,opacity:1,duration:.45,stagger:.065,ease:'power2.out'});},ref);
    return()=>ctx.revert();
  },[stage,active]);
  return <div className="intent-lab" ref={ref}><div className="lab-top"><Label>FROM A THOUGHT TO A DIRECTION</Label><span>Illustrative concept</span></div><div className="lab-presets" aria-label="Choose a discovery example">{examples.map((ex,i)=><button key={ex.query} onClick={()=>{setActive(i);setStage(0)}} aria-pressed={active===i}>{ex.query}</button>)}</div><ol className="concept-stages" aria-label="Explore the discovery process">{['Intent','Understanding','Discovery'].map((label,i)=><li key={label}><button onClick={()=>setStage(i)} aria-current={stage===i?'step':undefined}><span>0{i+1}</span>{label}</button></li>)}</ol><div className="concept-content"><p className="concept-query">“{examples[active].query}”</p><div className="concept-tokens" aria-label="Illustrative concepts" hidden={stage<1}>{examples[active].tokens.map(token=><span className="concept-token" key={token}>{token}</span>)}</div><div className="concept-products" hidden={stage<2}>{examples[active].products.map(n=><figure className="concept-product" key={n}><ProductImage index={n}/></figure>)}</div><p className="concept-description" aria-live="polite">{['Start with an idea, an occasion, or the way you want to feel.','Consider the colour, mood, context, and style behind the words.','Bring those ideas together with visual possibilities to explore.'][stage]}</p>{stage<2&&<button className="concept-next text-link" onClick={()=>setStage(stage+1)}>{stage===0?'Explore the meaning':'See the possibilities'} <span aria-hidden="true">↗</span></button>}</div></div>;
}
