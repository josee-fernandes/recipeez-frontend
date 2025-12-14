import { Skeleton } from '@/components/ui/skeleton'

export function RecipesSkeleton() {
	return Array.from({ length: 10 }).map((_, index) => (
		<div key={index} className="flex flex-col gap-2 border-2 rounded-lg p-4 max-w-96 w-96 h-128">
			<Skeleton className="w-full h-40 rounded-lg" />
			<Skeleton className="w-full h-10 rounded-lg" />
			<Skeleton className="w-full h-10 rounded-lg" />
			<Skeleton className="w-full h-10 rounded-lg" />
			<Skeleton className="w-full h-10 rounded-lg" />
			<Skeleton className="w-full h-10 rounded-lg" />
			<Skeleton className="w-full h-10 rounded-lg" />
		</div>
	))
}
