import { useNavigate, useSearch } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useMemo } from 'react'
import { Button } from './ui/button'

interface IPaginationProps {
	pageIndex: number
	perPage: number
	totalCount: number
}

export function Pagination({ pageIndex, perPage, totalCount }: IPaginationProps) {
	const navigate = useNavigate()
	const { page = 1 } = useSearch({ from: '/_app/recipes/' })

	const totalPages = useMemo(() => Math.ceil(totalCount / perPage), [totalCount, perPage])

	function handlePreviousPage() {
		if (pageIndex === 0) return

		navigate({ to: '/recipes', search: (oldSearch) => ({ ...oldSearch, page: page ? page - 1 : 0 }) })
	}

	function handleNextPage() {
		if (pageIndex === totalPages) return

		navigate({ to: '/recipes', search: (oldSearch) => ({ ...oldSearch, page: page ? page + 1 : 1 }) })
	}

	function handleFirstPage() {
		navigate({ to: '/recipes', search: (oldSearch) => ({ ...oldSearch, page: 1 }) })
	}

	function handleLastPage() {
		navigate({ to: '/recipes', search: (oldSearch) => ({ ...oldSearch, page: totalPages }) })
	}

	return (
		<div className="flex flex-col md:flex-row items-center justify-between gap-2">
			<span>
				Página {pageIndex + 1} de {totalPages}
			</span>
			<div className="flex items-center gap-2">
				<Button variant="outline" size="icon" disabled={pageIndex === 0} onClick={handleFirstPage}>
					<ChevronsLeft />
				</Button>
				<Button variant="outline" size="icon" disabled={pageIndex === 0} onClick={handlePreviousPage}>
					<ChevronLeft />
				</Button>
				<Button variant="outline" size="icon" disabled={pageIndex + 1 === totalPages} onClick={handleNextPage}>
					<ChevronRight />
				</Button>
				<Button variant="outline" size="icon" disabled={pageIndex + 1 === totalPages} onClick={handleLastPage}>
					<ChevronsRight />
				</Button>
			</div>
		</div>
	)
}
