import { getContentList } from "@/lib/cms/getContentList"
import { localizeUrl } from "@/lib/i18n/localizeUrl"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BlogCategoriesProps {
	languageCode: string
	selectedCategoryID?: number
	containerReferenceName?: string
}

/**
 * Category interface (from Category content model)
 */
interface Category {
	contentID: number
	fields: {
		name: string
		slug: string
		description?: string
	}
}

/**
 * BlogCategories Component
 *
 * Displays a sidebar list of blog categories from Agility CMS.
 * Highlights the currently selected category.
 *
 * @param languageCode - The language code for localized content
 * @param selectedCategoryID - The ID of the currently selected category (if any)
 * @param containerReferenceName - The container reference name for categories (defaults to "Categories")
 */
export async function BlogCategories({
	languageCode,
	selectedCategoryID,
}: BlogCategoriesProps) {
	// Fetch categories from container
	const categoriesResult = await getContentList<Category>({
		referenceName: "categories",
		languageCode,
		sort: "name",
		direction: "asc",
	})

	if (categoriesResult.items.length === 0) {
		return null
	}

	return (
		<aside className="space-y-4">
			<h3 className="text-lg font-semibold text-foreground mb-4">Categories</h3>
			<nav className="space-y-2">
				{/* All Posts link */}
				<Link
					href={localizeUrl("/blog", languageCode)}
					className={cn(
						"block px-4 py-2 rounded-lg text-sm font-medium transition-colors",
						!selectedCategoryID
							? "bg-primary text-primary-foreground"
							: "text-muted-foreground hover:text-foreground hover:bg-muted"
					)}
				>
					All Posts
				</Link>

				{/* Category links */}
				{categoriesResult.items.map((category: Category) => {
					const isSelected = selectedCategoryID === category.contentID
					const categoryUrl = localizeUrl(`/blog/category/${category.fields.slug}`, languageCode)

					return (
						<Link
							key={category.contentID}
							href={categoryUrl}
							className={cn(
								"block px-4 py-2 rounded-lg text-sm font-medium transition-colors",
								isSelected
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:text-foreground hover:bg-muted"
							)}
						>
							{category.fields.name}
						</Link>
					)
				})}
			</nav>
		</aside>
	)
}

