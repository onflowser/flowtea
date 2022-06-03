import TeaProfile from ./cadence/contracts/TeaProfile

transaction (name: String) {

    prepare(signer: AuthAccount) {
        let existing = signer.getCapability<&{TeaProfile.Public}>(TeaProfile.publicPath)
        if existing.check() {
            panic("Account is already registered")
        } else {
            let profile <-TeaProfile.createProject(name: name, address: signer.address)
            signer.save(<-profile, to: TeaProfile.storagePath)
            signer.link<&TeaProfile.Project{TeaProfile.Public}>(TeaProfile.publicPath, target: TeaProfile.storagePath)
        }
    }

}
