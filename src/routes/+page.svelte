<script lang="ts">
	import { open, message } from '@tauri-apps/api/dialog';
	import { basename, sep } from '@tauri-apps/api/path';
	import { goto, invalidateAll } from '$app/navigation';
	import { tutorsfile } from '../packages/tutors-reader-lib/src/stores/stores';
	import { watch, watchImmediate } from 'tauri-plugin-fs-watch-api';

	const selectFile = async () => {
		const selected = await open({
			multiple: false,
			filters: [
				{
					name: 'tutors',
					extensions: ['json']
				}
			]
		});
		let count = 0;
		if (Array.isArray(selected)) {
			await message('Can only select a single file', { title: 'Error', type: 'error' });
		} else if (selected === null) {
			await message('No file selected', { title: 'Cancelled', type: 'info' });
		} else if ((await basename(selected as string)) != 'tutors.json') {
			await message('Must be a tutors.json file', { title: 'Error', type: 'error' });
		} else {
			tutorsfile.set(selected);
			let courseName = selected.replace(`${sep}json${sep}tutors.json`, '');
			courseName = await basename(courseName);
			goto(`/course/${courseName}`);
			const stopWatching = await watchImmediate(selected, { recursive: true }, async (event) => {
				count += 1;
				console.log(event);
				let watchertime = Date.now();
				console.log(`watcher event: ${watchertime}`);
				invalidateAll();
				console.log(`filename: ${$tutorsfile}`);
				count = 0;
			});
		}
	};
</script>

<div class="container mx-auto">
	<div class="flex justify-center py-8">
		<div class="flex-none px-8 pt-4 pb-8">
			<svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				x="0px"
				y="0px"
				height="40px"
				viewBox="0 0 54.5 39.4"
				style="enable-background:new 0 0 54.5 39.4;"
				xml:space="preserve"
			>
				<defs />
				<g>
					<path
						fill="#37919B"
						d="M51.5,0H3C1.4,0,0,1.4,0,3v33.3c0,1.7,1.4,3,3,3h48.5c1.7,0,3-1.4,3-3V3C54.5,1.4,53.1,0,51.5,0z M50,34.8H4.5
        V4.5H50V34.8z"
					/>
					<g>
						<rect fill="#37919B" x="29" y="26.5" width="12.1" height="4.2" />
						<g>
							<path fill="#37919B" d="M13.4,13.5V8.7h19.1v4.8H26v17.2h-5.9V13.5H13.4z" />
						</g>
					</g>
				</g>
			</svg>
		</div>
		<h2 class="flex-none pt-4 font-bold">Tutors Viewer</h2>
	</div>

	<div class="container pb-12">
		<div class="card rounded-box mx-auto mb-2 p-20">
			<div class="text-center">
				<h2>Make sure you have started tutors-mon on the directory you are updating</h2>
				<br />
				<p class="text-lg">This is a live viewer for making updates to courses</p>
				<p class="p-4">Click button below to select tutors.json file</p>
				<button class="btn mt-6 bg-primary-500 text-white" on:click={selectFile}
					>Select tutors.json</button
				>
			</div>
		</div>
	</div>
</div>
