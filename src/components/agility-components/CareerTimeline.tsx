/**
 * CareerTimeline Component
 *
 * An Agility CMS module component that displays career timeline entries.
 * Fetches career entries from a specified container and renders them in a timeline format.
 */

import { getContentList } from "@/lib/cms/getContentList"
import { type UnloadedModuleProps, AgilityPic } from "@agility/nextjs"
import { processMarkdown } from "@/lib/markdown/processMarkdown"

/**
 * Interface defining the structure of the CareerTimeline module fields.
 */
export interface CareerTimelineFields {
	title?: string
	containerReferenceName?: string
}

/**
 * CareerEntry interface (from CareerEntry content model)
 */
interface CareerEntry {
	contentID: number
	fields: {
		company: string
		title: string
		startDate: string
		endDate?: string
		currentRole?: boolean
		markdown?: string
		logo?: {
			url: string
			label: string
		}
	}
}

/**
 * CareerTimeline Component
 *
 * Fetches and renders career timeline entries from Agility CMS.
 *
 * @param module - The Agility CMS module object containing fields
 * @param languageCode - The language code for localized content
 * @returns A section element with the career timeline
 */
const CareerTimeline = async ({ module, languageCode }: UnloadedModuleProps) => {
	const { title, containerReferenceName } = (module as any).fields as CareerTimelineFields

	const containerName = containerReferenceName || "CareerEntries"

	// Fetch career entries from the container
	const entries = await getContentList<CareerEntry>({
		referenceName: containerName,
		languageCode,
		sort: "startDate desc",
	})

	return (
		<section className="relative px-4 sm:px-6 lg:px-8 py-12" data-agility-component={module.contentid}>
			<div className="mx-auto max-w-4xl">
				{title && (
					<h2 className="text-3xl font-bold text-foreground mb-12 text-center" data-agility-field="title">
						{title}
					</h2>
				)}
				<div className="relative">
					{/* Timeline line */}
					<div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />
					<div className="space-y-12">
						{entries.items.map((entry: CareerEntry, index: number) => {
							const startDate = new Date(entry.fields.startDate)
							const endDate = entry.fields.endDate ? new Date(entry.fields.endDate) : null
							const isCurrent = entry.fields.currentRole || !endDate

							return (
								<div
									key={entry.contentID}
									className="relative flex items-start gap-8 md:gap-12 animate-slide-up"
									style={{ animationDelay: `${index * 100}ms` }}
								>
									{/* Timeline dot */}
									<div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary md:absolute md:left-1/2 md:-translate-x-1/2">
										{entry.fields.logo ? (
										<AgilityPic
											image={entry.fields.logo as any}
											fallbackWidth={64}
												className="h-10 w-10 rounded-full object-cover"
												sources={[
													{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 128 },
													{ media: "(min-width: 640px)", width: 64 },
												]}
											/>
										) : (
											<div className="h-10 w-10 rounded-full bg-primary/20" />
										)}
									</div>

									{/* Content */}
									<div className="flex-1 md:ml-auto md:w-1/2 md:pl-12">
										<div className="rounded-lg border border-border bg-card p-6 shadow-sm">
											<div className="mb-2 flex items-center justify-between">
												<h3 className="text-xl font-semibold text-foreground">
													{entry.fields.title}
												</h3>
											</div>
											<p className="text-lg font-medium text-primary mb-2">
												{entry.fields.company}
											</p>
											<p className="text-sm text-muted-foreground mb-4">
												{startDate.toLocaleDateString("en-US", {
													month: "short",
													year: "numeric",
												})}{" "}
												-{" "}
												{isCurrent
													? "Present"
													: endDate?.toLocaleDateString("en-US", {
															month: "short",
															year: "numeric",
														})}
											</p>
											{entry.fields.markdown && (
												<div className="prose prose-sm max-w-none dark:prose-invert">
													{processMarkdown(entry.fields.markdown)}
												</div>
											)}
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</section>
	)
}

export default CareerTimeline

