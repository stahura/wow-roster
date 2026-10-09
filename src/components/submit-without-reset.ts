import { startTransition, type FormEvent } from "react";

/**
 * Submit handler for a useActionState form that keeps what people typed and
 * picked when the server answers with an error. React resets a form after an
 * `action` prop runs, which would clear the picker on a "nickname taken".
 */
export function submitWithoutReset(action: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  };
}
