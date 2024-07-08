<script lang="ts">
	let aesKey: string = '';
	let sessionKey: string = '';
	let gatewayIPv4: string = '';
	let rootPassword: string = '';
	let error: string = '';
	let serverError: string = '';
	let serverErrorShow: boolean = false;

	async function setRootPassword(e: SubmitEvent) {
		e.preventDefault();
		if (gatewayIPv4 === '') {
			gatewayIPv4 = '192.168.1.1';
		}
		if (sessionKey === '') {
			error = 'Session key does not exists.';
			return;
		}
		if (aesKey === '') {
			error = 'Aes key does not exists.';
			return;
		}
		try {
			const body = { sessionKey: sessionKey, gatewayIPv4: gatewayIPv4, aesKey: aesKey };
			const response = await fetch('/api/credentials', {
				method: 'POST',
				body: JSON.stringify(body)
			});
			if (response.status != 200) {
				error = 'internal error';
				serverError = await response.json();
				return;
			}
			const resObj = await response.json();
			rootPassword = resObj['rootPassword'];
		} catch (error) {
			console.log(error);
			error = 'There is an issue, please check the Network tab.';
		}
	}
</script>

{#if rootPassword !== ''}
	<div role="alert" class="alert alert-success fixed">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			class="h-6 w-6 shrink-0 stroke-current"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
			></path>
		</svg>
		<span>The Root Password is {rootPassword}</span>
	</div>
{/if}

{#if error !== ''}
	<div role="alert" class="alert alert-error fixed">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 shrink-0 stroke-current"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
		<span>{serverErrorShow ? serverErrorShow : error}</span>

		{#if serverError !== ''}
			<button
				class="btn btn-sm btn-primary"
				on:click={(serverErrorShow) => {
					!serverErrorShow;
				}}>Check error</button
			>
		{/if}
	</div>
{/if}

<main class="flex justify-center items-center max-h-screen min-h-screen max-w-screen min-w-screen">
	<div>
		<form on:submit={(e) => setRootPassword(e)}>
			<label class="form-control w-full max-w-xs">
				<div class="label">
					<span class="label-text">AesKey</span>
				</div>
				<input
					type="text"
					placeholder="Type here"
					class="input input-bordered w-full max-w-xs"
					bind:value={aesKey}
				/>
			</label>
			<label class="form-control w-full max-w-xs">
				<div class="label">
					<span class="label-text">Session id</span>
				</div>
				<input
					type="text"
					placeholder="Type here"
					class="input input-bordered w-full max-w-xs"
					bind:value={sessionKey}
				/>
			</label>
			<label class="form-control w-full max-w-xs">
				<div class="label">
					<span class="label-text">Gateway IPv4</span>
				</div>
				<input
					type="text"
					placeholder="Defaults to 192.168.1.1"
					class="input input-bordered w-full max-w-xs"
					bind:value={gatewayIPv4}
				/>
			</label>
			<br />
			<button type="submit" class="btn w-full max-w-xs">Get Root Password</button>
		</form>
	</div>
</main>
