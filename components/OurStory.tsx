"use client";

import { motion } from "framer-motion";
import MediaFrame from "./MediaFrame";
import { weddingConfig } from "@/lib/content";

export default function OurStory() {
  return (
    <section id="story" className="w-full bg-black px-5 py-12">
      <h2 className="mb-1 font-display text-3xl tracking-wide text-white">Our Story</h2>
      <p className="mb-6 text-sm text-nk-mist">{weddingConfig.episodes.length} Episodes</p>

      <div className="flex flex-col gap-6">
        {weddingConfig.episodes.map((ep, i) => (
          <motion.div
            key={ep.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className="overflow-hidden rounded-lg bg-nk-panel"
          >
            <div className="relative aspect-video w-full">
              <MediaFrame
                src={ep.image}
                alt={ep.title}
                label={`EP ${ep.number}`}
                className="h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute bottom-2 left-3 font-display text-4xl text-white/90">{ep.number}</span>
            </div>
            <div className="p-4">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{ep.title}</h3>
                <span className="text-xs text-nk-mist">{ep.year}</span>
              </div>
              <p className="mb-2 text-[11px] uppercase tracking-wider text-nk-red">{ep.subtitle}</p>
              <p className="text-sm text-nk-mist">{ep.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
