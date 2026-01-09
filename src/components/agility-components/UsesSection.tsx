/**
 * UsesSection Component
 *
 * An Agility CMS module component that displays uses items organized by category.
 * Fetches uses items from a specified container and groups them by category.
 */

import { getContentList } from "@/lib/cms/getContentList"
import { getContentItem } from "@/lib/cms/getContentItem"
import { type UnloadedModuleProps, AgilityPic } from "@agility/nextjs"
import Link from "next/link"

/**
 * Interface defining the structure of the UsesSection module fields.
 */
export interface UsesSectionFields {
	title?: string
	categoryFilter?: string
}

/**
 * UsesItem interface (from UsesItem content model)
 */
interface UsesItem {
	contentID: number
	fields: {
		name: string
		description?: string
		link?: {
			href: string
			target: string
			text: string
		}
		affiliateLink?: {
			href: string
			target: string
			text: string
		}
		image?: {
			url: string
			label: string
		}
		category?: string
	}
}

/**
 * UsesSection Component
 *
 * Fetches and renders uses items from Agility CMS, optionally filtered by category.
 *
 * @param module - The Agility CMS module object containing fields
 * @param languageCode - The language code for localized content
 * @returns A section element with the uses items
 */
const UsesSection = async ({ module, languageCode }: UnloadedModuleProps) => {
	// Fetch the content item from Agility CMS
	const {
		fields: { title, categoryFilter },
		contentID,
	} = await getContentItem<UsesSectionFields>({
		contentID: module.contentid,
		languageCode,
	})

	const containerName = "UsesItems"

	// Fetch uses items from the container
	const allItems = await getContentList<UsesItem>({
		referenceName: containerName,
		languageCode,
		sort: "name",
	})

	// Filter by category if specified
	const items = categoryFilter
		? { ...allItems, items: allItems.items.filter((item: UsesItem) => item.fields.category === categoryFilter) }
		: allItems

	// Group items by category
	const groupedByCategory = items.items.reduce((acc: Record<string, UsesItem[]>, item: UsesItem) => {
		const category = item.fields.category || "Other"
		if (!acc[category]) {
			acc[category] = []
		}
		acc[category].push(item)
		return acc
	}, {} as Record<string, UsesItem[]>)

	return (
		<section className="relative px-4 sm:px-6 lg:px-8 py-12" data-agility-component={contentID}>
			<div className="mx-auto max-w-7xl">
				{title && (
					<h2 className="text-3xl font-bold text-foreground mb-12 text-center" data-agility-field="title">
						{title}
					</h2>
				)}
				<div className="space-y-12">
					{Object.entries(groupedByCategory).map(([category, categoryItems]) => {
						const items = categoryItems as UsesItem[]
						return (
							<div key={category}>
								<h3 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
									{category}
								</h3>
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
									{items.map((item: UsesItem, index: number) => (
										<div
											key={item.contentID}
											className="rounded-lg border border-border bg-card p-6 shadow-sm transition-optimized hover:shadow-md animate-scale-in"
											style={{ animationDelay: `${index * 30}ms` }}
										>
											<div className="flex items-start gap-4">
												{item.fields.image && (
													<AgilityPic
														image={item.fields.image as any}
														fallbackWidth={48}
														className="h-12 w-12 shrink-0 rounded object-cover"
														sources={[
															{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 96 },
															{ media: "(min-width: 640px)", width: 48 },
														]}
													/>
												)}
												<div className="flex-1">
													<h4 className="font-semibold text-foreground mb-2">
														{item.fields.link ? (
															<Link
																href={item.fields.link.href}
																target={item.fields.link.target}
																className="hover:text-primary transition-colors"
															>
																{item.fields.name}
															</Link>
														) : (
															item.fields.name
														)}
													</h4>
													{item.fields.description && (
														<p className="text-sm text-muted-foreground mb-3">
															{item.fields.description}
														</p>
													)}
													{item.fields.affiliateLink && (
														<Link
															href={item.fields.affiliateLink.href}
															target={item.fields.affiliateLink.target}
															className="text-sm text-primary hover:underline"
														>
															{item.fields.affiliateLink.text || "View"}
														</Link>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}

export default UsesSection

