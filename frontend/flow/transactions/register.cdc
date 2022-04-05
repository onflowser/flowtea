import TeaProfile from 0xTEAPROFILEADDRESS

transaction (name: String, createdAt: String) {

    prepare(acc: AuthAccount) {
        let existing = acc.getCapability<&{TeaProfile.Public}>(TeaProfile.publicPath)
        // TODO: throw error in case profile already registered or project name already exists
        if !existing.check() {
            let profile <-TeaProfile.createProject(name:name, createdAt: createdAt)
            acc.save(<-profile, to: TeaProfile.storagePath)
        }
    }

}
