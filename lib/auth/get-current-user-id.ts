import { withAuth } from '@workos-inc/authkit-nextjs'

export async function getCurrentUserId() {
  const { user } = await withAuth()

  return user?.id ?? null
}
