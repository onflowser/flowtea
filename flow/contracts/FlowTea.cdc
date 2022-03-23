import FungibleToken from 0xee82856bf20e2aa6

pub contract FlowTea {

    // service fee, default 2%
    access(contract) let fee: UFix64

    // service owner wallet, receives fee payments
    // access(contract) let ownerWallet: Capability<&{FungibleToken.Receiver}>

    pub event Donation(from: Address, to: Address, message: String, recurring: Bool)

    pub fun donate(fromVault: @FungibleToken.Vault, fromAddress: Address, toAddress: Address, message: String, recurring: Bool) {
        // Get a reference to the recipient's Receiver
        let receiverRef =  getAccount(toAddress)
            .getCapability(/public/flowTokenReceiver)
            .borrow<&{FungibleToken.Receiver}>()
               ?? panic("Could not borrow receiver reference to the recipient's Vault")

        // Deposit the withdrawn tokens in the recipient's receiver
        receiverRef.deposit(from: <-fromVault)

        emit Donation(from: fromAddress, to: toAddress, message: message, recurring: recurring)
    }

    // TODO: add argument fee: UFix64
    // TODO: initialise owner wallet
    // TODO: add fee split logic
    init() {
        self.fee = 10.0
    }
}
