/**
 * MainTemplate Component
 *
 * The default page template for Agility CMS pages. This template defines
 * the main content zone where modules can be added and rendered.
 *
 * The ContentZone component handles the rendering of all modules added to
 * the "main-content-zone" in Agility CMS, using the getModule function to
 * map module names to their corresponding React components.
 */

import React from "react"
import { ContentZone } from "@agility/nextjs"
import { getModule } from "../agility-components"

/**
 * MainTemplate Component
 *
 * Renders the main content zone for an Agility CMS page.
 *
 * @param props - Agility CMS page props including page data, sitemap, etc.
 * @returns A ContentZone component that renders all modules in the main-content-zone
 *
 * @remarks
 * - The ContentZone name "main-content-zone" must match the zone name in Agility CMS
 * - The getModule function is used to resolve module components by their reference name
 * - All props are spread to the ContentZone for proper context passing
 */
const MainTemplate = (props: any) => {
	return (
		<ContentZone name="main-content-zone" {...props} getModule={getModule} />
	)
}

export default MainTemplate

