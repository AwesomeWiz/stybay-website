Licensed font files were not supplied. The site currently uses local Satoshi and Eudoxus Sans when available, then Arial. Georgia supplies the editorial italic accent.

To self-host licensed fonts, add Satoshi-Variable.woff2 and EudoxusSans-Variable.woff2 here and replace the two local-only @font-face blocks in app/globals.css with:

@font-face { font-family: Satoshi; src: url('/fonts/Satoshi-Variable.woff2') format('woff2'); font-weight: 100 900; font-display: swap; }
@font-face { font-family: 'Eudoxus Sans'; src: url('/fonts/EudoxusSans-Variable.woff2') format('woff2'); font-weight: 100 900; font-display: swap; }

Use weight ranges supported by your licensed files. No third-party font downloads are required.
