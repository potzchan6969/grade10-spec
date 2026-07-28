import {
	Badge,
	Button,
	FeaturedMarketStatus,
	FeaturedMarketSummaryCard,
	FeaturedMarkets,
	FeaturedMarketsMobile,
	type FeaturedMarketsProps,
	SegmentedControl,
	Skeleton,
	Stack,
	Surface,
	Text,
} from "@acetrader/pred-spec-ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

type AssetId = "btc" | "eth" | "sol";
type DurationId = "15m" | "1h";
type EventId = "rate-cut" | "bitcoin-150k";
type SourceId = "polymarket" | "kalshi";

const onBrowseAll = fn();
const onHeaderAction = fn();
const onPrimaryAction = fn();
const onSecondaryAction = fn();
const onRetry = fn();

const summary = (title: string, source: SourceId = "polymarket") => ({
	header: {
		imageFallback: title.slice(0, 3),
		periodLabel: "12:00–12:15 UTC",
		statusLabel: "Ends in 08:42",
		title,
	},
	insight:
		"Supplied market context stays separate from the reusable component.",
	outcomes: [
		{
			id: "up",
			label: "Up",
			values: [
				{ sourceId: "polymarket" as const, value: "61%" },
				{ sourceId: "kalshi" as const, value: "59%" },
			],
		},
		{
			id: "down",
			label: "Down",
			values: [
				{ sourceId: "polymarket" as const, value: "39%" },
				{ sourceId: "kalshi" as const, value: "41%" },
			],
		},
	],
	primaryAction: { label: "View Event", onAction: () => undefined },
	sourceSelection: {
		onValueChange: () => undefined,
		sources: [
			{ id: "polymarket" as const, label: "Polymarket", shortLabel: "PM" },
			{ id: "kalshi" as const, label: "Kalshi", shortLabel: "KA" },
		],
		value: source,
	},
	stats: [
		{ label: "Price to Beat", value: "$104,200" },
		{ label: "Current Price", tone: "success" as const, value: "$104,840" },
		{ label: "Volume", value: "$1.2M" },
	],
});

const chartPresentation = {
	chart: {
		data: {
			ariaLabel: "Bitcoin price over the current 15 minute market window",
			currentValue: 104840,
			precision: 0,
			referenceValue: 104200,
			series: Array.from({ length: 16 }, (_, index) => ({
				timestamp: Date.now() - (15 - index) * 60_000,
				value: 104100 + index * 48 + (index % 3) * 26,
			})),
			trend: "up" as const,
		},
		status: "ready" as const,
	},
	kind: "chart" as const,
	summary: summary("BTC 15 Minute Up or Down"),
};

const featuredProps: FeaturedMarketsProps<
	AssetId,
	DurationId,
	EventId,
	SourceId
