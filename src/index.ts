import rp from "request-promise";
import crypto from "crypto";

import chalk from "chalk";

import sound from "sound-play";
import path from "path";

import fs from "fs";
import settings from "./settings.json";

let lastHash: string | null = null;
let pattern: RegExp = /^((https:\/\/)(www.)?supremenewyork.com\/shop\/\w+\/\w+\/\w+\/?)$/;

const patternTestSuccessful = () => {
	checkForItemChange(); 
	setInterval(checkForItemChange, settings.interval > 0 ? (settings.interval * 1000) : 10000);
}

const log = (text: string | string[], con: boolean = false) => {
	let currentDate = Date();
	let data: string = "";

	if (Array.isArray(text)) {
		text.forEach((log: string) => {
			data += `[${currentDate}] ${log}\n`;
		});
	} else {
		data = `[${currentDate}] ${text}`;
	}

	fs.appendFile(path.join(__dirname, "../debug.log"), data, (err) => { if (err) console.log(err) });
	if (con === true && !Array.isArray(text)) console.log(text);
}

const checkForItemChange = () => {
	let options = {
		uri: settings.url,
		headers: {
			'User-Agent': (settings.user_agent.length > 0 ? settings.user_agent : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36")
		}
	};
	
	rp(options)
		.then(function(html){
			let sha = crypto.createHash("sha1").update(html).digest("hex");
			log([`LastHash: ${lastHash}`, `CurrentHash: ${sha}`, `HTML Output: ${html}`]);
	
			if (lastHash !== sha && lastHash !== null) {
				console.log(chalk.green("This item is now in stock again! GO COP!"));
				sound.play(path.join(__dirname, "../audio/item_found.mp3"));
			} else {
				console.log(chalk.red("Checked and this item is still out of stock..."));
			}
	
			lastHash = sha;
		})
		.catch(function(err){
			log(err, true);
		});
}

if (settings.clear_logs === true) {
	fs.unlinkSync(path.join(__dirname, "../debug.log"));
}

pattern.test(settings.url) ? patternTestSuccessful() : log(`Your URL is invalid, please ensure it matches the syntax of ${pattern.toString()}.`, true);