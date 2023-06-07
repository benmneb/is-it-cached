import { Head } from '$fresh/runtime.ts'
import { AppProps } from '$fresh/src/server/types.ts'

export default function App({ Component }: AppProps) {
	return (
		<html>
			<Head>
				<title>Is it cached?</title>
				<meta
					name="description"
					content="Easily find a cached version of websites - whether they have a paywall or not."
				/>
				<script
					async
					defer
					src="https://umamalytics.vercel.app/script.js"
					data-website-id="340fbcac-cb8a-4677-856d-50899d0f36ed"
					data-domains="isitcached.com,isitcached.deno.dev"
				></script>
			</Head>
			<body class="bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-50 text-xl sm:text-2xl md:text-3xl lg:text-4xl max-w-full lg:max-w-screen-lg mx-auto">
				<Component />
			</body>
		</html>
	)
}
