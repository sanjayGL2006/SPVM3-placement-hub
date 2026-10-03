// Crisp, self-contained inline SVG Data URIs for company logos to prevent CORS, ORB, and Wikimedia 404 blocks

export const COMPANY_LOGOS: Record<string, string> = {
  Google: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  `)}`,

  Microsoft: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
      <rect x="4" y="4" width="18" height="18" fill="#F25022"/>
      <rect x="26" y="4" width="18" height="18" fill="#7FBA00"/>
      <rect x="4" y="26" width="18" height="18" fill="#00A4EF"/>
      <rect x="26" y="26" width="18" height="18" fill="#FFB900"/>
    </svg>
  `)}`,

  Amazon: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <text x="5" y="25" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#131921">amazon</text>
      <path d="M12 30 Q50 42 88 28" stroke="#FF9900" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M84 25 L89 28 L85 33" fill="#FF9900"/>
    </svg>
  `)}`,

  Deloitte: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 36" width="120" height="36">
      <text x="5" y="26" font-family="'Helvetica Neue', Arial, sans-serif" font-size="22" font-weight="900" fill="#000000" letter-spacing="-0.5">Deloitte</text>
      <circle cx="106" cy="23" r="3.5" fill="#86BC25"/>
    </svg>
  `)}`,

  GoldmanSachs: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <rect width="100" height="40" rx="6" fill="#7399C6"/>
      <text x="50%" y="38%" font-family="Georgia, serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">Goldman</text>
      <text x="50%" y="68%" font-family="Georgia, serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">Sachs</text>
    </svg>
  `)}`,

  TCS: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <text x="50%" y="38%" font-family="Arial, sans-serif" font-size="11" font-weight="900" fill="#003366" text-anchor="middle" letter-spacing="2">TATA</text>
      <text x="50%" y="72%" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#666666" text-anchor="middle">CONSULTANCY</text>
    </svg>
  `)}`,

  Infosys: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 36" width="100" height="36">
      <text x="50%" y="60%" font-family="'Segoe UI', Arial, sans-serif" font-size="20" font-weight="bold" fill="#007CC3" text-anchor="middle">Infosys</text>
    </svg>
  `)}`,

  HDFC: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <rect x="5" y="6" width="28" height="28" fill="#004C8F" rx="3"/>
      <rect x="12" y="13" width="14" height="14" fill="#ED1C24"/>
      <rect x="16" y="17" width="6" height="6" fill="#FFFFFF"/>
      <text x="38" y="25" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#004C8F">HDFC</text>
    </svg>
  `)}`,

  Marriott: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <circle cx="20" cy="20" r="14" fill="#8A1538"/>
      <text x="20" y="26" font-family="Georgia, serif" font-size="18" font-weight="bold" fill="#FFFFFF" text-anchor="middle">M</text>
      <text x="40" y="24" font-family="'Times New Roman', serif" font-size="12" font-weight="bold" fill="#8A1538" letter-spacing="1">MARRIOTT</text>
    </svg>
  `)}`,

  TajHotels: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <rect width="100" height="40" rx="6" fill="#1C2833"/>
      <text x="50%" y="42%" font-family="Cinzel, Georgia, serif" font-size="13" font-weight="bold" fill="#D4AF37" text-anchor="middle" letter-spacing="3">TAJ</text>
      <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#C5A059" text-anchor="middle" letter-spacing="1">HOTELS & RESORTS</text>
    </svg>
  `)}`,

  Accenture: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 36" width="100" height="36">
      <text x="10" y="24" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#000000">accenture</text>
      <path d="M82 14 L89 19 L82 24" fill="none" stroke="#A100FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `)}`,

  KPMG: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <rect width="100" height="40" rx="6" fill="#00338D"/>
      <text x="50%" y="62%" font-family="Arial, sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">KPMG</text>
    </svg>
  `)}`,

  Cisco: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <rect width="100" height="40" rx="6" fill="#049FD9"/>
      <text x="50%" y="62%" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">CISCO</text>
    </svg>
  `)}`,

  Adobe: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <rect width="100" height="40" rx="6" fill="#FA0F00"/>
      <text x="50%" y="62%" font-family="Arial, sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">Adobe</text>
    </svg>
  `)}`,

  IBM: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <rect width="100" height="40" rx="6" fill="#052FAD"/>
      <text x="50%" y="65%" font-family="'Courier New', monospace" font-size="22" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">IBM</text>
    </svg>
  `)}`,

  Oracle: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <rect width="100" height="40" rx="6" fill="#C74634"/>
      <text x="50%" y="62%" font-family="Arial, sans-serif" font-size="15" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">ORACLE</text>
    </svg>
  `)}`,

  Wipro: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <rect width="100" height="40" rx="6" fill="#4B0082"/>
      <text x="50%" y="62%" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">wipro</text>
    </svg>
  `)}`,

  Capgemini: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <rect width="100" height="40" rx="6" fill="#0070AD"/>
      <text x="50%" y="62%" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Capgemini</text>
    </svg>
  `)}`,

  Cognizant: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <rect width="100" height="40" rx="6" fill="#0033A0"/>
      <text x="50%" y="62%" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="middle">cognizant</text>
    </svg>
  `)}`,

  JPMorgan: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <rect width="100" height="40" rx="6" fill="#117ACA"/>
      <text x="50%" y="42%" font-family="Georgia, serif" font-size="10" font-weight="bold" fill="#FFFFFF" text-anchor="middle">J.P. Morgan</text>
      <text x="50%" y="72%" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#FFFFFF" text-anchor="middle">CHASE & CO.</text>
    </svg>
  `)}`,

  Apple: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
      <rect width="48" height="48" rx="10" fill="#000000"/>
      <path d="M24 13c0-2.2 1.8-4 4-4 .2 0 .4 0 .6.1-.2 2.2-2 4-4.2 4-.1 0-.2-.1-.4-.1zm6.5 13.8c-.1-3.6 3-5.3 3.1-5.4-1.7-2.5-4.4-2.8-5.3-2.9-2.3-.2-4.4 1.3-5.6 1.3-1.1 0-2.9-1.3-4.8-1.3-2.5 0-4.8 1.4-6 3.6-2.6 4.4-.7 11 1.8 14.6 1.2 1.8 2.7 3.7 4.6 3.6 1.9-.1 2.6-1.2 4.9-1.2 2.2 0 2.9 1.2 4.9 1.2 2 0 3.3-1.8 4.5-3.6 1.4-2.1 2-4.1 2-4.2-.1-.1-4-1.5-4.2-5.7z" fill="#FFFFFF"/>
    </svg>
  `)}`,

  Meta: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <rect width="100" height="40" rx="6" fill="#0668E1"/>
      <text x="50%" y="62%" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">Meta</text>
    </svg>
  `)}`,

  Netflix: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <rect width="100" height="40" rx="6" fill="#141414"/>
      <text x="50%" y="64%" font-family="Arial, sans-serif" font-size="18" font-weight="900" fill="#E50914" text-anchor="middle" letter-spacing="1">NETFLIX</text>
    </svg>
  `)}`,

  Uber: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <rect width="100" height="40" rx="6" fill="#000000"/>
      <text x="50%" y="62%" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">Uber</text>
    </svg>
  `)}`,

  Default: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
      <rect width="100" height="40" rx="8" fill="#1E293B"/>
      <path d="M16 28V12h12v16H16zm4-12h4v8h-4v-8zm16-4h12v16H36V12zm4 4h4v8h-4v-8z" fill="#94A3B8"/>
      <text x="58" y="25" font-family="sans-serif" font-size="12" font-weight="700" fill="#F8FAFC">CORP</text>
    </svg>
  `)}`,
};

