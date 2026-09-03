import { FlowContainer } from "../../../../packages/ui/src/blocks/shared/flow-container";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";
import { ENROLLMENT_SNAPSHOT_SIGNED_OUT } from "./listing-bid-enrollment-snapshots";
import {
  COUNTDOWN_FLOW_SCENARIOS,
  type CountdownScenario,
  countdownFormatForScenario,
  useCountdownReplay,
} from "./listing-countdown-flow";

function BidPanelCountdownPreview({
  initialSeconds,
  replayBelowSeconds = 0,
  extensionStarted = false,
}: CountdownScenario) {
  const { closesAtMs, seconds } = useCountdownReplay({
    initialSeconds,
    replayBelowSeconds,
  });

  return (
    <ListingBidEnrollmentCardPreview
      onChangePayment={() => undefined}
      onLinkPayment={() => undefined}
      snapshot={{
        ...ENROLLMENT_SNAPSHOT_SIGNED_OUT,
        viewOverride: {
          closesAtMs,
          countdownSeconds: seconds,
          countdownFormat: countdownFormatForScenario({ initialSeconds }),
          deadlineAtMs: closesAtMs,
          extended: extensionStarted,
        },
      }}
    />
  );
}

/** Signed-out bid panel through the same countdown boundaries as ListingAuctionBidCard. */
function BidPanelCountdownDemo() {
  return (
    <FlowContainer
      cases={COUNTDOWN_FLOW_SCENARIOS}
      description={
        <p>
          These cases guard the extension window, time-unit rollovers, auction
          close, and an already-extended auction on the signed-out bid panel.
          The countdown must stay valid through each boundary and restart the
          demonstration only after the terminal value has been visible. Sign-in
          remains the only bid action.
        </p>
      }
    >
      {(scenario, title) => (
        <BidPanelCountdownPreview key={title} {...scenario} />
      )}
    </FlowContainer>
  );
}

export { BidPanelCountdownDemo };
