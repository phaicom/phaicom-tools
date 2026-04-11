import { Button } from "@/components/ui/Button";

export function Welcome() {
	return (
		<main className="flex items-center justify-center pt-16 pb-4">
			<div className="flex flex-col gap-4 items-center">
				<Button>Get Started</Button>
				<code className="bg-black p-4 rounded-2xl text-white">
					{"const arr = [1,2].map((x) => x * 2)"}
				</code>
			</div>
		</main>
	);
}
