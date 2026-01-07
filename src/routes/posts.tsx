import {
  createFileRoute,
  Link,
  MatchRoute,
  Outlet,
} from '@tanstack/react-router'
import axios from 'redaxios'
import { Spinner } from '../components/Spinner'

type PostType = {
  id: string
  title: string
  body: string
}

const fetchPosts = async () => {
  console.info('Fetching posts...')
  await new Promise((r) => setTimeout(r, 100))
  return axios
    .get<Array<PostType>>('https://jsonplaceholder.typicode.com/posts')
    .then((r) => r.data.slice(0, 10))
}

export const Route = createFileRoute('/posts')({
  loader: fetchPosts,
  component: PostsComponent,
})

function PostsComponent() {
  const posts = Route.useLoaderData()

  return (
    <div className="p-2 flex gap-2">
      <ul className="list-disc pl-4">
        {[...posts, { id: 'i-do-not-exist', title: 'Non-existent Post' }].map(
          (post) => {
            return (
              <li key={post.id} className="whitespace-nowrap">
                <Link
                  to="/posts/$postId"
                  params={{
                    postId: post.id,
                  }}
                  className="flex py-1 text-blue-600 hover:opacity-75 gap-2 items-center"
                  activeProps={{ className: 'font-bold underline' }}
                >
                  <div>{post.title.substring(0, 20)}</div>
                  <MatchRoute
                    to="/posts/$postId"
                    params={{
                      postId: post.id,
                    }}
                    pending
                  >
                    {(match) => {
                      return <Spinner show={!!match} wait="delay-0" />
                    }}
                  </MatchRoute>
                </Link>
              </li>
            )
          },
        )}
      </ul>
      <hr />
      <Outlet />
    </div>
  )
}
