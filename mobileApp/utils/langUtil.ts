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

export {
	nameToCode,
}