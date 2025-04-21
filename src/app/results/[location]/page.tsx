import { notFound } from "next/navigation"
import ResultsClient from "../_components/ResultsClient"

interface Props {
  params: Promise<{ location: string }>
}

export const dynamic = "force-dynamic"

export default async function ResultsPage({ params }: Props) {
  const resolvedParams = await params
  const location = resolvedParams.location

  if (!location) {
    notFound()
  }

  return <ResultsClient location={location} />
}
