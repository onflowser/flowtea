import TeaProfile from 0xf8d6e0586b0a20c7

transaction (name: String, description: String) {

    prepare(signer: AuthAccount) {
        let profile = signer.getCapability<&{TeaProfile.Private}>(TeaProfile.privatePath)
            .borrow()
            ?? panic("Could not borrow TeaProfile")

        profile.setInfo(info: TeaProfile.Info(name: name, description: description))
    }

}
