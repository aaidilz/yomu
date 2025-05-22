import { GitHub, Instagram } from "@mui/icons-material";

export default function HomeFooter() {
  return (
    <footer className="bg-slate-950 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Social Media */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Follow Me</h2>
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/aaidilz/"
              aria-label="@aaidilz"
              className="hover:text-white relative group"
            >
              <Instagram />
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-gray-900 bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                @aaidilz
              </span>
            </a>
            <a
              href="https://github.com/aaidilz"
              aria-label="Github"
              className="hover:text-white relative group"
            >
              <GitHub />
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-gray-900 bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                aaidilz
              </span>
            </a>
          </div>
        </div>

        {/* About */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className="text-sm text-gray-400 hover:text-[#13AAFB]"
          >
            About Me
          </a>
          <a
            href="/feedback"
            className="text-sm text-gray-400 hover:text-[#13AAFB]"
          >
            Feedback
          </a>
        </div>

        {/* Copyright */}
        <div className="md:text-right">
          <h2 className="text-lg font-semibold mb-4">Made With ❤️</h2>
          <p className="text-sm text-gray-400">
            Open source project by{" "}
            <a
              href="https://github.com/aaidilz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              aaidilz
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