> = {
	assets: [
		{ id: "btc", label: "BTC", odds: { label: "61% Up", tone: "success" } },
		{ id: "eth", label: "ETH", odds: { label: "54% Down", tone: "error" } },
		{ id: "sol", label: "SOL", odds: { label: "58% Up", tone: "success" } },
	],
	defaultAssetId: "btc",
	defaultDurationId: "15m",
	durationMarkets: {
		data: [
			{
				desktop: { data: chartPresentation, status: "ready" },
				mobile: { data: summary("BTC 15 Minute Up or Down"), status: "ready" },
				selection: { assetId: "btc", durationId: "15m", kind: "duration" },
			},
			{
				desktop: {
					data: { kind: "summary", summary: summary("BTC 1 Hour Up or Down") },
					status: "ready",
				},
				mobile: { data: summary("BTC 1 Hour Up or Down"), status: "ready" },
				selection: { assetId: "btc", durationId: "1h", kind: "duration" },
			},
			{
				desktop: {
					data: {
						kind: "summary",
						summary: summary("ETH 15 Minute Up or Down"),
					},
					status: "ready",
				},
				mobile: { data: summary("ETH 15 Minute Up or Down"), status: "ready" },
				selection: { assetId: "eth", durationId: "15m", kind: "duration" },
			},
			{
				desktop: {
					data: {
						kind: "summary",
						summary: summary("SOL 15 Minute Up or Down"),
					},
					status: "ready",
				},
				mobile: { data: summary("SOL 15 Minute Up or Down"), status: "ready" },
				selection: { assetId: "sol", durationId: "15m", kind: "duration" },
			},
		],
		status: "ready",
	},
	durations: [
		{ id: "15m", label: "15 min Crypto" },
		{ id: "1h", label: "1 hr Crypto" },
	],
	events: {
		data: [
			{
				desktop: {
					data: {
						kind: "summary",
						summary: summary("Will Bitcoin exceed $150K?"),
					},
					status: "ready",
				},
				id: "bitcoin-150k",
				label: "Will Bitcoin exceed $150K?",
				mobile: {
					data: summary("Will Bitcoin exceed $150K?"),
					status: "ready",
				},
			},
			{
				desktop: {
					data: {
						kind: "summary",
						summary: summary("Will rates be cut next month?"),
					},
					status: "ready",
				},
				id: "rate-cut",
				label: "Will rates be cut next month?",
				mobile: {
					data: summary("Will rates be cut next month?"),
					status: "ready",
				},
			},
		],
		status: "ready",
	},
	mobileTab: "crypto",
	onBrowseAll: () => undefined,
	onMobileTabChange: () => undefined,
	onSelectionChange: () => undefined,
	selection: { assetId: "btc", durationId: "15m", kind: "duration" },
};

function FeaturedMarketsDemo({ mobile = false }: { mobile?: boolean }) {
	const [selection, setSelection] = useState(featuredProps.selection);
	const [mobileTab, setMobileTab] = useState(featuredProps.mobileTab);
	const props = {
		...featuredProps,
		mobileTab,
		onMobileTabChange: setMobileTab,
		onSelectionChange: setSelection,
		selection,
	};
	return mobile ? (
		<FeaturedMarketsMobile {...props} />
	) : (
		<FeaturedMarkets {...props} />
	);
}

const meta = {
	args: featuredProps,
	component: FeaturedMarkets,
	title: "Prediction/Featured Markets",
} satisfies Meta<FeaturedMarketsProps<AssetId, DurationId, EventId, SourceId>>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopChart: Story = { render: () => <FeaturedMarketsDemo /> };

export const Loading: Story = {
	render: () => (
		<FeaturedMarkets
			{...featuredProps}
			durationMarkets={{ status: "loading" }}
		/>
	),
};

export const LoadError: Story = {
	render: () => (
		<FeaturedMarkets
			{...featuredProps}
			durationMarkets={{
				message: "Unable to load featured markets.",
				onRetry: () => undefined,
				status: "error",
			}}
		/>
	),
};

export const MobileCrypto: Story = {
	render: () => <FeaturedMarketsDemo mobile />,
};

export const MobileTrending: Story = {
	render: () => (
		<FeaturedMarketsMobile {...featuredProps} mobileTab="trending" />
	),
};

export const Interactions: Story = {
	render: () => <FeaturedMarketsDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const eth = canvas.getByRole("tab", { name: /ETH/ });
		eth.focus();
		await userEvent.keyboard("[Enter]");
		expect(eth).toHaveAttribute("aria-selected", "true");
		expect(
			canvas.getByRole("heading", { name: "ETH 15 Minute Up or Down" }),
		).toBeInTheDocument();
		await userEvent.click(canvas.getByRole("button", { name: "1 hr Crypto" }));
		expect(
			canvas.getByText("This duration market is not available."),
		).toBeInTheDocument();
		await userEvent.click(
			canvas.getByRole("button", { name: "Will Bitcoin exceed $150K?" }),
		);
		expect(
			canvas.getByRole("heading", { name: "Will Bitcoin exceed $150K?" }),
		).toBeInTheDocument();
	},
};

