<script lang="ts">
	import { page } from '$app/stores';
	import '@skeletonlabs/skeleton/styles/all.css';
	import { AppShell, Toast } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { afterNavigate, invalidate } from '$app/navigation';
	import NavBar from '$lib/navigators/NavBar.svelte';
	import PageHeader from '$lib/navigators/PageHeader.svelte';
	import tutors from '../packages/tutors-ui/lib/themes/tutors.css?inline';
	import dyslexia from '../packages/tutors-ui/lib/themes/dyslexia.css?inline';
	import {
		tutorsJsonPath,
		storeTheme,
		currentLo,
		currentPage,
		tutorsfile
	} from '../packages/tutors-reader-lib/src/stores/stores';
	import Sidebars from '$lib/navigators/sidebars/Sidebars.svelte';

	const themes: any = { tutors, dyslexia };

	onMount(async () => {
		storeTheme.subscribe(setBodyThemeAttribute);
		setColorScheme();
		// document.addEventListener('contextmenu', (event) => {
		// 	event.preventDefault();
		// });
		// document.addEventListener('keydown', keypressInput);
	});

	function keypressInput(e: KeyboardEvent) {
		if (e.key === 'F5') {
			e.preventDefault();
		}
	}

	page.subscribe((path) => {
		if (path.route.id) {
			currentPage.set(path.url.pathname);
		}
		if (path.url.pathname == '/') {
			tutorsJsonPath.set(true);
		} else {
			tutorsJsonPath.set(false);
		}
	});

	afterNavigate((params: any) => {
		console.log(`filename: ${$tutorsfile}`);
		const isNewPage: boolean =
			params.from && params.to && params.from.route.id !== params.to.route.id;
		const elemPage = document.querySelector('#page');
		if (isNewPage && elemPage !== null) {
			elemPage.scrollTop = 0;
		}
	});

	function setColorScheme() {
		if (
			localStorage.getItem('storeLightSwitch') === 'true' ||
			(!('storeLightSwitch' in localStorage) &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	function setBodyThemeAttribute(): void {
		document.body.setAttribute('data-theme', $storeTheme);
	}
</script>

<svelte:head>
	{@html `\<style\>${themes[$storeTheme]}}\</style\>`}
	{#if $currentLo}
		<title>{$currentLo?.title}</title>
	{:else}
		<title>Tutors Viewer</title>
	{/if}
</svelte:head>

<div id="app" class="h-full overflow-hidden">
	<Sidebars />
	<AppShell class="h-screen">
		<svelte:fragment slot="header">
			{#if !$tutorsJsonPath}
				<NavBar />
				<PageHeader />
			{/if}
		</svelte:fragment>
		<div id="top" />
		<div class="mx-auto my-4">
			<slot />
		</div>
	</AppShell>
</div>
