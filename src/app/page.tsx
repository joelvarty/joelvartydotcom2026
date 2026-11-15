/**
 * The root page: re-export the catch-all, which resolves an empty slug to the
 * home page. In practice the proxy rewrites / to /{defaultLocale}, so this is
 * only a fallback.
 */
export { generateMetadata } from "./[locale]/[...slug]/page"
export { default } from "./[locale]/[...slug]/page"