function MobileInteractionDemo() {
	const [selection, setSelection] = useState(featuredProps.selection);
	const [mobileTab, setMobileTab] = useState(featuredProps.mobileTab);
	return (
		<FeaturedMarketsMobile
			{...featuredProps}
			mobileTab={mobileTab}
			onBrowseAll={onBrowseAll}
			onMobileTabChange={setMobileTab}
			onSelectionChange={setSelection}
			selection={selection}
		/>
	);
}

export const MobileInteractions: Story = {
	render: () => (
		<>
			<style>{`.at-featured-mobile { display: flex !important; flex-direction: column; gap: 1rem; }`}</style>
			<MobileInteractionDemo />
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("tab", { name: "Trending" }));
		expect(canvas.getByRole("tab", { name: "Trending" })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		expect(
			canvas.getByRole("heading", { name: "Will Bitcoin exceed $150K?" }),
		).toBeInTheDocument();
		await userEvent.click(canvas.getByRole("button", { name: "Browse All" }));
		expect(onBrowseAll).toHaveBeenCalledTimes(1);
	},
};

function MarketActionDemo() {
	const [source, setSource] = useState<SourceId>("polymarket");
	const base = summary("Actionable market", source);
	const data = {
		...base,
		header: {
			...base.header,
			action: { label: "Open market", onAction: onHeaderAction },
		},
		primaryAction: { label: "View Event", onAction: onPrimaryAction },
		secondaryAction: { label: "Share market", onAction: onSecondaryAction },
		sourceSelection: { ...base.sourceSelection, onValueChange: setSource },
	};
	return <FeaturedMarketSummaryCard data={data} />;
}

export const MarketActions: Story = {
	render: () => <MarketActionDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("tab", { name: "KA" }));
		expect(canvas.getByRole("tab", { name: "KA" })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		await userEvent.click(canvas.getByRole("button", { name: "Open market" }));
		await userEvent.click(canvas.getByRole("button", { name: "View Event" }));
		await userEvent.click(canvas.getByRole("button", { name: "Share market" }));
		expect(onHeaderAction).toHaveBeenCalledTimes(1);
		expect(onPrimaryAction).toHaveBeenCalledTimes(1);
		expect(onSecondaryAction).toHaveBeenCalledTimes(1);
	},
};

export const RetryAndDisabled: Story = {
	render: () => {
		const onAssetChange = fn();
		return (
			<Stack gap="md">
				<FeaturedMarketStatus
					state={{
						message: "Markets are unavailable.",
						onRetry,
						status: "error",
					}}
				/>
				<FeaturedMarkets
					{...featuredProps}
					assets={[
						...featuredProps.assets,
						{ disabled: true, id: "xrp" as AssetId, label: "XRP" },
					]}
					onSelectionChange={onAssetChange}
				/>
			</Stack>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
		expect(onRetry).toHaveBeenCalledTimes(1);
		expect(canvas.getByRole("tab", { name: /XRP/ })).toBeDisabled();
	},
};

export const FoundationPrimitives: Story = {
	render: () => (
		<Stack gap="lg" style={{ maxWidth: 420 }}>
			<Surface variant="panel">
				<Stack direction="horizontal" gap="sm">
					<Text as="h2" size="lg">
						Surface
					</Text>
					<Badge tone="success">Ready</Badge>
				</Stack>
			</Surface>
			<Stack direction="horizontal" gap="sm">
				<Button>Primary</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="ghost">Ghost</Button>
			</Stack>
			<SegmentedControl
				ariaLabel="Example choices"
				onValueChange={() => undefined}
				options={[
					{ label: "One", value: "one" },
					{ label: "Two", value: "two" },
				]}
				value="one"
			/>
			<Skeleton shape="line" />
		</Stack>
	),
};
