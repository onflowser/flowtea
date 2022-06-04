import TeaProfile from 0xf8d6e0586b0a20c7

transaction (name: String, description: String) {

    prepare(signer: AuthAccount) {
        let existing = signer.getCapability<&{TeaProfile.Public}>(TeaProfile.publicPath)
        if existing.check() {
            panic("Account is already registered")
        } else {
            let profile <-TeaProfile.createProject(
                name: name,
                description: description,
                address: signer.address
            )
            signer.save(<-profile, to: TeaProfile.storagePath)
            signer.link<&TeaProfile.Project{TeaProfile.Public}>(
                TeaProfile.publicPath,
                target: TeaProfile.storagePath
            )
            signer.link<&TeaProfile.Project{TeaProfile.Private}>(
                TeaProfile.privatePath,
                target: TeaProfile.storagePath
            )
        }
    }

}
