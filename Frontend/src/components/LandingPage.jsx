import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Users,
  BarChart,
  Menu,
  X,
  Github,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";
import Logo from "./common/Logo";

const features = [
  {
    title: "AI-Powered Resume Screening",
    desc: "Automatically rank and filter candidates using advanced AI algorithms, saving hours of manual review.",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: "Collaborative Hiring",
    desc: "Seamlessly collaborate with your team, leave feedback, and make decisions together in real-time.",
    icon: <Users className="w-6 h-6" />,
  },
  {
    title: "One-Click Job Posting",
    desc: "Post jobs to multiple platforms with a single click and track applicants from all sources in one dashboard.",
    icon: <ArrowRight className="w-6 h-6" />,
  },
  {
    title: "Advanced Analytics",
    desc: "Gain insights into your hiring pipeline, bottlenecks, and time-to-hire with beautiful, actionable reports.",
    icon: <BarChart className="w-6 h-6" />,
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
      {/* Enhanced Navbar */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-lg shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium"
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => navigate("/auth/login")}
                className="px-5 py-2 rounded-full font-medium transition-all hover:bg-primary/10 text-primary"
              >
                Login
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                onClick={() => navigate("/auth/signup")}
                className="px-5 py-2 rounded-full font-medium transition-all bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/25"
              >
                Sign Up
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t"
            >
              <div className="px-6 py-4 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block text-foreground/80 hover:text-primary transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-4 space-y-3">
                  <button
                    onClick={() => {
                      navigate("/auth/login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-5 py-2 rounded-full font-medium transition-all hover:bg-primary/10 text-primary"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/auth/signup");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-5 py-2 rounded-full font-medium transition-all bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/25"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="h-16"></div>

      {/* Main Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Modern Applicant Tracking
            </span>
            <br />
            <span className="text-foreground">for High-Performance Teams</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Supercharge your hiring with AI-driven automation, collaborative
            workflows, and stunning analytics.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth/signup")}
              className="px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all bg-primary text-white hover:bg-primary/90"
            >
              Get Started Free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
              className="px-8 py-4 rounded-full font-bold text-lg transition-all border-2 border-primary text-primary hover:bg-primary/5"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <section
          id="features"
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-10"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl p-8 flex items-start space-x-4 hover:shadow-xl transition-all bg-white border border-border"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                {f.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {f.title}
                </h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </section>
      </main>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground">
            From job posting to hiring, ATS Pro streamlines every step.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "📝",
              title: "Post a Job",
              desc: "Create and publish job openings to multiple platforms in seconds.",
            },
            {
              icon: "🤖",
              title: "Automated Screening",
              desc: "Let AI filter and rank candidates for you, saving valuable time.",
            },
            {
              icon: "🎉",
              title: "Hire the Best",
              desc: "Collaborate, interview, and onboard the perfect candidate with ease.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-border"
            >
              <span className="text-4xl mb-4 block">{step.icon}</span>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <p className="text-xl text-muted-foreground">
            Trusted by recruiters and teams worldwide.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              img: "https://randomuser.me/api/portraits/men/32.jpg",
              quote:
                "ATS Pro made our hiring 2x faster. The automation is a game changer!",
              name: "Alex",
              role: "HR Lead",
            },
            {
              img: "https://randomuser.me/api/portraits/women/44.jpg",
              quote:
                "The analytics dashboard gives us real insights. Highly recommended!",
              name: "Priya",
              role: "Talent Manager",
            },
            {
              img: "https://randomuser.me/api/portraits/men/65.jpg",
              quote: "Collaboration is seamless. Our team loves ATS Pro!",
              name: "John",
              role: "Recruiter",
            },
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-border"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={testimonial.img}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-bold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">{testimonial.quote}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-6xl mx-auto py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose a plan that fits your hiring needs.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Starter",
              price: "Free",
              desc: "For small teams",
              features: [
                "Up to 2 job postings",
                "Basic analytics",
                "Email support",
              ],
              cta: "Get Started",
              popular: false,
            },
            {
              name: "Pro",
              price: "$49",
              period: "/mo",
              desc: "For growing teams",
              features: [
                "Unlimited job postings",
                "AI-powered screening",
                "Advanced analytics",
                "Priority support",
              ],
              cta: "Start Free Trial",
              popular: true,
            },
            {
              name: "Enterprise",
              price: "Contact Us",
              desc: "For large organizations",
              features: [
                "Custom integrations",
                "Dedicated success manager",
                "SLA & compliance",
              ],
              cta: "Contact Sales",
              popular: false,
            },
          ].map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border ${
                plan.popular ? "border-primary scale-105" : "border-border"
              }`}
            >
              <h3 className="text-2xl font-bold mb-2 text-foreground">
                {plan.name}
              </h3>
              <p className="text-muted-foreground mb-4">{plan.desc}</p>
              <div className="text-4xl font-bold mb-4">
                {plan.price}
                {plan.period && (
                  <span className="text-base font-normal">{plan.period}</span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li
                    key={j}
                    className="flex items-center text-muted-foreground"
                  >
                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 rounded-full font-semibold transition-all ${
                  plan.popular
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Ready to streamline your hiring?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Sign up now and experience effortless recruitment with ATS Pro.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/auth/signup")}
            className="px-10 py-4 rounded-full bg-primary text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Get Started Free
          </motion.button>
        </motion.div>
      </section>

      {/* Enhanced Footer */}
      <footer className="w-full border-t mt-auto bg-gradient-to-b from-white to-muted">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ATS Pro
              </h3>
              <p className="text-muted-foreground">
                Modern applicant tracking system powered by AI for
                high-performance teams.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Integrations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Updates
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} ATS Pro. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
