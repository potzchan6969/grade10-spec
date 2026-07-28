import { Button } from "../Button.js";
import { Skeleton } from "../Skeleton.js";
import { Stack } from "../Stack.js";
import { Text } from "../Text.js";
import type { FeaturedAsyncState } from "./types.js";

export type FeaturedMarketStatusProps<T> = {
	state: Exclude<FeaturedAsyncState<T>, { status: "ready" }>;
	label?: string;
	className?: string;
};

export function FeaturedMarketStatus<T>({
	state,
	label = "market data",
	className,
}: FeaturedMarketStatusProps<T>) {
	if (state.status === "loading") {
		return (
			<Stack
				className={["at-featured-status", className].filter(Boolean).join(" ")}
				gap="sm"
			>
				<Skeleton shape="line" />
				<Skeleton shape="block" />
			</Stack>
		);
	}

	if (state.status === "error") {
		return (
			<Stack
				align="center"
				className={["at-featured-status", className].filter(Boolean).join(" ")}
				gap="sm"
				role="alert"
			>
				<Text tone="error">{state.message}</Text>
				{state.onRetry ? (
					<Button onClick={state.onRetry} variant="secondary">
						Try again
					</Button>
				) : null}
			</Stack>
		);
	}

	return (
		<Stack
			align="center"
			className={["at-featured-status", className].filter(Boolean).join(" ")}
			gap="sm"
		>
			<Text tone="secondary">{state.message ?? `No ${label} available.`}</Text>
		</Stack>
	);
}
