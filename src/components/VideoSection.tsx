import { useState } from "react";
import { Play, X } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import videoPreview from "@/assets/video-preview.jpg";

export function VideoSection() {
  const sectionReveal = useScrollReveal({ threshold: 0.1 });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div
            ref={sectionReveal.ref}
            className={`scroll-reveal ${sectionReveal.isVisible ? "visible" : ""}`}
          >
            <div
              className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-border cursor-pointer group"
              onClick={() => setIsOpen(true)}
            >
              <img
                src={videoPreview}
                alt="Aperçu vidéo ANE"
                className="w-full h-[300px] md:h-[500px] lg:h-[600px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-colors duration-300 group-hover:bg-black/40">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Play className="w-7 h-7 md:w-9 md:h-9 text-primary-foreground ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="w-[90vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full rounded-xl"
                src="https://www.youtube.com/embed/Bsm1UqAKFtY?autoplay=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3"
                title="Vidéo de présentation ANE"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
