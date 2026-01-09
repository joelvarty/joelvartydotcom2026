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
		take: 250,

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

	// Helper to determine grid span based on item count
	const getGridSpan = (index: number, total: number) => {
		// For bento layout: alternate between wide (4 cols) and narrow (2 cols)
		if (total === 1) return "lg:col-span-6"
		if (total === 2) return "lg:col-span-3"
		if (total === 3) {
			return index === 0 ? "lg:col-span-4" : "lg:col-span-2"
		}
		// For 4+ items, alternate pattern
		return index % 3 === 0 ? "lg:col-span-4" : "lg:col-span-2"
	}

	// Helper to get rounded corners based on position
	const getCornerClass = (index: number, total: number, catIndex: number, totalCats: number) => {
		const isFirstCat = catIndex === 0
		const isLastCat = catIndex === totalCats - 1
		const isFirstItem = index === 0
		const isLastItem = index === total - 1

		let corners = ""
		if (isFirstCat && isFirstItem) corners += " lg:rounded-tl-[2rem]"
		if (isFirstCat && (total <= 2 ? isLastItem : index === Math.min(1, total - 1)))
			corners += " lg:rounded-tr-[2rem]"
		if (isLastCat && isFirstItem) corners += " lg:rounded-bl-[2rem]"
		if (isLastCat && isLastItem) corners += " lg:rounded-br-[2rem]"
		return corners
	}

	const categories = Object.entries(groupedByCategory)

	return (
		<section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24" data-agility-component={contentID}>
			<div className="mx-auto max-w-7xl">
				{title && (
					<h2
						className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-16"
						data-agility-field="title"
					>
						{title}
					</h2>
				)}
				<div className="space-y-16">
					{categories.map(([category, categoryItems], catIndex) => {
						const items = categoryItems as UsesItem[]
						return (
							<div key={category} className="animate-scale-in" style={{ animationDelay: `${catIndex * 100}ms` }}>
								<h3 className="sticky top-16 z-10 -mx-4 px-4 py-3 text-sm font-semibold text-primary uppercase tracking-wide mb-6 bg-background/80 backdrop-blur-sm border-b border-border/50 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
									{category}
								</h3>
								<div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
									{items.map((item: UsesItem, index: number) => {
										const gridSpan = getGridSpan(index, items.length)
										const isWide = gridSpan.includes("col-span-4") || gridSpan.includes("col-span-6")
										const cornerClass = getCornerClass(index, items.length, catIndex, categories.length)

										return (
											<div key={item.contentID} className={`flex p-px ${gridSpan}`}>
												<div
													className={`group w-full overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border transition-all duration-300 hover:shadow-lg hover:ring-primary/50 dark:bg-card/80 dark:ring-border/50 ${cornerClass}`}
												>
													{item.fields.image && (
														<div className="relative overflow-hidden bg-muted">
															<AgilityPic
																image={item.fields.image as any}
																fallbackWidth={isWide ? 800 : 400}
																className={`w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${isWide ? "h-64 sm:h-72" : "h-48 sm:h-56"}`}
																sources={[
																	{
																		media: "(min-width: 1024px) and (min-resolution: 2dppx)",
																		width: isWide ? 1600 : 800,
																	},
																	{ media: "(min-width: 1024px)", width: isWide ? 800 : 400 },
																	{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 1200 },
																	{ media: "(min-width: 640px)", width: 600 },
																]}
															/>
														</div>
													)}
													<div className="p-6 sm:p-8">
														<h4 className="text-lg font-semibold mb-2">
															{item.fields.link ? (
																<Link
																	href={item.fields.link.href}
																	target={item.fields.link.target}
																	className="inline-flex items-center gap-1.5 text-primary hover:underline transition-colors"
																>
																	{item.fields.name}
																	<svg
																		className="w-4 h-4 opacity-60"
																		fill="none"
																		stroke="currentColor"
																		viewBox="0 0 24 24"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			strokeWidth={2}
																			d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
																		/>
																	</svg>
																</Link>
															) : (
																<span className="text-foreground group-hover:text-primary transition-colors">
																	{item.fields.name}
																</span>
															)}
														</h4>
														{item.fields.description && (
															<p
																className={`text-sm text-muted-foreground leading-relaxed ${isWide ? "max-w-lg" : ""}`}
															>
																{item.fields.description}
															</p>
														)}
														{item.fields.affiliateLink && (
															<Link
																href={item.fields.affiliateLink.href}
																target={item.fields.affiliateLink.target}
																className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:underline"
															>
																{item.fields.affiliateLink.text || "Learn more"}
																<svg
																	className="w-4 h-4"
																	fill="none"
																	stroke="currentColor"
																	viewBox="0 0 24 24"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth={2}
																		d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
																	/>
																</svg>
															</Link>
														)}
													</div>
												</div>
											</div>
										)
									})}
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

