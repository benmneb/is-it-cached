import { Handlers, PageProps } from '$fresh/server.ts'
import IconBrandGithub from 'https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/brand-github.tsx'
import IconMessageReport from 'https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/message-report.tsx'
import CountDown from '../islands/count-down.tsx'
import FormContent from '../islands/form-content.tsx'

export type Sources = 'google' | 'wayback'

interface Props {
	notFound?: string
	found?: string
	on?: Sources
}

export const sources: Record<Sources, string> = {
	google: 'http://webcache.googleusercontent.com/search?q=cache:',
	wayback: 'http://web.archive.org/',
}

export const handler: Handlers<Props> = {
	async POST(req, ctx) {
		const form = await req.formData()
		const url = String(form.get('url'))
		if (!url) return ctx.render()

		try {
			const response = await fetch(sources.google + url)
			if (!response.ok) throw new Error('thats not OK')
			const text = await response.text()
			if (!text.includes("This is Google's cache of")) throw new Error('uh oh')
			return ctx.render({ found: url, on: 'google' })
		} catch (e) {
			try {
				const response = await fetch(sources.wayback + url)
				if (!response.ok) throw new Error('not cool man')
				const text = await response.text()
				if (text.includes('The Wayback Machine has not archived that URL'))
					throw new Error('shit outta luck mate')
				return ctx.render({ found: url, on: 'wayback' })
			} catch (err) {
				return ctx.render({ notFound: url })
			}
		}
	},
}

function fix(url: Props['notFound']) {
	if (url?.startsWith('https://') || url?.startsWith('http://')) return url
	return `https://${url}`
}

export default function Home({ data }: PageProps<Props>) {
	return (
		<main class="p-4 mt-[16%] max-w-full flex flex-col items-center justify-center gap-6 lg:gap-10">
			{!data?.found && (
				<section class="flex items-center justify-center flex-col min-[398px]:flex-row gap-2">
					is
					<form
						method="post"
						class="flex items-center justify-center flex-col min-[398px]:flex-row gap-2"
					>
						<FormContent />
					</form>
				</section>
			)}
			{!!data?.found && (
				<section class="flex flex-col gap-6 lg:gap-10 text-center">
					<div class="py-2">
						Yes,{' '}
						<a
							href={data.found}
							rel="noopener noreferrer"
							class="text-sky-600 dark:text-sky-400 font-bold outline-none rounded hover:text-sky-500 [line-break:loose] [word-break:break-word]"
						>
							{data.found}
						</a>{' '}
						is cached! 🥳
					</div>
					<div>
						<CountDown url={data.found} source={data.on!} />
					</div>
				</section>
			)}
			{!data?.notFound && (
				<aside class="absolute bottom-0 left-2 overflow-hidden">
					<a
						href="https://github.com/benmneb/is-it-cached/"
						target="_blank"
						aria-label="View source code"
					>
						<button
							class="rounded text-gray-400 hover:text-neutral-800 dark:hover:text-neutral-50 outline-none focus-visible:(text-neutral-800) dark:focus-visible:(text-neutral-50) focus:text-neutral-800"
							aria-label="View source code"
						>
							<IconBrandGithub class="w-8 h-8 md:w-12 md:h-12" />
						</button>
					</a>
				</aside>
			)}
			{!!data?.notFound && (
				<>
					<section class="text-center">
						No,{' '}
						<a
							href={fix(data.notFound)}
							rel="noopener noreferrer"
							class="font-bold text-rose-600 dark:text-rose-500 hover:text-rose-500 dark:hover:text-rose-600 [line-break:loose] [word-break:break-word]"
						>
							{data.notFound}
						</a>{' '}
						is not cached. 😵
					</section>
					<aside class="absolute bottom-0 left-2 overflow-hidden">
						<a
							href={`https://github.com/benmneb/is-it-cached/issues/new?title=New+bug+report&body=There+is+a+problem+with+${data.notFound}`}
							target="_blank"
							aria-label="Report a problem with this page"
						>
							<button
								class="rounded text-gray-400 hover:text-neutral-800 dark:hover:text-neutral-50 outline-none focus-visible:(text-neutral-800) dark:focus-visible:(text-neutral-50) focus:text-neutral-800"
								aria-label="Report a problem with this page"
							>
								<IconMessageReport class="w-8 h-8 md:w-12 md:h-12" />
							</button>
						</a>
					</aside>
				</>
			)}
		</main>
	)
}