/**
 * Generate a deterministic stylish SVG logo data URI for any company
 */
export function generateDynamicLogo(name: string): string {
  const clean = (name || 'Company').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const initials = words.length >= 2 
    ? (words[0][0] + words[1][0]).toUpperCase()
    : clean.substring(0, 2).toUpperCase();

  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = clean.charCodeAt(i) + ((hash << 5) - hash);
  }

  const palettes = [
    { bg1: '#4F46E5', bg2: '#7C3AED', text: '#FFFFFF' }, // Indigo-Purple
    { bg1: '#2563EB', bg2: '#06B6D4', text: '#FFFFFF' }, // Blue-Cyan
    { bg1: '#059669', bg2: '#10B981', text: '#FFFFFF' }, // Emerald-Green
    { bg1: '#D97706', bg2: '#F59E0B', text: '#FFFFFF' }, // Amber-Orange
    { bg1: '#DC2626', bg2: '#F43F5E', text: '#FFFFFF' }, // Rose-Red
    { bg1: '#7C2D12', bg2: '#EA580C', text: '#FFFFFF' }, // Copper
    { bg1: '#0F172A', bg2: '#334155', text: '#FFFFFF' }, // Slate-Dark
    { bg1: '#0284C7', bg2: '#38BDF8', text: '#FFFFFF' }, // Sky
  ];

  const palette = palettes[Math.abs(hash) % palettes.length];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="g_${Math.abs(hash)}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette.bg1}"/>
          <stop offset="100%" stop-color="${palette.bg2}"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill="url(#g_${Math.abs(hash)})"/>
      <text x="50%" y="54%" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="800" fill="${palette.text}" text-anchor="middle" dominant-baseline="middle" letter-spacing="1">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

