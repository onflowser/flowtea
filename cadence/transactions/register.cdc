import FlowTea from 0xFlowTea

transaction (handle: String, name: String, websiteUrl: String, description: String) {

    prepare(signer: AuthAccount) {
        let existing = signer.getCapability<&{FlowTea.Public}>(FlowTea.publicPath)
        if existing.check() {
            panic("Account is already registered")
        } else {
            let profile <-FlowTea.createProject(
                handle: handle,
                name: name,
                websiteUrl: websiteUrl,
                description: description,
                address: signer.address
            )
            signer.save(<-profile, to: FlowTea.storagePath)
            signer.link<&FlowTea.Project{FlowTea.Public}>(
                FlowTea.publicPath,
                target: FlowTea.storagePath
            )
            signer.link<&FlowTea.Project{FlowTea.Private}>(
                FlowTea.privatePath,
                target: FlowTea.storagePath
            )
        }
    }

}
