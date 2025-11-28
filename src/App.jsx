import emailjs from "@emailjs/browser";
import { Toaster, toast } from "react-hot-toast";
import React, { useState, useEffect, useRef } from "react";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code2,
  Layers,
  Cpu,
  Globe,
  ChevronDown,
  Send,
  User,
  Trophy,
  Target,
  Award,
  Zap,
  TrendingUp,
  Sparkles,
  Server,
  Database,
  Cloud,
  Layout,
  Terminal,
  GraduationCap,
  BookOpen,
  Calendar,
  Workflow,
} from "lucide-react";

/**
 * TYPEWRITER COMPONENT
 * Handles the animated text deletion/typing effect.
 */
const Typewriter = ({ words, wait = 3000 }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  // Typing logic
  useEffect(() => {
    if (index === words.length) return;

    if (subIndex === words[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 75 : subIndex === words[index].length ? wait : 150, parseInt(Math.random() * 350)));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words, wait]);

  return (
    <span className="font-mono">
      {`${words[index].substring(0, subIndex)}${blink ? "|" : " "}`}
    </span>
  );
};

/**
 * THREE.JS LOADER HOOK
 */
const useThree = () => {
  const [loaded, setLoaded] = useState(() => !!window.THREE);

  useEffect(() => {
    if (loaded) return;
    if (window.THREE) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
    return () => {
      script.onload = null;
    };
  }, [loaded]);

  return loaded;
};

/**
 * 3D BACKGROUND COMPONENT
 * Renders an interactive abstract geometric scene.
 */
const ThreeBackground = () => {
  const containerRef = useRef(null);
  const threeLoaded = useThree();

  useEffect(() => {
    if (!threeLoaded || !containerRef.current) return;

    // Setup
    const THREE = window.THREE;
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Clear container and append canvas
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // Geometry - Abstract Torus Knot
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0x6366f1, // Indigo-500
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    });
    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    // Animation Loop
    let animationId;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event) => {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    };

    document.addEventListener("mousemove", onDocumentMouseMove);

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;

      // Smooth rotation based on mouse
      torusKnot.rotation.y += 0.5 * (targetX - torusKnot.rotation.y);
      torusKnot.rotation.x += 0.5 * (targetY - torusKnot.rotation.x);

      // Constant ambient rotation
      torusKnot.rotation.z += 0.002;

      // Particle movement
      particlesMesh.rotation.y = -mouseX * 0.0002;
      particlesMesh.rotation.x = -mouseY * 0.0002;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", onDocumentMouseMove);
      cancelAnimationFrame(animationId);

      // Safe cleanup of Three.js resources
      geometry.dispose();
      material.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [threeLoaded]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      style={{
        background:
          "radial-gradient(circle at center, #111827 0%, #000000 100%)",
      }}
    />
  );
};

/**
 * COMPONENT: 3D TILT CARD
 * Adds a parallax tilt effect to project cards
 */
