import { useState } from 'preact/hooks'

export default function FormContent() {
	const [loading, setLoading] = useState<boolean>(false)
	const [input, setInput] = useState<string>('')

	return (
		<>
			<input
				type="text"
				name="url"
				placeholder="www.example.com"
				class={`bg-transparent rounded-full py-2 px-4 md:px-5 lg:px-6 outline-none placeholder:text-center min-[398px]:placeholder:text-left w-64 sm:w-72 md:w-96 lg:w-[432px] border-2 border-neutral-400 dark:border-neutral-700 hover:(border-transparent shadow-google) focus:(border-transparent shadow-google) dark:hover:(bg-neutral-700 border-neutral-700) dark:focus:(bg-neutral-700 border-neutral-700) placeholder:(text-neutral-400) ${
					loading
						? 'loading border-transparent dark:border-transparent focus:border-transparent focus:dark:border-transparent shadow-none'
						: ''
				}`}
				onInput={(e) => setInput(e.currentTarget.value)}
			/>
			<button
				type="submit"
				class="text-sky-600 dark:text-sky-400 font-bold outline-none rounded focus-visible:(text-sky-500 ring-4 ring-sky-500) focus:text-sky-500 hover:text-sky-500 disabled:cursor-not-allowed"
				data-umami-event="Submit query"
				data-umami-event-value={input}
				onClick={() => setLoading(true)}
				disabled={!input?.trim().length}
			>
				cached?
			</button>
		</>
	)
}
