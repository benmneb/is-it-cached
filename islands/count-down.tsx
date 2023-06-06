import { useEffect, useState } from 'preact/hooks'
import { Sources, sources } from '../routes/index.tsx'

interface Props {
	url: string
	source: Sources
}

export default function CountDown({ url, source }: Props) {
	const [count, setCount] = useState<number>(3)

	useEffect(() => {
		if (count === 0) return
		setTimeout(() => setCount((prev) => prev - 1), 1000)
	}, [count])

	if (count === 0) window.location.replace(sources[source] + url)

	return <div>Redirecting in... {count || '🚀'}</div>
}
