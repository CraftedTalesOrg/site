import { createFileRoute } from '@tanstack/react-router';
import { JSX } from 'react/jsx-runtime';

export const Route = createFileRoute('/mods/')({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  return <div>{'Hello "/mods/"!'}</div>;
}
