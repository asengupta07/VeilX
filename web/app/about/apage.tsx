
export default function About() {
    return (
      <div className="bg-[#000000] text-white min-h-[100dvh] flex flex-col dark:bg-[#161515] dark:text-white">
       <section className="relative flex flex-col items-center justify-center h-[60dvh] bg-gradient-to-b from-[#b565a7] to-[#e15d44] px-4 sm:px-6 md:px-8 dark:bg-gradient-to-b dark:from-[#000000] dark:to-[#110200]">
        
        <div
          className="absolute inset-0 bg-cover bg-center opacity- 60"
          style={{ backgroundImage: "url('https://github.githubassets.com/assets/footer-galaxy-096a057faaf4.jpg')" }}
        ></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-wider text-purple-600 dark:text-purple-400 neon-glow">
            About Us
          </h1>
          <p className="max-w-[600px] text-center mt-4 text-xl sm:text-2xl md:text-3xl">
            How is VielX different?
          </p>
        </div>
      </section>
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-black">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-purple-600 dark:text-purple-400 neon-glow">
                Our Aim
              </h2>
              <p className="mt-10 text-lg sm:text-2xl md:text-2xl">
              At VielX, we empower users to take control of their data. We prioritize privacy by allowing users to redact sensitive information from their documents, ensuring their security. 
              </p>
              <p className="mt-6 text-lg sm:text-2xl md:text-3xl">
              We also provide a unique opportunity for users to share non-sensitive data with trusted companies in exchange for rewards. This approach balances privacy with the potential to benefit from data sharing.
              </p>
            </div>
            <div className="mt-8">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-purple-600 dark:text-purple-400 neon-glow">
                Our Values
              </h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-[#1b1b1b] dark:bg-[#222222] p-8 rounded-lg shadow-lg flex items-start gap-7">
                  <LightbulbIcon className="w-20 h-20 text-[#fdfdfd] neon-glow" />
                  <div>
                    <h3 className="text-3xl font-bold text-[#eff307] neon-glow">Innovation</h3>
                    <p className="mt-2 text-xl">
                      We are constantly exploring new ideas and technologies to create groundbreaking solutions that set
                      us apart from the competition.
                    </p>
                  </div>
                </div>
                <div className="bg-[#1b1b1b] dark:bg-[#222222] p-8 rounded-lg shadow-lg flex items-start gap-7">
                  <UsersIcon className="w-20 h-20 text-[#ffffff] neon-glow" />
                  <div>
                    <h3 className="text-3xl font-bold text-[#eff307]  neon-glow">Collaboration</h3>
                    <p className="mt-2 text-xl">
                      We believe in the power of teamwork and foster a culture of open communication and mutual respect to
                      deliver the best results for our clients.
                    </p>
                  </div>
                </div>
                <div className="bg-[#1b1b1b] dark:bg-[#222222] p-8 rounded-lg shadow-lg flex items-start gap-7">
                  <ShieldIcon className="w-20 h-20 text-[#ffffff] neon-glow" />
                  <div>
                    <h3 className="text-3xl font-bold text-[#eff307]  neon-glow">Integrity</h3>
                    <p className="mt-2 text-xl">
                      We are committed to upholding the highest ethical standards and building long-term relationships
                      based on trust and transparency.
                    </p>
                  </div>
                </div>
                <div className="bg-[#1b1b1b] dark:bg-[#222222] p-8 rounded-lg shadow-lg flex items-start gap-7">
                  <StarIcon className="w-20 h-20 text-[#faf9fa] neon-glow" />
                  <div>
                    <h3 className="text-3xl font-bold text-[#eff307]  neon-glow">Excellence</h3>
                    <p className="mt-2 text-xl">
                      We strive for excellence in everything we do, constantly pushing ourselves to deliver exceptional
                      results and exceed our clients' expectations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide  text-purple-600 dark:text-purple-400 ">
                Our Promise
              </h2>
              <p className="mt-10 text-xl sm:text-2xl md:text-3xl">
              We are committed to continually innovating and improving our platform to provide the best experience for our users. We actively seek feedback and make updates to enhance security, usability, and user satisfaction.
              </p>
            </div>
          </div>
        </section>
      </div>
    )
  }
  
  function LightbulbIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="34"
        viewBox="0 0 27 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    )
  }
  
  
  function ShieldIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      </svg>
    )
  }
  
  
  function StarIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
  
  
  function UsersIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }