"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/feature-model-background.png')" }}
      ></div>

      {/* Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center bg-black/60">
        <Image
          src="/CFM_WEBEDITOR.png"
          alt="CFM Webeditor Logo"
          width={400}
          height={400}
          priority
        />
        <h1 className="text-4xl md:text-6xl font-bold mb-4">CFM Webeditor</h1>
        <p className="text-lg md:text-2xl max-w-2xl mb-6">
          Visual Editor for Cardinality-Based Feature Models
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            className="text-lg px-6 py-3 bg-blue-600 text-white rounded shadow p-2"
            onClick={() => router.push("editor?mode=new")}
          >
            Start New Model
          </button>
          <button
            className="text-lg px-6 py-3 bg-blue-600 text-white rounded shadow p-2"
            onClick={() => router.push("editor?mode=demo")}
          >
            Try a Demo
          </button>
        </div>
      </div>

      {/* Related Work Section */}
      {/* Related Work Section */}
      <section className="relative z-10 px-6 py-12 bg-white text-black">
        <h2 className="text-3xl font-bold mb-10 text-center">Related Work</h2>
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical timeline line */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-300" />

          <div className="space-y-12">
            {/* Item 1 */}
            <div className="flex flex-col md:flex-row items-center justify-between relative">
              <div className="w-full md:w-1/2 md:pr-8 text-right">
                <div className="p-4 bg-gray-100 rounded shadow">
                  <h3 className="font-semibold">
                    Feature-Oriented Software Development (FOSD)
                  </h3>
                  <a
                    href="https://www.fosd.net/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    fosd.net
                  </a>
                </div>
              </div>
              <div className="w-4 h-4 bg-blue-600 rounded-full absolute left-1/2 transform -translate-x-1/2" />
              <div className="hidden md:block w-1/2" />
            </div>

            {/* Item 2 */}
            <div className="flex flex-col md:flex-row items-center justify-between relative">
              <div className="hidden md:block w-1/2" />
              <div className="w-4 h-4 bg-blue-600 rounded-full absolute left-1/2 transform -translate-x-1/2" />
              <div className="w-full md:w-1/2 md:pl-8 text-left">
                <div className="p-4 bg-gray-100 rounded shadow">
                  <h3 className="font-semibold">CFM Toolbox on GitHub</h3>
                  <a
                    href="https://github.com/variability/cfm-toolbox"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/variability/cfm-toolbox
                  </a>
                </div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col md:flex-row items-center justify-between relative">
              <div className="w-full md:w-1/2 md:pr-8 text-right">
                <div className="p-4 bg-gray-100 rounded shadow">
                  <h3 className="font-semibold">
                    Software Product Line Conference (SPLC)
                  </h3>
                  <a
                    href="https://www.splc.net/"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    splc.net
                  </a>
                </div>
              </div>
              <div className="w-4 h-4 bg-blue-600 rounded-full absolute left-1/2 transform -translate-x-1/2" />
              <div className="hidden md:block w-1/2" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 bg-gray-900 text-gray-400 text-sm text-center">
        <p>
          © {new Date().getFullYear()} CFM Editor |
          <a href="/impressum" className="text-gray-300 hover:underline ml-1">
            Impressum
          </a>
        </p>
      </footer>
    </div>
  );
}
