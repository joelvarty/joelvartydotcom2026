import MainTemplate from "./MainTemplate"

export const getPageTemplate = (templateName: string) => {
	switch (templateName) {
		case "MainTemplate":
			return MainTemplate
		default:
			return MainTemplate
	}
}