/**
 * Resolves a safe, self-contained company logo SVG data URI.
 * Automatically eliminates 404s, CORS issues, and Wikimedia link breaks.
 */
export function getCompanyLogo(name: string, customLogo?: string): string {
  // If customLogo is an inline data URI, use it directly
  if (customLogo && customLogo.startsWith('data:image/')) {
    return customLogo;
  }

  // Reject wikimedia, wikipedia, or broken external URLs
  if (
    customLogo &&
    !customLogo.includes('wikimedia.org') &&
    !customLogo.includes('wikipedia.org') &&
    (customLogo.startsWith('http://') || customLogo.startsWith('https://'))
  ) {
    return customLogo;
  }

  const raw = (name || '').toLowerCase();
  const clean = raw.replace(/[^a-z0-9]/g, '');

  if (clean.includes('google')) return COMPANY_LOGOS.Google;
  if (clean.includes('microsoft')) return COMPANY_LOGOS.Microsoft;
  if (clean.includes('amazon') || clean.includes('aws')) return COMPANY_LOGOS.Amazon;
  if (clean.includes('deloitte')) return COMPANY_LOGOS.Deloitte;
  if (clean.includes('goldman') || clean.includes('sachs')) return COMPANY_LOGOS.GoldmanSachs;
  if (clean.includes('tata') || clean.includes('tcs') || clean.includes('tataconsultancy')) return COMPANY_LOGOS.TCS;
  if (clean.includes('infosys')) return COMPANY_LOGOS.Infosys;
  if (clean.includes('hdfc')) return COMPANY_LOGOS.HDFC;
  if (clean.includes('marriott')) return COMPANY_LOGOS.Marriott;
  if (clean.includes('taj') || clean.includes('ihcl')) return COMPANY_LOGOS.TajHotels;
  if (clean.includes('accenture')) return COMPANY_LOGOS.Accenture;
  if (clean.includes('kpmg')) return COMPANY_LOGOS.KPMG;
  if (clean.includes('cisco')) return COMPANY_LOGOS.Cisco;
  if (clean.includes('adobe')) return COMPANY_LOGOS.Adobe;
  if (clean.includes('ibm')) return COMPANY_LOGOS.IBM;
  if (clean.includes('oracle')) return COMPANY_LOGOS.Oracle;
  if (clean.includes('wipro')) return COMPANY_LOGOS.Wipro;
  if (clean.includes('capgemini')) return COMPANY_LOGOS.Capgemini;
  if (clean.includes('cognizant') || clean.includes('cts')) return COMPANY_LOGOS.Cognizant;
  if (clean.includes('jpmorgan') || (clean.includes('jp') && clean.includes('morgan'))) return COMPANY_LOGOS.JPMorgan;
  if (clean.includes('apple')) return COMPANY_LOGOS.Apple;
  if (clean.includes('netflix')) return COMPANY_LOGOS.Netflix;
  if (clean.includes('meta') || clean.includes('facebook')) return COMPANY_LOGOS.Meta;
  if (clean.includes('uber')) return COMPANY_LOGOS.Uber;

  // Generate dynamic branded SVG logo if not matched to specific brand
  return generateDynamicLogo(name || 'Enterprise');
}
