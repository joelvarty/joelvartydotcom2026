/**
 * Agility CMS Module Components
 *
 * This file exports a getModule function that maps Agility CMS module names
 * to their corresponding React components. When a module is rendered in a
 * ContentZone, this function is called to retrieve the appropriate component.
 *
 * To add a new module component:
 * 1. Create a new component file in this directory (e.g., MyComponent.tsx)
 * 2. Import it at the top of this file
 * 3. Add a case in the switch statement below with the module's reference name
 */

import RichTextArea from "./RichTextArea"

/**
 * Returns the React component for a given Agility CMS module name.
 *
 * @param moduleName - The reference name of the module as defined in Agility CMS
 * @returns The React component for the module, or null if not found
 */
export const getModule = (moduleName: string) => {
	switch (moduleName) {
		case "RichTextArea":
			return RichTextArea
		default:
			return null
	}
}

