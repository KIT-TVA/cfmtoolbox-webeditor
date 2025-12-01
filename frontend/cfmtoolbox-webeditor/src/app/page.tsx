"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div className="home-container">
      {/* Background Image */}
      <div className="home-bg" />

      {/* Overlay */}
      <div className="home-overlay">
        <Image
          src="/CFM_WEBEDITOR.png"
          alt="CFM Webeditor Logo"
          width={400}
          height={400}
          priority
        />
        <h1 className="home-title">CFM Webeditor</h1>
        <p className="home-subtitle">
          Visual Editor for Cardinality-Based Feature Models
        </p>
        <div className="home-buttons">
          <button
            className="btn-primary"
            onClick={() => router.push("editor?mode=new")}
          >
            Start New Model
          </button>
          <button
            className="btn-primary"
            onClick={() => router.push("editor?mode=demo")}
          >
            Try a Demo
          </button>
        </div>
      </div>

      {/* Related Work Section */}
      <section className="related-work">
        <h2 className="related-work-title">Related Work</h2>
        <div className="timeline-container">
          <div className="timeline-line" />
          <div className="timeline-items">
            {/* Item 1 */}
            <div className="timeline-item timeline-item-left">
              <div className="timeline-card">
                <h3>Feature-Oriented Software Development (FOSD)</h3>
                <a
                  href="https://www.fosd.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  fosd.net
                </a>
              </div>
              <div className="timeline-dot" />
            </div>

            {/* Item 2 */}
            <div className="timeline-item timeline-item-right">
              <div className="timeline-dot" />
              <div className="timeline-card">
                <h3>CFM Toolbox on GitHub</h3>
                <a
                  href="https://github.com/variability/cfm-toolbox"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/variability/cfm-toolbox
                </a>
              </div>
            </div>

            {/* Item 3 */}
            <div className="timeline-item timeline-item-left">
              <div className="timeline-card">
                <h3>Software Product Line Conference (SPLC)</h3>
                <a
                  href="https://www.splc.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  splc.net
                </a>
              </div>
              <div className="timeline-dot" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>
          © {new Date().getFullYear()} CFM Editor |
          <a href="/impressum" className="home-footer-link">
            Impressum
          </a>
        </p>
      </footer>
    </div>
  );
}
