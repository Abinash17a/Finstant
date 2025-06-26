"use client"
import type { JSX } from "react"
import { motion } from "framer-motion"
import { FileText, List, Hash } from "lucide-react"

export type Section =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: { text: string }[] }

export type GPTInsightResponse =
  | {
      sections: Section[] | Section
    }
  | Section[]
  | Section

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

const getSectionIcon = (type: string) => {
  switch (type) {
    case "heading":
      return <Hash className="w-5 h-5 text-blue-600" />
    case "paragraph":
      return <FileText className="w-5 h-5 text-green-600" />
    case "list":
      return <List className="w-5 h-5 text-purple-600" />
    default:
      return null
  }
}

const getSectionBorderColor = (type: string) => {
  switch (type) {
    case "heading":
      return "border-l-blue-500"
    case "paragraph":
      return "border-l-green-500"
    case "list":
      return "border-l-purple-500"
    default:
      return "border-l-gray-500"
  }
}

export function InsightRenderer({ data }: { data: any }) {
  console.log("🧠 Received data in InsightRenderer:", data)

  // Normalize input into an array of Section
  const sections: Section[] = (() => {
    if (Array.isArray(data)) return data as Section[]

    if ("sections" in data) {
      const s = data.sections
      if (Array.isArray(s)) return s
      return [s] // single section inside `sections`
    }

    if ("type" in data) {
      return [data as Section] // single section object
    }

    return [] // fallback
  })()

  if (sections.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center p-8"
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <p className="text-red-600 font-medium">No insights found</p>
          <p className="text-red-500 text-sm mt-1">Please check your data format</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          AI Insights
        </h1>
        <p className="text-gray-600">Generated analysis and recommendations</p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
      </motion.div>

      {/* Sections */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 ${getSectionBorderColor(section.type)} overflow-hidden`}
          >
            <div className="p-6">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gray-50">{getSectionIcon(section.type)}</div>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">{section.type}</span>
              </div>

              {/* Section Content */}
              <div className="ml-2">
                {section.type === "heading" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {(() => {
                      const Tag = `h${section.level}` as keyof JSX.IntrinsicElements
                      return (
                        <Tag
                          className={`font-bold text-gray-800 leading-tight ${
                            section.level === 1
                              ? "text-2xl md:text-3xl"
                              : section.level === 2
                                ? "text-xl md:text-2xl"
                                : "text-lg md:text-xl"
                          }`}
                        >
                          {section.text}
                        </Tag>
                      )
                    })()}
                  </motion.div>
                )}

                {section.type === "paragraph" && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-700 leading-relaxed text-base md:text-lg"
                  >
                    {section.text}
                  </motion.p>
                )}

                {section.type === "list" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <ul className="space-y-3">
                      {section.items.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="flex items-start gap-3 text-gray-700"
                        >
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-base leading-relaxed">{item.text}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {!["heading", "paragraph", "list"].includes(section.type) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-600">⚠️</span>
                      <span className="text-yellow-800 font-medium">Unknown Section Type</span>
                    </div>
                    <pre className="text-sm text-yellow-700 bg-yellow-100 p-3 rounded overflow-x-auto">
                      {JSON.stringify(section, null, 2)}
                    </pre>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Analysis complete • {sections.length} section{sections.length !== 1 ? "s" : ""} processed
        </div>
      </motion.div>
    </div>
  )
}
