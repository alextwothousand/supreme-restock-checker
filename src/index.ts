import rp from "request-promise";
import crypto from "crypto";

let lastHash: string | null = null;

const checkForItemChange = () => {
	interface options {
		uri: string;
		headers: {
			"User-Agent": string;
		}
	}
	
	let options: options = {
		uri: "https://www.supremenewyork.com/shop/shoes/ndrgpvxhm/cxypn34k5",
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36'
		}
	};
	
	rp(options)
		.then(function(html){
			let sha = crypto.createHash("sha1").update(html).digest("hex");

			console.log("lastHash current value: " + lastHash);
			console.log("current SHA value: " + sha);
			console.log("HTML output: " + html);
	
			if (lastHash !== sha && lastHash !== null) {
				console.log("SUPREME X NIKE AIR FORCE 1 WHITE RESTOCKED!");
			} else {
				console.log("Checked and this item is still out of stock...");
			}
	
			lastHash = sha;
		})
		.catch(function(err){
			//handle error
			console.error(err);
		});
}

checkForItemChange();
setInterval(checkForItemChange, 15000);