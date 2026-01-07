/**
 * The root page - just re-export from the main slug route
 */
export { generateMetadata } from "./[locale]/[...slug]/page"
export { default } from "./[locale]/[...slug]/page"

export const revalidate = 60
export const runtime = "nodejs"

