# QOZYD

Immersive React / Next.js website for QOZYD: marketing, automation, web experiences, and trademark support. Includes GSAP scroll motion, React Bits Web Threads and Accordion Gallery, and a Three.js blood-moon pendant.

## Local development

Use Node.js 24 and npm:

```sh
npm ci
npm run dev
```

## Verification

```sh
npm test
npm run typecheck
npm run lint
npm run build
npm start
```

## Deploy on Vercel

1. Import the private `AstroDrip/Qozydv1` repository into Vercel. Grant Vercel access to this repository if prompted.
2. Use the repository root as the Root Directory and **Next.js** as the framework.
3. The committed `vercel.json` configures `npm ci` and `npm run build`. Leave Output Directory at its framework default.
4. Use Node.js **24.x**. No environment variables are required.
5. Deploy. Later pushes to the production branch will deploy automatically when the Git integration is connected.

The site now uses native Next.js, not the earlier Vinext/Cloudflare starter. The retained `.openai/hosting.json` is historical metadata and is not loaded by the application or Vercel build. Do not configure a Cloudflare Worker or a `dist` output override for this deployment.

Contact actions remain deferred. Gallery entries are labelled concept projects rather than client commissions. `HANDOFF.md` records the original brief and references; its implementation status predates subsequent hardening and this Vercel migration.
