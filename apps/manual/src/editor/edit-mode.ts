import { useSearchParams } from "react-router";

/** Edit mode is a URL state, so a page being edited can be linked and the
 * back button leaves it. */

const EDIT_PARAM = "edit";

export type EditMode = {
  editing: boolean;
  enter: () => void;
  exit: () => void;
};

export function useEditMode(): EditMode {
  const [params, setParams] = useSearchParams();

  const without = () => {
    const next = new URLSearchParams(params);
    next.delete(EDIT_PARAM);
    return next;
  };

  return {
    editing: params.get(EDIT_PARAM) === "1",
    enter: () => {
      const next = new URLSearchParams(params);
      next.set(EDIT_PARAM, "1");
      setParams(next);
    },
    exit: () => setParams(without(), { replace: true }),
  };
}

export function editHref(pathname: string): string {
  return `${pathname}?${EDIT_PARAM}=1`;
}
