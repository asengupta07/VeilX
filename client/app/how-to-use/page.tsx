"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Disclosure, Transition } from "@headlessui/react";
import Link from "next/link";
import {
  ChevronUp,
  ChevronDown,
  PlayCircle,
  Download,
  ShoppingCart,
  HelpCircle,
  Upload,
  CheckCircle,
} from "lucide-react";
import { TracingBeam } from "@/components/ui/tracing-beam";
import Image from "next/image";

export default function Component() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const steps = [
    {
      title: "Sign Up or Log In",
      description:
        "Create a VeilX account or log in using your existing credentials.",
      videoUrl: "/placeholder.svg?height=180&width=320",
      icon: (
        <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400" />
      ),
    },
    {
      title: "Upload Your Document",
      description:
        "Upload your document in formats such as PDF, TXT, or PNG to begin the redaction process.",
      videoUrl: "/placeholder.svg?height=180&width=320",
      icon: <Upload className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
    },
    {
      title: "Choose Redaction Level",
      description:
        "Customize your redaction by selecting the level of redactness based on your needs. Our AI models will handle the rest.",
      videoUrl: "/placeholder.svg?height=180&width=320",
      icon: (
        <ChevronUp className="w-6 h-6 text-purple-500 dark:text-purple-400" />
      ),
    },
    {
      title: "Download or Store Your Redacted Document",
      description:
        "After redacting, you can download your file or store it securely in our database or on the blockchain by connecting your wallet.",
      videoUrl: "/placeholder.svg?height=180&width=320",
      icon: (
        <Download className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
      ),
    },
    {
      title: "Sell Your Document in the Marketplace",
      description:
        "Monetize your redacted documents by listing them in our marketplace and earning tokens when they are sold.",
      videoUrl: "/placeholder.svg?height=180&width=320",
      icon: (
        <ShoppingCart className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
      ),
    },
  ];

  const handleVideoClick = (index: number) => {
    if (activeVideo === index) {
      videoRefs.current[index]?.pause();
      setActiveVideo(null);
    } else {
      setActiveVideo(index);
      setTimeout(() => {
        videoRefs.current[index]?.play();
      }, 0);
    }
  };

  return (
    <>
      <TracingBeam>
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 font-sans">
          <main className="container mx-auto px-4 py-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold text-center mb-12 text-zinc-800 dark:text-zinc-100"
            >
              <div className="text-6xl font-bold text-center mb-4">
                How to Use{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                  VeilX
                </span>
              </div>
            </motion.h1>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-16 text-center"
            >
              <p className="text-2xl mb-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Welcome to VeilX! This guide will walk you through the key
                processes of our platform.
              </p>
              <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Learn how to upload, redact, store, and sell your documents
                securely and efficiently.
              </p>
            </motion.section>

            {steps.map((step, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-4/5 mx-auto mb-16 bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="flex items-center p-6 bg-zinc-100 dark:bg-zinc-700">
                  <div className="mr-4">{step.icon}</div>
                  <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
                    Step {index + 1}: {step.title}
                  </h2>
                </div>
                <div className="p-6">
                  <div className="relative w-full max-w-md mx-auto aspect-video mb-6 bg-zinc-200 dark:bg-zinc-700 rounded-lg overflow-hidden">
                    {activeVideo === index ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        src={step.videoUrl}
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover rounded-lg"
                        onClick={() => handleVideoClick(index)}
                      />
                    ) : (
                      <Image
                        src={step.videoUrl}
                        alt={`Tutorial video for ${step.title}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    )}
                    {activeVideo !== index && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-700 transition-all duration-300 ease-in-out"
                        onClick={() => handleVideoClick(index)}
                      >
                        <PlayCircle className="h-12 w-12" />
                        <span className="sr-only">Play video</span>
                      </Button>
                    )}
                  </div>
                  <p className="text-lg mb-6 text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {step.description}
                  </p>
                  {index === 1 && (
                    <Link href="/uploads">
                      <Button
                        variant="outline"
                        className="mr-4 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all duration-300 ease-in-out"
                      >
                        <Upload className="mr-2 h-4 w-4" /> Upload Document
                      </Button>
                    </Link>
                  )}
                  {/* {index === 3 && (
                <Button
                  variant="outline"
                  className="mr-4 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all duration-300 ease-in-out"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Redacted Document
                </Button>
              )} */}
                  {index === 4 && (
                    <Link href="/marketplace">
                      <Button
                        variant="outline"
                        className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all duration-300 ease-in-out"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" /> Go to
                        Marketplace
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.section>
            ))}

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-16"
            >
              <h2 className="w-4/5 mx-auto text-3xl text-center font-semibold mb-6 text-zinc-800 dark:text-zinc-100">
                FAQs and Support
              </h2>
              <div className="w-4/5 mx-auto space-y-4">
                {[
                  {
                    question: "What file formats does VeilX support?",
                    answer:
                      "VeilX supports a wide range of file formats including PDF, TXT, DOC, and various image formats such as PNG and JPEG.",
                  },
                  {
                    question: "How secure is the redaction process?",
                    answer:
                      "Our redaction process uses advanced AI models and blockchain technology to ensure the highest level of security and privacy for your documents.",
                  },
                  {
                    question: "Can I customize the redaction levels?",
                    answer:
                      "Yes, VeilX offers four levels of redaction that you can choose from based on your specific needs and the sensitivity of your document.",
                  },
                ].map((faq, index) => (
                  <Disclosure key={index}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex justify-between items-center w-full p-4 text-left rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100">
                          <span className="text-lg font-medium">
                            {faq.question}
                          </span>
                          {open ? (
                            <ChevronUp className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                          )}
                        </Disclosure.Button>
                        <Transition
                          enter="transition duration-100 ease-out"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-75 ease-out"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                        >
                          <Disclosure.Panel className="p-4 mt-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            {faq.answer}
                          </Disclosure.Panel>
                        </Transition>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all duration-300 ease-in-out"
                >
                  <HelpCircle className="mr-2 h-4 w-4" /> Contact Support
                </Button>
              </div>
            </motion.section>
          </main>
        </div>
      </TracingBeam>
      {/* Footer Section */}
      <footer className="space-y-8 bg-custom-gray-transparent">
        <div className="mt-8 mb-8 pt-8 border-zinc-200 dark:border-zinc-700 text-center">
          <p>&copy; 2024 VeilX. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a
              href="#"
              className="text-sm hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
