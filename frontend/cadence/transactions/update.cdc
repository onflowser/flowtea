import TeaProfile from 0xTeaProfile

transaction (name: String, websiteUrl: String, description: String) {

    prepare(signer: AuthAccount) {
        let profile = signer.getCapability<&{TeaProfile.Private}>(TeaProfile.privatePath)
            .borrow()
            ?? panic("Could not borrow FlowTea Project")

        profile.setInfo(info: TeaProfile.Info(name: name, websiteUrl: websiteUrl, description: description))
    }

}
