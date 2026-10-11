import { Button } from "@grade10/design-system/components/forms/button";
import { EmptyPanel } from "../page-blocks/empty-panel";

type MyConsignmentsSignInCopy = {
  title: string;
  body: string;
  /** The invitation's button. */
  signIn: string;
};

type MyConsignmentsSignInProps = {
  copy: MyConsignmentsSignInCopy;
  /** What the invitation does; without it the invitation only says so. */
  onSignIn?: () => void;
  className?: string;
};

/** Signed out: the invitation to sign in, and nothing read. */
function MyConsignmentsSignIn({
  copy,
  onSignIn,
  className,
}: MyConsignmentsSignInProps) {
  return (
    <div className={className}>
      <EmptyPanel
        actions={
          onSignIn ? (
            <Button onClick={onSignIn} size="md" type="button">
              {copy.signIn}
            </Button>
          ) : undefined
        }
        copy={{ title: copy.title, description: copy.body }}
        slot="consignment-mine-sign-in"
      />
    </div>
  );
}

export type { MyConsignmentsSignInCopy, MyConsignmentsSignInProps };
export { MyConsignmentsSignIn };
