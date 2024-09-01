import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Lock, ArrowRight } from "lucide-react";
import Footer from "@/components/component/Footer";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Secure Your Documents with VeilX
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Redact sensitive information and store your documents securely
                  on the blockchain.
                </p>
              </div>
              <div className="space-x-4">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-900"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-2 bg-green-600 text-white rounded-full">
                  <Eye className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Document Redaction</h3>
                <p className="text-gray-400">
                  Easily redact sensitive information from your documents with
                  our intuitive tools.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-2 bg-green-600 text-white rounded-full">
                  <Lock className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Blockchain Storage</h3>
                <p className="text-gray-400">
                  Store your redacted documents securely on the blockchain for
                  immutability and transparency.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-950"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Document</h3>
                <p className="text-gray-400">
                  Upload your sensitive document to our secure platform.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Redact Information</h3>
                <p className="text-gray-400">
                  Use our tools to redact sensitive information from your
                  document.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Store on Blockchain</h3>
                <p className="text-gray-400">
                  Your redacted document is securely stored on the blockchain.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Secure Your Documents?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl">
                  Join VeilX today and experience the future of document
                  security.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col sm:flex-row gap-2">
                  <Input
                    className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    placeholder="Enter your email"
                    type="email"
                    required
                    aria-label="Email address"
                  />
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Sign Up
                  </Button>
                </form>
                <p className="text-xs text-gray-400">
                  By signing up, you agree to our{" "}
                  <Link
                    className="underline underline-offset-2 hover:text-green-400"
                    href="#"
                  >
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