const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        setIsHovered(true);
        handleMouseMove(e);
      }}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: "transform 0.1s ease-out",
      }}
      className={`transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};
/**
 * COMPONENT: SPOTLIGHT EDUCATION CARD
 * Features: Mouse-tracking radial gradient, deep glassmorphism, clean layout
 */
const EducationCard = ({ data, index }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8 transition-all duration-300 hover:border-white/20"
    >
      {/* The Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.15), transparent 40%)`,
        }}
      />

      {/* Spotlight Border Accent */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.4), transparent 40%)`,
          maskImage:
            "linear-gradient(black, black) content-box, linear-gradient(black, black)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Content */}
      <div className="relative z-10 grid gap-6 md:grid-cols-[auto_1fr]">
        {/* Left: Year Badge */}
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
            <GraduationCap size={32} />
          </div>
          {/* Connecting line for visual flow*/}
          {index !== 2 && (
            <div className="mt-6 h-full w-px bg-gradient-to-b from-indigo-500/20 to-transparent"></div>
          )}
        </div>

        {/* Right: Details */}
        <div className="space-y-4">
          <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {data.title}
              </h3>
              <p className="text-lg text-slate-400 mt-1">{data.institution}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-inset ring-white/10 backdrop-blur-sm">
              {data.year}
            </span>
          </div>

          {/* Score / Stats Area */}
          <div className="flex items-center gap-4 pt-2">
            <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20">
              <Award size={16} />
              <span>Grade: {data.score}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * MAIN APP COMPONENT
 */
export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Smooth scroll handler
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "qualifications", label: "Education" },
    { id: "projects", label: "Work" },
    { id: "contact", label: "Contact" },
  ];

  const form = useRef(); // Create a ref for the form
  const [isSubmitting, setIsSubmitting] = useState(false); // State for loading animation

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const SERVICE_ID = "service_fgqyond";
    const TEMPLATE_ID = "template_2jdaykt";
    const PUBLIC_KEY = "8TB1wl9wUqmeV_Q31";

    // Use a promise toast for better UX (Loading -> Success/Error automatically)
    toast.promise(
      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, {
        publicKey: PUBLIC_KEY,
      }),
      {
        loading: "Sending message...",
        success: () => {
          setIsSubmitting(false);
          e.target.reset(); // Clear the form
          return "Message sent successfully!";
        },
        error: (err) => {
          setIsSubmitting(false);
          console.error("FAILED...", err.text);
          return "Failed to send. Please try again.";
        },
      },
      {
        style: {
          background: "#1f2937", // Dark grey background
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
        },
      }
    );
  };

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* 3D Background */}
      <ThreeBackground />

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "",
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
          success: {
            iconTheme: {
              primary: "#6366f1", // Indigo-500
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => scrollTo("home")}
          >
            {/* Logo Icon Container */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Code2 size={24} />
              <div className="absolute -top-1 -right-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
              </div>
            </div>

            {/* Logo Text */}
            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-bold tracking-tight text-white">
                Agrawal
              </span>
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-wider">
                CODES
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-sm font-medium transition-colors hover:text-indigo-400 ${
                  activeSection === item.id
                    ? "text-indigo-400"
                    : "text-slate-400"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-slate-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10">
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="block w-full text-left text-lg text-slate-300 hover:text-indigo-400"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative pt-20"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 z-10">
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm w-fit">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-sm font-medium text-slate-300">
                Available for Work
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg text-indigo-400 font-medium tracking-wide">
                HELLO, I'M
              </h2>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                Sujal Agrawal
              </h1>
            </div>

            {/* Animated Text Section */}
            <div className="text-2xl md:text-4xl font-bold h-12 text-slate-300">
              {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                <Typewriter
                  words={[
                    "Full Stack Web Developer",
                    "C++ Problem Solver",
                    "Aspiring SDE",
                  ]}
                />
              </span>
            </div>

            <p className="text-lg text-slate-400 max-w-xl leading-relaxed pt-4">
              I'm an aspiring SDE and Developer shaping next-gen web
              experiences.
              <br />I combine smooth interactions with scalable design systems
              to craft memorable digital products.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => scrollTo("projects")}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25"
              >
                View My Work
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-medium transition-all backdrop-blur-sm"
              >
                Contact Me
              </button>
            </div>
          </div>

          {/* Complex Shape Image */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Morphing Blob Container */}
            <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] transition-all duration-500">
              {/* The Image inside a blob mask */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden"
                style={{
                  borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                  animation: "morph 8s ease-in-out infinite",
                  boxShadow: "0 0 40px rgba(99, 102, 241, 0.3)",
                }}
              >
                <img
                  src="/PictureX.png"
                  alt="Sujal Agrawal"
                  className="w-full h-full object-cover opacity-80 hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Decorative floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-700"></div>

              {/* Floating Tech Icons */}
              <div className="absolute top-10 right-0 bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10 animate-bounce delay-100">
                <Code2 className="text-indigo-400" size={24} />
              </div>
              <div className="absolute bottom-10 left-0 bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10 animate-bounce delay-300">
                <Globe className="text-cyan-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500">
          <ChevronDown size={24} />
        </div>

        {/* Style tag for the blob animation */}
        <style>{`
          @keyframes morph {
            0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
            50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
            100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          }
            @keyframes shine {
            0% { transform: translateX(-200%) skewX(-12deg); }
            100% { transform: translateX(200%) skewX(-12deg); }
          }
          .animate-shine {
            animation: shine 1.5s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>
      </section>

      <section id="about" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left: Tech Stack Grid */}
            <div className="order-2 md:order-1 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

              <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles size={80} />
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-indigo-300 mb-6 border border-white/10">
                  <Zap size={12} fill="currentColor" />
                  MY ARSENAL
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 1. Frontend */}
                  <div className="group p-5 bg-black/20 border border-white/5 rounded-2xl hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 group-hover:scale-110 transition-transform">
                        <Layout size={20} />
                      </div>
                      <h3 className="font-bold text-white">Frontend</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      React, Next.js, TypeScript, Tailwind
                    </p>
                  </div>

                  {/* 2. Devops */}
                  <div className="group p-5 bg-black/20 border border-white/5 rounded-2xl hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 translate-y-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                        <Workflow size={20} />
                      </div>
                      <h3 className="font-bold text-white">DevOps</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Docker, Kubernetes
                    </p>
                  </div>

                  {/* 3. Backend */}
                  <div className="group p-5 bg-black/20 border border-white/5 rounded-2xl hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform">
                        <Server size={20} />
                      </div>
                      <h3 className="font-bold text-white">Backend</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      NodeJs, Express, FastAPI, Flask
                    </p>
                  </div>

                  {/* 4. WebGL*/}
                  <div className="group p-5 bg-black/20 border border-white/5 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 translate-y-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                        <Globe size={20} />
                      </div>
                      <h3 className="font-bold text-white">WebGL</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Three.js, R3F
                    </p>
                  </div>

                  {/* 5. Cloud */}
                  <div className="group p-5 bg-black/20 border border-white/5 rounded-2xl hover:bg-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400 group-hover:scale-110 transition-transform">
                        <Cloud size={20} />
                      </div>
                      <h3 className="font-bold text-white">Cloud</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      AWS, Vercel
                    </p>
                  </div>

                  {/* 6. Database*/}
                  <div className="group p-5 bg-black/20 border border-white/5 rounded-2xl hover:bg-pink-500/10 hover:border-pink-500/30 transition-all duration-300 hover:-translate-y-1 translate-y-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400 group-hover:scale-110 transition-transform">
                        <Database size={20} />
                      </div>
                      <h3 className="font-bold text-white">Database</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      MongoDB, PostgreSQL, Convex
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-4xl font-bold">
                Beyond the <span className="text-indigo-400">Code</span>
              </h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                I don't just write code; I solve problems. With a background in
                Information Technology and a passion for design, I bridge the
                gap between technical complexity and user delight.
              </p>
              <p className="text-slate-400 leading-relaxed text-lg">
                Currently, I'm obsessed with WebGL and creating interfaces that
                feel alive. When I'm not coding, I'm exploring new tech stacks
                or contributing to open source.
              </p>

              <div className="pt-4 flex items-center space-x-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">3+</span>
                  <span className="text-sm text-slate-500">Months Exp.</span>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">7+</span>
                  <span className="text-sm text-slate-500">Projects</span>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-white">100%</span>
                  <span className="text-sm text-slate-500">Commitment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifications */}
      <section id="qualifications" className="py-32 relative">
        <div className="max-w-5xl mx-auto px-6">
          {/* Section Header */}
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full text-xs font-medium text-indigo-400 mb-4 border border-indigo-500/20">
                <BookOpen size={14} />
                ACADEMIC HISTORY
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                My <span className="text-indigo-400">Education</span>
              </h2>
            </div>
            {/* <p className="text-slate-400 max-w-sm text-right md:text-left hidden md:block">
              A timeline of my academic journey and the milestones that built my
              foundation.
            </p> */}
          </div>

          {/* Cards Grid */}
          <div className="space-y-6">
            {[
              {
                title: "Bachelor of Technology",
                institution: "Indian Institute of Information Technology, Una",
                year: "2023 - Present",
                score: "9.01 CGPA",
              },
              {
                title: "Senior Secondary (12th)",
                institution: "Saiyyid Hamid S.Sec School, A.M.U, Aligarh",
                year: "2023",
                score: "95%",
              },
              {
                title: "Secondary (10th)",
                institution: "Radiant Stars English School, Aligarh",
                year: "2021",
                score: "96.2%",
              },
            ].map((item, index) => (
              <EducationCard key={index} data={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 bg-black/20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Featured <span className="text-indigo-400">Work</span>
            </h2>
            <p className="text-slate-400">
              A selection of my favorite projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <TiltCard className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50">
              <div className="h-48 bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">
                    DocBrief
                  </h3>
                  <a
                    href="https://github.com/SujalAgrawal08/DocBrief"
                    className="p-2 bg-white/10 rounded-full hover:bg-indigo-600 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
                <p className="text-slate-400 text-sm">
                  A smart document processing system that converts text into
                  clear summaries with an integrated AI chatbot for contextual
                  queries.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded-full">
                    Vite
                  </span>
                  <span className="px-3 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded-full">
                    Flask
                  </span>
                  <span className="px-3 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded-full">
                    HuggingFace BART
                  </span>
                </div>
              </div>
            </TiltCard>

            {/* Project 2 */}
            <TiltCard className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50">
              <div className="h-48 bg-gradient-to-br from-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1644088379091-d574269d422f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-500"></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold group-hover:text-purple-400 transition-colors">
                    CodeRobo
                  </h3>
                  <a
                    href="https://code-robo.vercel.app/"
                    className="p-2 bg-white/10 rounded-full hover:bg-purple-600 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
                <p className="text-slate-400 text-sm">
                  A smart development assistant that builds full-stack projects,
                  supports live editing, and enhances workflows with AI-driven
                  logic.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                    Next.js
                  </span>
                  <span className="px-3 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                    ConvesDB
                  </span>
                  <span className="px-3 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                    Google Studio
                  </span>
                </div>
              </div>
            </TiltCard>

            {/* Project 3 */}
            <TiltCard className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50">
              <div className="h-48 bg-gradient-to-br from-cyan-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://plus.unsplash.com/premium_photo-1714618807043-1b9c2bf90f5f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-500"></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">
                    AtmaNirbhar Hills
                  </h3>
                  <a
                    href="https://atmanirbhar-hills-client.vercel.app/"
                    className="p-2 bg-white/10 rounded-full hover:bg-cyan-600 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
                <p className="text-slate-400 text-sm">
                  A digital transformation initiative enabling self-reliant hill
                  communities through interactive resources and transparent
                  analytics.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full">
                    React
                  </span>
                  <span className="px-3 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full">
                    NodeJS
                  </span>
                  <span className="px-3 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full">
                    MongoDB
                  </span>
                </div>
              </div>
            </TiltCard>
          </div>

          <div className="mt-16 text-center">
            <a
              href="https://github.com/SujalAgrawal08"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Github size={20} />
              <span>View more on Github</span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 relative overflow-hidden">
        {/* Decorative Gradient Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Let's Work <span className="text-indigo-400">Together</span>
          </h2>
          <p className="text-slate-400 text-lg mb-12">
            Have a project in mind? Looking for a full stack web developer to
            join your team? <br />
            I'm currently available for internship roles.
          </p>

          {/* FORM START */}
          <form
            ref={form}
            onSubmit={sendEmail}
            className="max-w-md mx-auto space-y-4 text-left"
          >
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-slate-500"
                  size={18}
                />
                <input
                  type="text"
                  name="from_name"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-slate-500"
                  size={18}
                />
                <input
                  type="email"
                  name="from_email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Send size={18} className={isSubmitting ? "animate-pulse" : ""} />
              <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
            </button>
          </form>
          {/* FORM END */}

          <div className="mt-16 flex justify-center space-x-8">
            <a
              href="https://github.com/SujalAgrawal08"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/sujalagrawal08/"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=agrawalsujal08@gmail.com"
              className="text-slate-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>© 2025 AgrawalCodes. Built with Love</p>
      </footer>
    </div>
  );
}
