import { Handlers, PageProps, RouteConfig } from '$fresh/server.ts'
import IconBrandGithub from 'https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/brand-github.tsx'
import IconMessageReport from 'https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/message-report.tsx'
import CountDown from '../islands/count-down.tsx'

interface Props {
	notFound?: string
	found?: string
	redirectTo?: string
}

const sources = {
	google: 'http://webcache.googleusercontent.com/search?q=cache:',
	wayback: 'https://archive.org/wayback/available?url=',
}

export const config: RouteConfig = {
	routeOverride: '{/}?*',
}

export const handler: Handlers<Props> = {
	async GET(_req, ctx) {
		const url = ctx.params[0]
		if (!url) return ctx.render()

		try {
			const response = await fetch(sources.google + url)
			if (!response.ok) throw new Error('thats not OK')
			const text = await response.text()
			if (!text.includes("This is Google's cache of")) throw new Error('uh oh')
			return ctx.render({ found: url, redirectTo: sources.google + url })
		} catch (e) {
			try {
				const response = await fetch(sources.wayback + url)
				const json = await response.json()
				const data = json?.archived_snapshots?.closest
				if (!data?.available) throw new Error('aw shucks')
				return ctx.render({ found: url, redirectTo: data.url })
			} catch (err) {
				return ctx.render({ notFound: url })
			}
		}
	},
	async POST(req, ctx) {
		const form = await req.formData()
		const url = String(form.get('url'))
		const headers = new Headers()

		if (!url) {
			headers.set('location', '/')
			return new Response(null, {
				status: 303,
				headers,
			})
		}

		headers.set('location', `/${url}`)
		return new Response(null, {
			status: 303,
			headers,
		})
	},
}

function fix(url: Props['notFound']) {
	if (url?.startsWith('https://') || url?.startsWith('http://')) return url
	return `https://${url}`
}

export default function IsItCached({ data }: PageProps<Props>) {
	return (
		<main class="p-4 mt-[16%] max-w-full flex flex-col items-center justify-center gap-6 lg:gap-10">
			{!!data?.notFound && (
				<>
					<section class="text-center py-2 md:pb-1 lg:py-1">
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
					<aside class="fixed bottom-0 left-2 overflow-hidden">
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
			{!data?.found && !data?.notFound && <ins class="py-6 pb-5 sm:py-6" />}
			{!data?.found && (
				<section class="flex items-center justify-center flex-col min-[350px]:flex-row gap-2">
					is
					<form
						method="post"
						class="flex items-center justify-center flex-col min-[350px]:flex-row gap-2"
					>
						<input
							type="text"
							name="url"
							placeholder="www.example.com"
							class="bg-transparent rounded-full py-2 px-4 md:px-5 lg:px-6 outline-none placeholder:text-center min-[350px]:placeholder:text-left w-full sm:w-80 md:w-96 lg:w-[432px] border-2 border-neutral-400 dark:border-neutral-700 hover:(border-transparent shadow-google) focus:(border-transparent shadow-google) dark:hover:(bg-neutral-700 border-neutral-700) dark:focus:(bg-neutral-700 border-neutral-700) placeholder:(text-neutral-400)"
							autoCapitalize="off"
							autoCorrect="off"
							autoComplete="url"
							spellCheck={false}
						/>
						<button
							type="submit"
							class="text-sky-600 dark:text-sky-400 font-bold outline-none rounded focus-visible:(text-sky-500 ring-4 ring-sky-500) focus:text-sky-500 hover:text-sky-500 disabled:cursor-not-allowed"
							data-umami-event="Submit query"
						>
							cached?
						</button>
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
					<div class="py-1">
						<CountDown redirectTo={data.redirectTo!} />
					</div>
				</section>
			)}
			{!data?.notFound && (
				<aside class="fixed bottom-0 left-2 overflow-hidden">
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
		</main>
	)
}
