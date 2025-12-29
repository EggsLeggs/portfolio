import { useEffect, useState, useRef } from 'react';
import { config } from '@/lib/loadConfig';
import { GithubLogo, LinkedinLogo, EnvelopeSimple, Calendar } from '@phosphor-icons/react';

export function Sidebar() {
  const [activeSection, setActiveSection] = useState('about');
  const isScrollingRef = useRef(false);

  // Handle initial hash on page load
  useEffect(() => {
    const handleInitialHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          // Small delay to ensure page is fully loaded
          setTimeout(() => {
            isScrollingRef.current = true;
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(id);
            // Reset flag after scroll completes
            setTimeout(() => {
              isScrollingRef.current = false;
            }, 1000);
          }, 100);
        }
      } else {
        // Set initial active section based on scroll position
        const sections = config.navigation.map(nav => nav.href.replace('#', ''));
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 200) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    handleInitialHash();
  }, []);

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      // Don't update hash during programmatic scrolling
      if (isScrollingRef.current) return;

      const sections = config.navigation.map(nav =>
        nav.href.replace('#', '')
      );

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            // Update URL hash without triggering scroll
            if (window.location.hash !== `#${section}`) {
              window.history.replaceState(null, '', `#${section}`);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash changes from browser navigation (back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          isScrollingRef.current = true;
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveSection(id);
          // Reset flag after scroll completes
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 1000);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const scrollToSection = (href: string) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      // Update URL hash
      window.history.pushState(null, '', href);
      // Set flag to prevent hash updates during scroll
      isScrollingRef.current = true;
      // Scroll to section (scroll-mt classes will be respected automatically)
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
      // Reset flag after scroll completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:w-1/2 lg:flex-col lg:py-24 lg:pr-4 lg:max-h-screen lg:overflow-y-auto">
      <div className="lg:pb-12">
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
              {config.name}
            </h1>
            {config.suffixes && config.suffixes.length > 0 && (
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {config.suffixes.join(', ')}
              </span>
            )}
          </div>
          <h2 className="text-lg font-medium tracking-tight text-slate-300 sm:text-xl">
            {config.title}
          </h2>
          <p className="text-sm leading-relaxed text-slate-400">
            {config.location}
          </p>
        </div>

        <nav className="nav hidden lg:block" aria-label="In-page jump links">
          <ul className="mt-16 w-max">
            {config.navigation.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => scrollToSection(item.href)}
                  className="group flex items-center py-3"
                >
                  <span
                    className={`mr-4 h-px transition-all ${
                      activeSection === item.href.replace('#', '')
                        ? 'w-16 bg-slate-200'
                        : 'w-8 bg-slate-600 group-hover:w-16 group-hover:bg-slate-200'
                    }`}
                  ></span>
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${
                      activeSection === item.href.replace('#', '')
                        ? 'text-slate-200'
                        : 'text-slate-500 group-hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <ul className="ml-1 mt-8 flex items-center" aria-label="Social media">
        {config.social.map((link) => (
          <li key={link.name} className="mr-5 text-xs shrink-0">
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="block hover:text-slate-200"
              aria-label={`${link.name} (opens in a new tab)`}
            >
              <span className="sr-only">{link.name}</span>
              <SocialIcon icon={link.icon} />
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}

function SocialIcon({ icon }: { icon: string }) {
  const iconClass = "text-slate-400 transition-colors group-hover:text-slate-200";

  switch (icon) {
    case 'github':
      return <GithubLogo className={`h-6 w-6 ${iconClass}`} weight="fill" aria-hidden="true" />;
    case 'linkedin':
      return <LinkedinLogo className={`h-6 w-6 ${iconClass}`} weight="fill" aria-hidden="true" />;
    case 'email':
      return <EnvelopeSimple className={`h-6 w-6 ${iconClass}`} weight="fill" aria-hidden="true" />;
    case 'calendar':
      return <Calendar className={`h-6 w-6 ${iconClass}`} weight="fill" aria-hidden="true" />;
    default:
      return null;
  }
}
