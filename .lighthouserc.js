// Config for the Lighthouse CI GitHub Action (.github/workflows/lighthouse.yml).
//
// The workflow audits the already-deployed Vercel URL (URLs are passed in by
// the action), so we do NOT start a local server here.
//
// Vercel preview/deployment URLs sit behind Deployment Protection, which
// redirects unauthenticated requests to vercel.com/login — so without a bypass
// Lighthouse ends up measuring the login page, not the site. We use Vercel's
// "Protection Bypass for Automation": a per-project secret sent as the
// `x-vercel-protection-bypass` header so the protected deployment serves the
// real page. See:
// https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation
//
// Setup (one time):
//   1. Vercel → Project → Settings → Deployment Protection → Protection Bypass
//      for Automation → generate a secret.
//   2. Add it as a GitHub Actions secret named VERCEL_AUTOMATION_BYPASS_SECRET
//      (the workflow passes it through to this config as an env var).
// Until the secret exists the audit still runs, but against the login page.
//
// Audits are informational only (the workflow step is continue-on-error), so
// assertions are warnings and never red-flag the PR.

const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

const collect = {
  numberOfRuns: 3,
};

if (bypassSecret) {
  collect.settings = {
    // Sent on every Lighthouse request, so the protected deployment serves the
    // real page instead of redirecting to the Vercel login screen.
    // `x-vercel-set-bypass-cookie: true` also stores the bypass as a cookie so
    // in-page navigations stay authenticated.
    extraHeaders: {
      'x-vercel-protection-bypass': bypassSecret,
      'x-vercel-set-bypass-cookie': 'true',
    },
  };
}

module.exports = {
  ci: {
    collect,
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
