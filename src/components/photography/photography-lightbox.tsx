"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Photograph = {
  slug: string;
  title: string;
  src: string;
  alt: string;
  caption: string;
  location: string;
  date: string;
};

type Props = { photographs: Photograph[] };

export function PhotographyLightbox({ photographs }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex === null ? null : photographs[activeIndex];

  function close() { setActiveIndex(null); }
  function previous() { setActiveIndex((index) => index === null ? null : index === 0 ? photographs.length - 1 : index - 1); }
  function next() { setActiveIndex((index) => index === null ? null : index === photographs.length - 1 ? 0 : index + 1); }

  useEffect(() => {
    if (activeIndex === null) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = previousOverflow; };
  }, [activeIndex]);

  return (
    <>
      <div className="photography-lightbox-grid">
        {photographs.map((photograph, index) => (
          <button key={photograph.slug} type="button" className="photography-lightbox-trigger" onClick={() => setActiveIndex(index)} aria-label={`Open ${photograph.title}`}>
            <span className="photography-lightbox-thumb"><Image src={photograph.src} alt={photograph.alt} fill unoptimized sizes="(max-width: 760px) 100vw, 33vw" /></span>
            <span className="photography-lightbox-card-copy"><span className="section-label">{photograph.location}</span><strong>{photograph.title}</strong><span>{photograph.caption}</span></span>
          </button>
        ))}
      </div>

      {active ? (
        <div className="photography-lightbox" role="dialog" aria-modal="true" aria-label={`${active.title} viewer`} onClick={close}>
          <div className="photography-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="photography-lightbox-close" onClick={close} aria-label="Close slideshow">×</button>
            <div className="photography-lightbox-image"><Image src={active.src} alt={active.alt} fill unoptimized sizes="100vw" /></div>
            <button type="button" className="photography-lightbox-previous" onClick={previous} aria-label="Previous photograph">←</button>
            <button type="button" className="photography-lightbox-next" onClick={next} aria-label="Next photograph">→</button>
            <div className="photography-lightbox-footer"><div><p className="section-label">{active.location} · {active.date}</p><h2>{active.title}</h2><p>{active.caption}</p></div><span>{(activeIndex ?? 0) + 1} / {photographs.length}</span></div>
          </div>
        </div>
      ) : null}

      <style jsx>{`.photography-lightbox-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:clamp(1.25rem,3vw,2.5rem)}.photography-lightbox-trigger{display:grid;gap:1rem;padding:0;border:0;background:transparent;color:inherit;text-align:left;cursor:pointer}.photography-lightbox-thumb{position:relative;display:block;aspect-ratio:4/3;overflow:hidden;border-radius:10px;background:rgba(23,23,23,.06)}.photography-lightbox-card-copy{display:grid;gap:.35rem}.photography-lightbox-card-copy strong{font-family:var(--font-cormorant),Georgia,serif;font-size:clamp(1.5rem,3vw,2.2rem);font-weight:500}.photography-lightbox-card-copy>span:last-child{opacity:.72}.photography-lightbox{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:clamp(1rem,4vw,3rem);background:rgba(12,12,12,.88)}.photography-lightbox-panel{position:relative;width:min(100%,76rem);max-height:calc(100vh - 2rem);padding:clamp(1rem,3vw,2rem);background:#f8f4ee;color:#171717}.photography-lightbox-image{position:relative;width:100%;height:min(68vh,46rem);background:#171717}.photography-lightbox-image img{object-fit:contain}.photography-lightbox-close,.photography-lightbox-previous,.photography-lightbox-next{position:absolute;z-index:2;display:grid;place-items:center;width:2.5rem;height:2.5rem;border:1px solid rgba(255,255,255,.35);border-radius:50%;background:rgba(23,23,23,.72);color:#fff;font-size:1.4rem;cursor:pointer}.photography-lightbox-close{top:1.5rem;right:1.5rem}.photography-lightbox-previous{top:50%;left:1.5rem}.photography-lightbox-next{top:50%;right:1.5rem}.photography-lightbox-footer{display:flex;justify-content:space-between;gap:2rem;padding-top:1rem}.photography-lightbox-footer h2{margin:.3rem 0}.photography-lightbox-footer p{margin:0}.photography-lightbox-footer>span{font-family:var(--font-plex-mono),monospace;font-size:.75rem;white-space:nowrap;opacity:.65}@media(max-width:760px){.photography-lightbox-panel{padding:.6rem}.photography-lightbox-image{height:58vh}.photography-lightbox-close{top:.9rem;right:.9rem}.photography-lightbox-previous{left:.9rem}.photography-lightbox-next{right:.9rem}.photography-lightbox-footer{gap:1rem}}`}</style>
    </>
  );
}
