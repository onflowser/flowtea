import { ProfileDropdown } from "../ProfileDropdown";

export default function ProfileLayout({children}: any) {
  return (
    <>
      <div className="nav-profile">
        <div className="nav-profile-content">
          <img src="images/logo-BMFT-horizontal.svg" alt=""/>
          <ProfileDropdown />
        </div>
      </div>
      {children}
    </>
  )
}
