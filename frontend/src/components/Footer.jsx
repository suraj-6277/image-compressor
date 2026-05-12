import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const links = [
  {
    label: "GitHub",
    href: "https://github.com/suraj-6277",
    icon: () => <FaGithub size={16} aria-hidden="true" />,
    ariaLabel: "Open Suraj Jadhav GitHub profile",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/surajadhav7",
    icon: () => <FaLinkedin size={16} aria-hidden="true" />,
    ariaLabel: "Open Suraj Jadhav LinkedIn profile",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:surajjadhav071204@gmail.com",
    icon: () => <Mail size={16} aria-hidden="true" />,
    ariaLabel: "Send email to Suraj Jadhav",
    external: false,
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
      <p>Made by Suraj Jadhav</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {links.map(({ label, href, icon: Icon, ariaLabel, external }) => (
          <a
            key={label}
            href={href}
            aria-label={ariaLabel}
            className="inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-slate-600"
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
          >
            <Icon />
            <span>{label}</span>
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
