import { ProfileDropdown } from "../ProfileDropdown";
import Link from "next/link";

export default function ProfileLayout({children}: any) {
  return (
    <>
      <div className="nav-profile">
        <div className="nav-profile-content">
          <Link href="/">
            <img src="images/logo-BMFT-horizontal.svg" alt=""/>
          </Link>
          <ProfileDropdown />
        </div>
      </div>
      {children}
    </>
  )
}
