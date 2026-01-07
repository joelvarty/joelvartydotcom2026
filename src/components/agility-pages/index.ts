import Main from "./Main"

export const getPageTemplate = (templateName: string) => {
	switch (templateName) {
		case "Main":
			return Main
		default:
			return Main
	}
}

