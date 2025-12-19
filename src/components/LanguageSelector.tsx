import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: 'en-IN', label: 'English', flag: '🇬🇧' },
  { code: 'hi-IN', label: 'हिंदी', flag: '🇮🇳' },
];

export function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Languages className="w-4 h-4 text-muted-foreground" />
      <div className="flex rounded-lg overflow-hidden border border-border">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant="ghost"
            size="sm"
            onClick={() => onLanguageChange(lang.code)}
            className={cn(
              "rounded-none px-4 py-2 text-sm font-medium transition-all",
              language === lang.code
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
