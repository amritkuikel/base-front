import { m } from "@/paraglide/messages";
import { getLocale, locales, setLocale } from "@/paraglide/runtime";
import { Button } from "../ui/button";

export default function ParaglideLocaleSwitcher() {
	const currentLocale = getLocale();
	console.log(locales);
	return (
		<div
			style={{
				display: "flex",
				gap: "0.5rem",
				alignItems: "center",
				color: "inherit",
			}}
		>
			<div style={{ display: "flex", gap: "0.25rem" }}>
				{locales.map((locale) => (
					<Button
						type="button"
						key={locale}
						onClick={() => setLocale(locale)}
						aria-pressed={locale === currentLocale}
						variant={locale === currentLocale ? "default" : "outline"}
					>
						{locale === "en" ? m.english() : m.nepali()}
					</Button>
				))}
			</div>
		</div>
	);
}
