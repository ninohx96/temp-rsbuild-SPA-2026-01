import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/post-demo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/postDemo"!</div>
}
