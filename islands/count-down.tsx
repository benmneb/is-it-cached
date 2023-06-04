import { useEffect, useState } from 'preact/hooks'

interface Props {
	url: string
}

const googlesCache = 'http://webcache.googleusercontent.com/search?q=cache:'

export default function CountDown({ url }: Props) {
	const [count, setCount] = useState<number>(3)

	useEffect(() => {
		if (count === 0) return
		setTimeout(() => setCount((prev) => prev - 1), 1000)
	}, [count])

	if (count === 0) window.location.replace(googlesCache + url)

	return <div>Redirecting in... {count || '🚀'}</div>
}
