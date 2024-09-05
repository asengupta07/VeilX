"use client";

import Link from 'next/link'
import { motion } from "framer-motion";
import { Shield, FileText, Coins, ArrowRight } from "lucide-react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";

import { HiChevronUp, HiChevronDown } from "react-icons/hi";

import { Button } from "@/components/ui/button";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 transition-colors duration-300">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white"
          >
            Welcome to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
              VeilX
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl mb-8 text-gray-700 dark:text-gray-300"
          >
            Revolutionizing Document Security and Data Monetization
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12"
          >
            <FeatureItem
              icon={<Shield className="w-8 h-8" />}
              title="AI-Powered Redaction"
              description="Secure your sensitive information"
            />
            <FeatureItem
              icon={<FileText className="w-8 h-8" />}
              title="Blockchain Storage"
              description="Immutable and decentralized"
            />
            <FeatureItem
              icon={<Coins className="w-8 h-8" />}
              title="Data Marketplace"
              description="Monetize your redacted data"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/uploads" passHref>
              <Button variant="default" size="lg">
                Get Started
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <OfferCard
              icon={
                <Shield className="w-12 h-12 mb-4 text-blue-500 dark:text-blue-400" />
              }
              title="AI-Powered Redaction"
              description="Precise and comprehensive text and image redaction using LLMs, regex, and computer vision."
            />
            <OfferCard
              icon={
                <FileText className="w-12 h-12 mb-4 text-green-500 dark:text-green-400" />
              }
              title="Decentralized Security"
              description="Immutable and secure document storage via InterPlanetary File System (IPFS)."
            />
            <OfferCard
              icon={
                <Coins className="w-12 h-12 mb-4 text-purple-500 dark:text-purple-400" />
              }
              title="Data Marketplace"
              description="Monetize your redacted data and access our cyber-store for transparent bulk data purchase."
            />
          </div>
        </div>
      </section>

      {/* Why VeilX Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose VeilX?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ComparisonCard
              title="Advanced AI Redaction"
              description="Our AI-powered redaction ensures no sensitive information slips through the cracks, offering customizable levels of data protection."
            />
            <ComparisonCard
              title="Blockchain Security"
              description="Immutable storage on the blockchain guarantees the integrity and privacy of your documents."
            />
            <ComparisonCard
              title="Data Monetization"
              description="Unique opportunity to earn cryptocurrency rewards by consenting to sell your redacted data."
            />
            <ComparisonCard
              title="User-Friendly Interface"
              description="Intuitive design makes document management and data transactions a breeze, even for non-technical users."
            />
            <ComparisonCard
              title="Transparent Marketplace"
              description="Our cyber-store offers clear and ethical bulk data purchase options for businesses and researchers."
            />
            <ComparisonCard
              title="Innovative Technology Stack"
              description="We combine AI, blockchain, and decentralized storage for a unique and powerful approach to data management."
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="w-full max-w-3xl mx-auto">
            <Disclosure>
              {({ open }) => (
                <>
                  <DisclosureButton className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-4 rounded-md w-full text-left">
                    <span>
                      How does VeilX ensure the security of my documents?
                    </span>
                    {open ? (
                      <HiChevronUp className="w-5 h-5" />
                    ) : (
                      <HiChevronDown className="w-5 h-5" />
                    )}
                  </DisclosureButton>
                  <DisclosurePanel className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                    VeilX uses a combination of advanced AI for redaction and
                    blockchain technology for storage. Your documents are
                    securely redacted using LLMs, regex, and computer vision,
                    then stored on the decentralized InterPlanetary File System
                    (IPFS) for immutable and secure access.
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-4">
              {({ open }) => (
                <>
                  <DisclosureButton className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-4 rounded-md w-full text-left">
                    <span>
                      Can I customize the level of redaction for my documents?
                    </span>
                    {open ? (
                      <HiChevronUp className="w-5 h-5" />
                    ) : (
                      <HiChevronDown className="w-5 h-5" />
                    )}
                  </DisclosureButton>
                  <DisclosurePanel className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                    Yes, VeilX offers customizable redaction levels to suit your
                    specific needs. You can choose from various levels of
                    redaction, ensuring that you have control over what
                    information is protected and what can be shared or
                    monetized.
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>

            <Disclosure as="div" className="mt-4">
              {({ open }) => (
                <>
                  <DisclosureButton className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 p-4 rounded-md w-full text-left">
                    <span>How does the data marketplace work?</span>
                    {open ? (
                      <HiChevronUp className="w-5 h-5" />
                    ) : (
                      <HiChevronDown className="w-5 h-5" />
                    )}
                  </DisclosureButton>
                  <DisclosurePanel className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                    Our data marketplace allows users to consent to sell their
                    redacted data (level 3 or 4) in exchange for cryptocurrency
                    rewards. We also provide a cyber-store where businesses and
                    researchers can purchase bulk data transparently and
                    ethically.
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="VeilX has revolutionized how we handle sensitive documents. The AI redaction is incredibly accurate, and the blockchain storage gives us peace of mind."
              author="Jane Doe, CEO of TechCorp"
            />
            <TestimonialCard
              quote="The data marketplace is a game-changer. We're able to monetize our non-sensitive data while maintaining full control over our privacy."
              author="John Smith, Data Scientist"
            />
            <TestimonialCard
              quote="As a researcher, having access to ethically sourced, redacted data through VeilX's marketplace has been invaluable for our studies."
              author="Dr. Emily Johnson, University Researcher"
            />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-12 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 transition-colors duration-300">
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p>&copy; 2024 VeilX. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
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
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center bg-white bg-opacity-10 rounded-lg p-4 backdrop-filter backdrop-blur-sm">
      {icon}
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  );
}

function OfferCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg text-center"
    >
      {icon}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
}

function ComparisonCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
}

function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <p className="text-gray-600 dark:text-gray-300 mb-4 italic">{quote}</p>
      <p className="text-right font-semibold">{author}</p>
    </motion.div>
  );
}
