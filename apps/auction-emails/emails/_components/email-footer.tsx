import { Hr, Link, Text } from "react-email";

export type EmailFooterProps = {
  whyYouGotThis: string;
  brandName?: string;
  canUnsubscribe?: boolean;
  unwatchUrl?: string;
};

export function EmailFooter({
  whyYouGotThis,
  brandName = "Grade10",
  canUnsubscribe = false,
  unwatchUrl,
}: EmailFooterProps) {
  return (
    <>
      <Hr className="my-6 border-stroke" />
      <Text className="mb-2 mt-0 text-sm leading-base text-fg-2">
        {whyYouGotThis}
        {canUnsubscribe && unwatchUrl ? (
          <>
            {" "}
            <Link className="text-fg-2" href={unwatchUrl}>
              Stop watching this lot
            </Link>
          </>
        ) : null}
      </Text>
      <Text className="m-0 text-sm leading-base text-fg-3">
        © {new Date().getFullYear()} {brandName}.
      </Text>
    </>
  );
}
