import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Github, Menu, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { useSearchState } from "@/hooks/useSearchState";
import { SearchBar } from "./SearchBar";

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "rounded-[7px] px-3 py-2 text-[13.5px] font-medium transition-colors",
        active ? "text-foreground" : "text-[hsl(212_11%_60%)] hover:text-foreground/80",
      )}
    >
      {label}
    </Link>
  );
}

export function TopNav() {
  const { query, setQuery, mode, setMode } = useSearchState();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const onSearch = (value: string): void => {
    setQuery(value);
    if (pathname !== "/") navigate("/");
  };

  const goToSubmit = (): void => {
    setMenuOpen(false);
    navigate("/docs");
    setTimeout(() => toast.success("Submit a skill via PR — see Publish below"), 50);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[hsl(215_15%_15%)] bg-[hsl(216_28%_7%/.82)] backdrop-blur-[14px]">
      <div className="flex h-[60px] items-center gap-3 px-4 sm:gap-[18px] sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-[10px]">
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-primary shadow-[0_2px_10px_hsl(33_90%_55%/.35)]">
            <Zap className="h-4 w-4 fill-black text-black" strokeWidth={2.4} />
          </span>
          <span className="hidden font-heading text-[22px] font-bold uppercase leading-none tracking-[.04em] text-foreground sm:inline">
            Forge
          </span>
        </Link>

        <SearchBar value={query} onChange={onSearch} mode={mode} onModeChange={setMode} />

        <div className="ml-auto hidden items-center gap-1 md:flex">
          <NavLink to="/" label="Browse" active={pathname === "/"} />
          <NavLink to="/docs" label="Docs" active={pathname === "/docs"} />
          <button
            type="button"
            onClick={goToSubmit}
            className="rounded-[7px] px-3 py-2 text-[13.5px] font-medium text-[hsl(212_11%_60%)] transition-colors hover:text-foreground/80"
          >
            Submit
          </button>
        </div>

        <button
          type="button"
          onClick={() => toast("Sign-in isn't available yet — coming soon")}
          className="hidden items-center gap-2 rounded-lg border border-[hsl(215_15%_19%)] px-[13px] py-2 text-[13px] font-medium text-foreground/85 transition-colors hover:border-[hsl(215_15%_28%)] hover:bg-[hsl(215_18%_13%)] md:flex"
        >
          <Github className="h-[15px] w-[15px]" />
          Sign in
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[hsl(215_15%_19%)] text-foreground/85 transition-colors hover:bg-[hsl(215_18%_13%)] md:hidden"
        >
          {menuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-[hsl(215_15%_15%)] px-4 py-3 md:hidden">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="rounded-[7px] px-3 py-2 text-[14px] font-medium text-foreground/85 hover:bg-[hsl(215_18%_13%)]"
          >
            Browse
          </Link>
          <Link
            to="/docs"
            onClick={() => setMenuOpen(false)}
            className="rounded-[7px] px-3 py-2 text-[14px] font-medium text-foreground/85 hover:bg-[hsl(215_18%_13%)]"
          >
            Docs
          </Link>
          <button
            type="button"
            onClick={goToSubmit}
            className="rounded-[7px] px-3 py-2 text-left text-[14px] font-medium text-foreground/85 hover:bg-[hsl(215_18%_13%)]"
          >
            Submit
          </button>
        </div>
      )}
    </nav>
  );
}
