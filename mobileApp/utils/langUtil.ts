function nameToCode(name: string): string {
	if (name.length < 3) return name;
	switch (name.toLowerCase().trim()) {
		case "french": return "fr";
		case "english": return "en";
		case "german": return "de";
		case "spanish": return "es";
	}
	return name;
}

function idToCountry(id?: number): string {
	switch (id) {
		case 1: return "es";
		case 2: return "fr";
		case 3: return "de";
	}
	return "";
}

function codeToNativeName(code: string): string {
	switch (code) {
		case "fr": return "Français";
		case "en": return "English";
		case "de": return "Deutsch";
		case "es": return "Español";
	}
	return code;
}

export {
	nameToCode,
	idToCountry,
	codeToNativeName
}