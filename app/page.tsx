"use client";

import {
  GithubIcon,
  Upload,
  PencilRulerIcon,
  Sparkles,
  ScanEye,
  MoonStar,
  FilePenIcon,
  Download,
  Copy,
  Sun,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

export default function Home() {
  const [originalSvg, setOriginalSvg] = useState<string>("");
  const [modifiedSvg, setModifiedSvg] = useState<string>("");
  const [darkModeColor, setDarkModeColor] = useState<string>("#FFFFFF");
  const [lightModeColor, setLightModeColor] = useState<string>("#000000");
  const [isDarkPreview, setIsDarkPreview] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    id: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const hideToast = () => {
    setToast(null);
  };

  const handleChangeColor = (colorType: "light" | "dark", color: string) => {
    if (colorType === "dark") {
      setDarkModeColor(color);
    } else {
      setLightModeColor(color);
    }

    if (originalSvg) {
      const newDarkColor = colorType === "dark" ? color : darkModeColor;
      const newLightColor = colorType === "light" ? color : lightModeColor;
      processSvg(originalSvg, newDarkColor, newLightColor);
    }
  };

  const processSvg = (
    svgContent: string,
    darkColor: string,
    lightColor: string
  ) => {
    try {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
      const svgElement = svgDoc.documentElement;

      if (svgElement.nodeName !== "svg") {
        throw new Error("Invalid SVG content");
      }

      const styleElement = svgDoc.createElement("style");
      styleElement.textContent = `
        @media (prefers-color-scheme: dark) {
          .dark-mode-fill { fill: ${darkColor} !important; }
          .dark-mode-stroke { stroke: ${darkColor} !important; }
        }
        @media (prefers-color-scheme: light) {
          .dark-mode-fill { fill: ${lightColor} !important; }
          .dark-mode-stroke { stroke: ${lightColor} !important; }
        }
      `;
      svgElement.insertBefore(styleElement, svgElement.firstChild);

      const elementsWithFill = svgElement.querySelectorAll(
        '[fill]:not([fill="none"]):not([fill="transparent"])'
      );
      const elementsWithStroke = svgElement.querySelectorAll(
        '[stroke]:not([stroke="none"]):not([stroke="transparent"])'
      );

      elementsWithFill.forEach((element) => {
        element.classList.add("dark-mode-fill");
      });

      elementsWithStroke.forEach((element) => {
        element.classList.add("dark-mode-stroke");
      });

      const pathElements = svgElement.querySelectorAll(
        "path, circle, rect, polygon, ellipse, line"
      );
      pathElements.forEach((element) => {
        if (!element.hasAttribute("fill") && !element.hasAttribute("stroke")) {
          element.classList.add("dark-mode-fill");
        }
      });

      const serializer = new XMLSerializer();
      const modifiedSvgString = serializer.serializeToString(svgElement);
      setModifiedSvg(modifiedSvgString);
    } catch (error) {
      showToast("Error processing SVG: " + (error as Error).message, "error");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "image/svg+xml" || file.name.endsWith(".svg"))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target?.result?.toString().trim();
        if (svgContent) {
          setOriginalSvg(svgContent);
          processSvg(svgContent, darkModeColor, lightModeColor);
        }
      };
      reader.readAsText(file);
    } else {
      showToast("Please upload an SVG file", "error");
    }
  };

  const handleSvgPaste = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const svgContent = event.target.value;
    setOriginalSvg(svgContent);
    if (svgContent.trim()) {
      processSvg(svgContent, darkModeColor, lightModeColor);
    }
  };

  const getPreviewSvg = () => {
    if (!modifiedSvg) return "";

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(modifiedSvg, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    const existingStyle = svgElement.querySelector("style");
    if (existingStyle) {
      existingStyle.remove();
    }

    const forcedColor = isDarkPreview ? darkModeColor : lightModeColor;
    const elementsWithClass = svgElement.querySelectorAll(
      ".dark-mode-fill, .dark-mode-stroke"
    );

    elementsWithClass.forEach((element) => {
      if (element.classList.contains("dark-mode-fill")) {
        element.setAttribute("fill", forcedColor);
      }
      if (element.classList.contains("dark-mode-stroke")) {
        element.setAttribute("stroke", forcedColor);
      }
    });

    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgElement);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const svgContent = e.target?.result?.toString().trim();
          if (svgContent) {
            setOriginalSvg(svgContent);
            processSvg(svgContent, darkModeColor, lightModeColor);
          }
        };
        reader.readAsText(file);
      } else {
        showToast("Please drop an SVG file", "error");
      }
    }
  };

  const downloadSvg = () => {
    if (!modifiedSvg) return;

    const blob = new Blob([modifiedSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "favicon-adaptive.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("SVG downloaded successfully!", "success");
  };

  const copyToClipboard = async () => {
    if (!modifiedSvg) return;

    try {
      await navigator.clipboard.writeText(modifiedSvg);
      showToast("SVG code copied to clipboard!", "success");
    } catch (err) {
      showToast("Failed to copy to clipboard", "error");
    }
  };

  return (
    <main className="relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={18} className="text-green-600" />
            ) : (
              <AlertCircle size={18} className="text-red-600" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={hideToast}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      <header className="flex items-center justify-between p-3 border-b border-gray-300">
        <h1 className="font-semibold text-lg">SVGStyleShift </h1>
        <Link href="https://github.com/letyassine/SVGFavIconEditor">
          <GithubIcon className="hover:text-gray-600 transition-colors" />
        </Link>
      </header>

      <section className="flex justify-center py-10 border-b border-gray-300">
        <h1 className="font-semibold text-2xl max-w-xl text-center">
          Upload an SVG and automatically adapt it for dark mode using CSS media
          queries
        </h1>
      </section>

      <section className="py-3 border-b border-gray-300">
        <p className="flex justify-center gap-1 items-center font-medium">
          <Upload size={18} />
          Upload or Paste SVG
        </p>
        <div className="flex items-center flex-col gap-2 px-2 sm:flex-row w-full justify-between mt-3">
          <label
            htmlFor="file-upload"
            className={`w-full text-sm flex items-center gap-2 justify-center min-h-[200px] flex-1 border-2 border-dashed rounded cursor-pointer transition-colors ${
              isDragOver
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Upload size={16} />
            Choose File Or Drag and Drop
          </label>
          <textarea
            value={originalSvg}
            onChange={handleSvgPaste}
            placeholder="Paste your SVG code here..."
            className="w-full min-h-[200px] border border-gray-300 rounded p-3 flex-1 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </section>

      <section className="pt-3 border-b border-gray-300">
        <p className="flex justify-center gap-1 items-center font-medium">
          <PencilRulerIcon size={18} />
          Color Configuration
        </p>
        <div className="flex flex-col sm:flex-row items-center border-t mt-3 border-gray-300 justify-between">
          <div className="border-b w-full sm:border-r sm:border-b-0 border-gray-300 flex-1 p-3">
            <h1 className="font-medium">Light Mode Color</h1>
            <div className="flex items-center gap-1 mt-2">
              <input
                value={lightModeColor}
                onChange={(e) => handleChangeColor("light", e.target.value)}
                type="color"
                className="w-11 h-11 rounded border border-gray-300 cursor-pointer"
              />
              <input
                value={lightModeColor}
                type="text"
                onChange={(e) => handleChangeColor("light", e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="w-full flex-1 p-3">
            <h1 className="font-medium">Dark Mode Color</h1>
            <div className="flex items-center gap-1 mt-2">
              <input
                value={darkModeColor}
                onChange={(e) => handleChangeColor("dark", e.target.value)}
                type="color"
                className="w-11 h-11 rounded border border-gray-300 cursor-pointer"
              />
              <input
                value={darkModeColor}
                onChange={(e) => handleChangeColor("dark", e.target.value)}
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {modifiedSvg && (
        <section className="pt-3 border-b border-gray-300">
          <p className="flex justify-center gap-1 items-center font-medium">
            <Sparkles size={18} />
            Results
          </p>
          <div className="mt-3 border-t flex flex-col sm:flex-row border-gray-300">
            <div className="p-3 flex-1 border-b w-full sm:border-r sm:border-b-0 border-gray-300">
              <div className="flex items-center justify-between mb-3">
                <h1 className="flex items-center gap-1 font-medium">
                  <ScanEye size={18} />
                  Preview
                </h1>
                <button
                  onClick={() => setIsDarkPreview(!isDarkPreview)}
                  className={`flex items-center cursor-pointer gap-1 px-3 py-1 rounded transition-colors ${
                    isDarkPreview
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-800 border border-gray-300"
                  }`}
                >
                  {isDarkPreview ? <MoonStar size={16} /> : <Sun size={16} />}
                  {isDarkPreview ? "Dark" : "Light"}
                </button>
              </div>
              <div
                className={`w-full min-h-[200px] border border-gray-300 rounded p-3 flex items-center justify-center ${
                  isDarkPreview ? "bg-gray-900" : "bg-white"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: getPreviewSvg() }}
                  className="max-w-16 max-h-16"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                <style jsx global>{`
                  .max-w-16 svg,
                  .max-h-16 svg {
                    max-width: 4rem !important;
                    max-height: 4rem !important;
                    width: auto !important;
                    height: auto !important;
                  }
                `}</style>
              </div>
            </div>
            <div className="p-3 flex-1">
              <div className="flex items-center justify-between mb-3">
                <h1 className="flex items-center gap-1 font-medium">
                  <FilePenIcon size={18} />
                  Modified SVG
                </h1>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center cursor-pointer gap-1 px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors"
                    disabled={!modifiedSvg}
                  >
                    <Copy size={14} />
                    Copy
                  </button>
                  <button
                    onClick={downloadSvg}
                    className="flex items-center cursor-pointer gap-1 px-2 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    disabled={!modifiedSvg}
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
              </div>
              <textarea
                value={modifiedSvg}
                readOnly
                className="w-full min-h-[200px] border border-gray-300 rounded p-3 font-mono text-sm resize-none bg-gray-50"
              />
            </div>
          </div>
        </section>
      )}

      <footer className="text-sm text-center px-3 py-4 text-gray-600">
        Created with love by{" "}
        <Link className="hover:underline" href={"https://x.com/thegitcoder"}>
          GitCoder
        </Link>
      </footer>
    </main>
  );
}
