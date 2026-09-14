import glob
import os
import re

PORTALS = {
    'admin': {
        'primary_light': '#7C1D2E',
        'secondary_light': '#D4A017',
        'primary_dark': '#A93B4E',
        'secondary_dark': '#EFC849'
    },
    'municipality': {
        'primary_light': '#1B3A6B',
        'secondary_light': '#E8750A',
        'primary_dark': '#6D9DDF',
        'secondary_dark': '#F0A55D'
    },
    'contractor': {
        'primary_light': '#2D4A6B',
        'secondary_light': '#D97706',
        'primary_dark': '#5D7C9F',
        'secondary_dark': '#FBBF24'
    },
    'public': {
        'primary_light': '#0E766E',
        'secondary_light': '#E8750A',
        'primary_dark': '#4CB5A2',
        'secondary_dark': '#E0A25B'
    }
}

base_root_template = """
:root {{
  /* FOUNDATION */
  --font-sans: "Inter", "Noto Sans Devanagari", "Noto Sans Gujarati", system-ui;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;

  /* SPACING SCALE */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;

  /* TYPOGRAPHY SCALE */
  --text-xs: 0.75rem / 1rem;
  --text-sm: 0.875rem / 1.25rem;
  --text-base: 1rem / 1.5rem;
  --text-lg: 1.125rem / 1.75rem;
  --text-xl: 1.25rem / 1.75rem;
  --text-2xl: 1.5rem / 2rem;
  --text-3xl: 1.875rem / 2.25rem;

  /* RADIUS */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --radius-full: 9999px;
  --radius: 0.85rem; /* fallback */

  /* SEMANTIC COLORS */
  --critical: #C41E3A;
  --warning: #B45309;
  --success: #166534;
  --info: #1E40AF;
  --destructive: #C41E3A;
  --destructive-foreground: #FFFFFF;

  /* PORTAL IDENTITY LIGHT */
  --primary: {primary_light};
  --primary-foreground: #FFFFFF;
  --secondary: {secondary_light};
  --secondary-foreground: #FFFFFF;
  --accent: {secondary_light};
  --accent-foreground: #FFFFFF;

  --background: #F8F9FA;
  --background-secondary: #F1F3F5;
  --foreground: #111827;
  --card-foreground: #111827;
  --popover-foreground: #111827;
  
  --surface: #FFFFFF;
  --surface-elevated: #FFFFFF;
  --card: #FFFFFF;
  --popover: #FFFFFF;
  --glass: rgba(255, 255, 255, 0.95);
  --glass-strong: rgba(255, 255, 255, 0.98);
  --glass-border: rgba(0, 0, 0, 0.08);
  
  --border: rgba(0, 0, 0, 0.1);
  --input: rgba(0, 0, 0, 0.15);
  --ring: {primary_light};

  --muted: #F3F4F6;
  --muted-foreground: #6B7280;
  --subtle-foreground: #9CA3AF;
  
  --civic-city-accent: {primary_light};
  --civic-paper: #FFFFFF;
}}
"""

base_dark_template = """
.dark {{
  /* PORTAL IDENTITY DARK */
  --primary: {primary_dark};
  --primary-foreground: #0B1230;
  --secondary: {secondary_dark};
  --secondary-foreground: #0B1230;
  --accent: {secondary_dark};
  --accent-foreground: #0B1230;

  --background: #0F172A;
  --background-secondary: #1E293B;
  --foreground: #F8FAFC;
  --card-foreground: #F8FAFC;
  --popover-foreground: #F8FAFC;
  
  --surface: #1E293B;
  --surface-elevated: #334155;
  --card: #1E293B;
  --popover: #1E293B;
  --glass: rgba(15, 23, 42, 0.95);
  --glass-strong: rgba(15, 23, 42, 0.98);
  --glass-border: rgba(255, 255, 255, 0.1);
  
  --border: rgba(255, 255, 255, 0.15);
  --input: rgba(255, 255, 255, 0.2);
  --ring: {primary_dark};

  --muted: #334155;
  --muted-foreground: #94A3B8;
  --subtle-foreground: #64748B;

  --critical: #F87171;
  --warning: #FBBF24;
  --success: #4ADE80;
  --info: #60A5FA;
  --destructive: #F87171;
  --destructive-foreground: #FFFFFF;
  
  --civic-city-accent: {primary_dark};
  --civic-paper: #0F172A;
}}
"""

css_files = glob.glob('apps/*/src/styles.css')

for file in css_files:
    app_name = os.path.basename(os.path.dirname(os.path.dirname(file)))
    if app_name not in PORTALS:
        continue
        
    portal_config = PORTALS[app_name]
    
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    def remove_blocks(text, start_pattern):
        while True:
            match = re.search(start_pattern, text)
            if not match:
                break
            start_idx = match.start()
            
            brace_idx = text.find('{', start_idx)
            if brace_idx == -1:
                break
                
            open_braces = 1
            curr_idx = brace_idx + 1
            while open_braces > 0 and curr_idx < len(text):
                if text[curr_idx] == '{':
                    open_braces += 1
                elif text[curr_idx] == '}':
                    open_braces -= 1
                curr_idx += 1
                
            text = text[:start_idx] + text[curr_idx:]
        return text
        
    content = remove_blocks(content, r':root\s*\{')
    content = remove_blocks(content, r'\.dark\s*\{')
    
    new_root = base_root_template.format(**portal_config)
    new_dark = base_dark_template.format(**portal_config)
    
    theme_idx = content.find('@theme inline')
    if theme_idx != -1:
        brace_idx = content.find('{', theme_idx)
        open_braces = 1
        curr_idx = brace_idx + 1
        while open_braces > 0 and curr_idx < len(content):
            if content[curr_idx] == '{':
                open_braces += 1
            elif content[curr_idx] == '}':
                open_braces -= 1
            curr_idx += 1
        
        content = content[:curr_idx] + "\n\n/* --- NEW INJECTED CSS TOKENS --- */\n" + new_root + "\n" + new_dark + "\n" + content[curr_idx:]
    else:
        content = new_root + "\n" + new_dark + "\n" + content
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f'Updated {file}')

