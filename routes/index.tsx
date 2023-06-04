import { Head } from '$fresh/runtime.ts'
import { Handlers, PageProps } from '$fresh/server.ts'
import IconBrandGithub from 'https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/brand-github.tsx'
import IconMessageReport from 'https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/message-report.tsx'
import CountDown from '../islands/count-down.tsx'

interface Props {
	notFound: string
	found: string
}

const googlesCache = 'http://webcache.googleusercontent.com/search?q=cache:'

export const handler: Handlers = {
	async POST(req, ctx) {
		const form = await req.formData()
		const url = String(form.get('url'))
		if (!url) return ctx.render()

		try {
			const response = await fetch(googlesCache + url)
			if (!response.ok) throw new Error('thats not OK')
			const text = await response.text()
			if (!text.includes("This is Google's cache of")) throw new Error('uh oh')
			return ctx.render({ found: url })
		} catch (e) {
			return ctx.render({ notFound: url })
		}
	},
}

function fix(url: Props['notFound']) {
	if (url.startsWith('https://') || url.startsWith('http://')) return url
	return `https://${url}`
}

export default function Home({ data }: PageProps<Props>) {
	return (
		<>
			<Head>
				<title>Is it cached?</title>
				<meta
					name="description"
					content="Easily find a cached version of websites - whether they have a paywall or not."
				/>
				<script
					async
					src="https://umamalytics.vercel.app/script.js"
					data-website-id="340fbcac-cb8a-4677-856d-50899d0f36ed"
					data-host-url="isitcached.com,isitcached.deno.dev"
				></script>
			</Head>
			<main class="p-4 mx-auto mt-[16%] max-w-full sm:max-w-screen-sm md:max-w-screen-md flex flex-col items-center justify-center gap-6 text-xl sm:text-3xl">
				{!data?.found && (
					<section class="flex items-center justify-center flex-wrap gap-2">
						is
						<form
							method="post"
							class="flex flex-row items-center justify-center flex-wrap gap-2"
						>
							<input
								type="text"
								name="url"
								placeholder="www.example.com"
								class="outline-none rounded p-2 border-2 border-gray-300 focus-visible:border-blue-200 focus:ring w-56 sm:w-auto"
							/>
							<button
								type="submit"
								class="text-blue-500 font-bold outline-none rounded focus-visible:border-blue-200 focus:text-blue-400 hover:text-blue-400"
								data-umami-event="submit-search"
							>
								cached?
							</button>
						</form>
					</section>
				)}
				{!!data?.found && (
					<section class="flex flex-col gap-6 text-center">
						<div>
							Yes,{' '}
							<a
								href={data.found}
								rel="noopener noreferrer"
								class="font-bold text-blue-500 hover:text-blue-400"
							>
								{data.found}
							</a>{' '}
							is cached! 🥳
						</div>
						<div>
							<CountDown url={data.found} />
						</div>
					</section>
				)}
				{!data?.notFound && (
					<aside class="absolute bottom-2 left-2">
						<a
							href="https://github.com/benmneb/is-it-cached/"
							target="_blank"
							aria-label="View source code"
						>
							<IconBrandGithub class="w-8 h-8 md:w-12 md:h-12 text-gray-400 hover:text-black" />
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
								class="font-bold text-red-500 hover:text-red-400"
							>
								{data.notFound}
							</a>{' '}
							is not cached. 😵
						</section>
						<aside class="absolute bottom-0 left-2">
							<a
								href={`https://github.com/benmneb/is-it-cached/issues/new?title=New+bug+report&body=There+is+a+problem+with+${data.notFound}`}
								target="_blank"
								aria-label="Report a problem with this page"
							>
								<button class="rounded text-gray-400 hover:text-black outline-none focus-visible:border-blue-200 focus:text-black">
									<IconMessageReport class="w-8 h-8 md:w-12 md:h-12" />
								</button>
							</a>
						</aside>
					</>
				)}
			</main>
		</>
	)
}
