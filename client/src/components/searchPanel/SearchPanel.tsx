import { TextField } from "../ui/textField/TextField";
import { Button } from "../ui/button/Button";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SubjectsType } from "../../api/subjects/subjects.type";

type SearchPanelTypes = {
  isMobile: boolean;
  setSubject: Dispatch<SetStateAction<string>>;
  onSearch: () => void;
  subject: string;
  subjects?: SubjectsType[];
};

export const SearchPanel = ({
  isMobile,
  setSubject,
  onSearch,
  subject,
  subjects,
}: SearchPanelTypes) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const hasSubjects = (subjects?.length ?? 0) > 0;

  const suggestions = useMemo(() => {
    if (!hasSubjects) {
      return [];
    }
    const query = subject.trim().toLowerCase();
    const list = subjects ?? [];
    const filtered = query
      ? list.filter((s) => s.name.toLowerCase().includes(query))
      : list;
    return filtered.slice(0, 4);
  }, [hasSubjects, subjects, subject]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) {
        return;
      }
      if (!wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const pick = (name: string) => {
    setSubject(name);
    setOpen(false);
  };

  return (
    <div
      ref={wrapRef}
      className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 max-w-2xl lg:max-w-3xl mx-auto mb-16 sm:mb-20 lg:mb-24"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block w-155 h-20 bg-[#27222EB3] rounded-[60px] -z-10" />

      <div className="relative w-50 sm:w-75 md:w-100">
        <TextField
          type="search"
          name="site-search"
          id="site-search"
          autoComplete="off"
          containerClassName="w-full"
          placeholder={
            isMobile ? "Search..." : "What language do you want to learn?"
          }
          variant="hero"
          value={subject}
          onValueChange={(value) => {
            setSubject(value);
            if (hasSubjects) {
              setOpen(true);
            }
          }}
          onFocus={() => {
            if (hasSubjects) {
              setOpen(true);
            }
          }}
        />

        {hasSubjects && open && (
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl border border-purple-500 bg-light-100 shadow-[0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden">
            {suggestions.map((s) => (
              <Button
                variant="link"
                key={s.id ?? s.name}
                type="button"
                onClick={() => pick(s.name)}
                className="w-full text-left px-4 py-3 text-bg-main hover:bg-gray-300
                transition-colors rounded-none justify-start
                "
              >
                {s.name}
              </Button>
            ))}
          </div>
        )}
      </div>

      <Button variant="secondary" onClick={onSearch}>
        Search
      </Button>
    </div>
  );
};
