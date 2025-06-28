import ReactMarkdown from "react-markdown";
import Footers from "../components/HomeFooter";
import HomeNavbar from "../components/HomeNavbar";
import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { ExpandMore, ExpandLess, FolderOpen, Folder, Description } from "@mui/icons-material";

const ChangeLog = () => {
  const { themeMode } = useTheme();
  const isLightMode = themeMode === "light";
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = "ChangeLog | Yomu";
  }, []);

  // Hierarchical changelog structure organized by major versions
  const changelogData = {
    "1.x.x": {
      title: "Version 1.x.x",
      description: "Main release series",
      isExpanded: false,
      versions: {
        "1.2.x": {
          title: "1.2.x - Theme System",
          description: "Theme management and UI improvements",
          versions: [
            {
              version: "1.2.0",
              date: "28 Juni 2025",
              tag: "Current",
              description: "- **Feature** Menambahkan fitur pengganti tema (theme switch) agar pengguna dapat beralih antara mode terang dan gelap.",
            }
          ]
        },
        "1.1.x": {
          title: "1.1.x - AI Integration",
          description: "AI chat and dictionary features",
          versions: [
            {
              version: "1.1.1",
              date: "11 Juni 2025",
              tag: "",
              description: "- **Feature** Penambahan Dictionary dan Catatan oleh Chat AI - **Yuki chan**",
            },
            {
              version: "1.1.0",
              date: "5 Juni 2025",
              tag: "Experimental",
              description: "- feature: **Implementasi AI Chat** untuk interaksi yang lebih baik dengan pengguna. 💬\n- Experimental: **Implementasi AI Dictionary** untuk membantu dalam pengelolaan data kamus.",
            }
          ]
        },
        "1.0.x": {
          title: "1.0.x - Foundation",
          description: "Core features and initial release",
          versions: [
            {
              version: "1.0.2",
              date: "24 Mei 2025",
              tag: "",
              description: "- Update: **Tampilan Home diperbarui** dengan desain baru & warna aksen yang disesuaikan. ✨ \n- BugFix: **Celah putih di sisi kanan** saat scrollbar disembunyikan telah diperbaiki. 🐞 \n- Feature: **Implementasi Autofill** pada entry data Dictionary \n- Adjust: **Penyesuaian tampilan** pada bagian penambahan entry data Dictionary. 🎨",
            },
            {
              version: "1.0.1",
              date: "10 Mei 2025",
              tag: "",
              description: "- Feature: **Implementasi feedback** untuk data collecting \n- Adjust: **Tampilan** agar lebih responsif dan user-friendly.",
            },
            {
              version: "1.0.0",
              date: "30 April 2025",
              tag: "",
              description: "- Feature: **Perbaikan tampilan** pada halaman Note Editor. 🎨\n- Feature: **Implementasi konversi** romaji ke hiragana dan katakana secara otomatis. 🔤\n- Feature: **Implementasi fitur Quiz** untuk latihan interaktif. 🧠\n- UI: **Penyesuaian warna** di pengaturan flashcard. 🎨\n- UX: **Penambahan layout loading** di halaman Note. ⏳",
            }
          ]
        }
      }
    }
  };

  // Function to find current version
  const getCurrentVersion = () => {
    for (const [, majorVersion] of Object.entries(changelogData)) {
      for (const [, minorGroup] of Object.entries(majorVersion.versions)) {
        if (Array.isArray(minorGroup.versions)) {
          const currentVersion = minorGroup.versions.find((v: any) => v.tag === "Current");
          if (currentVersion) return currentVersion;
        }
      }
    }
    return null;
  };

  const currentVersion = getCurrentVersion();

  const toggleExpansion = (path: string) => {
    setExpandedVersions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const renderVersionGroup = (groupKey: string, group: any, level: number = 0) => {
    const isExpanded = expandedVersions.has(groupKey);
    const hasSubVersions = group.versions && typeof group.versions === 'object';
    const hasDirectVersions = Array.isArray(group.versions);

    return (
      <div key={groupKey} className={`${level > 0 ? 'ml-6' : ''}`}>
        {/* Folder Header */}
        <div
          onClick={() => toggleExpansion(groupKey)}
          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            isLightMode 
              ? 'hover:bg-gray-100 border border-gray-200' 
              : 'hover:bg-gray-700 border border-gray-600'
          } ${level === 0 ? 'mb-4' : 'mb-2'}`}
        >
          {/* Folder Icon */}
          {isExpanded ? (
            <FolderOpen className={`mr-3 ${isLightMode ? 'text-blue-600' : 'text-blue-400'}`} />
          ) : (
            <Folder className={`mr-3 ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`} />
          )}
          
          {/* Folder Title */}
          <div className="flex-1">
            <h3 className={`font-semibold ${level === 0 ? 'text-lg' : 'text-md'} ${
              isLightMode ? 'text-gray-800' : 'text-white'
            }`}>
              {group.title}
            </h3>
            <p className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
              {group.description}
            </p>
          </div>
          
          {/* Expand/Collapse Icon */}
          {isExpanded ? (
            <ExpandLess className={isLightMode ? 'text-gray-600' : 'text-gray-400'} />
          ) : (
            <ExpandMore className={isLightMode ? 'text-gray-600' : 'text-gray-400'} />
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className={`ml-6 space-y-3 ${level === 0 ? 'mb-6' : 'mb-4'}`}>
            {hasSubVersions && !hasDirectVersions && 
              Object.entries(group.versions).map(([subKey, subGroup]: [string, any]) =>
                renderVersionGroup(`${groupKey}.${subKey}`, subGroup, level + 1)
              )
            }
            
            {hasDirectVersions &&
              group.versions.map((version: any) => (
                <div
                  key={version.version}
                  className={`p-4 rounded-lg border-l-4 ${
                    isLightMode 
                      ? 'bg-gray-50 border-blue-400 border border-gray-200' 
                      : 'bg-gray-800 border-blue-400'
                  }`}
                >
                  {/* Version Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Description className={`mr-2 text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`} />
                      <div>
                        <span className={`font-semibold ${isLightMode ? 'text-blue-600' : 'text-blue-400'}`}>
                          v{version.version}
                        </span>
                        <span className={`ml-3 text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                          {version.date}
                        </span>
                      </div>
                    </div>
                    {version.tag && (
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        version.tag === 'Current' 
                          ? isLightMode 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-green-900 text-green-300'
                          : version.tag === 'Experimental'
                          ? isLightMode 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-orange-900 text-orange-300'
                          : isLightMode 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-blue-900 text-blue-300'
                      }`}>
                        {version.tag}
                      </span>
                    )}
                  </div>
                  
                  {/* Version Description */}
                  <div className={`prose prose-sm max-w-none ${
                    isLightMode ? 'prose-gray' : 'prose-invert'
                  }`}>
                    <ReactMarkdown>{version.description}</ReactMarkdown>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${isLightMode ? 'bg-gray-50 text-gray-900' : 'bg-gray-900 text-white'}`}>
      {/* Navbar */}
      <HomeNavbar />
      
      {/* Content Card */}
      <div className="pt-24 pb-12 px-6 md:px-10 flex-grow">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold md:text-4xl ${isLightMode ? 'text-blue-600' : 'text-[#13AAFB]'}`}>
              Release Notes
            </h1>
            {currentVersion && (
              <div className={`mt-3 inline-flex items-center px-4 py-2 rounded-full border ${
                isLightMode 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-green-900/30 border-green-600 text-green-300'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  isLightMode ? 'bg-green-500' : 'bg-green-400'
                }`}></span>
                <span className="text-sm font-medium">
                  Current Version: v{currentVersion.version}
                </span>
              </div>
            )}
            <p className={`mt-2 text-lg ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
              Riwayat perubahan dan pembaruan aplikasi
            </p>
          </div>

          {/* Hierarchical Changelog Structure */}
          <div className="space-y-6">
            {Object.entries(changelogData).map(([key, majorVersion]: [string, any]) =>
              renderVersionGroup(key, majorVersion, 0)
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footers />
    </div>
  );
};

export default ChangeLog;
