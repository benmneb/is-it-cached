import { useEffect, useState } from 'preact/hooks'

interface Props {
	redirectTo: string
}

export default function CountDown({ redirectTo }: Props) {
	const [count, setCount] = useState<number>(3)

	useEffect(() => {
		if (count === 0) return
		setTimeout(() => setCount((prev) => prev - 1), 1000)
	}, [count])

	if (count === 0) window.location.replace(redirectTo)

	return <div>Redirecting in... {count || '🚀'}</div>
}
