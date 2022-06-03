export default function ProfileLayout({children}: any) {
  return (
    <>
      <div className="nav-profile">
        <div className="nav-profile-content">
          <img src="images/logo-BMFT-horizontal.svg" alt=""/>
          <div className="nav-profile-content-left">
            <img src="/images/menu.svg" alt=""/>
            <img className="profile-photo-small"
                 src="/images/profile-photo-small.svg" alt=""/>
          </div>
        </div>
      </div>
      {children}
    </>
  )
}
