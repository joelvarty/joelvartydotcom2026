// Config for the Lighthouse CI GitHub Action (.github/workflows/lighthouse.yml).
//
// The workflow audits the already-deployed Vercel URL, passing the URLs to the
// action via `github.event.deployment_status.target_url`. We therefore must NOT
// start a local server here: a previous `startServerCommand: 'npm run start'`
// made LHCI try to boot `next start` on the runner (which has no build), failing
// with "next: not found" before any audit ran.
//
// Audits are informational only (the workflow step is continue-on-error), so
// assertions are warnings rather than hard failures and never red-flag the PR.
module.exports = {
  ci: {
    collect: {
      // URLs are supplied by the action; no local server is started.
      numberOfRuns: 3,
    },
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
