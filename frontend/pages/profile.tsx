import ProfileLayout from "../components/layouts/ProfileLayout";

export default function Profile () {
  return (
    <>
      <div className="dark-background-profile"></div>

      <div className="profile-photo-main-wrapper">
        <img src="/images/profile-photo-main.svg" alt=""/>
        <h3 className="profile-name">Flowser team</h3>
      </div>

      <div className="profile-content-wrapper">
        <div className="bio-and-transactions">
          <div className="bio-profile">
            <h5>About profile name</h5>

            <p>Lorem LINK dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. 👋
            </p>

            <p>Lorem LINK dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip
              ex ea commodo <a className="bio-link" href="">LINK</a>. 👋
            </p>

          </div>

          <Transaction teaCount={1} fromAddress="0x0f44940e7dd31e6b" />
          <Transaction teaCount={5} fromAddress="0x0f44940e7dd31e6b" />
          <Transaction teaCount={100} fromAddress="0x0f44940e7dd31e6b" />

        </div>

        <div className="buy-flow-tea-form">

        </div>

      </div>
    </>
  )
}

function Transaction({ teaCount, fromAddress }: {teaCount: number, fromAddress: string}) {
  return (
    <div className="transactions-profil-details">
      <div className="tea-count">
        <img src="/images/flow-tea-cup.svg" alt=""/>
        <h4>x</h4>
        <h4 className="tea-count-number">{teaCount}</h4>
      </div>
      <h6 className="address-id">Appreciated by {fromAddress}</h6>
    </div>
  )
}

Profile.Layout = ProfileLayout;
