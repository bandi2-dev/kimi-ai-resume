import { Link } from "react-router";
import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Templates", "Changelog"],
  Resources: ["Blog", "Guides", "API Docs", "Support"],
  Company: ["About", "Careers", "Privacy", "Terms"],
};

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-xl font-bold orbit-gradient-text">Orbit</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              AI-powered resume optimization that helps you land your dream job.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Orbit. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with AI precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
