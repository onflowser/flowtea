import Link from "next/link";

export default function LoginLayout({ children }: any) {

  return (
    <>
      <div className="nav-logo-only">
        <Link href="/"><img src="./images/logo-BMFT-vertical.svg" alt=""/></Link>
      </div>
      {children}
    </>
  )
}
