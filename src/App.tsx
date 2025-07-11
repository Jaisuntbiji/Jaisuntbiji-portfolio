import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  User,
  Code,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  Heart,
  MapPin,
  Phone,
} from "lucide-react";

interface Command {
  command: string;
  output: string[];
  timestamp: string;
  isTyping?: boolean;
  currentLineIndex?: number;
  currentCharIndex?: number;
}

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Command[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [likes, setLikes] = useState(5432);
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Portfolio data for Jaisun T Biji
  const portfolioData = {
    name: "Jaisun T Biji",
    role: "Software Engineer | Java Developer | Quality Engineering Enthusiast",
    location: "Kottayam, Kerala",
    about: [
      "Detail-oriented and driven software engineer with a strong foundation in Java, MySQL,",
      "and object-oriented programming. Interested in Quality Engineering, familiar with Selenium,",
      "manual/automation testing, and cloud testing using AWS.",
      "",
      "Type any command to continue...",
    ],
    education: [
      "Bachelor of Technology in Computer Science",
      "College/University: [Your Institution Name]",
      "CGPA: 8.5/10 (or relevant grade)",
      "Relevant Coursework: Data Structures, Algorithms, Software Engineering,",
      "Database Management Systems, Object-Oriented Programming",
    ],
    skills: [
      "Programming Languages: Java, Python, JavaScript, SQL",
      "Frameworks & Libraries: Spring Boot, React, Node.js, Selenium WebDriver",
      "Databases: MySQL, PostgreSQL, MongoDB",
      "Testing: Manual Testing, Automation Testing, Selenium, TestNG, JUnit",
      "Cloud & DevOps: AWS (EC2, S3, RDS), Docker, Jenkins, Git",
      "Tools: IntelliJ IDEA, Eclipse, VS Code, Postman, JIRA, Maven",
    ],
    projects: [
      {
        name: "OpenTable Restaurant Booking System",
        description:
          "Full-stack web application for restaurant reservations with real-time availability",
        tech: "Java Spring Boot, MySQL, React, REST APIs",
        features: "User authentication, booking management, admin dashboard",
      },
      {
        name: "Tumor Detection System",
        description:
          "Machine learning application for medical image analysis and tumor detection",
        tech: "Python, TensorFlow, OpenCV, Flask",
        features:
          "Image preprocessing, CNN model, web interface for predictions",
      },
    ],
    experience: [
      "Quality Engineering Intern - [Company Name] (Duration)",
      "• Developed automated test scripts using Selenium WebDriver",
      "• Performed manual testing for web applications",
      "• Collaborated with development teams for bug tracking and resolution",
      "",
      "Software Development Simulation - Various Projects",
      "• Built full-stack applications using Java and modern frameworks",
      "• Implemented database design and optimization techniques",
    ],
    certifications: [
      "Deloitte Technology Virtual Experience Program - Forage",
      "• Completed software engineering simulation",
      "• Gained experience in agile development methodologies",
      "",
      "AWS Cloud Practitioner (In Progress)",
      "Java SE 8 Programmer Certification (Planned)",
      "Selenium WebDriver Certification",
    ],
    contact: {
      email: "jaisuntbiji890@gmail.com",
      phone: "+91 99479 22453",
      github: "https://github.com/Jaisuntbiji",
      linkedin: "https://linkedin.com/in/jaisun-t-biji",
    },
  };

  // Available commands
  const commands = {
    help: () => [
      "Available commands:",
      "about         - Summary and career focus",
      "education     - Academic background and grades",
      "skills        - Technical languages, tools, and frameworks",
      "projects      - Overview of major projects (OpenTable, Tumor Detection)",
      "experience    - Internships and simulations",
      "contact       - Contact info (email, phone, LinkedIn)",
      "certifications- Certifications or simulations (like Deloitte Forage)",
      "clear         - Clears the terminal",
      "help          - Lists all commands",
      "",
      "Type any command to continue...",
    ],
    about: () => portfolioData.about,
    education: () => portfolioData.education,
    skills: () => portfolioData.skills,
    projects: () => {
      const output: string[] = [];
      portfolioData.projects.forEach((project, index) => {
        output.push(`${index + 1}. ${project.name}`);
        output.push(`   ${project.description}`);
        output.push(`   Tech Stack: ${project.tech}`);
        output.push(`   Key Features: ${project.features}`);
        output.push("");
      });
      return output;
    },
    experience: () => portfolioData.experience,
    contact: () => [
      `Email: ${portfolioData.contact.email}`,
      `Phone: ${portfolioData.contact.phone}`,
      `GitHub: ${portfolioData.contact.github}`,
      `LinkedIn: ${portfolioData.contact.linkedin}`,
      "",
      "Feel free to reach out for collaboration opportunities!",
    ],
    certifications: () => portfolioData.certifications,
    clear: () => {
      setHistory([]);
      return [];
    },
    welcome: () => [
      `Welcome to ${portfolioData.name}'s interactive portfolio terminal!`,
      "",
      "I'm a passionate software engineer specializing in Java development",
      "and quality engineering. This terminal interface showcases my",
      "technical skills and projects in an interactive way.",
      "",
      "Type 'help' to see available commands or explore my background",
      "using commands like 'about', 'skills', 'projects', or 'experience'.",
      "",
      "Let's connect and build something amazing together!",
    ],
  };

  const processCommand = (cmd: string): string[] => {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (commands[trimmedCmd as keyof typeof commands]) {
      return commands[trimmedCmd as keyof typeof commands]();
    }
    return [
      `bash: ${cmd}: command not found`,
      "Type 'help' to see available commands",
    ];
  };

  // Typing animation effect
  useEffect(() => {
    if (history.length === 0) return;

    const lastCommand = history[history.length - 1];
    if (!lastCommand.isTyping) return;

    const typingSpeed = 30; // milliseconds per character
    const lineDelay = 100; // delay between lines

    const timer = setTimeout(
      () => {
        setHistory((prev) => {
          const newHistory = [...prev];
          const currentCommand = newHistory[newHistory.length - 1];

          if (!currentCommand.isTyping) return prev;

          const currentLineIndex = currentCommand.currentLineIndex || 0;
          const currentCharIndex = currentCommand.currentCharIndex || 0;
          const currentLine = currentCommand.output[currentLineIndex] || "";

          if (currentCharIndex < currentLine.length) {
            // Continue typing current line
            currentCommand.currentCharIndex = currentCharIndex + 1;
          } else if (currentLineIndex < currentCommand.output.length - 1) {
            // Move to next line
            currentCommand.currentLineIndex = currentLineIndex + 1;
            currentCommand.currentCharIndex = 0;
          } else {
            // Finished typing
            currentCommand.isTyping = false;
            delete currentCommand.currentLineIndex;
            delete currentCommand.currentCharIndex;
            setIsProcessing(false);
          }

          return newHistory;
        });
      },
      (lastCommand.currentCharIndex || 0) === 0 &&
        (lastCommand.currentLineIndex || 0) > 0
        ? lineDelay
        : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const output = processCommand(input);
    const newCommand: Command = {
      command: input,
      output,
      timestamp: new Date().toLocaleTimeString(),
      isTyping: input.trim().toLowerCase() !== "clear",
      currentLineIndex: 0,
      currentCharIndex: 0,
    };

    if (input.trim().toLowerCase() !== "clear") {
      setHistory((prev) => [...prev, newCommand]);
      setIsProcessing(true);
    }
    setInput("");
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isProcessing) {
      e.preventDefault();
      return;
    }

    if (e.key === "ArrowUp" && history.length > 0) {
      e.preventDefault();
      const newIndex =
        historyIndex === -1
          ? history.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex].command);
    } else if (e.key === "ArrowDown" && historyIndex !== -1) {
      e.preventDefault();
      const newIndex =
        historyIndex === history.length - 1 ? -1 : historyIndex + 1;
      setHistoryIndex(newIndex);
      setInput(newIndex === -1 ? "" : history[newIndex].command);
    }
  };

  const handleLike = () => {
    setLikes((prev) => prev + 1);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    // Initial welcome message
    const welcomeCommand: Command = {
      command: "welcome",
      output: commands.welcome(),
      timestamp: new Date().toLocaleTimeString(),
      isTyping: true,
      currentLineIndex: 0,
      currentCharIndex: 0,
    };
    setHistory([welcomeCommand]);
    setIsProcessing(true);
  }, []);

  // Function to get displayed text for typing animation
  const getDisplayedOutput = (cmd: Command): string[] => {
    if (!cmd.isTyping) return cmd.output;

    const currentLineIndex = cmd.currentLineIndex || 0;
    const currentCharIndex = cmd.currentCharIndex || 0;

    const displayedLines = cmd.output.slice(0, currentLineIndex);
    if (currentLineIndex < cmd.output.length) {
      const currentLine = cmd.output[currentLineIndex];
      displayedLines.push(currentLine.substring(0, currentCharIndex));
    }

    return displayedLines;
  };

  return (
    <div className="min-h-screen bg-black text-green-400 flex">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-black to-purple-900/20"></div>

      {/* Left Panel - ID Card */}
      <div className="w-1/2 flex items-center justify-center relative z-10 p-8">
        <div className="relative">
          {/* Hanging Animation Effect */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="w-1 h-8 bg-gray-600"></div>
            <div className="w-4 h-4 bg-gray-500 rounded-full -mt-2 mx-auto"></div>
          </div>

          {/* ID Card */}
          <div className="bg-gray-900 border-2 border-green-400/50 rounded-lg p-6 w-80 shadow-2xl animate-float">
            {/* Card Header */}
            <div className="text-center mb-4">
              <div className="inline-block bg-green-400/20 border border-green-400/50 rounded px-3 py-1 text-xs text-green-300 mb-3">
                [Interactive 3D Card]
              </div>
            </div>

            {/* Profile Image */}
            <div className="w-32 h-32 mx-auto mb-4 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center overflow-hidden border-2 border-green-400/30">
              <User className="w-20 h-20 text-green-400" />
            </div>

            {/* Profile Info */}
            <div className="text-center space-y-2">
              <h2 className="text-green-400 font-bold text-xl">
                {portfolioData.name}
              </h2>

              {/* Animated Role Text */}
              <div className="h-16 overflow-hidden">
                <div className="animate-pulse text-green-300 text-sm leading-tight">
                  {portfolioData.role}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-1 text-xs text-green-300">
                <div className="flex items-center justify-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{portfolioData.location}</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <Mail className="w-3 h-3" />
                  <span>{portfolioData.contact.email}</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>{portfolioData.contact.phone}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-4 pt-3">
                <a
                  href={portfolioData.contact.github}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={portfolioData.contact.linkedin}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Terminal */}
      <div className="w-1/2 flex flex-col relative z-10">
        {/* Terminal Header */}
        <div className="bg-gray-900/90 border-b border-green-400/30 px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-green-400 text-sm font-mono">
              jaisun@portfolio: ~
            </span>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="flex-1 flex flex-col p-4">
          <div
            ref={terminalRef}
            className="flex-1 overflow-y-auto font-mono text-sm space-y-1"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Command History */}
            {history.map((cmd, index) => (
              <div key={index} className="space-y-1 mb-4">
                {cmd.command && cmd.command !== "welcome" && (
                  <div className="flex items-center">
                    <span className="text-blue-400 mr-2">
                      jaisun@portfolio:~$
                    </span>
                    <span className="text-white">{cmd.command}</span>
                  </div>
                )}
                {getDisplayedOutput(cmd).map((line, lineIndex) => (
                  <div key={lineIndex} className="text-white pl-0">
                    {line}
                    {cmd.isTyping &&
                      lineIndex === getDisplayedOutput(cmd).length - 1 && (
                        <span className="animate-pulse">█</span>
                      )}
                  </div>
                ))}
              </div>
            ))}

            {/* Input Line */}
            <form onSubmit={handleSubmit} className="flex items-center mt-2">
              <span className="text-blue-400 mr-2">jaisun@portfolio:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-white outline-none font-mono caret-green-400"
                autoFocus
                disabled={isProcessing}
              />
              {!isProcessing && (
                <span className="text-blue-400 animate-pulse ml-1">█</span>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Like Button */}
      <div className="absolute right-8 top-8 z-20">
        <button
          onClick={handleLike}
          className="flex flex-col items-center space-y-1 bg-gray-900/90 backdrop-blur-sm border border-green-400/30 rounded-lg p-3 hover:bg-gray-800/90 transition-colors"
        >
          <Heart className="w-6 h-6 text-green-400 hover:text-red-400 transition-colors" />
          <span className="text-green-400 font-bold text-sm">
            {likes.toLocaleString()}
          </span>
        </button>
      </div>
    </div>
  );
};

export default App;
