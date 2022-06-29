import FungibleToken from 0xFungibleToken
import FlowTea from 0xFlowTea

transaction(message: String, amount: UFix64, recurring: Bool, to: Address) {

    let fromAddress: Address
    let fromVault: &FungibleToken.Vault
    let toProject: &AnyResource{FlowTea.Public}

    prepare(signer: AuthAccount) {

        // Get a reference to the signer's stored vault
        self.fromVault = signer.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)
           ?? panic("Could not borrow reference to the owner's Vault!")

        self.toProject = getAccount(to)
            .getCapability(FlowTea.publicPath)
            .borrow<&AnyResource{FlowTea.Public}>()
            ?? panic("Could not borrow receiver reference to the recipient's FlowTea Project")

        self.fromAddress = signer.address
    }

    execute {
        self.toProject.donate(
            from: self.fromVault,
            amount: amount,
            fromAddress: self.fromAddress,
            message: message,
            recurring: recurring
        )
    }
}
