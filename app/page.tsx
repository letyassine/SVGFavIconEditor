import {
  GithubIcon,
  Upload,
  PencilRulerIcon,
  Sparkles,
  ScanEye,
  MoonStar,
  FilePenIcon,
  Download,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <header className="flex items-center justify-between p-3 border-b border-gray-300">
        <h1>SVG FavIcon Editor</h1>
        <Link href="https://github.com/letyassine/SVGFavIconEditor">
          <GithubIcon />
        </Link>
      </header>
      <section className="flex justify-center py-10 border-b border-gray-300">
        <h1 className="font-semibold text-2xl max-w-xl text-center">
          Upload an SVG favicon and automatically adapt it for dark mode using
          CSS media queries
        </h1>
      </section>
      <section className="py-3 border-b border-gray-300">
        <p className="flex justify-center gap-1 items-center">
          <Upload size={18} />
          Upload or Paste SVG
        </p>
        <div className="flex items-center flex-col gap-2 px-2 sm:flex-row w-full justify-between mt-3">
          <div className="w-full text-sm flex items-center gap-2 justify-center min-h-[200px] flex-1/2 border border-gray-300 border-dashed rounded">
            <Upload size={16} /> Choose File Or Drag and Drop
          </div>
          <textarea
            placeholder="Paste your SVG code here..."
            className="w-full min-h-[200px] border border-gray-300 rounded p-3 flex-1/2 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </section>
      <section className="pt-3 border-b border-gray-300">
        <p className="flex justify-center gap-1 items-center">
          <PencilRulerIcon size={18} />
          Color Configuration
        </p>
        <div className="flex flex-col sm:flex-row items-center border-t mt-3 border-gray-300 justify-between">
          <div className="border-b w-full sm:border-r sm:border-b-0 border-gray-300 flex-1/2 p-3">
            <h1>Light Mode Color</h1>
            <div className="flex items-center gap-1 mt-2">
              <input
                type="color"
                className="w-12 h-10 border border-gray-300 rounded"
              />
              <input
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="w-full flex-1/2 p-3">
            <h1>Dark Mode Color</h1>
            <div className="flex items-center gap-1 mt-2">
              <input
                type="color"
                className="w-12 h-10 border border-gray-300 rounded"
              />
              <input
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="pt-3 border-b border-gray-300">
        <p className="flex justify-center gap-1 items-center">
          <Sparkles size={18} />
          Results
        </p>
        <div className="mt-3 border-t flex flex-col sm:flex-row border-gray-300">
          <div className="p-3 flex-1/2 border-b w-full sm:border-r sm:border-b-0 border-gray-300">
            <div className="flex items-center justify-between">
              <h1 className="flex items-center gap-1">
                <ScanEye size={18} />
                Preview
              </h1>
              <MoonStar size={18} />
            </div>
            <textarea className="w-full mt-3 min-h-[200px] border border-gray-300 rounded p-3 flex-1/2 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="p-3 flex-1/2">
            <div className="flex items-center justify-between">
              <h1 className="flex items-center gap-1">
                <FilePenIcon size={18} />
                Modified SVG
              </h1>
              <Download size={18} />
            </div>
            <textarea
              placeholder="Paste your SVG code here..."
              className="w-full mt-3 min-h-[200px] border border-gray-300 rounded p-3 flex-1/2 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </section>
      <footer className="text-sm bottom-0 px-3 py-6">
        Created with love by Yassine H.
      </footer>
    </main>
  );
}
