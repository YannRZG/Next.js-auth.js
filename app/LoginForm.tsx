import { signIn } from "next-auth/react"
 
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("credentials")
      }}
    >
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  )
}