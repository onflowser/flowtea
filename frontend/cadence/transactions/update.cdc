import FlowTea from 0xFlowTea

transaction (name: String, websiteUrl: String, description: String) {

    prepare(signer: AuthAccount) {
        let profile = signer.getCapability<&{FlowTea.Private}>(FlowTea.privatePath)
            .borrow()
            ?? panic("Could not borrow FlowTea Project")

        profile.setInfo(info: FlowTea.Info(name: name, websiteUrl: websiteUrl, description: description))
    }

}
