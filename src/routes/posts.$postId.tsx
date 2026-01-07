import React from 'react'
import {
  Await,
  ErrorComponent,
  createFileRoute,
  defer,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import axios from 'redaxios'
import { Spinner } from '../components/Spinner'
import { baseUrl } from '../constants/base-url'

type PostType = {
  id: string
  title: string
  body: string
}

type CommentType = {
  id: string
  postId: string
  name: string
  email: string
  body: string
}

class NotFoundError extends Error {}

const fetchPost = async (postId: string) => {
  console.info(`Fetching post with id ${postId}...`)

  const commentsPromise = new Promise((r) => setTimeout(r, 2000))
    .then(() =>
      axios.get<Array<CommentType>>(`${baseUrl}/comments?postId=${postId}`),
    )
    .then((r) => r.data)

  const post = await new Promise((r) => setTimeout(r, 1000))
    .then(() => axios.get<PostType>(`${baseUrl}/posts/${postId}`))
    .catch((err) => {
      if (err.status === 404) {
        throw new NotFoundError(`Post with id "${postId}" not found!`)
      }
      throw err
    })
    .then((r) => r.data)

  return {
    post,
    commentsPromise: defer(commentsPromise),
  }
}

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params: { postId } }) => fetchPost(postId),
  errorComponent: PostErrorComponent,
  component: PostComponent,
})

function PostErrorComponent({ error }: ErrorComponentProps) {
  if (error instanceof NotFoundError) {
    return <div>{error.message}</div>
  }

  return <ErrorComponent error={error} />
}

function PostComponent() {
  const { post, commentsPromise } = Route.useLoaderData()

  return (
    <div className="space-y-2">
      <h4 className="text-xl font-bold underline">{post.title}</h4>
      <div className="text-sm">{post.body}</div>
      <React.Suspense
        fallback={
          <div className="flex items-center gap-2">
            <Spinner />
            Loading comments...
          </div>
        }
        key={post.id}
      >
        <Await promise={commentsPromise}>
          {(comments) => {
            return (
              <div className="space-y-2">
                <h5 className="text-lg font-bold underline">Comments</h5>
                {comments.map((comment) => {
                  return (
                    <div key={comment.id}>
                      <h6 className="text-md font-bold">{comment.name}</h6>
                      <div className="text-sm italic opacity-50">
                        {comment.email}
                      </div>
                      <div className="text-sm">{comment.body}</div>
                    </div>
                  )
                })}
              </div>
            )
          }}
        </Await>
      </React.Suspense>
    </div>
  )
}
