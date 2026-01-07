/**
 * CareerTimeline Component
 *
 * An Agility CMS module component that displays career timeline entries.
 * Uses the 8star Labs Timeline component for a polished, professional look.
 */

import { getContentList } from "@/lib/cms/getContentList"
import { getContentItem } from "@/lib/cms/getContentItem"
import { type UnloadedModuleProps, AgilityPic } from "@agility/nextjs"
import { processMarkdown } from "@/lib/markdown/processMarkdown"
import Timeline, { TimelineItem, TimelineItemDate, TimelineItemTitle } from "@/components/ui/timeline"

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
 * Fetches and renders career timeline entries from Agility CMS using the 8star Labs Timeline component.
 *
 * @param module - The Agility CMS module object containing fields
 * @param languageCode - The language code for localized content
 * @returns A section element with the career timeline
 */
const CareerTimeline = async ({ module, languageCode }: UnloadedModuleProps) => {
	// Fetch the content item from Agility CMS
	const {
		fields: { title, containerReferenceName },
		contentID,
	} = await getContentItem<CareerTimelineFields>({
		contentID: module.contentid,
		languageCode,
	})

	const containerName = containerReferenceName || "CareerEntries"

	// Fetch career entries from the container
	const entries = await getContentList<CareerEntry>({
		referenceName: containerName,
		languageCode,
		sort: "startDate desc",
	})

	return (
		<section className="relative px-4 sm:px-6 lg:px-8 py-12" data-agility-component={contentID}>
			<div className="mx-auto max-w-6xl">
				{title && (
					<h2 className="text-3xl font-bold text-foreground mb-12 text-center" data-agility-field="title">
						{title}
					</h2>
				)}
				<Timeline
					orientation="vertical"
					alternating={true}
					vertItemSpacing={300}
					vertItemMaxWidth={450}
					alignment="top/left"
				>
					{entries.items.map((entry: CareerEntry) => {
						const startDate = new Date(entry.fields.startDate)
						const endDate = entry.fields.endDate ? new Date(entry.fields.endDate) : null
						const isCurrent = entry.fields.currentRole || !endDate
						const dateRange = `${startDate.toLocaleDateString("en-US", {
							month: "long",
							year: "numeric",
						})} - ${isCurrent ? "Present" : endDate?.toLocaleDateString("en-US", {
							month: "long",
							year: "numeric",
						})}`

						return (
							<TimelineItem key={entry.contentID}>
								{entry.fields.logo && (
									<div className="mb-4">
										<AgilityPic
											image={entry.fields.logo as any}
											fallbackWidth={64}
											className="h-16 w-16 rounded-full object-cover border-2 border-primary"
											sources={[
												{ media: "(min-width: 640px) and (min-resolution: 2dppx)", width: 128 },
												{ media: "(min-width: 640px)", width: 64 },
											]}
										/>
									</div>
								)}
								<TimelineItemDate>{dateRange}</TimelineItemDate>
								<TimelineItemTitle>{entry.fields.title}</TimelineItemTitle>
								<div className="space-y-3 mt-2 text-sm text-muted-foreground">
									<p className="text-lg font-medium text-primary">
										{entry.fields.company}
									</p>
									{entry.fields.markdown && (
										<div className="prose prose-sm max-w-none dark:prose-invert">
											{processMarkdown(entry.fields.markdown)}
										</div>
									)}
								</div>
							</TimelineItem>
						)
					})}
				</Timeline>
			</div>
		</section>
	)
}

export default CareerTimeline
