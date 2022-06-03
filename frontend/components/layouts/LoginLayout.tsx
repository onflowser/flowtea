export default function LoginLayout({ children }: any) {

  return (
    <>
      <div className="nav-logo-only">
        <a href="flowtea.me"><img src="./images/logo-BMFT-vertical.svg" alt=""/></a>
      </div>
      {children}
    </>
  )
}
