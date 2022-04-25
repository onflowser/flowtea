import TeaProfile from 0xf8d6e0586b0a20c7

transaction (name: String, createdAt: String) {

    prepare(acc: AuthAccount) {
        let existing = acc.getCapability<&{TeaProfile.Public}>(TeaProfile.publicPath)
        if existing.check() {
            panic("Account is already registered")
        } else {
            let profile <-TeaProfile.createProject(name:name, createdAt: createdAt)
            acc.save(<-profile, to: TeaProfile.storagePath)
            acc.link<&TeaProfile.Project{TeaProfile.Public}>(TeaProfile.publicPath, target: TeaProfile.storagePath)
        }
    }

}
